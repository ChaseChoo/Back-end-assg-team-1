// Enhanced Simple Translation System for SilverConnect
class SimpleTranslator {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            'zh': {
                // Navigation
                'Meal Logging': '饮食记录',
                'Medication Tracker': '药物追踪',
                'Medicine Inventory': '药物库存',
                'Family & Support': '家庭支持',
                'Appointments': '预约',
                'Profile': '个人资料',
                'Settings': '设置',
                'Logout': '退出登录',
                'Login': '登录',
                'Register': '注册',

                // Page titles
                'Create Account - SilverConnect': '创建账户 - 银连健康',
                'Login - SilverConnect': '登录 - 银连健康',
                'Medication Tracker - SilverConnect': '药物追踪 - 银连健康',
                'Settings - SilverConnect': '设置 - 银连健康',

                // Homepage
                'Welcome to SilverConnect': '欢迎使用银连健康',
                'Your Health, Your Way, Your Life': '您的健康，您的方式，您的生活',
                'Healthcare Simplified': '医疗保健简化',
                'Empowering seniors with intelligent healthcare management solutions for a healthier, more connected life.': '通过智能医疗管理解决方案为老年人赋能，实现更健康、更互联的生活。',
                'Designed with ❤️ for Seniors': '为老年人精心设计 ❤️',

                // Homepage sections
                'Track Your Medication': '追踪您的药物',
                'Manage your prescriptions, view dosage info, and get reminders daily.': '管理您的处方药，查看剂量信息，并每天获得提醒。',
                'Your Appointments': '您的预约',
                'Schedule and manage upcoming visits with doctors or specialists.': '安排和管理与医生或专家的预约。',
                'Family & Support Group': '家庭支持小组',
                'Connect with trusted family members and caregivers who can help you manage your health.': '与值得信赖的家庭成员和护理人员联系，他们可以帮助您管理健康。',

                // Stats
                '24/7': '24/7',
                '10K+': '10K+',
                '99%': '99%',
                'Active Users': '活跃用户',
                'Medications Tracked': '追踪药物',
                'Customer Satisfaction': '客户满意度',
                'Available Support': '可用支持',

                // Login/Registration
                'Join SilverConnect': '加入银连健康',
                'Create Account': '创建账户',
                'Login to Your Account': '登录您的账户',
                'Welcome back! Please enter your credentials to access your account.': '欢迎回来！请输入您的凭据以访问您的账户。',
                'Start your journey to better health management with our comprehensive healthcare platform.': '通过我们全面的医疗保健平台开始您的健康管理之旅。',
                'Join thousands managing their health with SilverConnect': '加入成千上万使用银连健康管理健康的用户',
                
                // Form fields
                'Username': '用户名',
                'Choose a username': '选择用户名',
                'Email Address': '电子邮箱',
                'Email': '电子邮箱',
                'Enter your email': '输入您的电子邮箱',
                'Password': '密码',
                'Create a password': '创建密码',
                'Confirm Password': '确认密码',
                'Log In': '登录',
                'Forgot Password?': '忘记密码？',
                "Don't have an account?": '还没有账户？',
                'Already have an account?': '已有账户？',
                'Sign up here': '点击注册',
                'Sign in here': '点击登录',
                'Register here': '点击注册',
                'Login here': '点击登录',
                'I agree to the': '我同意',
                'Terms of Service': '服务条款',
                'Privacy Policy': '隐私政策',
                'and': '和',

                // Features
                'Secure & Private': '安全私密',
                'Health Focused': '专注健康',
                'Family Support': '家庭支持',

                // User Settings
                'Account Settings': '账户设置',
                'Personal Information': '个人信息',
                'Update Profile': '更新资料',
                'Language Preference': '语言偏好',
                'Choose Language': '选择语言',
                'English': 'English',
                '中文 (Chinese)': '中文',

                // Medication
                'Medication Tracker': '药物追踪',
                'Add Medication': '添加药物',
                'Medication Name': '药物名称',
                'Dosage': '剂量',
                'Frequency': '频率',
                'Instructions': '说明',
                'Take with food': '与食物一起服用',
                'Take on empty stomach': '空腹服用',
                'Once daily': '每日一次',
                'Twice daily': '每日两次',
                'Three times daily': '每日三次',

                // Medicine Inventory
                'Medicine Inventory': '药物库存',
                'Current Stock': '当前库存',
                'Low Stock Alert': '低库存警报',
                'Expiry Date': '有效期',
                'Quantity': '数量',

                // Appointments
                'Book Appointment': '预约',
                'Doctor Name': '医生姓名',
                'Appointment Date': '预约日期',
                'Appointment Time': '预约时间',

                // Family Management
                'Family Management': '家庭管理',
                'Add Family Member': '添加家庭成员',
                'Relationship': '关系',

                // Meal Logging
                'Meal Logging': '饮食记录',
                'Add Meal': '添加餐食',
                'Breakfast': '早餐',
                'Lunch': '午餐',
                'Dinner': '晚餐',
                'Calories': '卡路里',

                // Common actions
                'Submit': '提交',
                'Cancel': '取消',
                'Save': '保存',
                'Delete': '删除',
                'Edit': '编辑',
                'Add': '添加',
                'Update': '更新',
                'Search': '搜索',
                'Save Changes': '保存更改',

                // Time and dates
                'Today': '今天',
                'Tomorrow': '明天',
                'Morning': '上午',
                'Afternoon': '下午',
                'Evening': '晚上',
                'Time': '时间',
                'Date': '日期',

                // Status
                'Active': '活跃',
                'Pending': '待定',
                'Completed': '已完成',
                'Confirmed': '已确认',
                'Cancelled': '已取消',

