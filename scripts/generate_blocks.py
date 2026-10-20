# scripts/generate_blocks.py - Procedural High-Detail Pixel-Art Block Generator for Aethelgard
import os
import math
from PIL import Image, ImageDraw

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'blocks')
os.makedirs(OUT_DIR, exist_ok=True)

def create_piso_pedra():
    im = Image.new('RGBA', (48, 48), (60, 64, 72, 255))
    draw = ImageDraw.Draw(im)
    for y in range(48):
        for x in range(48):
            n = ((x * 17 + y * 29 + (x ^ y)) % 19) - 9
            r = max(0, min(255, 78 + n * 2))
            g = max(0, min(255, 82 + n * 2))
            b = max(0, min(255, 90 + n * 2))
            draw.point((x, y), fill=(r, g, b, 255))
    stones = [
        [(2, 2), (22, 2), (22, 20), (2, 20)],
        [(24, 2), (46, 2), (46, 14), (24, 14)],
        [(24, 16), (46, 16), (46, 32), (24, 32)],
        [(2, 22), (14, 22), (14, 46), (2, 46)],
        [(16, 22), (22, 22), (22, 34), (16, 34)],
        [(16, 36), (36, 36), (36, 46), (16, 46)],
        [(38, 34), (46, 34), (46, 46), (38, 46)]
    ]
    for poly in stones:
        draw.polygon(poly, fill=(88, 93, 102, 255))
        x0, y0 = poly[0]
        x1, _ = poly[1]
        _, y2 = poly[2]
        draw.line([(x0+1, y0+1), (x1-1, y0+1)], fill=(120, 126, 138, 255), width=1)
        draw.line([(x0+1, y0+1), (x0+1, y2-1)], fill=(110, 116, 128, 255), width=1)
        draw.line([(x0+1, y2-1), (x1-1, y2-1)], fill=(52, 55, 62, 255), width=1)
        draw.line([(x1-1, y0+1), (x1-1, y2-1)], fill=(56, 59, 66, 255), width=1)
        draw.polygon(poly, outline=(34, 36, 42, 255))
    for pt in [(15, 21), (23, 15), (23, 33), (37, 35), (2, 21), (45, 15)]:
        draw.point(pt, fill=(45, 90, 40, 255))
        draw.point((pt[0]+1, pt[1]), fill=(35, 75, 30, 255))
    im.save(os.path.join(OUT_DIR, 'piso_pedra.png'))
    print("Generated piso_pedra.png")

def create_piso_madeira():
    im = Image.new('RGBA', (48, 48), (90, 58, 30, 255))
    draw = ImageDraw.Draw(im)
    plank_h = 12
    for i in range(4):
        y0 = i * plank_h
        y1 = y0 + plank_h - 1
        tone = (i % 2) * 8
        base_r, base_g, base_b = 138 + tone, 90 + tone, 50 + tone
        for y in range(y0, y1 + 1):
            for x in range(48):
                grain = int(math.sin(x * 0.45 + i * 2.1) * 6 + ((x * 7 + y * 13) % 9) - 4)
                r = max(0, min(255, base_r + grain))
                g = max(0, min(255, base_g + grain))
                b = max(0, min(255, base_b + grain))
                draw.point((x, y), fill=(r, g, b, 255))
        draw.line([(0, y0), (47, y0)], fill=(168 + tone, 115 + tone, 70 + tone, 255))
        draw.line([(0, y1), (47, y1)], fill=(50, 30, 14, 255))
        draw.point((3, y0 + 3), fill=(40, 25, 12, 255))
        draw.point((4, y0 + 3), fill=(180, 140, 80, 255))
        draw.point((44, y0 + 3), fill=(40, 25, 12, 255))
        draw.point((45, y0 + 3), fill=(180, 140, 80, 255))
    im.save(os.path.join(OUT_DIR, 'piso_madeira.png'))
    print("Generated piso_madeira.png")

