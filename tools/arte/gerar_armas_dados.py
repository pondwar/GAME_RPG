"""Gera os DADOS das armas corpo a corpo do D&D que faltavam (21 armas): itens da mochila (js/inventory.js), ficha de
combate (js/combate.js) e a migracao do banco com os itens (server/db/migrations/010_armas_dnd.sql).

Uma tabela so (ARMAS abaixo). Os blocos no JS ficam entre marcadores e podem ser regerados:
    // <<armas-dnd ... // armas-dnd>>
A migracao so e criada se ainda nao existir (migracao aplicada nunca se edita; para mudar, crie a seguinte).
Regras de dano/propriedades: js/armas.js (D&D 5e SRD). Movimento: o do boneco que mais combina (js/combate.js):
  machadada = golpe de cima (folha attack_2h), corte = attack_1h, estocada = thrust_1h; duas = estocada de duas maos (thrust_2h).
Movimentos proprios (varredura, giro, chicotada...) ficam como pendencia em docs/arte/MOVIMENTOS_ARMAS.md.

Uso: python tools/arte/gerar_armas_dados.py
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(os.path.dirname(HERE))

# id: (nome, icone, descricao, stats, mov, tempo, anim, alcance, folego, duas)
ARMAS = {
    'clava_grande':    ('Clava Grande', '🏏', 'Tronco nodoso e pesado, de duas mãos. Esmaga tudo que acerta.', 'Dano 1d8 impacto • Duas mãos', 'machadada', 1.35, 0.62, 90, 8, 0),
    'martelo_leve':    ('Martelo Leve', '🔨', 'Martelo pequeno de ferro, leve e fácil de arremessar.', 'Dano 1d4 impacto • Leve • Arremesso', 'machadada', 0.95, 0.48, 70, 4, 0),
    'maca':            ('Maça de Ferro', '🔨', 'Cabeça de ferro com rebarbas na ponta de um cabo de madeira.', 'Dano 1d6 impacto', 'machadada', 1.05, 0.52, 75, 5, 0),
    'bordao':          ('Bordão', '🦯', 'Cajado longo de madeira dura. Uma ou duas mãos.', 'Dano 1d6 impacto (1d8 com duas mãos) • Versátil', 'corte', 1.0, 0.50, 95, 4, 0),
    'foice':           ('Foice Curta', '🌾', 'Lâmina curva de ceifar, de cabo curto.', 'Dano 1d4 corte • Leve', 'corte', 0.85, 0.45, 70, 4, 0),
    'machado_batalha': ('Machado de Batalha', '🪓', 'Machado de uma lâmina larga, feito para a guerra.', 'Dano 1d8 corte (1d10 com duas mãos) • Versátil', 'machadada', 1.15, 0.58, 80, 7, 0),
    'mangual':         ('Mangual', '⛓️', 'Cabo com corrente e uma bola de ferro com espinhos.', 'Dano 1d8 impacto', 'machadada', 1.2, 0.60, 80, 6, 0),
    'glaive':          ('Glaive', '⚔️', 'Haste longa com uma lâmina curva de um fio na ponta.', 'Dano 1d10 corte • Alcance • Pesada • Duas mãos', 'machadada', 1.6, 0.75, 125, 9, 0),
    'machado_grande':  ('Machado Grande', '🪓', 'Machado enorme de duas mãos, com lâmina larga.', 'Dano 1d12 corte • Pesada • Duas mãos', 'machadada', 1.7, 0.80, 90, 10, 0),
    'montante':        ('Montante', '⚔️', 'Espada enorme de duas mãos, de lâmina longa e reta.', 'Dano 2d6 corte • Pesada • Duas mãos', 'machadada', 1.6, 0.78, 95, 10, 0),
    'alabarda':        ('Alabarda', '⚔️', 'Haste longa com machado, ponta e gancho. Alcança longe.', 'Dano 1d10 corte • Alcance • Pesada • Duas mãos', 'machadada', 1.7, 0.80, 130, 10, 0),
    'lanca_montada':   ('Lança de Cavalaria', '🔱', 'Lança longuíssima de cavaleiro, com guarda de mão.', 'Dano 1d12 perfuração • Alcance • Montado: uma mão', 'estocada', 1.5, 0.65, 150, 9, 1),
    'malho':           ('Malho', '🔨', 'Marreta gigante de duas mãos. Cada pancada é um terremoto.', 'Dano 2d6 impacto • Pesada • Duas mãos', 'machadada', 1.9, 0.85, 85, 11, 0),
    'maca_estrela':    ('Maça-Estrela', '🔨', 'Cabo de madeira com uma bola de ferro cheia de espinhos.', 'Dano 1d8 perfuração', 'machadada', 1.1, 0.55, 78, 6, 0),
    'pique':           ('Pique', '🔱', 'Lança comprida de soldado, para segurar a linha.', 'Dano 1d10 perfuração • Alcance • Pesada • Duas mãos', 'estocada', 1.7, 0.70, 165, 9, 1),
    'rapieira':        ('Rapieira', '🗡️', 'Lâmina fina e comprida, feita para estocadas rápidas.', 'Dano 1d8 perfuração • Acuidade', 'estocada', 0.8, 0.38, 88, 4, 0),
    'cimitarra':       ('Cimitarra', '🗡️', 'Lâmina curva de um fio, leve e ágil.', 'Dano 1d6 corte • Leve • Acuidade', 'corte', 0.9, 0.45, 80, 5, 0),
    'tridente':        ('Tridente', '🔱', 'Haste longa com três pontas. Pode ser arremessado.', 'Dano 1d6 perfuração (1d8 com duas mãos) • Arremesso • Versátil', 'estocada', 1.3, 0.60, 110, 7, 1),
    'picareta_guerra': ('Picareta de Guerra', '⛏️', 'Cabo de madeira com uma ponta curva de aço que fura armaduras.', 'Dano 1d8 perfuração', 'machadada', 1.1, 0.55, 75, 6, 0),
    'martelo_guerra':  ('Martelo de Guerra', '🔨', 'Martelo de aço com uma ponta atrás. Uma ou duas mãos.', 'Dano 1d8 impacto (1d10 com duas mãos) • Versátil', 'machadada', 1.15, 0.58, 78, 7, 0),
    'chicote':         ('Chicote', '➰', 'Tira de couro trançado. Acerta de longe, mas dói pouco.', 'Dano 1d4 corte • Acuidade • Alcance', 'corte', 0.9, 0.50, 115, 4, 0),
}


def js_item(i, d):
    nome, ico, desc, stats = d[0], d[1], d[2], d[3]
    return (f"      {i}: {{ id: '{i}', name: '{nome}', type: 'weapon', rarity: 'common', icon: '{ico}', maxStack: 1,\n"
            f"        desc: '{desc}', stats: '{stats}',\n        equipType: 'weapon', equipId: '{i}' }},\n")


def js_ficha(i, d):
    mov, tempo, anim, alc, fol, duas = d[4:]
    return f"    {i}: {{ mov: '{mov}', tempo: {tempo:.2f}, anim: {anim:.2f}, alcance: {alc}, folego: {fol}{', duas: true' if duas else ''} }},\n"


def troca(path, ini, fim, corpo, ancora):
    s = open(path, encoding='utf-8').read()
    bloco = ini + '\n' + corpo + fim
    if ini in s:
        i = s.index(ini); j = s.index(fim, i) + len(fim)
        s = s[:i] + bloco + s[j:]
    else:
        assert s.count(ancora) == 1, (path, ancora)
        s = s.replace(ancora, bloco + '\n' + ancora)
    open(path, 'w', encoding='utf-8').write(s)


def main():
    troca(os.path.join(R, 'js', 'inventory.js'), '      // <<armas-dnd', '      // armas-dnd>>\n',
          ''.join(js_item(i, d) for i, d in ARMAS.items()), '      // armas so de arremesso')
    troca(os.path.join(R, 'js', 'combate.js'), '    // <<armas-dnd', '    // armas-dnd>>\n',
          ''.join(js_ficha(i, d) for i, d in ARMAS.items()), '    // armas de longe (docs/PROJETEIS.md)')
    mig = os.path.join(R, 'server', 'db', 'migrations', '010_armas_dnd.sql')
    if not os.path.exists(mig):
        linhas = ',\n'.join("  ('{}', '{}', 'weapon', 'common', 'weapon', '{}', 1, '{}', '{}')".format(i, d[0].replace("'", "''"), d[1], d[2].replace("'", "''"), d[3].replace("'", "''")) for i, d in ARMAS.items())
        open(mig, 'w', encoding='utf-8').write(
            "-- 010_armas_dnd.sql - As armas corpo a corpo do D&D que faltavam (js/armas.js). Sem estas linhas o servidor descartava a arma ao salvar.\n"
            "-- Gerado por tools/arte/gerar_armas_dados.py.\n\n"
            "INSERT INTO ruleset.item (code, name, item_type_code, rarity_code, equipment_slot_code, icon, max_stack, description, stats_text) VALUES\n"
            + linhas + "\nON CONFLICT (code) DO NOTHING;\n")
        print('migracao criada:', mig)
    print('ok:', len(ARMAS), 'armas')


if __name__ == '__main__':
    main()
