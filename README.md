# 🏥 SilverConnect - Medication Management System

<div align="center">

![SilverConnect Logo](docs/assets/MerderkaLife.png)

**A comprehensive medication management system designed specifically for elderly users and their caregivers**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-lightgrey.svg)](https://expressjs.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-red.svg)](https://www.microsoft.com/en-us/sql-server)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3+-purple.svg)](https://getbootstrap.com/)

[🚀 Live Demo](#demo) | [📖 Documentation](#documentation) | [💡 Features](#features) | [🛠️ Installation](#installation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Key Features](#key-features)
- [🏗️ Technology Stack](#technology-stack)
- [🚀 Getting Started](#getting-started)
- [📁 Project Structure](#project-structure)
- [🔧 API Documentation](#api-documentation)
- [🌐 Multi-language Support](#multi-language-support)
- [♿ Accessibility Features](#accessibility-features)
- [🔒 Security Implementation](#security-implementation)
- [📱 Screenshots](#screenshots)
- [🧪 Testing](#testing)
- [🚀 Deployment](#deployment)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

---

## 📖 Overview

**SilverConnect** is a full-stack web application designed to help elderly users manage their medications effectively. The system addresses critical healthcare challenges including medication adherence, complex scheduling, and family caregiver coordination.

### 🎯 Problem Statement

- **Medication adherence** is crucial for elderly health outcomes
- **Complex medication schedules** are difficult to manage manually
- **Family members** need visibility into medication compliance
- **Traditional paper-based tracking** is unreliable and error-prone

### 💡 Solution

SilverConnect provides an intuitive, accessible platform that combines medication tracking, scheduling, notifications, and family integration with a focus on elderly-friendly design principles.

---

## ✨ Key Features

### 💊 Medication Management
- **Smart Medication Entry** with FDA-approved drug database integration (RxNav API)
- **Visual Icon System** (tablets, capsules, syringes, inhalers)
- **Flexible Dosing** with custom schedules and instructions
- **Inventory Tracking** with automatic refill reminders

### ⏰ Advanced Scheduling
- **Multiple Daily Doses** with precise timing
- **Visual Schedule Overview** organized by time periods
- **Conflict Detection** to prevent scheduling overlaps
- **Recurring Patterns** for complex medication regimens

### 🔔 Intelligent Notifications
- **Browser Push Notifications** with action buttons
- **Customizable Reminders** (5-30 minutes before doses)
- **Escalating Alerts** for missed medications
- **Family Caregiver Notifications** for critical missed doses

### 👥 Family Integration
- **Caregiver Dashboard** for family member oversight
- **Emergency Contacts** with automatic alert systems
- **Access Level Management** with privacy controls
- **Medication History Sharing** with healthcare providers

### 🌐 Accessibility & Internationalization
- **Multi-language Support** (English, Chinese Simplified/Traditional)
- **Large Font Options** optimized for elderly users
- **High Contrast Themes** for vision accessibility
- **Keyboard Navigation** for motor accessibility
- **Screen Reader Compatibility** with ARIA labels

### 🔒 Security & Privacy
- **JWT Authentication** with secure session management
- **Password Encryption** using bcrypt hashing
- **Role-based Access Control** for family members
- **HIPAA-Compliant** data handling practices

---

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: Microsoft SQL Server 2019+
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcrypt
- **API Integration**: Axios for external healthcare APIs

### Frontend
- **Languages**: HTML5, CSS3, Vanilla JavaScript ES6+
- **Framework**: Bootstrap 5.3+ for responsive design
- **Icons**: Custom medication icon system
- **Notifications**: Browser Notification API
- **Storage**: SessionStorage and LocalStorage

### External Integrations
- **RxNav API**: FDA medication database for autocomplete
- **OpenFDA API**: Adverse event reporting and drug safety data
- **Healthcare APIs**: Integration ready for EHR systems

### Development Tools
- **Development Server**: Nodemon for hot reload
- **Environment Management**: dotenv for configuration
- **Version Control**: Git with GitHub integration
- **Testing**: Custom test suites for API and UI validation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher
- **Microsoft SQL Server** 2019 or higher
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChaseChoo/SilverConnect-Medication-Management.git
   cd SilverConnect-Medication-Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file with your configuration
   PORT=3000
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_SERVER=localhost
   DB_DATABASE=SilverConnect
   DB_PORT=1433
   JWT_SECRET=your-secure-secret-key
   ```

4. **Database Setup**
   ```bash
   # The application will automatically create tables on first run
   # Ensure your SQL Server is running and accessible
   ```

5. **Start the application**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   ```
   Open your browser to: http://localhost:3000
   ```

### Quick Start Guide

1. **Register a new account** at `/user-registration.html`
2. **Log in** at `/user-login.html`
3. **Add your first medication** at `/add-medication.html`
4. **Schedule dose times** using the Schedule button
5. **View your daily schedule** on the main `/medication.html` page

---

## 📁 Project Structure

```
SilverConnect-Clean/
├── 📄 app.js                    # Main application entry point
├── 📄 dbConfig.js              # Database configuration
├── 📄 package.json             # Project dependencies and scripts
├── 📄 README.md               # This file
├── 📁 controllers/            # API endpoint controllers
│   ├── 📄 appointmentController.js  # Appointment management
│   ├── 📄 doctorController.js       # Doctor information
│   ├── 📄 familyController.js       # Family member management
│   ├── 📄 medicationController.js   # Core medication logic
│   ├── 📄 userController.js         # User authentication
│   └── 📄 supportController.js      # Help and support
├── 📁 models/                 # Database models and queries
│   ├── 📄 appointmentModel.js
│   ├── 📄 doctorModel.js
│   ├── 📄 familyModel.js
│   ├── 📄 medicationModel.js
│   ├── 📄 mealLogModel.js
│   └── 📄 userModel.js
├── 📁 middlewares/           # Express middleware functions
│   ├── 📄 appointmentValidation.js
│   ├── 📄 medicationValidation.js
│   ├── 📄 mealLogValidation.js
│   └── 📄 userValidation.js
├── 📁 docs/                  # Frontend application
│   ├── 📄 index.html         # Landing page
│   ├── 📄 medication.html    # Main medication dashboard
│   ├── 📄 add-medication.html # Add new medications
│   ├── 📄 schedule-medication.html # Schedule dose times
│   ├── 📄 user-login.html    # User authentication
│   ├── 📄 user-registration.html # New user signup
│   ├── 📁 css/               # Stylesheets
│   │   └── 📄 style.css      # Main application styles
│   ├── 📁 js/                # Frontend JavaScript
│   │   ├── 📄 medication.js  # Medication management logic
│   │   ├── 📄 schedule-medication.js # Scheduling functionality
│   │   ├── 📄 user-login.js  # Authentication logic
│   │   ├── 📄 add-medication.js # Add medication functionality
│   │   └── 📄 notification-manager.js # Notification system
│   └── 📁 assets/            # Images and icons
│       ├── 📄 tablet.png     # Medication type icons
│       ├── 📄 capsule.png
│       ├── 📄 syringe.png
│       ├── 📄 inhaler.png
│       └── 📄 MerderkaLife.png # Application logo
└── 📁 tests/                 # Test suites
    ├── 📄 medicationController.test.js
    ├── 📄 medicationModel.test.js
    ├── 📄 userController.test.js
    └── 📄 userValidation.test.js
```

---

## 🔧 API Documentation

### Authentication Endpoints

#### POST `/api/users/register`
Register a new user account
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

#### POST `/api/users/login`
Authenticate user and receive JWT token
```json
{
  "username": "string",
  "password": "string"
}
```

### Medication Endpoints

#### GET `/api/medication-records`
Get all medications for authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of medications with schedules

#### POST `/api/medication`
Create new medication
```json
{
  "medicationName": "string",
  "dosage": "string",
  "frequency": "string",
  "iconType": "tablet|capsule|syringe|inhaler",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "doseTimes": ["HH:MM", "HH:MM"]
}
```

#### PUT `/api/medication/:id`
Update existing medication
- **Headers**: `Authorization: Bearer <token>`

#### DELETE `/api/medication-schedule/:scheduleId`
Delete specific dose time
- **Headers**: `Authorization: Bearer <token>`

### Schedule Management

#### POST `/api/medication-schedule`
Create new medication schedule
```json
{
  "medicationId": "number",
  "doseTime": "HH:MM",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

#### PUT `/api/medication-schedule/:scheduleId/mark-taken`
Mark dose as taken/not taken
```json
{
  "markAsTaken": true
}
```

### External API Integration

#### GET `/api/medication-suggestions`
Get medication name suggestions from RxNav
- **Query**: `?name=medication_name`
- **Response**: Array of FDA-approved medication names

---

## 🌐 Multi-language Support

SilverConnect supports multiple languages with a focus on elderly user accessibility:

### Supported Languages
- **English** (en) - Default language
- **Chinese Simplified** (zh-CN) - Full translation
- **Chinese Traditional** (zh-TW) - Regional variant

### Implementation Features
- **Dynamic Language Switching** without page reload
- **Persistent Preferences** saved to user profile
- **Cultural Localization** for dates and time formats
- **Medical Terminology** properly translated
- **Extensible Framework** for adding new languages

---

## ♿ Accessibility Features

SilverConnect is designed with comprehensive accessibility for elderly and disabled users:

### Visual Accessibility
- **Large Font Sizes** (18px minimum, scalable to 24px)
- **High Contrast Themes** meeting WCAG AA standards
- **Color-blind Support** with patterns and shapes
- **Zoom Compatibility** functional at 200% browser zoom

### Motor Accessibility
- **Large Click Targets** (minimum 44px)
- **Keyboard Navigation** for all functionality
- **Touch-friendly** interface for tablets
- **Voice Control** compatibility

### Cognitive Accessibility
- **Simple Navigation** with clear breadcrumbs
- **Progress Indicators** showing current step
- **Error Prevention** with confirmation dialogs
- **Context Help** and tooltips

---

## 🔒 Security Implementation

### Authentication & Authorization
- **JWT Tokens** with configurable expiration
- **Password Hashing** using bcrypt with salt rounds
- **Route Protection** middleware on all API endpoints
- **Role-based Access** for family member permissions

### Data Security
- **SQL Injection Prevention** with parameterized queries
- **Input Validation** on all user inputs
- **XSS Protection** with sanitized outputs
- **Secure Headers** configuration

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "medication"
```

### Test Coverage
- **Unit Tests**: Controller and model functions
- **Integration Tests**: API endpoint testing
- **Validation Tests**: Input validation middleware
- **UI Tests**: Frontend functionality validation

---

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
DB_SERVER=your-production-server
DB_DATABASE=SilverConnect
JWT_SECRET=your-secure-secret
```

### Deployment Options
- **Azure App Service** (recommended for SQL Server integration)
- **AWS Elastic Beanstalk**
- **Docker containerization**
- **Traditional server deployment**

---

## 🤝 Contributing

We welcome contributions to improve SilverConnect! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add new notification feature"`
5. Push to your fork: `git push origin feature/new-feature`
6. Create a Pull Request

### Areas for Contribution
- 🌐 Additional language translations
- ♿ Enhanced accessibility features
- 📱 Mobile application development
- 🔗 Healthcare provider integrations
- 🤖 AI-powered medication insights

---

## 📋 Roadmap

### Version 2.0 (Planned)
- [ ] **Mobile Application** - React Native implementation
- [ ] **Doctor Portal** - Healthcare provider dashboard
- [ ] **IoT Integration** - Smart pill dispenser connectivity
- [ ] **AI Recommendations** - Machine learning for adherence insights

### Version 1.5 (In Progress)
- [ ] **Advanced Analytics** - Medication adherence reporting
- [ ] **Family Dashboard** - Enhanced caregiver features
- [ ] **Voice Assistant** - Integration with Alexa/Google Home

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Original Development Team:**
- **S10266857F** - Chong Xu Feng - Medication Schedules & Management
- **S10269541C** - Chase Choo Yan Hee - Help Hotline, Ask Us Form & Family Groups  
- **S10268292E** - Chong Yi Kai David - Inventory Tracker & Language Support
- **S10267180D** - De Roza Ariel Therese - Meal Planning & Family Group CRUD
- **S10259031H** - Koh Ming Feng - Authentication & User Management

**Lead Maintainer:**
- **Chase Choo** - GitHub: [@ChaseChoo](https://github.com/ChaseChoo)

---

## 🙏 Acknowledgments

- **RxNav API** for FDA medication database access
- **OpenFDA** for drug safety information
- **Bootstrap Team** for responsive framework
- **Node.js Community** for excellent documentation
- **Elderly Care Specialists** for user experience insights

---

## 📞 Support

For support, questions, or feature requests:

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ChaseChoo/SilverConnect-Medication-Management/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/ChaseChoo/SilverConnect-Medication-Management/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/ChaseChoo/SilverConnect-Medication-Management/wiki)

---

<div align="center">

**Made with ❤️ for elderly healthcare**

[![GitHub stars](https://img.shields.io/github/stars/ChaseChoo/SilverConnect-Medication-Management.svg?style=social&label=Star)](https://github.com/ChaseChoo/SilverConnect-Medication-Management)
[![GitHub forks](https://img.shields.io/github/forks/ChaseChoo/SilverConnect-Medication-Management.svg?style=social&label=Fork)](https://github.com/ChaseChoo/SilverConnect-Medication-Management/fork)

</div>