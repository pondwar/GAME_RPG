# Golpe de espada de cima para baixo (substitui o golpe "de sabre")

Problema: o vídeo atual sobe e avança na altura da cabeça, parece estocada/sabre.
Correto (espada medieval): lâmina erguida ACIMA do ombro, desce em arco diagonal até o quadril oposto, depois volta.

## Bloco para o notebook Kaggle (trocar a ação "attack")

```python
"attack_cima": dict(frames=8, length=65, image="<nome da print inicial da direção>",
    prompt="The character performs a powerful one-handed overhead sword chop, with NO weapon in hand and the hand closed as if gripping a hilt. "
           "ONLY the character's RIGHT arm moves. The character's LEFT arm hangs relaxed and stays still. "
           "Starting from a relaxed guard stance, the right arm first raises the fist up high above the right shoulder, beside the head, "
           "with the elbow bent and the torso leaning slightly back and the weight on the back leg; "
           "then the right arm swings DOWN in a fast diagonal arc from high above the shoulder, passing in front of the chest, "
           "down to the opposite hip, as the torso bends forward and the front foot steps forward slightly; "
           "the fist ends low, near the opposite hip, with the arm extended downward; then it returns to the guard stance. "
           "The motion is a downward chopping cut, from top to bottom, never a forward thrust, never a horizontal swing at head height. "
           "The character never switches hands. Both feet stay on the same ground line. The character does not walk away or turn around. "
           "Locked static camera. Character centered at constant scale. Flat solid magenta background, no shadow, no floor. Starts and ends in the same pose."),
```

NEGATIVE (tirar "arm raised above head", "hand covering face", "raised second arm" e acrescentar):

```
blurry, deformed, extra limbs, camera movement, zoom, background change, text, watermark, weapon, sword, second character,
left arm swinging, both arms swinging, switching hands, thrust, stab, lunge, horizontal swing, fencing, saber
```

## Escolha dos 8 quadros
Subida (2) -> topo, punho acima do ombro (1) -> descida (3) -> fim embaixo no quadril (1) -> volta (1).
Rodar nas 3 vistas (lado, frente, costas), com a print inicial de cada uma. Depois montar, importar e testar nas 4 direções do mouse.
