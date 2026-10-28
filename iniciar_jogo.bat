@echo off
title Suritto RPG - Servidor Local
echo ====================================================
echo     INICIANDO SURITTO - RPG DE SOBREVIVENCIA
echo ====================================================
echo Servidor com banco de dados (PostgreSQL) na porta 3000.
echo Deixe esta janela aberta enquanto joga! CTRL+C encerra.
echo ====================================================
cd /d "%~dp0server"
if not exist node_modules call npm install
start http://localhost:3000
node --env-file=.env server.js
