# Language Switching Feature (Chinese UI Localization) - Test Plan

## Feature Overview
This feature allows users to switch the application interface to Simplified Chinese based on preference, navigate, input data, and receive alerts in their preferred language. This enhances accessibility for non-English speaking seniors and supports Singapore's bilingual population.

## Backend Implementation
✅ **Database Schema Changes**
- Added `languagePreference` column to Users table (NVARCHAR(10), default 'en')
- Added function to update language preference column during app startup
- Updated userModel.js to include language preference in user operations

✅ **API Endpoints**
- `PUT /api/users/language` - Update user language preference
- `GET /api/users/profile` - Get user profile including language preference
- Modified login/register to include language preference in response

✅ **Controllers**
- Added `updateUserLanguage` function in userController.js
- Added `getUserProfile` function in userController.js
- Modified registration and login to return language preference

## Frontend Implementation
✅ **i18n System**
- Created comprehensive i18n manager (i18n.js)
- Translation files for English (en.js) and Chinese (zh.js)
- Language switcher component (language-switcher.js)
- Automatic language detection and application

✅ **Translation Coverage**
- Navigation menus and buttons
- Authentication forms (login/register)
- Homepage features and content
- Medication inventory interface
- User settings and profile management
- Common UI elements and messages
- Error messages and confirmations

✅ **User Interface**
- Language toggle button in navigation bar
- Language preference setting in user profile
- Real-time language switching without page reload
- Toast notifications for language changes
- Persistent language preference storage

✅ **Integration Points**
- Automatic token standardization across all JavaScript files
- Session storage integration for language preferences
- Server-side language preference persistence
- Frontend-backend synchronization

## Files Modified/Created

### Backend Files
- `models/userModel.js` - Added language preference support
- `controllers/userController.js` - Added language endpoints
- `utils/languageSetup.js` - Database schema update utility
- `app.js` - Added language routes and initialization

### Frontend Translation Files
- `docs/js/translations/en.js` - English translations
- `docs/js/translations/zh.js` - Chinese translations
- `docs/js/i18n.js` - Internationalization manager
- `docs/js/language-switcher.js` - Language switcher component

### Updated HTML Pages
- `docs/index.html` - Added i18n scripts and data-i18n attributes
- `docs/user-login.html` - Added i18n support and translations
- `docs/user-registration.html` - Added i18n support and translations
- `docs/user-settings.html` - Added language preference section
- `docs/medication-inventory.html` - Added i18n support
- `docs/medication.html` - Added i18n scripts
- All other HTML pages via automated script

### Updated JavaScript Files
- `docs/js/user-login.js` - Updated to store language preference
- `docs/js/user-registration.js` - Updated to store language preference
- `docs/js/user-settings.js` - Added language preference management
- `docs/js/index.js` - Updated authentication rendering
- Standardized all token references to 'authToken'

## Testing Checklist

### Backend Testing
- [x] Database column added successfully
- [x] Language preference API endpoints working
- [x] User registration includes language preference
- [x] User login returns language preference
- [x] Language preference update persists to database

### Frontend Testing
- [x] i18n scripts load properly
- [x] Language switcher appears in navigation
- [x] Language switching works in real-time
- [x] Translation keys render correctly
- [x] Language preference saves to user profile
- [x] Language persists across page navigation
- [x] Toast notifications work for language changes

### User Experience Testing
- [ ] Register new user and test language switching
- [ ] Login existing user and verify language preference
- [ ] Navigate between pages and verify language persistence
- [ ] Test language switching from user settings
- [ ] Verify Chinese translations display correctly
- [ ] Test with both authenticated and non-authenticated users

### Browser Compatibility
- [ ] Test in Chrome/Edge
- [ ] Test mobile responsiveness
- [ ] Test translation file loading
- [ ] Test sessionStorage functionality

## Key Features Implemented

1. **Complete Bilingual Support**: Full interface translation between English and Simplified Chinese
2. **User Preference Storage**: Language preference stored in user profile and persists across sessions
3. **Real-time Switching**: Language changes apply immediately without page reload
4. **Senior-friendly Design**: Large, accessible language toggle button with clear visual feedback
5. **Comprehensive Coverage**: All major UI elements, forms, messages, and navigation translated
6. **Automatic Detection**: System detects user's preferred language on login
7. **Fallback System**: Graceful fallback to English if translations are missing
8. **Toast Notifications**: User feedback when language is changed successfully

## Database Schema
```sql
ALTER TABLE Users 
ADD languagePreference NVARCHAR(10) DEFAULT 'en' NOT NULL
```

## API Endpoints
```
PUT /api/users/language
Body: { "languagePreference": "zh" | "en" }
Response: { "message": "Language preference updated successfully", "languagePreference": "zh" }

GET /api/users/profile
Response: { "userId": 1, "username": "user", "email": "user@example.com", "languagePreference": "en" }
```

## Translation Keys Structure
```javascript
{
  nav: { ... },           // Navigation elements
  buttons: { ... },       // Common buttons
  homepage: { ... },      // Homepage content
  auth: { ... },          // Authentication forms
  medication: { ... },    // Medication tracker
  inventory: { ... },     // Medicine inventory
  messages: { ... },      // Success/error messages
  common: { ... }         // Common UI elements
}
```

This comprehensive language switching feature enhances accessibility for Singapore's bilingual senior population and provides a fully localized user experience.
