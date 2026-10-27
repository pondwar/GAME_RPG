#!/usr/bin/env python3
"""
tools/make_game_atlas.py
Generates the scaled 104px-column game atlas and sprites_manifest.json
for Suritto from the 65 dungeon sprites in 1x/.
"""

import os
import sys
import json
from PIL import Image

TARGET_WALL_HEIGHT = int(sys.argv[1]) if len(sys.argv) > 1 else 104

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_FILE = os.path.join(BASE_DIR, 'sprites_index.json')
SPRITES_1X_DIR = os.path.join(BASE_DIR, '1x')
GAME_ATLAS_DIR = os.path.join(BASE_DIR, 'atlas_game')
os.makedirs(GAME_ATLAS_DIR, exist_ok=True)

# Frontal sprites (as documented in prompt: 5 walls, 3 double doors)
FRONTAL_NAMES = {
    'brick_wall_barred_window_01',
    'brick_wall_barred_window_02',
    'brick_wall_barred_window_03',
    'brick_wall_torch_01',
    'wood_wall_low_01',
    'double_door_iron_gate_01',
    'double_door_stone_arch_01',
    'double_door_magic_portal_01'
}

def get_kind(name, cat):
    if name in FRONTAL_NAMES:
        return 'double_door_frontal' if 'double_door' in name else 'wall_frontal'
    if cat == 'arches':
        return 'arch'
    if cat == 'ruins':
        return 'ruin'
    if 'pillar' in name:
        return 'pillar'
    if 'fence' in name:
        return 'fence'
    if 'gate' in name:
        return 'gate'
    if 'door' in name:
        return 'door'
    if 'corner_mossy_01' in name or 'corner_north' in name:
        return 'corner_concave'
    if 'corner' in name:
        return 'corner_convex'
    return 'wall'

with open(INDEX_FILE, 'r', encoding='utf-8') as f:
    sprites_index = json.load(f)

