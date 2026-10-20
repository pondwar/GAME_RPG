import os
import json
from PIL import Image
import numpy as np

base_dir = 'assets/player/v2'

TWEAKS = {
    # Idle
    'idle_down_0': {'angle': 0.40, 'behind': False},
    'idle_down_1': {'angle': 0.40, 'behind': False},
    'idle_up_0':   {'angle': -0.32, 'behind': True},
    'idle_up_1':   {'angle': -0.32, 'behind': True},
    'idle_right_0':{'angle': 0.22, 'behind': False},
    'idle_left_0': {'angle': -0.22, 'behind': False},

    # Walk
    'walk_down_0': {'angle': 0.42, 'behind': False},
    'walk_down_1': {'angle': 0.42, 'behind': False},
    'walk_up_0':   {'angle': -0.30, 'behind': True},
    'walk_up_1':   {'angle': -0.30, 'behind': True},
    'walk_right_0':{'angle': 0.28, 'behind': False},
    'walk_right_1':{'angle': 0.14, 'behind': False},
    'walk_right_2':{'angle': 0.16, 'behind': False},
    'walk_right_3':{'angle': 0.30, 'behind': False},
    'walk_left_0': {'angle': -0.28, 'behind': False},
    'walk_left_1': {'angle': -0.14, 'behind': False},
    'walk_left_2': {'angle': -0.16, 'behind': False},
    'walk_left_3': {'angle': -0.30, 'behind': False},

    # Run
    'run_down_0':  {'angle': 0.48, 'behind': False},
    'run_down_1':  {'angle': 0.48, 'behind': False},
    'run_up_0':    {'angle': -0.35, 'behind': True},
    'run_up_1':    {'angle': -0.35, 'behind': True},
    'run_right_0': {'angle': 0.42, 'behind': False},
    'run_right_1': {'angle': 0.24, 'behind': False},
    'run_right_2': {'angle': 0.10, 'behind': False},
    'run_right_3': {'angle': 0.34, 'behind': False},
    'run_left_0':  {'angle': -0.42, 'behind': False},
    'run_left_1':  {'angle': -0.24, 'behind': False},
    'run_left_2':  {'angle': -0.10, 'behind': False},
    'run_left_3':  {'angle': -0.34, 'behind': False},

    # Jump (4-stage aerial arc)
    'jump_0':       {'angle': 0.45, 'behind': False},
    'jump_1':       {'angle': 0.08, 'behind': False},
    'jump_2':       {'angle': 0.32, 'behind': False},
    'jump_3':       {'angle': 0.48, 'behind': False},
    'jump_right_0': {'angle': 0.45, 'behind': False},
    'jump_right_1': {'angle': 0.08, 'behind': False},
    'jump_right_2': {'angle': 0.32, 'behind': False},
    'jump_right_3': {'angle': 0.48, 'behind': False},
    'jump_left_0':  {'angle': -0.45, 'behind': False},
    'jump_left_1':  {'angle': -0.08, 'behind': False},
    'jump_left_2':  {'angle': -0.32, 'behind': False},
    'jump_left_3':  {'angle': -0.48, 'behind': False},

    # 1H Slash (Melee combo)
    'slash_right_0': {'angle': -0.75, 'behind': True},
    'slash_right_1': {'angle': -0.35, 'behind': False},
    'slash_right_2': {'angle': 0.45, 'behind': False},
    'slash_right_3': {'angle': 1.15, 'behind': False},
    'slash_right_4': {'angle': 0.70, 'behind': False},
    'slash_left_0':  {'angle': 0.75, 'behind': True},
    'slash_left_1':  {'angle': 0.35, 'behind': False},
    'slash_left_2':  {'angle': -0.45, 'behind': False},
    'slash_left_3':  {'angle': -1.15, 'behind': False},
    'slash_left_4':  {'angle': -0.70, 'behind': False},

    # 2H Chop (Overhead Axe)
    'chop_right_0': {'angle': 0.15, 'behind': False},
    'chop_right_1': {'angle': -0.65, 'behind': True},
    'chop_right_2': {'angle': -0.80, 'behind': True},
    'chop_right_3': {'angle': 1.25, 'behind': False},
    'chop_right_4': {'angle': 1.05, 'behind': False},
    'chop_left_0':  {'angle': -0.15, 'behind': False},
    'chop_left_1':  {'angle': 0.65, 'behind': True},
    'chop_left_2':  {'angle': 0.80, 'behind': True},
    'chop_left_3':  {'angle': -1.25, 'behind': False},
    'chop_left_4':  {'angle': -1.05, 'behind': False},

    # Sit (Cross-legged resting posture)
    'sit_down':        {'angle': 0.85, 'behind': False},
    'sit_up':          {'angle': 0.85, 'behind': True},
    'sit_right':       {'angle': 0.70, 'behind': False},
    'sit_left':        {'angle': -0.70, 'behind': False},
    'sit_angle_right': {'angle': 0.80, 'behind': False},
    'sit_angle_left':  {'angle': -0.80, 'behind': False},
}