def create_piso_terra():
    im = Image.new('RGBA', (48, 48), (110, 75, 42, 255))
    draw = ImageDraw.Draw(im)
    for y in range(48):
        for x in range(48):
            n = ((x * 23 + y * 37 + (x * y)) % 23) - 11
            r = max(0, min(255, 125 + n * 2))
            g = max(0, min(255, 85 + n * 2))
            b = max(0, min(255, 48 + n))
            draw.point((x, y), fill=(r, g, b, 255))
    pebbles = [(8, 12), (24, 9), (38, 18), (14, 32), (30, 39), (42, 41), (6, 44)]
    for px, py in pebbles:
        draw.ellipse([(px, py), (px + 3, py + 2)], fill=(90, 85, 80, 255), outline=(50, 45, 40, 255))
        draw.point((px + 1, py), fill=(140, 135, 130, 255))
    for gx, gy in [(2, 4), (45, 8), (4, 42), (43, 36)]:
        draw.line([(gx, gy), (gx + 1, gy - 3)], fill=(55, 110, 45, 255), width=1)
    im.save(os.path.join(OUT_DIR, 'piso_terra.png'))
    print("Generated piso_terra.png")

# --- PAREDES 2.5D ---

def draw_stone_coping(draw, y_start=0, y_end=23, width=48):
    draw.rectangle([(0, y_start), (width - 1, y_end)], fill=(138, 145, 158, 255))
    draw.line([(0, y_start), (width - 1, y_start)], fill=(188, 195, 208, 255), width=1)
    draw.line([(0, y_start), (0, y_end)], fill=(165, 172, 185, 255), width=1)
    draw.line([(width - 1, y_start), (width - 1, y_end)], fill=(95, 102, 115, 255), width=1)
    draw.line([(0, y_end), (width - 1, y_end)], fill=(75, 82, 95, 255), width=1)
    for cx in range(24, width, 24):
        draw.line([(cx, y_start), (cx, y_end)], fill=(65, 72, 85, 255), width=1)
    for cy in range(y_start + 1, y_end):
        for cx in range(1, width - 1):
            n = ((cx * 11 + cy * 17) % 13) - 6
            draw.point((cx, cy), fill=(138 + n * 2, 145 + n * 2, 158 + n * 2, 255))

