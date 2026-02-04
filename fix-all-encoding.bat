@echo off
chcp 65001 >nul
echo 批量转换所有文件编码为UTF-8...
echo.

echo 1. 转换TypeScript/JavaScript文件...
for /r %%f in (*.tsx *.ts *.jsx *.js) do (
  if exist "%%f" (
    echo 正在修复: %%~nxf
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding Default; [System.IO.File]::WriteAllText('%%f', $content, [System.Text.Encoding]::UTF8)"
  )
)

echo.
echo 2. 转换配置文件...
for %%f in (package.json tsconfig.json vite.config.ts *.config.js *.config.ts) do (
  if exist "%%f" (
    echo 正在修复: %%f
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding Default; [System.IO.File]::WriteAllText('%%f', $content, [System.Text.Encoding]::UTF8)"
  )
)

echo.
echo 3. 转换HTML/CSS文件...
for /r %%f in (*.html *.css) do (
  if exist "%%f" (
    echo 正在修复: %%~nxf
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding Default; [System.IO.File]::WriteAllText('%%f', $content, [System.Text.Encoding]::UTF8)"
  )
)

echo.
echo 4. 转换其他文本文件...
for /r %%f in (*.txt *.md *.json) do (
  if exist "%%f" (
    echo 正在修复: %%~nxf
    powershell -Command "$content = Get-Content '%%f' -Raw -Encoding Default; [System.IO.File]::WriteAllText('%%f', $content, [System.Text.Encoding]::UTF8)"
  )
)

echo.
echo ✅ 所有文件编码修复完成！
echo.
echo 请运行: npm run dev
pause