def analyze_hand(rel_path, side='right'):
    full_path = os.path.join(base_dir, rel_path)
    if not os.path.exists(full_path):
        return None
    img = Image.open(full_path)
    w, h = img.size
    arr = np.array(img)
    r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
    
    # Skin color threshold
    skin = (a > 150) & (r > 150) & (g > 100) & (b > 60) & (r > b + 25)
    
    # Special handling for jump_1 (fist raised high into the air)
    if 'jump' in rel_path and '1' in rel_path:
        mid_x = w // 2
        all_ys, all_xs = np.where(skin)
        if side == 'right':
            fist_mask = (all_xs >= mid_x) & (all_ys < h * 0.25)
        else:
            fist_mask = (all_xs <= mid_x) & (all_ys < h * 0.25)
        if fist_mask.any():
            return round(float(all_xs[fist_mask].mean() / w), 3), round(float(all_ys[fist_mask].mean() / h), 3)

    # General standing / walking / running / attacking / idle poses:
    # We locate the fist clusters.
    all_ys, all_xs = np.where(skin)
    if len(all_xs) == 0:
        return (0.40 if side == 'left' else 0.60), 0.55
        
    mid_x = w // 2
    if side == 'left':
        side_mask = (all_xs <= mid_x) & (all_ys >= h * 0.28) & (all_ys <= h * 0.72)
    else:
        side_mask = (all_xs >= mid_x) & (all_ys >= h * 0.28) & (all_ys <= h * 0.72)
        
    if not side_mask.any():
        side_mask = (all_ys >= h * 0.28) & (all_ys <= h * 0.72)
        
    if side_mask.any():
        xs = all_xs[side_mask]
        ys = all_ys[side_mask]
        # In upright poses (idle, walk, run), the hand is the lowest cluster of arm skin
        if 'idle' in rel_path or 'walk' in rel_path or 'run' in rel_path:
            lower_arm = ys >= (ys.min() + (ys.max() - ys.min()) * 0.45)
            if lower_arm.any():
                fx = xs[lower_arm].mean() / w
                fy = ys[lower_arm].mean() / h
                return round(float(fx), 3), round(float(fy), 3)
        return round(float(xs.mean() / w), 3), round(float(ys.mean() / h), 3)

    return (0.40 if side == 'left' else 0.60), 0.55

