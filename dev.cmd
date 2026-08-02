@echo off
setlocal

where pnpm >nul 2>nul
if errorlevel 1 goto bundled_runtime
where node >nul 2>nul
if not errorlevel 1 goto global_pnpm

:bundled_runtime
set "CODEX_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "CODEX_PNPM=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
if exist "%CODEX_PNPM%" goto codex_pnpm

where corepack >nul 2>nul
if not errorlevel 1 goto corepack_pnpm

echo Could not find pnpm or the bundled Codex runtime.
echo Install Node.js, then run: corepack enable pnpm
exit /b 1

:global_pnpm
call pnpm dev
exit /b %errorlevel%

:codex_pnpm
set "PATH=%CODEX_NODE%;%PATH%"
call "%CODEX_PNPM%" dev
exit /b %errorlevel%

:corepack_pnpm
call corepack pnpm dev
exit /b %errorlevel%
