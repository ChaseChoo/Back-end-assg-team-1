// Script to standardize token naming to 'authToken'
const fs = require('fs');
const path = require('path');

const jsFilesPath = path.join(__dirname, 'docs/js');
const jsFiles = fs.readdirSync(jsFilesPath).filter(file => file.endsWith('.js'));

jsFiles.forEach(file => {
    const filePath = path.join(jsFilesPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip translation files and i18n.js (already correct)
    if (file.includes('translation') || file === 'i18n.js' || file === 'language-switcher.js') {
        return;
    }
    
    let changed = false;
    
    // Replace sessionStorage.getItem('token') with sessionStorage.getItem('authToken')
    if (content.includes("sessionStorage.getItem('token')") || content.includes('sessionStorage.getItem("token")')) {
        content = content.replace(/sessionStorage\.getItem\(['"]token['"]\)/g, "sessionStorage.getItem('authToken')");
        changed = true;
    }
    
    // Replace sessionStorage.setItem('token', with sessionStorage.setItem('authToken',
    if (content.includes("sessionStorage.setItem('token',") || content.includes('sessionStorage.setItem("token",')) {
        content = content.replace(/sessionStorage\.setItem\(['"]token['"],/g, "sessionStorage.setItem('authToken',");
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated token references in ${file}`);
    }
});

console.log('Token standardization complete');
