@echo off
title Suritto RPG - Servidor Local
echo ====================================================
echo     INICIANDO SURITTO - RPG DE SOBREVIVENCIA
echo ====================================================
echo Abrindo o jogo no seu navegador...
start http://localhost:3000
echo Servidor rodando na porta 3000. Deixe esta janela aberta enquanto joga!
echo Pressione CTRL+C para encerrar o jogo quando terminar.
echo ====================================================
python -m http.server 3000
