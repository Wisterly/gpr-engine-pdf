@echo off
title GPR Engine PDF - Servidor Local
color 0b
echo ===================================================
echo     GPR ENGINE PDF - SUITE DE MANIPULACAO DE PDF
echo ===================================================
echo.
echo Iniciando o servidor de desenvolvimento na porta 3000...
echo Acesse no navegador: http://localhost:3000
echo.
start http://localhost:3000
npm run dev
pause
