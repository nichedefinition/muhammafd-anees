@echo off
REM ============================================================
REM  Web Scraper Shortcut — just run: scrape "https://url.com" 3
REM ============================================================

set SCRIPT=C:\Users\DAB\.gemini\antigravity-ide\brain\1f72bd30-da30-4a67-a512-ee6a3eea37da\web-scraper\run-scraper.js

if "%~1"=="" (
  echo.
  echo  USAGE: scrape "https://yourwebsite.com"
  echo         scrape "https://yourwebsite.com" 5
  echo.
  echo  The second number lets you pick which product to target by index.
  echo.
  goto :end
)

node "%SCRIPT%" %*

:end
