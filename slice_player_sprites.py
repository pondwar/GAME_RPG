import os
from PIL import Image
import numpy as np

def extract_bands_and_cols(img):
    alpha = np.array(img)[:, :, 3]
    row_sum = (alpha > 10).sum(axis=1)

    in_band = False
    bands = []
    start = 0
    for y, val in enumerate(row_sum):
        if val > 40 and not in_band:
            in_band = True
            start = y
        elif val <= 40 and in_band:
            in_band = False
            if y - start > 80:
                bands.append((start, y))
    if in_band:
        bands.append((start, len(row_sum)))

    grid = []
    for (y1, y2) in bands:
        band_alpha = alpha[y1:y2, :]
        col_sum = (band_alpha > 10).sum(axis=0)
        cols = []
        in_col = False
        c_start = 0
        for x, val in enumerate(col_sum):
            if val > 15 and not in_col:
                in_col = True
                c_start = x
            elif val <= 15 and in_col:
                in_col = False
                if x - c_start > 40:
                    cols.append((c_start, x))
        if in_col:
            cols.append((c_start, len(col_sum)))
        grid.append((y1, y2, cols))
    return grid

def crop_exact(img, x1, y1, x2, y2, padding=4):
    cropped = img.crop((x1, y1, x2, y2))
    bbox = cropped.getbbox()
    if bbox:
        # Tight crop with small padding
        bx1 = max(0, bbox[0] - padding)
        by1 = max(0, bbox[1] - padding)
        bx2 = min(cropped.width, bbox[2] + padding)
        by2 = min(cropped.height, bbox[3] + padding)
        return cropped.crop((bx1, by1, bx2, by2))
    return cropped

def save_sprite(sprite, path, flip_x=False):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if flip_x:
        sprite = sprite.transpose(Image.FLIP_LEFT_RIGHT)
    sprite.save(path)
    print(f'Saved: {path} ({sprite.size})')

