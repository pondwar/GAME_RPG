# scripts/generate_tibia_sprites.py
# High quality 2.5D Tibia-inspired sprites for:
# 1. parede_pedra_side.png (48x120) & parede_madeira_side.png (48x120)
#    - Tall 120px height matching horizontal walls (no more flat floor look!)
#    - y=0..48: continuous stone/timber coping running North-South
#    - y=48..120: South-facing stone/timber facade down to grass
# 2. porta_simples_side.png & porta_simples_side_aberta.png (48x120)
#    - Tibia-style visible wooden door leaf inside stone archway (closed & open)
# 3. porta_dupla_side.png & porta_dupla_side_aberta.png (48x120)
#    - Fortified double door in side view (closed & open)
# 4. portal_pequeno_side.png (48x360) & portal_grande_side.png (48x552)
#    - Castle portals in side view (for vertical North-South walls!)

import os
from PIL import Image, ImageDraw

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'blocks')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_parede_pedra_side_120():
    """
    48x120 Stone Wall Side Sprite.
    Matches 2-block wall height (120px).
    y=0..48: Top coping surface that connects seamlessly along Y for vertical walls.
    y=48..120: South-facing terminal brick face down to the ground.
    """
    img = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Top Coping (y = 0..48): Elevated walkway / coping running North-South
    # Left edge shadow/bevel (x = 0..4)
    # Center slabs (x = 5..42)
    # Right edge highlight/bevel (x = 43..47)
    for y in range(0, 48):
        for x in range(48):
            # Base slate tone
            if x < 4:
                # Dark left bevel (shadowed side)
                r, g, b = 75 + x * 5, 80 + x * 5, 90 + x * 5
            elif x > 43:
                # Bright right bevel (sunlit side)
                r, g, b = 155 - (47 - x) * 8, 160 - (47 - x) * 8, 170 - (47 - x) * 8
            else:
                # Center coping stone slab
                noise = ((x * 17 + y * 31) % 9) - 4
                r, g, b = 120 + noise, 125 + noise, 135 + noise

            # Transverse mortar joints at y=16 and y=32 (seamless tiling along Y!)
            if y in (15, 31, 47):
                r, g, b = max(0, r - 35), max(0, g - 35), max(0, b - 35)
            elif y in (16, 32, 0):
                r, g, b = min(255, r + 20), min(255, g + 20), min(255, b + 20)

            # Central subtle longitudinal groove
            if x == 24:
                r, g, b = max(0, r - 15), max(0, g - 15), max(0, b - 15)

            draw.point((x, y), fill=(r, g, b, 255))

    # 2. South-facing Facade (y = 48..120): Stone brick courses down to ground
    # 72px total height: 3 courses of 24px each
    for course_idx in range(3):
        cy_start = 48 + course_idx * 24
        cy_end = cy_start + 24
        is_offset = (course_idx % 2 == 1)

        for y in range(cy_start, cy_end):
            for x in range(48):
                # Mortar line at top of course
                if y == cy_start:
                    draw.point((x, y), fill=(40, 42, 48, 255))
                    continue
                # Highlight below mortar line
                if y == cy_start + 1:
                    draw.point((x, y), fill=(145, 150, 160, 255))
                    continue

                # Vertical joint between bricks
                joint_x = 24 if not is_offset else 12
                joint_x2 = 36 if is_offset else -1
                if x == joint_x or x == joint_x2:
                    draw.point((x, y), fill=(40, 42, 48, 255))
                    continue

                # Brick body texture
                noise = ((x * 13 + y * 29) % 11) - 5
                # Shading from top to bottom of brick
                grad = (y - cy_start) * 0.6
                br = int(95 + noise - grad)
                bg = int(100 + noise - grad)
                bb = int(110 + noise - grad)

                # Left side shadow, right side highlight
                if x < 4:
                    br, bg, bb = br - 18, bg - 18, bb - 18
                elif x > 43:
                    br, bg, bb = br + 15, bg + 15, bb + 15

                draw.point((x, y), fill=(max(0, min(255, br)), max(0, min(255, bg)), max(0, min(255, bb)), 255))

    # Drop shadow at ground base
    for x in range(48):
        draw.point((x, 119), fill=(20, 22, 25, 230))
        draw.point((x, 118), fill=(30, 32, 35, 180))

    img.save(os.path.join(OUTPUT_DIR, 'parede_pedra_side.png'))
    print("Generated parede_pedra_side.png (48x120)")

