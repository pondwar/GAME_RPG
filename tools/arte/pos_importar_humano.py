# -*- coding: utf-8 -*-
# Depois de importar_humano_acoes.py: devolve as OUTRAS racas ao estado do git (o importador reprocessa todas) e mantem so o humano novo.
# Uso (na pasta GAME_RPG): python tools/arte/pos_importar_humano.py
import json, subprocess
p = 'assets/player/racas/manifest.json'
new = json.load(open(p, encoding='utf-8'))
old = json.loads(subprocess.run(['git', 'show', 'HEAD:' + p], capture_output=True).stdout.decode('utf-8'))
for r in [k for k in old if k != 'humano']:
    subprocess.run(['git', 'checkout', '--', f'assets/player/racas/{r}'])
    subprocess.run(['git', 'checkout', '--', f'assets/_novas/folha_{r}_*.png'], capture_output=True)
out = {k: (new[k] if k == 'humano' else old[k]) for k in old}
h = out['humano']; o = old['humano']
if 'attack_1h' not in h['acoes'] and 'attack_1h' in o['acoes']:      # o importador as vezes derruba a espada do humano
    h['acoes']['attack_1h'] = o['acoes']['attack_1h']
    for k, v in o['maos'].items():
        if '/attack_1h/' in k: h['maos'][k] = v
open(p, 'w', encoding='utf-8').write(json.dumps(out, indent=1, ensure_ascii=False))
print({a: {d: len(v) for d, v in dd.items()} for a, dd in h['acoes'].items() if a in ('attack_1h', 'walk')})
