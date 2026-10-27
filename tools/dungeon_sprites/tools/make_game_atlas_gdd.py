#!/usr/bin/env python3
"""Gera o atlas 'game-ready': cada sprite já redimensionado para a mesma altura de parede.
Uso:  python3 tools/make_game_atlas.py [ALTURA_ALVO_PX]     (padrão 104 = ~2,6 m a 40 px/m)
Lê  : sprites_manifest.json + 1x/<categoria>/<nome>.png
Grava: atlas_game/dungeon_game_atlas.png + .json  (sprites em escala FINAL: desenhe com escala 1, sem suavização)
"""
import json, sys, os, math
import numpy as np
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET=float(sys.argv[1]) if len(sys.argv)>1 else 104.0
man=json.load(open(os.path.join(ROOT,'sprites_manifest_gdd.json'), encoding='utf-8'))
base=man['meta']['targetColumnHeightPx']; sp=man['sprites']
PAD=2; MAXW=2048
items=[]
for name,v in sp.items():
    im=Image.open(os.path.join(ROOT,'1x',v['category'],name+'.png')).convert('RGBA')
    s=v['recommendedScale']*TARGET/base
    w,h=max(1,round(im.width*s)),max(1,round(im.height*s))
    pm=im.convert('RGBa').resize((w,h),Image.LANCZOS).convert('RGBA')   # premultiplicado: sem halo nas bordas
    a=np.array(pm); a[...,3]=np.where(a[...,3]<24,0,a[...,3]); pm=Image.fromarray(a,'RGBA')
    items.append((v['category'],name,pm,s,v))
order=['stone_walls','brick_walls','wood_walls','doors','gates','arches','ruins']
items.sort(key=lambda t:(order.index(t[0]),t[1]))
x=y=PAD; rowh=0; placed=[]
for cat,name,im,s,v in items:
    if x+im.width+PAD>MAXW: x=PAD; y+=rowh+PAD; rowh=0
    placed.append((name,x,y,im,s,v)); x+=im.width+PAD; rowh=max(rowh,im.height)
H=16
while H<y+rowh+PAD: H+=16
atlas=Image.new('RGBA',(MAXW,H),(0,0,0,0)); frames={}
COS=man['meta']['cosAngle']
for name,x,y,im,s,v in placed:
    atlas.paste(im,(x,y))
    # --- pontos de encaixe medidos no sprite FINAL (px, relativos à âncora, orientação nativa do PNG) ---
    al=np.array(im)[...,3]>128; hh,ww=al.shape
    cols=np.where(al.any(0))[0]
    bot=np.array([hh-1-np.argmax(al[::-1,c]) if al[:,c].any() else -1 for c in range(ww)])
    ax,ay=round(v['anchor'][0]*s),round(v['anchor'][1]*s)
    pt=lambda c: dict(dx=int(c-ax),dy=int(bot[c]-ay))
    cL,cR=int(cols.min()),int(cols.max())
    cFront=cL+int(np.argmax(bot[cL:cR+1]))          # coluna mais baixa do contorno inferior = quina da frente
    cBack=cL+int(np.argmin(np.where(bot[cL:cR+1]>=0,bot[cL:cR+1],10**6)))
    ground=dict(left=pt(cL),right=pt(cR),front=pt(cFront),back=pt(cBack))
    face=None
    if v['screenSlope'] in ('\\','/') and v['kind'] in ('wall','door','gate','fence'):
        # Face = trecho da borda inferior que segue a reta 2:1 (ignora pedras salientes e a tampa lateral)
        nat=v['screenSlope']; sl=0.5 if nat=='\\' else -0.5
        # envelope inferior: ignora vãos entre barras (max numa janela de 9 colunas)
        env=np.array([bot[max(0,c-4):c+5].max() for c in range(ww)])
        span=cR-cL; win=int(0.35*span)
        if nat=='\\':                                      # quina da frente B = ponto mais baixo no terço direito
            lo_c,hi_c=cR-win,cR; seg=bot[lo_c:hi_c+1]; cF=lo_c+int(np.mean(np.where(seg==seg.max())[0]))
            capw=cR-cF; faceDx=cF-cL; xA=cL
        else:                                             # espelhado: terço esquerdo
            lo_c,hi_c=cL,cL+win; seg=bot[lo_c:hi_c+1]; cF=lo_c+int(np.mean(np.where(seg==seg.max())[0]))
            capw=cF-cL; faceDx=cR-cF; xA=cR
        yB=int(bot[cF]-ay if bot[cF]>=0 else env[cF]-ay); sgn=1 if nat=='\\' else -1
        A=dict(dx=int(xA-ax),dy=int(yB-0.5*faceDx))      # A fica na reta 2:1 que passa por B
        B=dict(dx=int(cF-ax),dy=yB)
        face=dict(A=A,B=B,dx=int(faceDx),cap=int(capw),reliable=bool(3<=capw<=26 and faceDx>=40))
    axisLen=round(face['dx']/COS) if face else None    # comprimento da FACE ao longo da linha (sem a tampa)
    frames[name]=dict(frame=dict(x=x,y=y,w=im.width,h=im.height),
        anchor=dict(x=ax,y=ay),
        category=v['category'],kind=v['kind'],axis=v['axis'],screenSlope=v['screenSlope'],nativeSlope=v['screenSlope'],
        ground=ground,face=face,
        groundLengthPx=axisLen,                       # só peças retas; null nas demais
        spriteWidthLengthPx=round(im.width/COS),      # largura do PNG convertida (INCLUI a tampa) — não use para encaixe
        columnHeightPx=round(v['columnHeightPx']*s))
atlas.save(os.path.join(ROOT,'atlas_game','dungeon_game_atlas.png'))
json.dump(dict(meta=dict(image='dungeon_game_atlas.png',size=dict(w=MAXW,h=H),targetColumnHeightPx=TARGET,
   projection='2:1 isometrico',cosAngle=COS,drawScale=1,note='Desenhe com escala 1, imageSmoothingEnabled=false, posição inteira. anchor = pixel do sprite que fica sobre o ponto do chão.'),
   frames=frames),open(os.path.join(ROOT,'atlas_game','dungeon_game_atlas.json'),'w',encoding='utf-8'),indent=1,ensure_ascii=False)
print('atlas',MAXW,H,'sprites',len(frames),'alvo',TARGET)