def create_parede_madeira_side_120():
    """
    48x120 Wooden Wall Side Sprite.
    y=0..48: Top timber beam coping running North-South.
    y=48..120: South-facing wooden planks down to ground.
    """
    img = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Top Timber Beam (y = 0..48)
    for y in range(0, 48):
        for x in range(48):
            # Rich wood tones
            grain = ((x * 19 + y * 7) % 7) - 3
            if x < 4:
                r, g, b = 90 + x * 5, 55 + x * 3, 25 + x * 2
            elif x > 43:
                r, g, b = 150 - (47 - x) * 6, 100 - (47 - x) * 4, 55 - (47 - x) * 3
            else:
                r, g, b = 120 + grain, 78 + grain, 42 + grain

            # Cross joints at y=16, 32, 48
            if y in (15, 31, 47):
                r, g, b = max(0, r - 30), max(0, g - 25), max(0, b - 15)
            elif y in (16, 32, 0):
                r, g, b = min(255, r + 20), min(255, g + 15), min(255, b + 10)

            # Iron reinforcing strap with rivet at y=8 and y=24
            if y in (8, 9, 24, 25) and 6 <= x <= 41:
                r, g, b = (45, 48, 52)
                if x in (12, 35) and y in (8, 24):
                    r, g, b = (180, 185, 190) # Rivet

            draw.point((x, y), fill=(r, g, b, 255))

    # 2. South-facing Wooden Planks (y = 48..120)
    for y in range(48, 120):
        for x in range(48):
            plank_idx = x // 12
            in_plank_x = x % 12
            grain = ((x * 11 + y * 23) % 9) - 4

            if in_plank_x == 0:
                # Dark vertical seam between planks
                r, g, b = 40, 25, 12
            elif in_plank_x == 1:
                # Highlight next to seam
                r, g, b = 135 + grain, 90 + grain, 50 + grain
            else:
                shade = (y - 48) * 0.4
                r = int(115 + grain - shade)
                g = int(72 + grain - shade)
                b = int(38 + grain - shade)

            # Horizontal iron reinforcement bands at y=70 and y=105
            if y in (70, 71, 105, 106) and 2 <= x <= 45:
                r, g, b = (50, 52, 56)
                if x in (6, 18, 30, 42) and y in (70, 105):
                    r, g, b = (175, 180, 185)

            draw.point((x, y), fill=(max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)), 255))

    # Drop shadow at ground base
    for x in range(48):
        draw.point((x, 119), fill=(15, 12, 10, 230))
        draw.point((x, 118), fill=(25, 20, 15, 180))

    img.save(os.path.join(OUTPUT_DIR, 'parede_madeira_side.png'))
    print("Generated parede_madeira_side.png (48x120)")

