// Script to add i18n support to all HTML pages
const fs = require('fs');
const path = require('path');

const i18nScripts = `
    <!-- i18n Support -->
    <script src="js/translations/en.js"></script>
    <script src="js/translations/zh.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/language-switcher.js"></script>`;

const docsPath = path.join(__dirname, 'docs');
const htmlFiles = [
    'add-medication.html',
    'credits.html',
    'family-management.html',
    'healthcare-appointments.html',
    'meal-logging.html',
    'schedule-medication.html',
    'user-registration.html',
    'user-settings.html'
];

htmlFiles.forEach(file => {
    const filePath = path.join(docsPath, file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if i18n scripts are already added
        if (!content.includes('js/i18n.js')) {
            // Add i18n scripts before the closing </head> tag
            content = content.replace('</head>', `${i18nScripts}
</head>`);
            
            fs.writeFileSync(filePath, content);
            console.log(`Added i18n support to ${file}`);
        } else {
            console.log(`${file} already has i18n support`);
        }
    }
});

console.log('i18n update complete');
