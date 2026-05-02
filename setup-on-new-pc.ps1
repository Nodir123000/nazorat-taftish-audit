# Скрипт автоматической настройки АИС КРУ МО на новом ПК
# Запустите этот файл через PowerShell в папке проекта

$ErrorActionPreference = "Stop"

Write-Host "=== Настройка АИС КРУ МО на новом компьютере ===" -ForegroundColor Cyan

# 1. Проверка Node.js
try {
    $nodeVersion = node -v
    Write-Host "[OK] Node.js установлен ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host "[!] Ошибка: Node.js не найден. Установите его с https://nodejs.org/" -ForegroundColor Red
    exit
}

# 2. Проверка PostgreSQL
try {
    $psqlVersion = psql --version
    Write-Host "[OK] PostgreSQL найден ($psqlVersion)" -ForegroundColor Green
} catch {
    Write-Host "[!] Ошибка: PostgreSQL (psql) не найден. Убедитесь, что он установлен и добавлен в PATH." -ForegroundColor Red
    exit
}

# 3. Запрос данных БД
Write-Host "`n--- Настройка подключения к базе данных ---" -ForegroundColor Yellow
$dbName = "kru_db"
$dbUser = "postgres"
$dbPass = Read-Host -Prompt "Введите пароль пользователя $dbUser (символы не будут скрыты)"
$dbHost = "localhost"
$dbPort = "5432"

# 4. Создание базы данных
Write-Host "`n[1/4] Создание базы данных $dbName..." -ForegroundColor Cyan
$env:PGPASSWORD = $dbPass
try {
    # Пытаемся создать, если нет. Если есть - продолжаем.
    & psql -U $dbUser -h $dbHost -p $dbPort -c "CREATE DATABASE $dbName;" 2>$null
    Write-Host "[OK] База данных готова (создана или уже существует)." -ForegroundColor Green
} catch {
    Write-Host "[!] База данных уже существует, будем обновлять данные." -ForegroundColor Gray
}

# 5. Импорт дампа
$sqlFile = "db_transfer_ready_2026_05_02.sql"
if (Test-Path $sqlFile) {
    Write-Host "[2/4] Обновление данных из $sqlFile..." -ForegroundColor Cyan
    Write-Host "(Старые данные в таблицах будут заменены новыми)" -ForegroundColor Gray
    & psql -U $dbUser -h $dbHost -p $dbPort -d $dbName -f $sqlFile
    Write-Host "[OK] База данных успешно обновлена новыми данными." -ForegroundColor Green
} else {
    Write-Host "[!] Ошибка: Файл $sqlFile не найден в текущей папке." -ForegroundColor Red
}

# 6. Обновление .env
Write-Host "[3/4] Обновление файла .env..." -ForegroundColor Cyan
$dbUrl = "postgresql://$dbUser:$dbPass@$dbHost:$dbPort/$dbName`?schema=public"
$envContent = "DATABASE_URL=`"$dbUrl`"`nNEXT_PUBLIC_APP_URL=`"http://localhost:3000`"`nNODE_ENV=`"development`""
$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host "[OK] Файл .env обновлен." -ForegroundColor Green

# 7. Установка зависимостей и Prisma
Write-Host "[4/4] Установка модулей и генерация Prisma..." -ForegroundColor Cyan
npm install
npx prisma generate

Write-Host "`n=== НАСТРОЙКА ЗАВЕРШЕНА! ===" -ForegroundColor Green
Write-Host "Для запуска системы введите команду: npm run dev" -ForegroundColor Yellow
Write-Host "-------------------------------------------"
pause