def create_porta_simples_side_tibia(is_open=False):
    """
    48x120 Side Door Sprite (Tibia style).
    Width: 48px, Height: 120px.
    Fits in vertical walls. Shows clearly visible stone archway and wooden door leaf.
    """
    img = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Top stone arch/lintel (y = 0..24)
    # Matches stone wall coping
    for y in range(0, 24):
        for x in range(48):
            noise = ((x * 17 + y * 31) % 9) - 4
            if x < 4 or x > 43:
                r, g, b = 90 + noise, 95 + noise, 105 + noise
            else:
                r, g, b = 120 + noise, 125 + noise, 135 + noise
            draw.point((x, y), fill=(r, g, b, 255))

    # Keystone in arch top
    for y in range(8, 24):
        for x in range(20, 28):
            draw.point((x, y), fill=(140, 145, 155, 255))
    draw.rectangle([20, 8, 27, 23], outline=(60, 65, 75, 255))

    # 2. Left & Right Stone Jambs (y = 24..118)
    for y in range(24, 118):
        # Left jamb: x = 0..5
        for x in range(6):
            shade = 85 + (x * 4) + ((y * 13) % 7)
            draw.point((x, y), fill=(shade, shade + 5, shade + 12, 255))
        # Right jamb: x = 42..47
        for x in range(42, 48):
            shade = 125 - ((x - 42) * 5) + ((y * 13) % 7)
            draw.point((x, y), fill=(shade, shade + 5, shade + 12, 255))

        # Mortar joint marks on jambs every 20px
        if y % 20 == 0:
            draw.line([(0, y), (5, y)], fill=(45, 48, 55, 255))
            draw.line([(42, y), (47, y)], fill=(45, 48, 55, 255))

    # 3. Doorway Inner Area (x = 6..41, y = 24..116)
    if not is_open:
        # CLOSED DOOR (Tibia style: clear oak wood door, iron hinges, gold handle)
        # Inner frame shadow
        draw.rectangle([6, 24, 41, 116], fill=(45, 28, 15, 255))

        # Wooden door panel (x = 8..39, y = 26..115)
        for y in range(26, 116):
            for x in range(8, 40):
                # 3 vertical wooden planks
                plank = (x - 8) // 10
                in_p = (x - 8) % 10
                grain = ((x * 7 + y * 19) % 7) - 3

                if in_p == 0:
                    r, g, b = 50, 30, 15 # Plank seam
                else:
                    # Warm oak wood tone
                    r = 145 + grain - (plank * 5)
                    g = 95 + grain - (plank * 4)
                    b = 50 + grain - (plank * 2)

                draw.point((x, y), fill=(r, g, b, 255))

        # Top arched trim
        draw.arc([8, 26, 39, 44], 180, 360, fill=(70, 45, 25, 255), width=2)

        # Heavy Black Wrought-Iron Hinges (at y=42 and y=88)
        for hy in (42, 88):
            # Iron strap across door
            draw.rectangle([8, hy, 36, hy + 5], fill=(35, 38, 42, 255))
            # Hinge bracket on left post
            draw.rectangle([5, hy - 2, 8, hy + 7], fill=(25, 28, 32, 255))
            # Silver rivets
            draw.point((12, hy + 2), fill=(190, 195, 205, 255))
            draw.point((22, hy + 2), fill=(190, 195, 205, 255))
            draw.point((32, hy + 2), fill=(190, 195, 205, 255))

        # Golden Brass Handle and Keyplate (at x=34..37, y=68..76)
        draw.rectangle([34, 68, 37, 76], fill=(220, 175, 40, 255))
        draw.rectangle([34, 68, 37, 76], outline=(140, 100, 20, 255))
        draw.ellipse([32, 70, 36, 74], fill=(255, 215, 60, 255)) # Handle knob
        draw.point((35, 73), fill=(40, 25, 10, 255)) # Keyhole
        draw.point((35, 74), fill=(40, 25, 10, 255))

        # Stone threshold at bottom
        for y in range(116, 120):
            for x in range(48):
                draw.point((x, y), fill=(80, 85, 95, 255))
    else:
        # OPEN DOOR (Tibia style: clear doorway opening, stone floor threshold, swung leaf)
        # 1. Dark interior passage (revealing passage through wall!)
        for y in range(24, 116):
            for x in range(6, 42):
                depth_shade = int(35 + (y - 24) * 0.4)
                draw.point((x, y), fill=(depth_shade, depth_shade + 4, depth_shade + 8, 255))

        # Floor threshold cobblestone inside doorway
        for y in range(96, 116):
            for x in range(6, 42):
                cobble = ((x * 13 + y * 27) % 7) - 3
                draw.point((x, y), fill=(85 + cobble, 90 + cobble, 98 + cobble, 255))

        # 2. Door leaf swung OPEN in 3D perspective against the right jamb (x = 32..44)
        for y in range(30, 115):
            for x in range(32, 42):
                # Slanted open perspective
                grain = ((x * 9 + y * 17) % 5) - 2
                draw.point((x, y), fill=(130 + grain, 85 + grain, 45 + grain, 255))

        # Iron hinges visible on the open leaf
        draw.rectangle([32, 44, 42, 47], fill=(35, 38, 42, 255))
        draw.rectangle([32, 90, 42, 93], fill=(35, 38, 42, 255))

        # Door handle on open leaf edge
        draw.ellipse([31, 70, 34, 74], fill=(240, 195, 50, 255))

        # Stone threshold at base
        for y in range(116, 120):
            for x in range(48):
                draw.point((x, y), fill=(80, 85, 95, 255))

    fname = 'porta_simples_side_aberta.png' if is_open else 'porta_simples_side.png'
    img.save(os.path.join(OUTPUT_DIR, fname))
    print(f"Generated {fname} (48x120)")