                // Footer
                'Quick Links': '快速链接',
                'Support': '支持',
                'Help Center': '帮助中心',
                'Credits': '致谢',
                'Contact Information': '联系信息',
                '1 Hougang Street 93': '芳林街93号1号',
                'Singapore 538895': '新加坡 538895',
                '+65 6999 6999': '+65 6999 6999',
                'support@silverconnect.sg': 'support@silverconnect.sg',
                'Mon-Fri: 9am-6pm': '周一至周五：上午9点至下午6点',
                'Sat-Sun: 10am-4pm': '周六至周日：上午10点至下午4点',
                '© 2025 SilverConnect. All rights reserved.': '© 2025 银连健康。保留所有权利。',

                // Common
                'Loading...': '加载中...',
                'Please wait': '请稍候',
                'Yes': '是',
                'No': '否',
                'Name': '姓名',
                'Description': '描述',
                'Details': '详情',
                'Status': '状态',
                'Type': '类型',
                'Category': '类别'
            }
        };
    }

    // Enhanced translation method that catches EVERYTHING
    translatePage(language) {
        if (!this.translations[language]) {
            console.warn(`Translation for language '${language}' not found`);
            return;
        }

        this.currentLanguage = language;
        const translations = this.translations[language];

        // Translate all text content
        this.translateAllText(translations);
        
        // Translate placeholders
        this.translatePlaceholders(translations);
        
        // Translate titles and alt text
        this.translateTitlesAndAlt(translations);
        
        // Translate dynamic content
        this.translateDynamicContent(translations);

        // Update language indicator
        this.updateLanguageIndicator(language);
    }

    translateAllText(translations) {
        // Get all text nodes in the document
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip script and style elements
                    const parent = node.parentElement;
                    if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Only process nodes with actual text content
                    return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Translate each text node
        textNodes.forEach(textNode => {
            const originalText = textNode.textContent.trim();
            if (originalText && translations[originalText]) {
                textNode.textContent = translations[originalText];
            }
        });

        // Also translate common HTML elements by their text content
        const elementsToTranslate = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'div', 'button', 'a',
            'label', 'th', 'td', 'li', 'option'
        ];

        elementsToTranslate.forEach(tagName => {
            const elements = document.querySelectorAll(tagName);
            elements.forEach(element => {
                const text = element.textContent.trim();
                if (text && translations[text] && !element.querySelector('*')) {
                    element.textContent = translations[text];
                }
            });
        });
    }

    translatePlaceholders(translations) {
        // Translate input placeholders
        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach(input => {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder && translations[placeholder]) {
                input.setAttribute('placeholder', translations[placeholder]);
            }
        });
    }

    translateTitlesAndAlt(translations) {
        // Translate title attributes
        const elementsWithTitle = document.querySelectorAll('[title]');
        elementsWithTitle.forEach(element => {
            const title = element.getAttribute('title');
            if (title && translations[title]) {
                element.setAttribute('title', translations[title]);
            }
        });

        // Translate alt attributes
        const imagesWithAlt = document.querySelectorAll('img[alt]');
        imagesWithAlt.forEach(img => {
            const alt = img.getAttribute('alt');
            if (alt && translations[alt]) {
                img.setAttribute('alt', translations[alt]);
            }
        });

        // Translate document title
        if (document.title && translations[document.title]) {
            document.title = translations[document.title];
        }
    }

    translateDynamicContent(translations) {
        // Translate data attributes that might contain text
        const elementsWithData = document.querySelectorAll('[data-text], [data-title], [data-label]');
        elementsWithData.forEach(element => {
            ['data-text', 'data-title', 'data-label'].forEach(attr => {
                const value = element.getAttribute(attr);
                if (value && translations[value]) {
                    element.setAttribute(attr, translations[value]);
                }
            });
        });

        // Translate aria-label attributes
        const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
        elementsWithAriaLabel.forEach(element => {
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel && translations[ariaLabel]) {
                element.setAttribute('aria-label', translations[ariaLabel]);
            }
        });
    }

    updateLanguageIndicator(language) {
        const currentLanguageText = document.getElementById('currentLanguageText');
        if (currentLanguageText) {
            currentLanguageText.textContent = language === 'zh' ? '中文' : 'English';
        }

        // Update checkmarks
        const englishCheck = document.getElementById('englishCheck');
        const chineseCheck = document.getElementById('chineseCheck');
        
        if (englishCheck && chineseCheck) {
            if (language === 'zh') {
                englishCheck.classList.add('invisible');
                chineseCheck.classList.remove('invisible');
            } else {
                englishCheck.classList.remove('invisible');
                chineseCheck.classList.add('invisible');
            }
        }
    }

    async updateUserLanguagePreference(language) {
        try {
            const token = sessionStorage.getItem('authToken');
            if (token) {
                await fetch('/api/users/language-preference', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ languagePreference: language })
                });
            }
        } catch (error) {
            console.error('Error updating language preference:', error);
        }
    }

    async init() {
        try {
            const savedLanguage = localStorage.getItem('preferredLanguage');
            const token = sessionStorage.getItem('authToken');
            
            let userLanguage = 'en';
            
            if (token) {
                try {
                    const response = await fetch('/api/users/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    userLanguage = data.user?.languagePreference || 'en';
                } catch (error) {
                    console.error('Error fetching user language preference:', error);
                    userLanguage = savedLanguage || 'en';
                }
            } else {
                userLanguage = savedLanguage || 'en';
            }

            if (userLanguage === 'zh') {
                setTimeout(() => this.translatePage('zh'), 100);
            }
        } catch (error) {
            console.error('Error initializing translator:', error);
        }
    }
}

// Initialize the translator
const translator = new SimpleTranslator();

// Auto-translate on page load
document.addEventListener('DOMContentLoaded', () => {
    translator.init();
});

// Expose globally for language switcher
window.translator = translator;