# Measure baseline column height and footprint of each sprite in 1x
sprite_metrics = {}
for name, meta in sorted(sprites_index.items()):
    cat = meta['category']
    p = os.path.join(SPRITES_1X_DIR, cat, f"{name}.png")
    im = Image.open(p).convert('RGBA')
    w, h = im.size
    
    # Analyze pixels
    bot_y = {}
    top_y = {}
    for x in range(w):
        for y in range(h - 1, -1, -1):
            if im.getpixel((x, y))[3] > 40:
                bot_y[x] = y
                break
        for y in range(h):
            if im.getpixel((x, y))[3] > 40:
                top_y[x] = y
                break
    
    col_heights = [bot_y[x] - top_y[x] + 1 for x in bot_y if x in top_y]
    median_col_h = sorted(col_heights)[len(col_heights)//2] if col_heights else h
    
    kind = get_kind(name, cat)
    
    # UNIFORM SCALE: All 65 sprites were hand-drawn by the artist to fit together at the same 1:1 scale!
    # Scaling them individually caused brick heights and corner widths to become mismatched.
    # Uniform scale preserves exact pixel-to-pixel tile and joint alignment across the entire pack.
    scale = TARGET_WALL_HEIGHT / 170.0
        
    scaled_w = max(1, int(round(w * scale)))
    scaled_h = max(1, int(round(h * scale)))
    
    # Footprint anchor in 1x
    x_min, x_max = min(bot_y.keys()), max(bot_y.keys())
    anc_x_1x = (x_min + x_max) / 2.0
    
    if kind == 'corner_convex':
        # Peak of V (south corner vertex): maximum Y in the bottom contour
        apex_x = max(bot_y.keys(), key=lambda x: bot_y[x])
        anc_x_1x = float(apex_x)
        anc_y_1x = float(bot_y[apex_x])
    elif kind == 'corner_concave':
        # Peak of ^ (north inner corner joint): minimum Y in the middle 30%..70%
        mid_range = [x for x in bot_y if int(w * 0.3) <= x <= int(w * 0.7)]
        apex_x = min(mid_range, key=lambda x: bot_y[x]) if mid_range else int(w / 2)
        anc_x_1x = float(apex_x)
        anc_y_1x = float(bot_y[apex_x])
    elif cat == 'stone_walls' and 'broken' not in name:
        # Standardized Coping Baseline for straight stone walls:
        # Unifies coping line at y = 0.5 * x - 12.0 and projects down exactly 170px to base.
        # This completely eliminates vertical steps between different stone wall pieces!
        anc_y_1x = (0.5 * anc_x_1x - 12.0) + 170.0
    else:
        # Other straight pieces / doors / arches / broken ruins: center of bottom edge
        mid_xs = [x for x in bot_y if abs(x - anc_x_1x) <= max(2, (x_max - x_min) * 0.15)]
        anc_y_1x = sum(bot_y[x] for x in mid_xs) / float(len(mid_xs)) if mid_xs else float(max(bot_y.values()))
        
    anc_x_scaled = int(round(anc_x_1x * scale))
    anc_y_scaled = int(round(anc_y_1x * scale))
    
    ground_len_px = round(scaled_w / 0.894427) # scaled_w / cos(26.565)
    
    sprite_metrics[name] = {
        'name': name,
        'category': cat,
        'kind': kind,
        'axis': 'x' if 'frontal' not in kind else None,
        'screenSlope': 0.5 if 'frontal' not in kind else 0.0,
        'orig_size': [w, h],
        'scale': scale,
        'scaled_size': [scaled_w, scaled_h],
        'anchor': [anc_x_scaled, anc_y_scaled],
        'groundLengthPx': ground_len_px,
        'columnHeightPx': TARGET_WALL_HEIGHT
    }

# Pack into game atlas (bin packing - shelf)
PADDING = 4
SHELF_WIDTH = 2048

# Sort sprites by scaled_h desc
sorted_sprites = sorted(sprite_metrics.values(), key=lambda s: s['scaled_size'][1], reverse=True)

curr_x = PADDING
curr_y = PADDING
row_h = 0
placements = {}

for s in sorted_sprites:
    sw, sh = s['scaled_size']
    if curr_x + sw + PADDING > SHELF_WIDTH:
        curr_x = PADDING
        curr_y += row_h + PADDING
        row_h = 0
    placements[s['name']] = (curr_x, curr_y, sw, sh)
    curr_x += sw + PADDING
    row_h = max(row_h, sh)

total_atlas_h = curr_y + row_h + PADDING
# Align height to power of 2 or multiple of 16
total_atlas_h = ((total_atlas_h + 15) // 16) * 16

print(f"Creating atlas: {SHELF_WIDTH}x{total_atlas_h}")
atlas_img = Image.new('RGBA', (SHELF_WIDTH, total_atlas_h), (0, 0, 0, 0))

frames_dict = {}
for name, (ax, ay, sw, sh) in placements.items():
    s = sprite_metrics[name]
    cat = s['category']
    src_p = os.path.join(SPRITES_1X_DIR, cat, f"{name}.png")
    src_im = Image.open(src_p).convert('RGBA')
    # Resize with High-Quality Lanczos or nearest/bicubic
    # Pixel art scaled cleanly
    resized_im = src_im.resize((sw, sh), Image.Resampling.LANCZOS)
    atlas_img.paste(resized_im, (ax, ay))
    
    frames_dict[name] = {
        'frame': {'x': ax, 'y': ay, 'w': sw, 'h': sh},
        'kind': s['kind'],
        'category': cat,
        'axis': s['axis'],
        'anchor': {'x': s['anchor'][0], 'y': s['anchor'][1]},
        'groundLengthPx': s['groundLengthPx'],
        'columnHeightPx': s['columnHeightPx'],
        'scaleApplied': round(s['scale'], 4)
    }

atlas_png_path = os.path.join(GAME_ATLAS_DIR, 'dungeon_game_atlas.png')
atlas_json_path = os.path.join(GAME_ATLAS_DIR, 'dungeon_game_atlas.json')
manifest_json_path = os.path.join(BASE_DIR, 'sprites_manifest.json')

atlas_img.save(atlas_png_path, optimize=True)

atlas_meta = {
    'meta': {
        'image': 'dungeon_game_atlas.png',
        'size': {'w': SHELF_WIDTH, 'h': total_atlas_h},
        'targetWallHeightPx': TARGET_WALL_HEIGHT,
        'totalSprites': len(frames_dict)
    },
    'frames': frames_dict
}

with open(atlas_json_path, 'w', encoding='utf-8') as f:
    json.dump(atlas_meta, f, indent=2)

manifest_data = {
    'meta': atlas_meta['meta'],
    'defaultsByKind': {
        'wall': {'solid': True, 'blocksVision': True, 'thicknessPx': 14},
        'corner_convex': {'solid': True, 'blocksVision': True, 'thicknessPx': 14},
        'corner_concave': {'solid': True, 'blocksVision': True, 'thicknessPx': 14},
        'door': {'solid': True, 'blocksVision': True, 'interactable': True},
        'gate': {'solid': True, 'blocksVision': False, 'interactable': True},
        'fence': {'solid': True, 'blocksVision': False},
        'arch': {'solid': False, 'blocksVision': False},
        'ruin': {'solid': True, 'blocksVision': False},
        'pillar': {'solid': True, 'blocksVision': False}
    },
    'sprites': frames_dict
}

with open(manifest_json_path, 'w', encoding='utf-8') as f:
    json.dump(manifest_data, f, indent=2)

print(f"Successfully generated {atlas_png_path}")
print(f"Successfully generated {atlas_json_path}")
print(f"Successfully generated {manifest_json_path}")
