# scripts/generate_portals_and_side.py - High-Detail Portal & Side View Generator
import os
import math
from PIL import Image, ImageDraw

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'blocks')
os.makedirs(OUT_DIR, exist_ok=True)

def draw_stone_coping(draw, y_start, y_end, width):
    draw.rectangle([(0, y_start), (width - 1, y_end)], fill=(138, 145, 158, 255))
    draw.line([(0, y_start), (width - 1, y_start)], fill=(188, 195, 208, 255), width=1)
    draw.line([(0, y_start), (0, y_end)], fill=(165, 172, 185, 255), width=1)
    draw.line([(width - 1, y_start), (width - 1, y_end)], fill=(95, 102, 115, 255), width=1)
    draw.line([(0, y_end), (width - 1, y_end)], fill=(75, 82, 95, 255), width=1)
    for cx in range(24, width, 24):
        draw.line([(cx, y_start), (cx, y_end)], fill=(65, 72, 85, 255), width=1)
        draw.line([(cx + 1, y_start), (cx + 1, y_end)], fill=(160, 168, 180, 255), width=1)
    for cy in range(y_start + 1, y_end):
        for cx in range(1, width - 1):
            n = ((cx * 11 + cy * 17) % 13) - 6
            draw.point((cx, cy), fill=(138 + n * 2, 145 + n * 2, 158 + n * 2, 255))