def main():
    sockets = {}
    
    mapping = {
        'idle_down_0': ('idle/down_0.png', 'right'),
        'idle_down_1': ('idle/down_1.png', 'right'),
        'idle_up_0':   ('idle/up_0.png', 'right'),
        'idle_up_1':   ('idle/up_1.png', 'right'),
        'idle_right_0':('idle/right_0.png', 'right'),
        'idle_left_0': ('idle/left_0.png', 'left'),

        'walk_down_0': ('walk/down_0.png', 'right'),
        'walk_down_1': ('walk/down_1.png', 'right'),
        'walk_up_0':   ('walk/up_0.png', 'right'),
        'walk_up_1':   ('walk/up_1.png', 'right'),
        'walk_right_0':('walk/right_0.png', 'right'),
        'walk_right_1':('walk/right_1.png', 'right'),
        'walk_right_2':('walk/right_2.png', 'right'),
        'walk_right_3':('walk/right_3.png', 'right'),
        'walk_left_0': ('walk/left_0.png', 'left'),
        'walk_left_1': ('walk/left_1.png', 'left'),
        'walk_left_2': ('walk/left_2.png', 'left'),
        'walk_left_3': ('walk/left_3.png', 'left'),

        'run_down_0':  ('run/down_0.png', 'right'),
        'run_down_1':  ('run/down_1.png', 'right'),
        'run_up_0':    ('run/up_0.png', 'right'),
        'run_up_1':    ('run/up_1.png', 'right'),
        'run_right_0': ('run/right_0.png', 'right'),
        'run_right_1': ('run/right_1.png', 'right'),
        'run_right_2': ('run/right_2.png', 'right'),
        'run_right_3': ('run/right_3.png', 'right'),
        'run_left_0':  ('run/left_0.png', 'left'),
        'run_left_1':  ('run/left_1.png', 'left'),
        'run_left_2':  ('run/left_2.png', 'left'),
        'run_left_3':  ('run/left_3.png', 'left'),

        'jump_0': ('jump/jump_right_0.png', 'right'),
        'jump_1': ('jump/jump_right_1.png', 'right'),
        'jump_2': ('jump/jump_right_2.png', 'right'),
        'jump_3': ('jump/jump_right_3.png', 'right'),
        'jump_right_0': ('jump/jump_right_0.png', 'right'),
        'jump_right_1': ('jump/jump_right_1.png', 'right'),
        'jump_right_2': ('jump/jump_right_2.png', 'right'),
        'jump_right_3': ('jump/jump_right_3.png', 'right'),
        'jump_left_0':  ('jump/jump_left_0.png', 'left'),
        'jump_left_1':  ('jump/jump_left_1.png', 'left'),
        'jump_left_2':  ('jump/jump_left_2.png', 'left'),
        'jump_left_3':  ('jump/jump_left_3.png', 'left'),

        'slash_right_0': ('attack_1h/slash_right_0.png', 'right'),
        'slash_right_1': ('attack_1h/slash_right_1.png', 'right'),
        'slash_right_2': ('attack_1h/slash_right_2.png', 'right'),
        'slash_right_3': ('attack_1h/slash_right_3.png', 'right'),
        'slash_right_4': ('attack_1h/slash_right_4.png', 'right'),
        'slash_left_0':  ('attack_1h/slash_left_0.png', 'left'),
        'slash_left_1':  ('attack_1h/slash_left_1.png', 'left'),
        'slash_left_2':  ('attack_1h/slash_left_2.png', 'left'),
        'slash_left_3':  ('attack_1h/slash_left_3.png', 'left'),
        'slash_left_4':  ('attack_1h/slash_left_4.png', 'left'),

        'chop_right_0': ('attack_2h/chop_right_0.png', 'right'),
        'chop_right_1': ('attack_2h/chop_right_1.png', 'right'),
        'chop_right_2': ('attack_2h/chop_right_2.png', 'right'),
        'chop_right_3': ('attack_2h/chop_right_3.png', 'right'),
        'chop_right_4': ('attack_2h/chop_right_4.png', 'right'),
        'chop_left_0':  ('attack_2h/chop_left_0.png', 'left'),
        'chop_left_1':  ('attack_2h/chop_left_1.png', 'left'),
        'chop_left_2':  ('attack_2h/chop_left_2.png', 'left'),
        'chop_left_3':  ('attack_2h/chop_left_3.png', 'left'),
        'chop_left_4':  ('attack_2h/chop_left_4.png', 'left'),

        'sit_down':        ('sit/down.png', 'right'),
        'sit_up':          ('sit/up.png', 'right'),
        'sit_right':       ('sit/right.png', 'right'),
        'sit_left':        ('sit/left.png', 'left'),
        'sit_angle_right': ('sit/angle_right.png', 'right'),
        'sit_angle_left':  ('sit/angle_left.png', 'left'),
    }

    for key, (path, side) in mapping.items():
        res = analyze_hand(path, side)
        if res:
            fx, fy = res
            tweak = TWEAKS.get(key, {'angle': 0.25, 'behind': False})
            is_flip = 'left' in key
            sockets[key] = {
                'x': fx,
                'y': fy,
                'angle': tweak['angle'],
                'behind': tweak['behind'],
                'flip': is_flip
            }

    js_content = "// Auto-generated Precision Weapon Hand Socket Mapping for V2 Sprites\n"
    js_content += "window.PLAYER_WEAPON_SOCKETS = " + json.dumps(sockets, indent=2) + ";\n"

    with open('js/player_sockets.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("Created js/player_sockets.js with", len(sockets), "precision socket mappings!")

if __name__ == '__main__':
    main()
