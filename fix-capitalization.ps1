# PowerShell script to fix capitalization issues in translation keys

$htmlFiles = Get-ChildItem -Path "docs" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix navigation keys
    $content = $content -replace 'data-i18n="navmealLogging"', 'data-i18n="navMealLogging"'
    $content = $content -replace 'data-i18n="navmedicationTracker"', 'data-i18n="navMedicationTracker"'
    $content = $content -replace 'data-i18n="navmedicineInventory"', 'data-i18n="navMedicineInventory"'
    $content = $content -replace 'data-i18n="navfamilySupport"', 'data-i18n="navFamilySupport"'
    $content = $content -replace 'data-i18n="navmanageAppointment"', 'data-i18n="navManageAppointment"'
    $content = $content -replace 'data-i18n="navprofile"', 'data-i18n="navProfile"'
    $content = $content -replace 'data-i18n="navsettings"', 'data-i18n="navSettings"'
    $content = $content -replace 'data-i18n="navlogout"', 'data-i18n="navLogout"'
    $content = $content -replace 'data-i18n="navlogin"', 'data-i18n="navLogin"'
    $content = $content -replace 'data-i18n="navregister"', 'data-i18n="navRegister"'
    
    # Fix button keys
    $content = $content -replace 'data-i18n="buttonsave"', 'data-i18n="buttonSave"'
    $content = $content -replace 'data-i18n="buttoncancel"', 'data-i18n="buttonCancel"'
    $content = $content -replace 'data-i18n="buttonedit"', 'data-i18n="buttonEdit"'
    $content = $content -replace 'data-i18n="buttondelete"', 'data-i18n="buttonDelete"'
    $content = $content -replace 'data-i18n="buttonadd"', 'data-i18n="buttonAdd"'
    $content = $content -replace 'data-i18n="buttonupdate"', 'data-i18n="buttonUpdate"'
    $content = $content -replace 'data-i18n="buttonsubmit"', 'data-i18n="buttonSubmit"'
    $content = $content -replace 'data-i18n="buttonclose"', 'data-i18n="buttonClose"'
    $content = $content -replace 'data-i18n="buttonconfirm"', 'data-i18n="buttonConfirm"'
    $content = $content -replace 'data-i18n="buttonback"', 'data-i18n="buttonBack"'
    $content = $content -replace 'data-i18n="buttonnext"', 'data-i18n="buttonNext"'
    $content = $content -replace 'data-i18n="buttonprevious"', 'data-i18n="buttonPrevious"'
    $content = $content -replace 'data-i18n="buttonsearch"', 'data-i18n="buttonSearch"'
    $content = $content -replace 'data-i18n="buttonfilter"', 'data-i18n="buttonFilter"'
    $content = $content -replace 'data-i18n="buttonexport"', 'data-i18n="buttonExport"'
    $content = $content -replace 'data-i18n="buttonimport"', 'data-i18n="buttonImport"'
    $content = $content -replace 'data-i18n="buttonrefresh"', 'data-i18n="buttonRefresh"'
    $content = $content -replace 'data-i18n="buttonreset"', 'data-i18n="buttonReset"'
    $content = $content -replace 'data-i18n="buttonclear"', 'data-i18n="buttonClear"'
    
    # Fix login keys
    $content = $content -replace 'data-i18n="logintitle"', 'data-i18n="loginTitle"'
    $content = $content -replace 'data-i18n="loginemail"', 'data-i18n="loginEmail"'
    $content = $content -replace 'data-i18n="loginpassword"', 'data-i18n="loginPassword"'
    $content = $content -replace 'data-i18n="loginloginButton"', 'data-i18n="loginButton"'
    $content = $content -replace 'data-i18n="loginforgotPassword"', 'data-i18n="loginForgotPassword"'
    $content = $content -replace 'data-i18n="loginnoAccount"', 'data-i18n="loginNoAccount"'
    $content = $content -replace 'data-i18n="loginregisterLink"', 'data-i18n="loginRegisterLink"'
    
    # Fix register keys
    $content = $content -replace 'data-i18n="registertitle"', 'data-i18n="registerTitle"'
    $content = $content -replace 'data-i18n="registerusername"', 'data-i18n="registerUsername"'
    $content = $content -replace 'data-i18n="registeremail"', 'data-i18n="registerEmail"'
    $content = $content -replace 'data-i18n="registerpassword"', 'data-i18n="registerPassword"'
    $content = $content -replace 'data-i18n="registerconfirmPassword"', 'data-i18n="registerConfirmPassword"'
    $content = $content -replace 'data-i18n="registerregisterButton"', 'data-i18n="registerButton"'
    $content = $content -replace 'data-i18n="registerhasAccount"', 'data-i18n="registerHasAccount"'
    $content = $content -replace 'data-i18n="registerloginLink"', 'data-i18n="registerLoginLink"'
    
    # Fix profile keys
    $content = $content -replace 'data-i18n="profiletitle"', 'data-i18n="profileTitle"'
    $content = $content -replace 'data-i18n="profilepersonalInfo"', 'data-i18n="profilePersonalInfo"'
    $content = $content -replace 'data-i18n="profilelanguagePreference"', 'data-i18n="profileLanguagePreference"'
    $content = $content -replace 'data-i18n="profileenglish"', 'data-i18n="profileEnglish"'
    $content = $content -replace 'data-i18n="profilechinese"', 'data-i18n="profileChinese"'
    
    # Fix inventory keys
    $content = $content -replace 'data-i18n="inventorytitle"', 'data-i18n="inventoryTitle"'
    $content = $content -replace 'data-i18n="inventorydescription"', 'data-i18n="inventoryDescription"'
    $content = $content -replace 'data-i18n="inventoryloadingMessage"', 'data-i18n="inventoryLoadingMessage"'
    $content = $content -replace 'data-i18n="inventorysignInMessage"', 'data-i18n="inventorySignInMessage"'
    
    # Fix message keys
    $content = $content -replace 'data-i18n="messagesignInRequired"', 'data-i18n="messageSignInRequired"'
    $content = $content -replace 'data-i18n="messageloading"', 'data-i18n="messageLoading"'
    $content = $content -replace 'data-i18n="messagesuccess"', 'data-i18n="messageSuccess"'
    $content = $content -replace 'data-i18n="messageerror"', 'data-i18n="messageError"'
    $content = $content -replace 'data-i18n="messageconfirmDelete"', 'data-i18n="messageConfirmDelete"'
    
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Fixed capitalization: $($file.Name)"
}

Write-Host "All capitalization issues fixed!"