def create_parede_pedra_front():
    im = Image.new('RGBA', (48, 72), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw_stone_coping(draw, 0, 23, 48)
    courses = [
        (24, 38, [0, 24, 48]),
        (39, 53, [0, 16, 36, 48]),
        (54, 69, [0, 26, 48])
    ]
    for y_top, y_bot, vertical_cuts in courses:
        for c in range(len(vertical_cuts) - 1):
            x_left = vertical_cuts[c]
            x_right = vertical_cuts[c + 1] - 1
            draw.rectangle([(x_left, y_top), (x_right, y_bot)], fill=(92, 98, 110, 255))
            for sy in range(y_top + 1, y_bot):
                for sx in range(x_left + 1, x_right):
                    n = ((sx * 13 + sy * 23) % 17) - 8
                    draw.point((sx, sy), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
            draw.line([(x_left + 1, y_top + 1), (x_right - 1, y_top + 1)], fill=(138, 145, 160, 255))
            draw.line([(x_left + 1, y_top + 1), (x_left + 1, y_bot - 1)], fill=(120, 126, 140, 255))
            draw.line([(x_left + 1, y_bot), (x_right, y_bot)], fill=(45, 48, 55, 255))
            draw.line([(x_right, y_top + 1), (x_right, y_bot)], fill=(48, 52, 60, 255))
            draw.rectangle([(x_left, y_top), (x_right, y_top)], outline=(32, 35, 42, 255))
    draw.rectangle([(0, 70), (47, 71)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'parede_pedra.png'))
    im.save(os.path.join(OUT_DIR, 'parede_pedra_front.png'))
    print("Generated parede_pedra_front.png")

def create_parede_pedra_side():
    im = Image.new('RGBA', (48, 72), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    # Side coping 0..23 (slightly darker side shading)
    draw.rectangle([(0, 0), (47, 23)], fill=(125, 132, 144, 255))
    draw.line([(0, 0), (47, 0)], fill=(175, 182, 195, 255), width=1)
    draw.line([(0, 0), (0, 23)], fill=(155, 162, 175, 255), width=1)
    draw.line([(47, 0), (47, 23)], fill=(85, 90, 102, 255), width=1)
    draw.line([(0, 23), (47, 23)], fill=(65, 70, 80, 255), width=1)
    for cx in range(16, 48, 16):
        draw.line([(cx, 0), (cx, 23)], fill=(60, 65, 75, 255), width=1)
    for cy in range(1, 23):
        for cx in range(1, 47):
            n = ((cx * 11 + cy * 17) % 13) - 6
            draw.point((cx, cy), fill=(125 + n * 2, 132 + n * 2, 144 + n * 2, 255))
    # Stone courses on side face 24..69
    courses = [
        (24, 38, [0, 16, 32, 48]),
        (39, 53, [0, 24, 48]),
        (54, 69, [0, 14, 34, 48])
    ]
    for y_top, y_bot, vertical_cuts in courses:
        for c in range(len(vertical_cuts) - 1):
            x_left = vertical_cuts[c]
            x_right = vertical_cuts[c + 1] - 1
            draw.rectangle([(x_left, y_top), (x_right, y_bot)], fill=(86, 92, 104, 255))
            for sy in range(y_top + 1, y_bot):
                for sx in range(x_left + 1, x_right):
                    n = ((sx * 13 + sy * 23) % 17) - 8
                    draw.point((sx, sy), fill=(86 + n * 2, 92 + n * 2, 104 + n * 2, 255))
            draw.line([(x_left + 1, y_top + 1), (x_right - 1, y_top + 1)], fill=(125, 132, 145, 255))
            draw.line([(x_left + 1, y_top + 1), (x_left + 1, y_bot - 1)], fill=(110, 116, 128, 255))
            draw.line([(x_left + 1, y_bot), (x_right, y_bot)], fill=(40, 44, 50, 255))
            draw.line([(x_right, y_top + 1), (x_right, y_bot)], fill=(45, 48, 55, 255))
            draw.rectangle([(x_left, y_top), (x_right, y_top)], outline=(30, 32, 38, 255))
    draw.rectangle([(0, 70), (47, 71)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'parede_pedra_side.png'))
    print("Generated parede_pedra_side.png")

def create_parede_madeira_front():
    im = Image.new('RGBA', (48, 72), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw.rectangle([(0, 0), (47, 21)], fill=(145, 100, 58, 255))
    draw.line([(0, 0), (47, 0)], fill=(195, 145, 95, 255), width=1)
    draw.line([(0, 21), (47, 21)], fill=(75, 48, 24, 255), width=1)
    for bx in [8, 24, 40]:
        draw.rectangle([(bx - 2, 3), (bx + 2, 18)], fill=(48, 52, 58, 255))
        draw.point((bx, 5), fill=(160, 170, 180, 255))
        draw.point((bx, 15), fill=(160, 170, 180, 255))
    for p in range(4):
        px0 = p * 12
        px1 = px0 + 11
        tone = (p % 2) * 10
        for y in range(22, 70):
            for x in range(px0, px1 + 1):
                grain = int(math.sin(y * 0.4 + p * 2.4) * 6 + ((x * 5 + y * 11) % 9) - 4)
                draw.point((x, y), fill=(105 + tone + grain, 70 + tone + grain, 40 + tone + grain, 255))
        draw.line([(px0 + 1, 22), (px0 + 1, 69)], fill=(145 + tone, 100 + tone, 60 + tone, 255))
        draw.line([(px1, 22), (px1, 69)], fill=(45, 28, 14, 255))
        for by in [34, 56]:
            draw.rectangle([(px0 + 3, by), (px0 + 8, by + 3)], fill=(42, 45, 52, 255))
            draw.point((px0 + 5, by + 1), fill=(150, 160, 170, 255))
    draw.rectangle([(0, 70), (47, 71)], fill=(18, 12, 8, 180))
    im.save(os.path.join(OUT_DIR, 'parede_madeira.png'))
    im.save(os.path.join(OUT_DIR, 'parede_madeira_front.png'))
    print("Generated parede_madeira_front.png")

def create_parede_madeira_side():
    im = Image.new('RGBA', (48, 72), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    # Coping beam 0..23
    draw.rectangle([(0, 0), (47, 23)], fill=(135, 90, 50, 255))
    draw.line([(0, 0), (47, 0)], fill=(185, 135, 85, 255), width=1)
    draw.line([(0, 23), (47, 23)], fill=(65, 40, 18, 255), width=1)
    for bx in [12, 36]:
        draw.rectangle([(bx - 2, 4), (bx + 2, 19)], fill=(42, 46, 52, 255))
        draw.point((bx, 6), fill=(150, 160, 170, 255))
        draw.point((bx, 16), fill=(150, 160, 170, 255))
    # Side wooden face 24..69
    for y in range(24, 70):
        for x in range(48):
            grain = int(math.sin(x * 0.4 + y * 0.25) * 6 + ((x * 13 + y * 19) % 9) - 4)
            draw.point((x, y), fill=(110 + grain, 72 + grain, 42 + grain, 255))
    for sy in [39, 54]:
        draw.line([(0, sy), (47, sy)], fill=(55, 32, 14, 255), width=1)
        draw.line([(0, sy + 1), (47, sy + 1)], fill=(145, 95, 55, 255), width=1)
    draw.rectangle([(0, 70), (47, 71)], fill=(18, 12, 8, 180))
    im.save(os.path.join(OUT_DIR, 'parede_madeira_side.png'))
    print("Generated parede_madeira_side.png")

# --- PORTAS (120px / 2 Blocos de Altura com Vão Amplo & Alinhamento de Topo) ---

def create_porta_simples_fechada():
    im = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw_stone_coping(draw, 0, 23, 48)
    
    # Stone course above arch (24-43)
    draw.rectangle([(0, 24), (47, 43)], fill=(92, 98, 110, 255))
    for sy in range(24, 44):
        for sx in range(48):
            n = ((sx * 13 + sy * 23) % 17) - 8
            draw.point((sx, sy), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
    draw.line([(24, 24), (24, 43)], fill=(45, 48, 55, 255))
    draw.line([(0, 43), (47, 43)], fill=(45, 48, 55, 255))

    # Stone pillars
    draw.rectangle([(0, 44), (5, 117)], fill=(92, 98, 110, 255))
    draw.rectangle([(42, 44), (47, 117)], fill=(92, 98, 110, 255))
    draw.line([(0, 44), (0, 117)], fill=(138, 145, 160, 255))
    draw.line([(47, 44), (47, 117)], fill=(45, 48, 55, 255))
    for py in [60, 78, 96, 114]:
        draw.line([(0, py), (5, py)], fill=(45, 48, 55, 255))
        draw.line([(42, py), (47, py)], fill=(45, 48, 55, 255))

    # Arch
    draw.rectangle([(6, 44), (41, 50)], fill=(80, 85, 96, 255))
    draw.arc([(5, 42), (42, 60)], 180, 360, fill=(135, 142, 155, 255), width=2)
    draw.polygon([(21, 42), (26, 42), (25, 50), (22, 50)], fill=(175, 182, 195, 255), outline=(45, 48, 55, 255))

    # Wood door
    for y in range(51, 118):
        for x in range(6, 42):
            p_idx = (x - 6) // 9
            n = ((x * 5 + y * 13) % 9) - 4
            draw.point((x, y), fill=(95 + p_idx * 6 + n, 62 + p_idx * 4 + n, 34 + p_idx * 2 + n, 255))
    for px in [15, 24, 33]:
        draw.line([(px, 51), (px, 117)], fill=(38, 22, 12, 255))
    for iy in [58, 86, 108]:
        draw.rectangle([(6, iy), (41, iy + 2)], fill=(42, 45, 52, 255))
        draw.line([(6, iy), (41, iy)], fill=(90, 95, 105, 255))
        for rx in [9, 18, 27, 37]:
            draw.point((rx, iy + 1), fill=(160, 170, 180, 255))
    # Brass handle
    draw.ellipse([(33, 83), (38, 88)], outline=(160, 170, 180, 255), fill=(35, 38, 44, 255))
    draw.point((35, 82), fill=(220, 200, 120, 255))

    draw.rectangle([(0, 118), (47, 119)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'porta_simples.png'))
    print("Generated porta_simples.png (48x120)")

def create_porta_simples_aberta():
    im = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw_stone_coping(draw, 0, 23, 48)
    
    draw.rectangle([(0, 24), (47, 43)], fill=(92, 98, 110, 255))
    for sy in range(24, 44):
        for sx in range(48):
            n = ((sx * 13 + sy * 23) % 17) - 8
            draw.point((sx, sy), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
    draw.line([(24, 24), (24, 43)], fill=(45, 48, 55, 255))
    draw.line([(0, 43), (47, 43)], fill=(45, 48, 55, 255))

    draw.rectangle([(0, 44), (5, 117)], fill=(92, 98, 110, 255))
    draw.rectangle([(42, 44), (47, 117)], fill=(92, 98, 110, 255))
    draw.line([(0, 44), (0, 117)], fill=(138, 145, 160, 255))
    draw.line([(47, 44), (47, 117)], fill=(45, 48, 55, 255))
    for py in [60, 78, 96, 114]:
        draw.line([(0, py), (5, py)], fill=(45, 48, 55, 255))
        draw.line([(42, py), (47, py)], fill=(45, 48, 55, 255))

    draw.rectangle([(6, 44), (41, 50)], fill=(80, 85, 96, 255))
    draw.arc([(5, 42), (42, 60)], 180, 360, fill=(135, 142, 155, 255), width=2)
    draw.polygon([(21, 42), (26, 42), (25, 50), (22, 50)], fill=(175, 182, 195, 255), outline=(45, 48, 55, 255))

    draw.rectangle([(6, 51), (41, 65)], fill=(20, 22, 28, 160))
    draw.rectangle([(6, 66), (41, 85)], fill=(20, 22, 28, 90))
    draw.rectangle([(6, 86), (41, 117)], fill=(20, 22, 28, 40))

    draw.polygon([(6, 52), (14, 60), (14, 115), (6, 117)], fill=(92, 60, 34, 255))
    draw.polygon([(6, 52), (7, 51), (15, 59), (14, 60)], fill=(138, 92, 50, 255))
    draw.line([(14, 60), (14, 115)], fill=(160, 110, 60, 255), width=1)
    for hy in [66, 88, 108]:
        draw.line([(6, hy), (14, hy + 4)], fill=(45, 48, 54, 255), width=2)

    draw.rectangle([(0, 118), (47, 119)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'porta_simples_aberta.png'))
    print("Generated porta_simples_aberta.png (48x120)")

def create_porta_dupla_fechada():
    im = Image.new('RGBA', (96, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw_stone_coping(draw, 0, 23, 96)
    
    # Stone wall course above arch
    draw.rectangle([(0, 24), (95, 43)], fill=(92, 98, 110, 255))
    for sy in range(24, 44):
        for sx in range(96):
            n = ((sx * 13 + sy * 23) % 17) - 8
            draw.point((sx, sy), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
    for vx in [24, 48, 72]:
        draw.line([(vx, 24), (vx, 43)], fill=(45, 48, 55, 255))
        draw.line([(vx + 1, 24), (vx + 1, 43)], fill=(120, 126, 140, 255))
    draw.line([(0, 43), (95, 43)], fill=(45, 48, 55, 255))

    # Stone pillars
    draw.rectangle([(0, 44), (7, 117)], fill=(92, 98, 110, 255))
    draw.rectangle([(88, 44), (95, 117)], fill=(92, 98, 110, 255))
    draw.line([(0, 44), (0, 117)], fill=(138, 145, 160, 255))
    draw.line([(95, 44), (95, 117)], fill=(45, 48, 55, 255))
    for py in [60, 78, 96, 114]:
        draw.line([(0, py), (7, py)], fill=(45, 48, 55, 255))
        draw.line([(88, py), (95, py)], fill=(45, 48, 55, 255))

    # Arch frame & keystone
    draw.rectangle([(8, 44), (87, 50)], fill=(80, 85, 96, 255))
    draw.arc([(7, 42), (88, 62)], 180, 360, fill=(145, 152, 165, 255), width=3)
    draw.polygon([(44, 42), (51, 42), (49, 52), (46, 52)], fill=(185, 192, 205, 255), outline=(45, 48, 55, 255))

    # Wooden door leaves
    for wing in [0, 1]:
        wx0 = 8 + wing * 40
        wx1 = wx0 + 39
        for y in range(51, 118):
            for x in range(wx0, wx1 + 1):
                p_idx = ((x - wx0) // 10)
                grain = ((x * 7 + y * 17) % 11) - 5
                draw.point((x, y), fill=(98 + p_idx * 4 + grain, 64 + p_idx * 3 + grain, 36 + p_idx * 2 + grain, 255))
        for iy in [58, 86, 108]:
            draw.rectangle([(wx0, iy), (wx1, iy + 2)], fill=(42, 46, 52, 255))
            draw.line([(wx0, iy), (wx1, iy)], fill=(90, 96, 108, 255))
            for rx in range(wx0 + 4, wx1, 8):
                draw.point((rx, iy + 1), fill=(150, 160, 175, 255))
    draw.line([(47, 51), (47, 117)], fill=(20, 12, 6, 255), width=2)
    draw.rectangle([(42, 82), (53, 90)], fill=(50, 54, 62, 255))
    draw.ellipse([(40, 84), (44, 88)], fill=(220, 190, 80, 255))
    draw.ellipse([(51, 84), (55, 88)], fill=(220, 190, 80, 255))
    
    draw.rectangle([(0, 118), (95, 119)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'porta_dupla.png'))
    print("Generated porta_dupla.png (96x120)")

def create_porta_dupla_aberta():
    im = Image.new('RGBA', (96, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw_stone_coping(draw, 0, 23, 96)
    
    # Stone wall course above arch
    draw.rectangle([(0, 24), (95, 43)], fill=(92, 98, 110, 255))
    for sy in range(24, 44):
        for sx in range(96):
            n = ((sx * 13 + sy * 23) % 17) - 8
            draw.point((sx, sy), fill=(92 + n * 2, 98 + n * 2, 110 + n * 2, 255))
    for vx in [24, 48, 72]:
        draw.line([(vx, 24), (vx, 43)], fill=(45, 48, 55, 255))
        draw.line([(vx + 1, 24), (vx + 1, 43)], fill=(120, 126, 140, 255))
    draw.line([(0, 43), (95, 43)], fill=(45, 48, 55, 255))

    # Stone pillars
    draw.rectangle([(0, 44), (7, 117)], fill=(92, 98, 110, 255))
    draw.rectangle([(88, 44), (95, 117)], fill=(92, 98, 110, 255))
    draw.line([(0, 44), (0, 117)], fill=(138, 145, 160, 255))
    draw.line([(95, 44), (95, 117)], fill=(45, 48, 55, 255))
    for py in [60, 78, 96, 114]:
        draw.line([(0, py), (7, py)], fill=(45, 48, 55, 255))
        draw.line([(88, py), (95, py)], fill=(45, 48, 55, 255))

    # Arch frame
    draw.rectangle([(8, 44), (87, 50)], fill=(80, 85, 96, 255))
    draw.arc([(7, 42), (88, 62)], 180, 360, fill=(145, 152, 165, 255), width=3)
    draw.polygon([(44, 42), (51, 42), (49, 52), (46, 52)], fill=(185, 192, 205, 255), outline=(45, 48, 55, 255))

    # Atmospheric open interior shadows
    draw.rectangle([(8, 51), (87, 65)], fill=(20, 22, 28, 160))
    draw.rectangle([(8, 66), (87, 85)], fill=(20, 22, 28, 90))
    draw.rectangle([(8, 86), (87, 117)], fill=(20, 22, 28, 40))

    # Open door wings swung back into 2.5D perspective
    draw.polygon([(8, 52), (20, 60), (20, 115), (8, 117)], fill=(92, 60, 34, 255))
    draw.polygon([(8, 52), (9, 51), (21, 59), (20, 60)], fill=(138, 92, 50, 255))
    draw.line([(20, 60), (20, 115)], fill=(160, 110, 60, 255), width=1)
    for hy in [66, 88, 108]:
        draw.line([(8, hy), (20, hy + 4)], fill=(45, 48, 54, 255), width=2)

    draw.polygon([(87, 52), (75, 60), (75, 115), (87, 117)], fill=(92, 60, 34, 255))
    draw.polygon([(87, 52), (86, 51), (74, 59), (75, 60)], fill=(138, 92, 50, 255))
    draw.line([(75, 60), (75, 115)], fill=(160, 110, 60, 255), width=1)
    for hy in [66, 88, 108]:
        draw.line([(87, hy), (75, hy + 4)], fill=(45, 48, 54, 255), width=2)

    draw.rectangle([(0, 118), (95, 119)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'porta_dupla_aberta.png'))
    print("Generated porta_dupla_aberta.png (96x120)")

# --- TELHADOS 2.5D (48x48 Grid Perfeito com Telhas Escalonadas e Beirais Frontal e Lateral) ---

def create_telhado_madeira_front():
    # 48x48 - Shingle Cedar / Terracotta Roof (Horizontal / Slopes South)
    im = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    shingle_rows = [0, 12, 24, 36]
    for idx, sy in enumerate(shingle_rows):
        ey = min(47, sy + 11)
        offset = (idx % 2) * 8
        draw.rectangle([(0, sy), (47, ey)], fill=(155, 72, 38, 255))
        for sx in range(offset - 8, 56, 16):
            x0 = max(0, sx)
            x1 = min(47, sx + 15)
            draw.line([(x0, sy), (x1, sy)], fill=(205, 115, 68, 255))
            if x0 > 0:
                draw.line([(x0, sy), (x0, ey)], fill=(65, 28, 14, 255))
            draw.line([(x0, ey), (x1, ey)], fill=(50, 20, 8, 255))
            for gy in range(sy + 1, ey):
                for gx in range(x0, x1 + 1):
                    shade = int((gy - sy) * 2.8)
                    n = ((gx * 7 + gy * 13) % 9) - 4
                    draw.point((gx, gy), fill=(max(0, 160 - shade + n), max(0, 78 - shade + n), max(0, 44 - shade + n), 255))
    im.save(os.path.join(OUT_DIR, 'telhado_madeira.png'))
    im.save(os.path.join(OUT_DIR, 'telhado_madeira_front.png'))
    print("Generated telhado_madeira_front.png")

def create_telhado_madeira_side():
    # 48x48 - Shingle Cedar Roof (Vertical / Slopes East-West)
    im = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    shingle_cols = [0, 12, 24, 36]
    for idx, sx in enumerate(shingle_cols):
        ex = min(47, sx + 11)
        offset = (idx % 2) * 8
        draw.rectangle([(sx, 0), (ex, 47)], fill=(145, 68, 34, 255))
        for sy in range(offset - 8, 56, 16):
            y0 = max(0, sy)
            y1 = min(47, sy + 15)
            draw.line([(sx, y0), (sx, y1)], fill=(205, 115, 68, 255))
            if y0 > 0:
                draw.line([(sx, y0), (ex, y0)], fill=(65, 28, 14, 255))
            draw.line([(ex, y0), (ex, y1)], fill=(50, 20, 8, 255))
            for gx in range(sx + 1, ex):
                for gy in range(y0, y1 + 1):
                    shade = int((gx - sx) * 2.8)
                    n = ((gx * 11 + gy * 7) % 9) - 4
                    draw.point((gx, gy), fill=(max(0, 155 - shade + n), max(0, 74 - shade + n), max(0, 40 - shade + n), 255))
    im.save(os.path.join(OUT_DIR, 'telhado_madeira_side.png'))
    print("Generated telhado_madeira_side.png")

def create_telhado_palha_front():
    # 48x48 - Thatched Straw Roof (Horizontal / Slopes South)
    im = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    tiers = [
        (0, 12, (220, 180, 85)),
        (11, 24, (205, 165, 75)),
        (23, 36, (190, 150, 65)),
        (35, 47, (175, 135, 55))
    ]
    for y_start, y_end, base_col in tiers:
        for y in range(y_start, y_end + 1):
            for x in range(48):
                strand = int(math.sin(x * 1.8 + y * 0.3) * 12 + ((x * 19 + y * 7) % 15) - 7)
                r = max(0, min(255, base_col[0] + strand))
                g = max(0, min(255, base_col[1] + strand))
                b = max(0, min(255, base_col[2] + strand // 2))
                draw.point((x, y), fill=(r, g, b, 255))
        draw.line([(0, y_start), (47, y_start)], fill=(250, 220, 130, 255))
        draw.line([(0, y_end), (47, y_end)], fill=(85, 60, 20, 255))
        for fx in range(0, 48, 3):
            draw.point((fx, min(47, y_end + 1)), fill=(105, 75, 25, 255))
    im.save(os.path.join(OUT_DIR, 'telhado_palha.png'))
    im.save(os.path.join(OUT_DIR, 'telhado_palha_front.png'))
    print("Generated telhado_palha_front.png")

def create_telhado_palha_side():
    # 48x48 - Thatched Straw Roof (Vertical / Slopes East-West)
    im = Image.new('RGBA', (48, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    tiers = [
        (0, 12, (220, 180, 85)),
        (11, 24, (205, 165, 75)),
        (23, 36, (190, 150, 65)),
        (35, 47, (175, 135, 55))
    ]
    for x_start, x_end, base_col in tiers:
        for x in range(x_start, x_end + 1):
            for y in range(48):
                strand = int(math.sin(y * 1.8 + x * 0.3) * 12 + ((y * 19 + x * 7) % 15) - 7)
                r = max(0, min(255, base_col[0] + strand))
                g = max(0, min(255, base_col[1] + strand))
                b = max(0, min(255, base_col[2] + strand // 2))
                draw.point((x, y), fill=(r, g, b, 255))
        draw.line([(x_start, 0), (x_start, 47)], fill=(250, 220, 130, 255))
        draw.line([(x_end, 0), (x_end, 47)], fill=(85, 60, 20, 255))
        for fy in range(0, 48, 3):
            draw.point((min(47, x_end + 1), fy), fill=(105, 75, 25, 255))
    im.save(os.path.join(OUT_DIR, 'telhado_palha_side.png'))
    print("Generated telhado_palha_side.png")

# --- PORTAIS ---

def create_portal_pequeno():
    im = Image.new('RGBA', (48, 72), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw_stone_coping(draw, 0, 23, 48)
    draw.rectangle([(0, 24), (11, 69)], fill=(92, 98, 110, 255))
    draw.rectangle([(36, 24), (47, 69)], fill=(92, 98, 110, 255))
    for cy in [39, 54]:
        draw.line([(0, cy), (11, cy)], fill=(45, 48, 55, 255))
        draw.line([(36, cy), (47, cy)], fill=(45, 48, 55, 255))
    draw.arc([(8, 24), (39, 42)], 180, 360, fill=(125, 132, 145, 255), width=4)
    draw.polygon([(21, 24), (26, 24), (25, 30), (22, 30)], fill=(165, 172, 185, 255), outline=(45, 48, 55, 255))
    draw.line([(12, 30), (35, 30)], fill=(25, 28, 35, 180), width=2)
    draw.line([(12, 32), (35, 32)], fill=(35, 38, 45, 120), width=2)
    draw.line([(0, 24), (0, 69)], fill=(145, 152, 165, 255), width=1)
    draw.line([(47, 24), (47, 69)], fill=(55, 58, 65, 255), width=1)
    draw.rectangle([(0, 70), (47, 71)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'portal_pequeno.png'))
    print("Generated portal_pequeno.png")

def create_portal_grande():
    im = Image.new('RGBA', (96, 84), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    draw_stone_coping(draw, 0, 23, 96)
    for tx0, tx1 in [(0, 22), (73, 95)]:
        draw.rectangle([(tx0, 24), (tx1, 81)], fill=(92, 98, 110, 255))
        draw.rectangle([(tx0 + 9, 42), (tx0 + 13, 58)], fill=(22, 24, 28, 255))
        for cy in range(32, 82, 14):
            draw.line([(tx0, cy), (tx1, cy)], fill=(45, 48, 55, 255))
    draw.arc([(18, 24), (77, 60)], 180, 360, fill=(135, 142, 155, 255), width=8)
    draw.polygon([(44, 24), (51, 24), (49, 34), (46, 34)], fill=(210, 175, 75, 255), outline=(50, 40, 15, 255))
    for bx in range(28, 68, 8):
        draw.line([(bx, 34), (bx, 48)], fill=(55, 60, 68, 255), width=2)
        draw.line([(bx, 34), (bx, 48)], fill=(110, 118, 130, 255), width=1)
        draw.polygon([(bx - 1, 48), (bx + 2, 48), (bx, 52)], fill=(160, 170, 185, 255))
    draw.line([(26, 40), (69, 40)], fill=(65, 70, 80, 255), width=2)
    draw.rectangle([(0, 82), (95, 83)], fill=(20, 22, 28, 180))
    im.save(os.path.join(OUT_DIR, 'portal_grande.png'))
    print("Generated portal_grande.png")

if __name__ == '__main__':
    create_piso_pedra()
    create_piso_madeira()
    create_piso_terra()
    create_parede_pedra_front()
    create_parede_pedra_side()
    create_parede_madeira_front()
    create_parede_madeira_side()
    create_telhado_palha_front()
    create_telhado_palha_side()
    create_telhado_madeira_front()
    create_telhado_madeira_side()
    create_porta_simples_fechada()
    create_porta_simples_aberta()
    create_porta_dupla_fechada()
    create_porta_dupla_aberta()
    create_portal_pequeno()
    create_portal_grande()
    print("All Modular 2.5D RPG blocks and state sprites generated successfully with 48x48 pixel-perfect roofs!")