def main():
    base_out = 'assets/player/v2'
    os.makedirs(base_out, exist_ok=True)

    # 1. SLICE HOMEM_2.PNG (Locomotion & Rest)
    print("--- Slicing homem_2.png ---")
    img1 = Image.open('assets/player/homem_2.png')
    grid1 = extract_bands_and_cols(img1)
    
    # Row 0: Idle
    y1, y2, cols = grid1[0]
    idle_down_0 = crop_exact(img1, cols[0][0], y1, cols[0][1], y2)
    idle_down_1 = crop_exact(img1, cols[1][0], y1, cols[1][1], y2)
    idle_up_0   = crop_exact(img1, cols[3][0], y1, cols[3][1], y2)
    idle_up_1   = crop_exact(img1, cols[4][0], y1, cols[4][1], y2)
    idle_right  = crop_exact(img1, cols[5][0], y1, cols[5][1], y2)
    
    save_sprite(idle_down_0, f'{base_out}/idle/down_0.png')
    save_sprite(idle_down_1, f'{base_out}/idle/down_1.png')
    save_sprite(idle_up_0,   f'{base_out}/idle/up_0.png')
    save_sprite(idle_up_1,   f'{base_out}/idle/up_1.png')
    save_sprite(idle_right,  f'{base_out}/idle/right_0.png')
    save_sprite(idle_right,  f'{base_out}/idle/left_0.png', flip_x=True)

    # Row 1: Walk Cycle
    y1, y2, cols = grid1[1]
    save_sprite(crop_exact(img1, cols[0][0], y1, cols[0][1], y2), f'{base_out}/walk/down_0.png')
    save_sprite(crop_exact(img1, cols[1][0], y1, cols[1][1], y2), f'{base_out}/walk/down_1.png')
    # Use idle for up walk frames
    save_sprite(idle_up_0, f'{base_out}/walk/up_0.png')
    save_sprite(idle_up_1, f'{base_out}/walk/up_1.png')

    for i in range(2, len(cols)):
        w_frame = crop_exact(img1, cols[i][0], y1, cols[i][1], y2)
        idx = i - 2
        save_sprite(w_frame, f'{base_out}/walk/right_{idx}.png')
        save_sprite(w_frame, f'{base_out}/walk/left_{idx}.png', flip_x=True)

    # Row 2: Run / Sprint Cycle
    y1, y2, cols = grid1[2]
    save_sprite(crop_exact(img1, cols[0][0], y1, cols[0][1], y2), f'{base_out}/run/down_0.png')
    save_sprite(crop_exact(img1, cols[1][0], y1, cols[1][1], y2), f'{base_out}/run/down_1.png')
    save_sprite(idle_up_0, f'{base_out}/run/up_0.png')
    save_sprite(idle_up_1, f'{base_out}/run/up_1.png')

    for i in range(2, len(cols)):
        r_frame = crop_exact(img1, cols[i][0], y1, cols[i][1], y2)
        idx = i - 2
        save_sprite(r_frame, f'{base_out}/run/right_{idx}.png')
        save_sprite(r_frame, f'{base_out}/run/left_{idx}.png', flip_x=True)

    # Row 3: Jump Cycle
    y1, y2, cols = grid1[3]
    for idx, (cx1, cx2) in enumerate(cols):
        j_frame = crop_exact(img1, cx1, y1, cx2, y2)
        save_sprite(j_frame, f'{base_out}/jump/jump_{idx}.png')

    # Row 4: Sit Cross-Legged (Raça Humana única)
    y1, y2, cols = grid1[4]
    sit_angle = crop_exact(img1, cols[0][0], y1, cols[0][1], y2)
    sit_front = crop_exact(img1, cols[1][0], y1, cols[1][1], y2)
    sit_back  = crop_exact(img1, cols[3][0], y1, cols[3][1], y2)
    sit_side  = crop_exact(img1, cols[4][0], y1, cols[4][1], y2)

    save_sprite(sit_front, f'{base_out}/sit/down.png')
    save_sprite(sit_angle, f'{base_out}/sit/angle_right.png')
    save_sprite(sit_angle, f'{base_out}/sit/angle_left.png', flip_x=True)
    save_sprite(sit_back,  f'{base_out}/sit/up.png')
    save_sprite(sit_side,  f'{base_out}/sit/right.png')
    save_sprite(sit_side,  f'{base_out}/sit/left.png', flip_x=True)

    # Row 5: Panting / Exhausted (Ofegante sem estamina)
    y1, y2, cols = grid1[5]
    for idx, (cx1, cx2) in enumerate(cols):
        p_frame = crop_exact(img1, cx1, y1, cx2, y2)
        save_sprite(p_frame, f'{base_out}/exhausted/panting_{idx}.png')
        save_sprite(p_frame, f'{base_out}/exhausted/panting_left_{idx}.png', flip_x=True)

    # 2. SLICE HOMEM_2_BATALHA.PNG (Combat & Actions with Empty Rigging Hands)
    print("\n--- Slicing homem_2_batalha.png ---")
    img2 = Image.open('assets/player/homem_2_batalha.png')
    grid2 = extract_bands_and_cols(img2)

    # Row 0: Slash 1H (Empty fist weapon swing)
    y1, y2, cols = grid2[0]
    for idx in range(min(5, len(cols))):
        s_frame = crop_exact(img2, cols[idx][0], y1, cols[idx][1], y2)
        save_sprite(s_frame, f'{base_out}/attack_1h/slash_right_{idx}.png')
        save_sprite(s_frame, f'{base_out}/attack_1h/slash_left_{idx}.png', flip_x=True)

    # Row 1: Overhead 2H Chop (Woodcutting & Greatsword chop)
    y1, y2, cols = grid2[1]
    for idx in range(min(5, len(cols))):
        c_frame = crop_exact(img2, cols[idx][0], y1, cols[idx][1], y2)
        save_sprite(c_frame, f'{base_out}/attack_2h/chop_right_{idx}.png')
        save_sprite(c_frame, f'{base_out}/attack_2h/chop_left_{idx}.png', flip_x=True)

    # Row 2: Thrust / Spear / Punch Lunges
    y1, y2, cols = grid2[2]
    for idx in range(min(5, len(cols))):
        t_frame = crop_exact(img2, cols[idx][0], y1, cols[idx][1], y2)
        save_sprite(t_frame, f'{base_out}/thrust/thrust_right_{idx}.png')
        save_sprite(t_frame, f'{base_out}/thrust/thrust_left_{idx}.png', flip_x=True)

    # Row 3: Gather (first 4 cols) & Hurt / Recoil (next 4 cols)
    y1, y2, cols = grid2[3]
    for idx in range(min(4, len(cols))):
        g_frame = crop_exact(img2, cols[idx][0], y1, cols[idx][1], y2)
        save_sprite(g_frame, f'{base_out}/gather/gather_right_{idx}.png')
        save_sprite(g_frame, f'{base_out}/gather/gather_left_{idx}.png', flip_x=True)

    for idx in range(4, min(8, len(cols))):
        h_idx = idx - 4
        h_frame = crop_exact(img2, cols[idx][0], y1, cols[idx][1], y2)
        save_sprite(h_frame, f'{base_out}/hurt/hurt_right_{h_idx}.png')
        save_sprite(h_frame, f'{base_out}/hurt/hurt_left_{h_idx}.png', flip_x=True)

    print("\nAll player sprite animations extracted successfully into:", base_out)

if __name__ == '__main__':
    main()
