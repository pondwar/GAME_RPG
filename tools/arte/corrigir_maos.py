"""Corrige no manifest os quadros em que a medicao (medir_maos.py) pulou para a OUTRA mao.

Acha quadros cuja mao esta longe dos dois vizinhos (que estao perto um do outro) e troca pela media deles (x, y e angulo).
So mexe nos casos da lista CASOS (conferidos a olho); rode DEPOIS de medir_maos.py, que refaz a tabela inteira.
Uso: python tools/arte/corrigir_maos.py
"""
import json
import math
import os

M = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'assets', 'player', 'racas', 'manifest.json')
# (acao, direcao, quadro) do humano; os pares esquerda/direita sao espelhados
CASOS = [('thrust_1h', 'left', 2), ('thrust_1h', 'right', 2), ('attack_2h', 'down_left', 5), ('attack_2h', 'down_right', 5),
         ('gather', 'down_left', 3), ('gather', 'down_right', 3), ('jump', 'up_left', 5), ('jump', 'up_right', 5),
         ('punch', 'left', 1), ('punch', 'right', 1), ('punch', 'up', 3)]


def main():
    man = json.load(open(M, encoding='utf-8'))
    maos = man['humano']['maos']
    for a, d, i in CASOS:
        k, kp, kn = (f'humano/{a}/{d}_{j}' for j in (i, i - 1, i + 1))
        if k not in maos or kp not in maos or kn not in maos: print('sem vizinhos:', k); continue
        v, p, n = maos[k], maos[kp], maos[kn]
        if math.hypot(v[0] - p[0], v[1] - p[1]) < 0.14 and math.hypot(v[0] - n[0], v[1] - n[1]) < 0.14: print('ja ok:', k); continue
        ang = math.atan2(math.sin(p[2]) + math.sin(n[2]), math.cos(p[2]) + math.cos(n[2]))     # media circular
        novo = list(v)
        novo[0] = round((p[0] + n[0]) / 2, 4); novo[1] = round((p[1] + n[1]) / 2, 4); novo[2] = round(ang, 3)
        if len(v) > 6: novo[6] = round((p[6] + n[6]) / 2, 3)
        maos[k] = novo
        print('corrigido', k, [round(x, 3) for x in v[:3]], '->', novo[:3])
    json.dump(man, open(M, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
