# PowerShell Script to Create Modern Custom Images for Each Page
# create-custom-images.ps1

Write-Host "Creating custom modern images for each page..." -ForegroundColor Green

# Create a modern medication tracker illustration
$medicationSVG = @'
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="medGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#f8f9fa"/>
  
  <!-- Pill bottles -->
  <rect x="50" y="100" width="40" height="80" rx="8" fill="url(#medGradient)" opacity="0.8"/>
  <rect x="120" y="120" width="40" height="60" rx="8" fill="url(#medGradient)" opacity="0.6"/>
  <rect x="190" y="110" width="40" height="70" rx="8" fill="url(#medGradient)" opacity="0.7"/>
  
  <!-- Pills scattered -->
  <circle cx="280" cy="80" r="12" fill="url(#medGradient)" opacity="0.5"/>
  <circle cx="320" cy="100" r="10" fill="url(#medGradient)" opacity="0.6"/>
  <circle cx="300" cy="140" r="8" fill="url(#medGradient)" opacity="0.7"/>
  
  <!-- Calendar grid -->
  <rect x="260" y="180" width="120" height="80" rx="8" fill="white" stroke="url(#medGradient)" stroke-width="2"/>
  <text x="320" y="200" text-anchor="middle" fill="url(#medGradient)" font-family="Arial" font-size="12" font-weight="bold">Medication</text>
  <text x="320" y="215" text-anchor="middle" fill="url(#medGradient)" font-family="Arial" font-size="12">Schedule</text>
  
  <!-- Checkmarks -->
  <text x="280" y="240" text-anchor="middle" fill="green" font-family="Arial" font-size="16">✓</text>
  <text x="310" y="240" text-anchor="middle" fill="green" font-family="Arial" font-size="16">✓</text>
  <text x="340" y="240" text-anchor="middle" fill="orange" font-family="Arial" font-size="16">⏰</text>
</svg>
'@

Set-Content "docs\assets\medication-custom.svg" $medicationSVG -Encoding UTF8

# Create a modern family management illustration
$familySVG = @'
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="familyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#f8f9fa"/>
  
  <!-- Family members as connected circles -->
  <circle cx="200" cy="100" r="30" fill="url(#familyGradient)" opacity="0.8"/>
  <text x="200" y="108" text-anchor="middle" fill="white" font-family="Arial" font-size="24">👴</text>
  <text x="200" y="140" text-anchor="middle" fill="url(#familyGradient)" font-family="Arial" font-size="12" font-weight="bold">Patient</text>
  
  <circle cx="120" cy="180" r="25" fill="url(#familyGradient)" opacity="0.6"/>
  <text x="120" y="187" text-anchor="middle" fill="white" font-family="Arial" font-size="20">👩</text>
  <text x="120" y="215" text-anchor="middle" fill="url(#familyGradient)" font-family="Arial" font-size="10">Daughter</text>
  
  <circle cx="280" cy="180" r="25" fill="url(#familyGradient)" opacity="0.6"/>
  <text x="280" y="187" text-anchor="middle" fill="white" font-family="Arial" font-size="20">👨</text>
  <text x="280" y="215" text-anchor="middle" fill="url(#familyGradient)" font-family="Arial" font-size="10">Son</text>
  
  <circle cx="320" cy="80" r="20" fill="url(#familyGradient)" opacity="0.5"/>
  <text x="320" y="86" text-anchor="middle" fill="white" font-family="Arial" font-size="16">🩺</text>
  <text x="320" y="110" text-anchor="middle" fill="url(#familyGradient)" font-family="Arial" font-size="10">Doctor</text>
  
  <!-- Connection lines -->
  <line x1="200" y1="130" x2="120" y2="155" stroke="url(#familyGradient)" stroke-width="2" opacity="0.5"/>
  <line x1="200" y1="130" x2="280" y2="155" stroke="url(#familyGradient)" stroke-width="2" opacity="0.5"/>
  <line x1="200" y1="100" x2="320" y2="80" stroke="url(#familyGradient)" stroke-width="2" opacity="0.5"/>
  
  <!-- Notification bubbles -->
  <circle cx="350" cy="50" r="15" fill="red" opacity="0.7"/>
  <text x="350" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="10">3</text>
</svg>
'@

Set-Content "docs\assets\family-custom.svg" $familySVG -Encoding UTF8

# Create a modern appointment illustration
$appointmentSVG = @'
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="appointmentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#f8f9fa"/>
  
  <!-- Calendar -->
  <rect x="50" y="50" width="180" height="140" rx="12" fill="white" stroke="url(#appointmentGradient)" stroke-width="2"/>
  <rect x="50" y="50" width="180" height="30" rx="12" fill="url(#appointmentGradient)"/>
  <text x="140" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">December 2025</text>
  
  <!-- Calendar grid -->
  <g transform="translate(60, 90)">
    <text x="20" y="15" text-anchor="middle" fill="url(#appointmentGradient)" font-family="Arial" font-size="10">M</text>
    <text x="45" y="15" text-anchor="middle" fill="url(#appointmentGradient)" font-family="Arial" font-size="10">T</text>
    <text x="70" y="15" text-anchor="middle" fill="url(#appointmentGradient)" font-family="Arial" font-size="10">W</text>
    <text x="95" y="15" text-anchor="middle" fill="url(#appointmentGradient)" font-family="Arial" font-size="10">T</text>
    <text x="120" y="15" text-anchor="middle" fill="url(#appointmentGradient)" font-family="Arial" font-size="10">F</text>
    <text x="145" y="15" text-anchor="middle" fill="url(#appointmentGradient)" font-family="Arial" font-size="10">S</text>
    
    <!-- Highlighted appointment day -->
    <circle cx="95" cy="35" r="12" fill="url(#appointmentGradient)" opacity="0.8"/>
    <text x="95" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">15</text>
  </g>
  
  <!-- Doctor consultation -->
  <circle cx="320" cy="120" r="40" fill="url(#appointmentGradient)" opacity="0.2"/>
  <text x="320" y="128" text-anchor="middle" fill="url(#appointmentGradient)" font-family="Arial" font-size="32">👨‍⚕️</text>
  
  <!-- Clock -->
  <circle cx="300" cy="220" r="25" fill="white" stroke="url(#appointmentGradient)" stroke-width="2"/>
  <line x1="300" y1="220" x2="300" y2="205" stroke="url(#appointmentGradient)" stroke-width="2"/>
  <line x1="300" y1="220" x2="310" y2="220" stroke="url(#appointmentGradient)" stroke-width="2"/>
  <text x="340" y="225" fill="url(#appointmentGradient)" font-family="Arial" font-size="12">2:30 PM</text>
</svg>
'@

Set-Content "docs\assets\appointment-custom.svg" $appointmentSVG -Encoding UTF8

Write-Host "Custom images created successfully!" -ForegroundColor Green
Write-Host "Created files:" -ForegroundColor Cyan
Write-Host "- docs/assets/medication-custom.svg" -ForegroundColor White
Write-Host "- docs/assets/family-custom.svg" -ForegroundColor White  
Write-Host "- docs/assets/appointment-custom.svg" -ForegroundColor White
