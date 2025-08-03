# Add authentication error handling to family management
$filePath = "c:\Users\chase\Downloads\SilverConnect-Clean\docs\js\family-management.js"
$content = Get-Content $filePath -Raw

# Add authentication error handling pattern
$authErrorPattern = @"
        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
"@

# Replace simple else patterns with authentication-aware patterns
$content = $content -replace "(\s*} else \{)", $authErrorPattern

# Write back to file
Set-Content -Path $filePath -Value $content -Encoding UTF8

Write-Host "Authentication error handling added to family management!"
