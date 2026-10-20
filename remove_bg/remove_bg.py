from PIL import Image
from rembg import remove

caminho_entrada = r'C:\Projetos\RPG\assets\player\homem_2_batalha.jpg'
caminho_saida = r'C:\Projetos\RPG\assets\player\homem_2_batalha_no_bg.png'

# Abre a imagem, remove o fundo via IA e salva em PNG
entrada = Image.open(caminho_entrada)
saida = remove(entrada)
saida.save(caminho_saida)

print('Fundo removido com sucesso!')