$path = "c:\kru-version-2\components\tashkent-district-paths.ts"
$content = Get-Content $path -Raw
# Replace footer
$content = $content -replace "\s*</svg>\s*\);\s*};", "}"
# Replace blocks
# Using DotAll option via (?s) to match across newlines inside the group tag
$content = $content -replace '(?s)\s*<\s*g\s+id\s*=\s*"([^"]+)"[^>]*>\s*<path d="([^"]+)" />\s*</\s*g>', "`n  `$1: `"`$2`","

Set-Content $path $content