def create_porta_dupla_side_tibia(is_open=False):
    """
    48x120 Double Door Side View Sprite.
    Grand castle double-door profile in vertical walls.
    """
    img = Image.new('RGBA', (48, 120), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Top heavy fortified stone coping & arch (y = 0..26)
    for y in range(0, 26):
        for x in range(48):
            noise = ((x * 17 + y * 31) % 9) - 4
            draw.point((x, y), fill=(115 + noise, 120 + noise, 130 + noise, 255))

    # Large ornate keystone
    for y in range(6, 26):
        for x in range(18, 30):
            draw.point((x, y), fill=(145, 150, 160, 255))
    draw.rectangle([18, 6, 29, 25], outline=(55, 60, 70, 255))

    # 2. Fortified jambs with stone corbels (x = 0..6, x = 41..47)
    for y in range(26, 118):
        for x in range(7):
            s = 85 + x * 4 + ((y * 11) % 6)
            draw.point((x, y), fill=(s, s + 5, s + 12, 255))
        for x in range(41, 48):
            s = 125 - (x - 41) * 5 + ((y * 11) % 6)
            draw.point((x, y), fill=(s, s + 5, s + 12, 255))
        if y % 18 == 0:
            draw.line([(0, y), (6, y)], fill=(40, 45, 52, 255))
            draw.line([(41, y), (47, y)], fill=(40, 45, 52, 255))

    if not is_open:
        # CLOSED DOUBLE DOOR (Fortified castle gate with heavy iron cross-bands)
        draw.rectangle([7, 26, 40, 116], fill=(40, 24, 12, 255))

        for y in range(28, 116):
            for x in range(9, 39):
                grain = ((x * 7 + y * 19) % 7) - 3
                draw.point((x, y), fill=(135 + grain, 85 + grain, 45 + grain, 255))

        # Center vertical division between the two doors
        draw.line([(24, 28), (24, 115)], fill=(30, 18, 10, 255), width=2)

        # 3 Heavy Iron bands (y=38, 72, 100)
        for hy in (38, 72, 100):
            draw.rectangle([7, hy, 40, hy + 5], fill=(32, 35, 40, 255))
            for rx in (11, 19, 29, 37):
                draw.point((rx, hy + 2), fill=(185, 190, 200, 255))

        # Twin brass door handles and heavy padlock
        draw.ellipse([21, 76, 23, 81], fill=(230, 185, 45, 255))
        draw.ellipse([25, 76, 27, 81], fill=(230, 185, 45, 255))
        draw.rectangle([22, 82, 26, 88], fill=(60, 65, 75, 255)) # Iron lock

        for y in range(116, 120):
            for x in range(48):
                draw.point((x, y), fill=(75, 80, 90, 255))
    else:
        # OPEN DOUBLE DOOR (Both leaves open inward against the jambs)
        # Open dark passageway
        for y in range(26, 116):
            for x in range(7, 41):
                ds = int(35 + (y - 26) * 0.4)
                draw.point((x, y), fill=(ds, ds + 4, ds + 8, 255))

        # Cobblestone threshold floor
        for y in range(96, 116):
            for x in range(7, 41):
                cb = ((x * 13 + y * 27) % 7) - 3
                draw.point((x, y), fill=(85 + cb, 90 + cb, 98 + cb, 255))

        # Left leaf swung open against left jamb (x = 7..14)
        for y in range(30, 115):
            for x in range(7, 15):
                draw.point((x, y), fill=(120, 75, 38, 255))
        # Right leaf swung open against right jamb (x = 33..41)
        for y in range(30, 115):
            for x in range(33, 41):
                draw.point((x, y), fill=(120, 75, 38, 255))

        for hy in (40, 74, 102):
            draw.rectangle([7, hy, 14, hy + 4], fill=(30, 32, 36, 255))
            draw.rectangle([33, hy, 41, hy + 4], fill=(30, 32, 36, 255))

        for y in range(116, 120):
            for x in range(48):
                draw.point((x, y), fill=(75, 80, 90, 255))

    fname = 'porta_dupla_side_aberta.png' if is_open else 'porta_dupla_side.png'
    img.save(os.path.join(OUTPUT_DIR, fname))
    print(f"Generated {fname} (48x120)")

def create_portal_pequeno_side():
    """
    Side profile of Portal Pequeno (4 blocks along Y = 192px on ground, 216px visual height).
    Sprite: 48 wide x 360 tall.
    North Bastion at top (y = 0..96).
    Grand Vaulted Arch spanning between towers (y = 70..140).
    Open Archway Passage in center (y = 140..264) - open passage!
    South Bastion at bottom (y = 264..360).
    """
    img = Image.new('RGBA', (48, 360), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Full height side wall / arch backbone (x = 0..48)
    # North Bastion (y = 0..96)
    for y in range(0, 96):
        for x in range(48):
            noise = ((x * 17 + y * 29) % 9) - 4
            if x < 4:
                r, g, b = 75 + noise, 80 + noise, 90 + noise
            elif x > 43:
                r, g, b = 150 + noise, 155 + noise, 165 + noise
            else:
                r, g, b = 115 + noise, 120 + noise, 130 + noise
            draw.point((x, y), fill=(r, g, b, 255))

    # Crenelation embrasure at top of North tower
    draw.rectangle([14, 0, 34, 18], fill=(0, 0, 0, 0))

    # 2. Grand Vaulted Stone Arch spanning continuously between North and South towers
    # Arch stone vault (y = 70..140 across all x)
    for y in range(70, 140):
        for x in range(48):
            arch_noise = ((x * 23 + y * 13) % 9) - 4
            # Highlighted stone masonry on the arch ring
            if 70 <= y <= 85:
                r, g, b = 140 + arch_noise, 145 + arch_noise, 155 + arch_noise
            else:
                r, g, b = 115 + arch_noise, 120 + arch_noise, 130 + arch_noise
            draw.point((x, y), fill=(r, g, b, 255))

    # Voussoir / stone arch radial segments
    for y in range(70, 140, 14):
        draw.line([(0, y), (47, y)], fill=(45, 48, 55, 255))

    # Golden decorative shield/crest on arch crown (y = 80..100)
    draw.polygon([(24, 78), (34, 88), (24, 102), (14, 88)], fill=(220, 180, 45, 255), outline=(130, 95, 20, 255))

    # 3. South Bastion Tower (y = 264..360)
    for y in range(264, 360):
        for x in range(48):
            noise = ((x * 17 + y * 29) % 9) - 4
            if x < 4:
                r, g, b = 75 + noise, 80 + noise, 90 + noise
            elif x > 43:
                r, g, b = 150 + noise, 155 + noise, 165 + noise
            else:
                r, g, b = 115 + noise, 120 + noise, 130 + noise
            draw.point((x, y), fill=(r, g, b, 255))

    # South tower stone brick courses (every 24px)
    for y in (288, 312, 336):
        draw.line([(0, y), (47, y)], fill=(45, 48, 55, 255))

    # Cobblestone road / path beneath archway (y = 230..264)
    for y in range(230, 264):
        for x in range(48):
            c = ((x * 11 + y * 17) % 7) - 3
            draw.point((x, y), fill=(80 + c, 85 + c, 92 + c, 210))

    # Arrow slits on North and South bastions
    draw.rectangle([22, 38, 26, 68], fill=(30, 32, 38, 255))
    draw.rectangle([22, 290, 26, 320], fill=(30, 32, 38, 255))

    # Drop shadow at ground base
    for x in range(48):
        draw.point((x, 359), fill=(20, 22, 25, 240))
        draw.point((x, 358), fill=(30, 32, 35, 180))

    img.save(os.path.join(OUTPUT_DIR, 'portal_pequeno_side.png'))
    print("Generated portal_pequeno_side.png (48x360)")

def create_portal_grande_side():
    """
    Side profile of Portal Grande (8 blocks along Y = 384px on ground, 216px visual height).
    Sprite: 48 wide x 552 tall.
    North Bastion Tower (y = 0..120).
    Massive Vaulted Arch with raised iron portcullis spanning towers (y = 80..160).
    Open Archway Passage in center (y = 160..432) - 272px opening!
    South Bastion Tower (y = 432..552).
    """
    img = Image.new('RGBA', (48, 552), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. North Fortress Bastion (y = 0..120)
    for y in range(0, 120):
        for x in range(48):
            noise = ((x * 17 + y * 29) % 9) - 4
            if x < 4:
                r, g, b = 75 + noise, 80 + noise, 90 + noise
            elif x > 43:
                r, g, b = 150 + noise, 155 + noise, 165 + noise
            else:
                r, g, b = 115 + noise, 120 + noise, 130 + noise
            draw.point((x, y), fill=(r, g, b, 255))

    # Machicolations & crenelations at top of North bastion
    draw.rectangle([12, 0, 36, 20], fill=(0, 0, 0, 0))

    # 2. Massive Arch Vault spanning continuously between the bastions (y = 80..160)
    for y in range(80, 160):
        for x in range(48):
            arch_noise = ((x * 23 + y * 13) % 9) - 4
            if 80 <= y <= 100:
                r, g, b = 145 + arch_noise, 150 + arch_noise, 160 + arch_noise
            else:
                r, g, b = 120 + arch_noise, 125 + arch_noise, 135 + arch_noise
            draw.point((x, y), fill=(r, g, b, 255))

    # Voussoirs / arch ring joints
    for y in range(80, 160, 16):
        draw.line([(0, y), (47, y)], fill=(45, 48, 55, 255))

    # Raised iron portcullis visible suspended in arch top (y = 150..185)
    for y in range(150, 185):
        for x in range(48):
            if x % 6 == 0 or y % 8 == 0:
                draw.point((x, y), fill=(45, 48, 55, 255))
            if y == 184 and x % 6 == 0:
                draw.polygon([(x - 2, 184), (x + 2, 184), (x, 190)], fill=(45, 48, 55, 255)) # Iron spike tip

    # Golden Imperial Crest on arch crown (y = 90..116)
    draw.polygon([(24, 88), (36, 100), (24, 118), (12, 100)], fill=(230, 190, 45, 255), outline=(140, 100, 20, 255))

    # 3. South Fortress Bastion (y = 432..552)
    for y in range(432, 552):
        for x in range(48):
            noise = ((x * 17 + y * 29) % 9) - 4
            if x < 4:
                r, g, b = 75 + noise, 80 + noise, 90 + noise
            elif x > 43:
                r, g, b = 150 + noise, 155 + noise, 165 + noise
            else:
                r, g, b = 115 + noise, 120 + noise, 130 + noise
            draw.point((x, y), fill=(r, g, b, 255))

    for y in range(456, 550, 24):
        draw.line([(0, y), (47, y)], fill=(45, 48, 55, 255))

    # Cobblestone road beneath archway (y = 390..432)
    for y in range(390, 432):
        for x in range(48):
            c = ((x * 11 + y * 17) % 7) - 3
            draw.point((x, y), fill=(80 + c, 85 + c, 92 + c, 210))

    # Arrow slits & murder holes
    draw.rectangle([21, 45, 27, 80], fill=(28, 30, 35, 255))
    draw.rectangle([21, 460, 27, 495], fill=(28, 30, 35, 255))

    # Ground shadow
    for x in range(48):
        draw.point((x, 551), fill=(20, 22, 25, 240))
        draw.point((x, 550), fill=(30, 32, 35, 180))

    img.save(os.path.join(OUTPUT_DIR, 'portal_grande_side.png'))
    print("Generated portal_grande_side.png (48x552)")

if __name__ == '__main__':
    create_parede_pedra_side_120()
    create_parede_madeira_side_120()
    create_porta_simples_side_tibia(is_open=False)
    create_porta_simples_side_tibia(is_open=True)
    create_porta_dupla_side_tibia(is_open=False)
    create_porta_dupla_side_tibia(is_open=True)
    create_portal_pequeno_side()
    create_portal_grande_side()
    print("All upgraded Tibia-style sprites generated successfully!")