def create_portal_pequeno():
    # 4 blocks wide (192px) x 4 blocks high (216px total: 24px coping + 192px face)
    W, H = 192, 216
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # 1. Top Stone Coping (0..23)
    draw_stone_coping(draw, 0, 23, W)

    # 2. Upper Wall Course with stone masonry (24..63)
    for y in range(24, 64):
        for x in range(W):
            n = ((x * 13 + y * 23) % 17) - 8
            draw.point((x, y), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
    for vx in range(24, W, 24):
        draw.line([(vx, 24), (vx, 63)], fill=(45, 48, 55, 255))
    draw.line([(0, 63), (W - 1, 63)], fill=(45, 48, 55, 255))

    # 3. Flanking Stone Pillars (Left: 0..47, Right: 144..191)
    for px0, px1 in [(0, 47), (144, 191)]:
        for y in range(64, H - 2):
            for x in range(px0, px1 + 1):
                n = ((x * 17 + y * 19) % 15) - 7
                draw.point((x, y), fill=(88 + n * 2, 94 + n * 2, 106 + n * 2, 255))
        # Quoins / corner stones
        draw.line([(px0, 64), (px0, H - 2)], fill=(145, 152, 165, 255), width=2)
        draw.line([(px1, 64), (px1, H - 2)], fill=(45, 48, 55, 255), width=2)
        for cy in range(78, H - 2, 18):
            draw.line([(px0, cy), (px1, cy)], fill=(45, 48, 55, 255), width=1)
            draw.line([(px0 + 1, cy + 1), (px1 - 1, cy + 1)], fill=(120, 126, 140, 255), width=1)
        # Arrow slits (seteiras) in pillars
        mid_x = (px0 + px1) // 2
        draw.rectangle([(mid_x - 2, 90), (mid_x + 2, 130)], fill=(18, 20, 24, 255))
        draw.line([(mid_x - 5, 110), (mid_x + 5, 110)], fill=(18, 20, 24, 255), width=2)
        draw.rectangle([(mid_x - 3, 89), (mid_x + 3, 89)], fill=(130, 138, 150, 255))

    # 4. Semicircular Stone Arch (between x=48 and x=143, center x=96)
    # Outer arch from y=50 to y=150
    draw.arc([(44, 46), (147, 150)], 180, 360, fill=(145, 152, 165, 255), width=10)
    # Inner arch outline
    draw.arc([(54, 56), (137, 140)], 180, 360, fill=(45, 48, 55, 255), width=2)

    # Voussoir stone cuts radiating from arch
    for deg in range(195, 350, 15):
        rad = math.radians(deg)
        x_in = 96 + int(42 * math.cos(rad))
        y_in = 98 + int(42 * math.sin(rad))
        x_out = 96 + int(52 * math.cos(rad))
        y_out = 98 + int(52 * math.sin(rad))
        draw.line([(x_in, y_in), (x_out, y_out)], fill=(45, 48, 55, 255), width=2)

    # Massive Keystone at center (top of arch)
    draw.polygon([(91, 42), (101, 42), (99, 58), (93, 58)], fill=(195, 202, 215, 255), outline=(45, 48, 55, 255))
    draw.line([(92, 43), (100, 43)], fill=(240, 245, 255, 255))

    # Inner arch shadow gradient
    draw.arc([(54, 56), (137, 140)], 180, 360, fill=(20, 22, 28, 180), width=6)

    # Ground shadow trim
    draw.rectangle([(0, H - 2), (W - 1, H - 1)], fill=(20, 22, 28, 180))

    im.save(os.path.join(OUT_DIR, 'portal_pequeno.png'))
    print(f"Generated portal_pequeno.png ({W}x{H})")

def create_portal_grande():
    # 8 blocks wide (384px) x 4 blocks high (216px total)
    W, H = 384, 216
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # 1. Top Battlements & Coping (0..23)
    draw_stone_coping(draw, 0, 23, W)
    # Fortified Machicolations / Corbels under coping
    for cx in range(0, W, 24):
        draw.polygon([(cx + 2, 24), (cx + 10, 24), (cx + 8, 34), (cx + 4, 34)], fill=(120, 126, 138, 255), outline=(45, 48, 55, 255))

    # 2. Upper Castle Wall Course (24..63)
    for y in range(24, 64):
        for x in range(W):
            n = ((x * 13 + y * 23) % 17) - 8
            draw.point((x, y), fill=(90 + n * 2, 96 + n * 2, 108 + n * 2, 255))
    for vx in range(24, W, 24):
        draw.line([(vx, 24), (vx, 63)], fill=(45, 48, 55, 255))
    draw.line([(0, 63), (W - 1, 63)], fill=(45, 48, 55, 255))

    # 3. Flanking Bastion Towers (Left: 0..47, Right: 336..383)
    for px0, px1 in [(0, 47), (336, 383)]:
        for y in range(64, H - 2):
            for x in range(px0, px1 + 1):
                n = ((x * 17 + y * 19) % 15) - 7
                draw.point((x, y), fill=(86 + n * 2, 92 + n * 2, 104 + n * 2, 255))
        draw.line([(px0, 64), (px0, H - 2)], fill=(145, 152, 165, 255), width=2)
        draw.line([(px1, 64), (px1, H - 2)], fill=(45, 48, 55, 255), width=2)
        for cy in range(76, H - 2, 16):
            draw.line([(px0, cy), (px1, cy)], fill=(45, 48, 55, 255), width=1)
            draw.line([(px0 + 1, cy + 1), (px1 - 1, cy + 1)], fill=(120, 126, 140, 255), width=1)
        # Double Arrow Slits with Stone Arch Frames
        mid_x = (px0 + px1) // 2
        for sy_slit in [85, 140]:
            draw.rectangle([(mid_x - 2, sy_slit), (mid_x + 2, sy_slit + 32)], fill=(16, 18, 22, 255))
            draw.line([(mid_x - 5, sy_slit + 14), (mid_x + 5, sy_slit + 14)], fill=(16, 18, 22, 255), width=2)
            draw.arc([(mid_x - 5, sy_slit - 4), (mid_x + 5, sy_slit + 6)], 180, 360, fill=(135, 142, 155, 255), width=2)

    # 4. Monumental Castle Arch (spans x=48 to x=335, center x=192, radius=144)
    # Outer monumental arch rim
    draw.arc([(42, 38), (341, 190)], 180, 360, fill=(145, 152, 165, 255), width=14)
    draw.arc([(56, 52), (327, 180)], 180, 360, fill=(45, 48, 55, 255), width=2)

    # Radial voussoirs
    for deg in range(185, 360, 8):
        rad = math.radians(deg)
        x_in = 192 + int(136 * math.cos(rad))
        y_in = 114 + int(64 * math.sin(rad))
        x_out = 192 + int(150 * math.cos(rad))
        y_out = 114 + int(76 * math.sin(rad))
        draw.line([(x_in, y_in), (x_out, y_out)], fill=(45, 48, 55, 255), width=2)

    # Grand Imperial Gold Keystone with Relief
    draw.polygon([(184, 30), (200, 30), (197, 54), (187, 54)], fill=(215, 175, 75, 255), outline=(55, 45, 18, 255))
    draw.line([(185, 31), (199, 31)], fill=(255, 230, 130, 255), width=1)
    draw.rectangle([(189, 36), (195, 48)], fill=(180, 140, 50, 255))

    # 5. Heavy Iron Portcullis (Grade de Ferro Suspensa com Pontas Afiadas) in upper vault
    # Crossbeams
    for gy in [58, 76, 94]:
        draw.rectangle([(58, gy), (325, gy + 3)], fill=(42, 45, 52, 255))
        draw.line([(58, gy), (325, gy)], fill=(85, 90, 102, 255), width=1)
        for rx in range(64, 320, 16):
            draw.point((rx, gy + 1), fill=(160, 170, 180, 255))
    # Vertical Iron Bars with Spike Tips
    for bx in range(66, 320, 12):
        draw.line([(bx, 52), (bx, 106)], fill=(50, 55, 62, 255), width=2)
        draw.line([(bx, 52), (bx, 106)], fill=(110, 118, 130, 255), width=1)
        # Spike tip
        draw.polygon([(bx - 2, 106), (bx + 2, 106), (bx, 114)], fill=(170, 180, 195, 255), outline=(40, 44, 50, 255))

    # Inner arch atmospheric shadow
    draw.arc([(56, 52), (327, 180)], 180, 360, fill=(18, 20, 26, 160), width=8)

    draw.rectangle([(0, H - 2), (W - 1, H - 1)], fill=(20, 22, 28, 180))

    im.save(os.path.join(OUT_DIR, 'portal_grande.png'))
    print(f"Generated portal_grande.png ({W}x{H})")

def create_parede_pedra_side_48():
    # 48x48 pixel-perfect continuous stone coping for vertical walls (North-South)
    im = Image.new('RGBA', (48, 48), (135, 142, 155, 255))
    draw = ImageDraw.Draw(im)

    # Stone texture noise
    for y in range(48):
        for x in range(48):
            n = ((x * 17 + y * 29) % 15) - 7
            draw.point((x, y), fill=(135 + n * 2, 142 + n * 2, 155 + n * 2, 255))

    # West edge bevel (highlight)
    draw.line([(0, 0), (0, 47)], fill=(185, 192, 205, 255), width=2)
    # East edge bevel (shadow)
    draw.line([(47, 0), (47, 47)], fill=(85, 90, 102, 255), width=2)

    # Transverse masonry coping joint lines (every 24px along Y)
    for jy in [0, 24]:
        draw.line([(0, jy), (47, jy)], fill=(55, 60, 70, 255), width=1)
        if jy + 1 < 48:
            draw.line([(1, jy + 1), (46, jy + 1)], fill=(160, 168, 180, 255), width=1)

    im.save(os.path.join(OUT_DIR, 'parede_pedra_side.png'))
    print("Generated parede_pedra_side.png (48x48 continuous North-South coping)")

def create_parede_madeira_side_48():
    # 48x48 pixel-perfect continuous heavy timber coping for vertical walls
    im = Image.new('RGBA', (48, 48), (140, 95, 52, 255))
    draw = ImageDraw.Draw(im)

    for y in range(48):
        for x in range(48):
            grain = int(math.sin(x * 0.4 + y * 0.1) * 6 + ((x * 11 + y * 19) % 9) - 4)
            draw.point((x, y), fill=(140 + grain, 95 + grain, 52 + grain, 255))

    # Left/right edges
    draw.line([(0, 0), (0, 47)], fill=(190, 140, 90, 255), width=2)
    draw.line([(47, 0), (47, 47)], fill=(75, 48, 22, 255), width=2)

    # Transverse joint + Iron binding straps
    for jy in [0, 24]:
        draw.line([(0, jy), (47, jy)], fill=(55, 32, 14, 255), width=1)
        # Iron bracket
        draw.rectangle([(2, jy + 2), (6, jy + 8)], fill=(45, 48, 55, 255))
        draw.point((4, jy + 5), fill=(160, 170, 180, 255))
        draw.rectangle([(41, jy + 2), (45, jy + 8)], fill=(45, 48, 55, 255))
        draw.point((43, jy + 5), fill=(160, 170, 180, 255))

    im.save(os.path.join(OUT_DIR, 'parede_madeira_side.png'))
    print("Generated parede_madeira_side.png (48x48 continuous North-South timber)")

def create_porta_simples_side(is_open=False):
    # 48x120 - Side Profile of Simple Door in a North-South Wall
    im = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # 1. Top Coping (0..23)
    draw.rectangle([(0, 0), (47, 23)], fill=(135, 142, 155, 255))
    draw.line([(0, 0), (47, 0)], fill=(185, 192, 205, 255), width=1)
    draw.line([(0, 0), (0, 23)], fill=(175, 182, 195, 255), width=2)
    draw.line([(47, 0), (47, 23)], fill=(85, 90, 102, 255), width=1)
    draw.line([(0, 23), (47, 23)], fill=(65, 70, 80, 255), width=1)

    # 2. Side Arch Profile (24..43)
    draw.rectangle([(0, 24), (47, 43)], fill=(92, 98, 110, 255))
    for sy in range(24, 44):
        for sx in range(48):
            n = ((sx * 13 + sy * 23) % 17) - 8
            draw.point((sx, sy), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
    # Arch curve from side
    draw.line([(0, 43), (47, 43)], fill=(45, 48, 55, 255), width=2)
    draw.line([(10, 36), (38, 36)], fill=(125, 132, 145, 255), width=1)

    # 3. North & South Jamb Pillars (44..117)
    draw.rectangle([(0, 44), (7, 117)], fill=(88, 94, 106, 255))
    draw.rectangle([(40, 44), (47, 117)], fill=(88, 94, 106, 255))
    draw.line([(0, 44), (0, 117)], fill=(145, 152, 165, 255))
    draw.line([(47, 44), (47, 117)], fill=(50, 54, 62, 255))
    for py in [62, 80, 98]:
        draw.line([(0, py), (7, py)], fill=(45, 48, 55, 255))
        draw.line([(40, py), (47, py)], fill=(45, 48, 55, 255))

    # 4. Doorway opening (between x=8 and x=39)
    if is_open:
        # Open: dark depth in doorway, door leaf swung inward against wall
        draw.rectangle([(8, 44), (39, 117)], fill=(18, 20, 26, 120))
        # Door swung open inside
        draw.polygon([(8, 50), (14, 46), (14, 112), (8, 116)], fill=(95, 62, 34, 255))
        draw.line([(14, 46), (14, 112)], fill=(160, 110, 60, 255), width=1)
        for hy in [60, 85, 105]:
            draw.line([(8, hy), (14, hy - 2)], fill=(45, 48, 55, 255), width=2)
    else:
        # Closed: wooden door leaf seen in perspective blocking the passage
        for y in range(45, 117):
            for x in range(12, 36):
                grain = int(math.sin(y * 0.3) * 6 + ((x * 7 + y * 13) % 9) - 4)
                draw.point((x, y), fill=(105 + grain, 70 + grain, 38 + grain, 255))
        draw.line([(12, 45), (12, 116)], fill=(155, 110, 65, 255), width=1)
        draw.line([(35, 45), (35, 116)], fill=(55, 34, 16, 255), width=1)
        for iy in [56, 84, 106]:
            draw.rectangle([(12, iy), (35, iy + 2)], fill=(42, 45, 52, 255))
            draw.point((15, iy + 1), fill=(160, 170, 180, 255))
            draw.point((32, iy + 1), fill=(160, 170, 180, 255))
        # Handle on side
        draw.rectangle([(31, 80), (33, 86)], fill=(220, 200, 120, 255))

    draw.rectangle([(0, 118), (47, 119)], fill=(20, 22, 28, 180))

    name = 'porta_simples_side_aberta.png' if is_open else 'porta_simples_side.png'
    im.save(os.path.join(OUT_DIR, name))
    print(f"Generated {name} (48x120)")

def create_porta_dupla_side(is_open=False):
    # 48x120 - Side Profile of Double Door in a North-South Wall
    im = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)

    # 1. Top Coping (0..23)
    draw.rectangle([(0, 0), (47, 23)], fill=(135, 142, 155, 255))
    draw.line([(0, 0), (47, 0)], fill=(185, 192, 205, 255), width=1)
    draw.line([(0, 0), (0, 23)], fill=(175, 182, 195, 255), width=2)
    draw.line([(47, 0), (47, 23)], fill=(85, 90, 102, 255), width=1)
    draw.line([(0, 23), (47, 23)], fill=(65, 70, 80, 255), width=1)

    # 2. Side Arch & Keystone Profile (24..43)
    draw.rectangle([(0, 24), (47, 43)], fill=(92, 98, 110, 255))
    for sy in range(24, 44):
        for sx in range(48):
            n = ((sx * 13 + sy * 23) % 17) - 8
            draw.point((sx, sy), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
    draw.line([(0, 43), (47, 43)], fill=(45, 48, 55, 255), width=2)
    # Side corbel
    draw.polygon([(20, 36), (28, 36), (26, 43), (22, 43)], fill=(175, 182, 195, 255), outline=(45, 48, 55, 255))

    # 3. Flanking Side Pillars
    draw.rectangle([(0, 44), (6, 117)], fill=(88, 94, 106, 255))
    draw.rectangle([(41, 44), (47, 117)], fill=(88, 94, 106, 255))
    draw.line([(0, 44), (0, 117)], fill=(145, 152, 165, 255))
    draw.line([(47, 44), (47, 117)], fill=(50, 54, 62, 255))

    if is_open:
        # Open: dark passage through arch
        draw.rectangle([(7, 44), (40, 117)], fill=(18, 20, 26, 130))
        # Double leaves open in perspective (one on each jamb)
        draw.polygon([(7, 48), (13, 44), (13, 112), (7, 116)], fill=(95, 62, 34, 255))
        draw.polygon([(40, 48), (34, 44), (34, 112), (40, 116)], fill=(95, 62, 34, 255))
        for hy in [58, 84, 106]:
            draw.line([(7, hy), (13, hy - 2)], fill=(45, 48, 55, 255), width=2)
            draw.line([(40, hy), (34, hy - 2)], fill=(45, 48, 55, 255), width=2)
    else:
        # Closed: heavy double castle door leaves seen from side
        for y in range(45, 117):
            for x in range(7, 41):
                grain = int(math.sin(y * 0.3) * 6 + ((x * 7 + y * 13) % 9) - 4)
                draw.point((x, y), fill=(105 + grain, 70 + grain, 38 + grain, 255))
        draw.line([(23, 45), (23, 116)], fill=(38, 22, 12, 255), width=2)
        draw.line([(7, 45), (7, 116)], fill=(155, 110, 65, 255), width=1)
        draw.line([(40, 45), (40, 116)], fill=(55, 34, 16, 255), width=1)
        for iy in [56, 84, 106]:
            draw.rectangle([(7, iy), (40, iy + 2)], fill=(42, 45, 52, 255))
            draw.point([(12, iy + 1), (20, iy + 1), (28, iy + 1), (36, iy + 1)], fill=(160, 170, 180, 255))
        # Twin Brass Studs
        draw.circle((21, 82), 2, fill=(220, 200, 120, 255))
        draw.circle((26, 82), 2, fill=(220, 200, 120, 255))

    draw.rectangle([(0, 118), (47, 119)], fill=(20, 22, 28, 180))

    name = 'porta_dupla_side_aberta.png' if is_open else 'porta_dupla_side.png'
    im.save(os.path.join(OUT_DIR, name))
    print(f"Generated {name} (48x120)")

if __name__ == '__main__':
    create_portal_pequeno()
    create_portal_grande()
    create_parede_pedra_side_48()
    create_parede_madeira_side_48()
    create_porta_simples_side(is_open=False)
    create_porta_simples_side(is_open=True)
    create_porta_dupla_side(is_open=False)
    create_porta_dupla_side(is_open=True)
    print("All new and updated sprites generated successfully!")
