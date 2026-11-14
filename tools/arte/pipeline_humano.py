# -*- coding: utf-8 -*-
# Monta a folha de UMA acao do humano (3 linhas: lado, frente, costas; 8 quadros cada) a partir dos quadros brutos do Kaggle,
# usando os quadros escolhidos em picks_humano.json, e grava assets/_novas/folha_humano_<folha>.png.
# Uso: python pipeline_humano.py <folha> <prefixo_da_acao_no_kaggle> <pasta_zip_com_os_frames_brutos>
#   ex.: python pipeline_humano.py machado attack_2h .kaggle/saida/suritto-lote1/zip
import json, os, shutil, subprocess, sys, tempfile
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
PILOTO = os.path.join(os.path.dirname(ROOT), 'ferramentas_3d', 'piloto')
DIAG = '--diag' in sys.argv; sys.argv = [a for a in sys.argv if a != '--diag']      # --diag: so as 2 diagonais 3/4 (frente e costas), folha_humano_<folha>_diagonal.png
folha, pref, zdir = sys.argv[1], sys.argv[2], sys.argv[3]
picks = json.load(open(os.path.join(HERE, 'picks_humano.json'), encoding='utf-8'))
PRINT = {'lado': 'golpe_lado_esq_3x4.png', 'frente': 'golpe_frente_3x4.png', 'costas': 'golpe_costas_3x4.png', 'diagfrente': 'golpe_diag_esq_3x4.png', 'diagcostas': 'andar_diag_costas_esq_3x4.png'}
linhas = []
VISTAS = ('diagfrente', 'diagcostas') if DIAG else ('lado', 'frente', 'costas')
for vista in VISTAS:
    ids = picks[f'{pref}_{vista}']
    tmp = tempfile.mkdtemp(); shutil.copytree(os.path.join(zdir, f'{pref}_{vista}_frames_brutos'), os.path.join(tmp, 'attack_frames_brutos'))
    out = os.path.join(tmp, 'linha.png')
    r = subprocess.run([sys.executable, 'montar_golpe.py', ','.join(map(str, ids)), out, tmp, os.path.join('prints', PRINT[vista])], cwd=PILOTO, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-800:]); sys.exit(1)
    linhas.append(Image.open(out.replace('.png', '_sem_regua.png')).convert('RGB'))
W = max(l.width for l in linhas); H = 592
sh = Image.new('RGB', (W, H * len(linhas)), (255, 0, 255))
for i, l in enumerate(linhas): sh.paste(l, (0, i * H))
dst = os.path.join(ROOT, 'assets', '_novas', f'folha_humano_{folha}' + ('_diagonal' if DIAG else '') + '.png'); sh.save(dst); print('folha gravada:', dst, sh.size)
