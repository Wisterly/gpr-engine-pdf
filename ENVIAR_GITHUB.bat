@echo off
title Enviando GPR Engine PDF para o GitHub
chcp 65001 > nul
cd /d "%~dp0"
color 0b

echo ========================================================
echo       ENVIANDO GPR ENGINE PDF PARA O GITHUB
echo                  (Conta: Wisterly)
echo ========================================================
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/Wisterly/gpr-engine-pdf.git
git branch -M main

echo Verificando alteracoes e preparando arquivos...
git add .
git commit -m "update: atualizacao gpr engine pdf suite" 2>nul

echo.
echo Enviando para o repositorio https://github.com/Wisterly/gpr-engine-pdf.git ...
git push -u origin main

echo.
echo ========================================================
echo   Processo finalizado! Pressione qualquer tecla para sair.
echo ========================================================
pause
