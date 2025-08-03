# Add language switcher to ALL pages
$docsPath = "c:\Users\chase\Downloads\SilverConnect-Clean\docs"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $docsPath -Filter "*.html"

foreach ($file in $htmlFiles) {
    $filePath = $file.FullName
    $fileName = $file.Name
    
    # Skip test files
    if ($fileName -like "*test*") {
        continue
    }
    
    Write-Host "Processing: $fileName"
    $content = Get-Content $filePath -Raw
    
    # Check if language switcher is already present
    if ($content -match "switchToEnglish|switchToChinese") {
        Write-Host "  - Language switcher already present"
        continue
    }
    
    # Find the navigation area - look for different patterns
    $hasNavbarAuthArea = $content -match 'id="navbarAuthArea"'
    $hasNavbarNav = $content -match 'class="navbar-nav'
    
    if ($hasNavbarAuthArea) {
        Write-Host "  - Adding language switcher to existing navbarAuthArea"
        # Add language switcher before the closing </li> of navbarAuthArea
        $languageSwitcherHTML = @"
                    <!-- Language Switcher -->
                    <li class="nav-item">
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-globe me-1"></i>
                                <span id="currentLanguageText">English</span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                                <li><a class="dropdown-item" href="#" onclick="switchToEnglish()">
                                    <i class="bi bi-check me-2" id="englishCheck"></i>English
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="switchToChinese()">
                                    <i class="bi bi-check invisible me-2" id="chineseCheck"></i>中文 (Chinese)
                                </a></li>
                            </ul>
                        </div>
                    </li>
"@
        
        # Insert before the navbarAuthArea li element
        $content = $content -replace '(\s*<li class="nav-item[^"]*" id="navbarAuthArea")', "$languageSwitcherHTML`r`n`$1"
        
    } elseif ($hasNavbarNav) {
        Write-Host "  - Adding language switcher to navbar-nav"
        # Add language switcher to the end of navbar-nav
        $languageSwitcherHTML = @"
                    <!-- Language Switcher -->
                    <li class="nav-item">
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-globe me-1"></i>
                                <span id="currentLanguageText">English</span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                                <li><a class="dropdown-item" href="#" onclick="switchToEnglish()">
                                    <i class="bi bi-check me-2" id="englishCheck"></i>English
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="switchToChinese()">
                                    <i class="bi bi-check invisible me-2" id="chineseCheck"></i>中文 (Chinese)
                                </a></li>
                            </ul>
                        </div>
                    </li>
"@
        
        # Insert before the closing </ul> of navbar-nav
        $content = $content -replace '(\s*</ul>\s*</div>\s*</div>\s*</nav>)', "$languageSwitcherHTML`r`n`$1"
        
    } else {
        Write-Host "  - No suitable navigation found, skipping"
        continue
    }
    
    # Add the JavaScript functions if they don't exist
    if ($content -notmatch "function switchToEnglish") {
        Write-Host "  - Adding language switcher JavaScript functions"
        
        $jsFunctions = @"
    
    <!-- Language Switcher Functions -->
    <script>
        function switchToEnglish() {
            document.getElementById('currentLanguageText').textContent = 'English';
            const englishCheck = document.getElementById('englishCheck');
            const chineseCheck = document.getElementById('chineseCheck');
            if (englishCheck) englishCheck.classList.remove('invisible');
            if (chineseCheck) chineseCheck.classList.add('invisible');
            localStorage.setItem('preferredLanguage', 'en');
            location.reload(); // Reset to English
        }
        
        function switchToChinese() {
            document.getElementById('currentLanguageText').textContent = '中文';
            const englishCheck = document.getElementById('englishCheck');
            const chineseCheck = document.getElementById('chineseCheck');
            if (englishCheck) englishCheck.classList.add('invisible');
            if (chineseCheck) chineseCheck.classList.remove('invisible');
            localStorage.setItem('preferredLanguage', 'zh');
            
            if (window.translator) {
                window.translator.translatePage('zh');
            } else {
                // Fallback if translator not loaded
                setTimeout(() => {
                    if (window.translator) {
                        window.translator.translatePage('zh');
                    }
                }, 500);
            }
        }
        
        // Check saved language preference on load
        window.addEventListener('load', () => {
            const savedLanguage = localStorage.getItem('preferredLanguage');
            if (savedLanguage === 'zh') {
                setTimeout(() => {
                    const currentLangText = document.getElementById('currentLanguageText');
                    const englishCheck = document.getElementById('englishCheck');
                    const chineseCheck = document.getElementById('chineseCheck');
                    
                    if (currentLangText) currentLangText.textContent = '中文';
                    if (englishCheck) englishCheck.classList.add('invisible');
                    if (chineseCheck) chineseCheck.classList.remove('invisible');
                    
                    if (window.translator) {
                        window.translator.translatePage('zh');
                    }
                }, 100);
            }
        });
    </script>
"@
        
        # Insert before closing </body> tag
        $content = $content -replace '(\s*</body>)', "$jsFunctions`r`n`$1"
    }
    
    # Write back to file
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "  - Updated successfully"
}

Write-Host "Language switcher added to all pages!"
