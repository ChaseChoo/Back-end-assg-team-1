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

                // More homepage content
                'Comprehensive Healthcare Management': '全面医疗保健管理',
                'Everything you need to manage your health in one beautiful, easy-to-use platform': '在一个美观易用的平台上管理您健康所需的一切',
                'Smart Medication Tracker': '智能药物追踪器',
                'AI-powered medication management with intelligent reminders, drug interaction alerts, and adherence tracking.': '人工智能驱动的药物管理，具有智能提醒、药物相互作用警报和依从性追踪。',
                'Advanced AI': '高级AI',
                'Intelligent Inventory': '智能库存',
                'Real-time medication stock monitoring with automated reorder alerts and family sharing capabilities.': '实时药物库存监控，具有自动重新订购警报和家庭共享功能。',
                'Real-time': '实时',
                'Family Connect Hub': '家庭连接中心',
                'Secure family network for care coordination, emergency contacts, and real-time health updates.': '安全的家庭网络，用于护理协调、紧急联系人和实时健康更新。',
                'Secure': '安全',
                'SilverConnect': '银连健康',

                // Additional common content
                'Learn More': '了解更多',
                'Get Started': '开始使用',
                'Sign Up': '注册',
                'Sign In': '登录',
                'Log Out': '退出',
                'Dashboard': '仪表板',
                'Home': '首页',
                'About': '关于',
                'Contact': '联系',
                'Privacy': '隐私',
                'Terms': '条款',
                'Help': '帮助',
                'FAQ': '常见问题',
                'Documentation': '文档',

                // Feature descriptions that might be missed
                'Modern': '现代化',
                'Advanced': '高级',
                'Intelligent': '智能',
                'Automated': '自动化',
                'Connected': '互联',
                'Comprehensive': '全面',
                'Beautiful': '美观',
                'Easy-to-use': '易于使用',
                'Platform': '平台',
                'Management': '管理',
                'Tracking': '追踪',
                'Monitoring': '监控',
                'Coordination': '协调',
                'Network': '网络',
                'Updates': '更新',
                'Alerts': '警报',
                'Reminders': '提醒',
                'Capabilities': '功能',
                'Sharing': '共享',

                // More feature content from index page
                'Nutrition Intelligence': '营养智能',
                'Smart meal tracking with nutritional analysis, dietary recommendations, and health goal monitoring.': '智能膳食追踪，具有营养分析、饮食建议和健康目标监控。',
                'Smart Analytics': '智能分析',
                'Appointment Orchestrator': '预约协调器',
                'Seamless appointment scheduling with provider matching, reminder systems, and telehealth integration.': '无缝预约安排，具有提供商匹配、提醒系统和远程医疗集成。',
                'Telehealth Ready': '远程医疗就绪',
                'Health Insights': '健康洞察',
                'Comprehensive health analytics with trend analysis, predictive insights, and personalized recommendations.': '全面的健康分析，具有趋势分析、预测洞察和个性化建议。',
                'Coming Soon': '即将推出',

                // Common UI text
                'Get Started Today': '立即开始',
                'Learn More': '了解更多',
                'Try Now': '立即试用',
                'Download': '下载',
                'Install': '安装',
                'Features': '功能',
                'Benefits': '优势',
                'How it Works': '工作原理',
                'Testimonials': '用户评价',
                'Pricing': '价格',
                'Contact Us': '联系我们',

                // Login page specific content
                'Sign In - SilverConnect': '登录 - 银连健康',
                'Welcome to SilverConnect': '欢迎使用银连健康',
                'Your trusted healthcare companion for managing medications, appointments, and family health.': '您值得信赖的医疗保健伙伴，用于管理药物、预约和家庭健康。',
                'Welcome Back': '欢迎回来',
                'Sign in to your SilverConnect account': '登录您的银连健康账户',
                'Enter your email': '输入您的电子邮箱',
                'Enter your password': '输入您的密码',
                'Remember me': '记住我',
                'Forgot password?': '忘记密码？',
                'Sign In': '登录',
                'or': '或',
                "Don't have an account?": '还没有账户？',
                'Create account': '创建账户',

                // Login page features
                'SilverConnect Healthcare Platform': '银连健康医疗平台',

                // Footer links
                'Family Hub': '家庭中心',
                'Nutrition': '营养',

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

        // Run multiple translation passes for maximum coverage
        console.log('Starting comprehensive translation...');
        
        // Pass 1: Translate all text content
        this.translateAllText(translations);
        
        // Pass 2: Translate placeholders
        this.translatePlaceholders(translations);
        
        // Pass 3: Translate titles and alt text
        this.translateTitlesAndAlt(translations);
        
        // Pass 4: Translate dynamic content
        this.translateDynamicContent(translations);

        // Pass 5: Ultra-aggressive final pass to catch anything missed
        setTimeout(() => {
            this.ultraAggressiveTranslation(translations);
        }, 100);

        // Update language indicator and ensure language switching still works
        this.updateLanguageIndicator(language);
        
        // Store preference
        localStorage.setItem('preferredLanguage', language);
        
        // Re-bind language switcher events after translation
        setTimeout(() => this.rebindLanguageSwitcher(), 50);
        console.log('Translation complete');
    }

    rebindLanguageSwitcher() {
        // Always rebind the language switcher dropdown events and global functions
        const englishItem = document.querySelector('a[onclick*="switchToEnglish"]');
        const chineseItem = document.querySelector('a[onclick*="switchToChinese"]');

        // Remove any previous event listeners by replacing the element
        if (englishItem) {
            const newEnglish = englishItem.cloneNode(true);
            newEnglish.onclick = (e) => {
                e.preventDefault();
                window.switchToEnglish();
            };
            englishItem.parentNode.replaceChild(newEnglish, englishItem);
        }
        if (chineseItem) {
            const newChinese = chineseItem.cloneNode(true);
            newChinese.onclick = (e) => {
                e.preventDefault();
                window.switchToChinese();
            };
            chineseItem.parentNode.replaceChild(newChinese, chineseItem);
        }

        // Always define the global functions
        window.switchToEnglish = () => {
            const currentLangText = document.getElementById('currentLanguageText');
            const englishCheck = document.getElementById('englishCheck');
            const chineseCheck = document.getElementById('chineseCheck');
            if (currentLangText) currentLangText.textContent = 'English';
            if (englishCheck) englishCheck.classList.remove('invisible');
            if (chineseCheck) chineseCheck.classList.add('invisible');
            localStorage.setItem('preferredLanguage', 'en');
            this.currentLanguage = 'en';
            setTimeout(() => {
                location.reload();
            }, 100);
        };
        window.switchToChinese = () => {
            const currentLangText = document.getElementById('currentLanguageText');
            const englishCheck = document.getElementById('englishCheck');
            const chineseCheck = document.getElementById('chineseCheck');
            if (currentLangText) currentLangText.textContent = '中文';
            if (englishCheck) englishCheck.classList.add('invisible');
            if (chineseCheck) chineseCheck.classList.remove('invisible');
            localStorage.setItem('preferredLanguage', 'zh');
            this.currentLanguage = 'zh';
            setTimeout(() => {
                this.translatePage('zh');
            }, 50);
        };
    }

    ultraAggressiveTranslation(translations) {
        console.log('Running ultra-aggressive translation pass...');
        
        // Find ANY element that contains English text
        const allElements = document.querySelectorAll('*');
        let translatedCount = 0;
        
        allElements.forEach(element => {
            // Skip script, style, and already processed elements
            if (['SCRIPT', 'STYLE', 'META', 'LINK'].includes(element.tagName)) return;
            
            // Get direct text content (not from children)
            const ownText = this.getOwnTextContent(element);
            
            if (ownText && ownText.length > 0) {
                // Check if it's English text (contains Latin characters but no Chinese)
                if (/[a-zA-Z]/.test(ownText) && !/[\u4e00-\u9fff]/.test(ownText)) {
                    
                    // Try exact match first
                    if (translations[ownText.trim()]) {
                        this.replaceOwnTextContent(element, ownText, translations[ownText.trim()]);
                        translatedCount++;
                    } else {
                        // Try word-by-word replacement for common terms
                        let translatedText = ownText;
                        let hasTranslation = false;
                        
                        // Common word replacements
                        const wordMap = {
                            'Login': '登录',
                            'Register': '注册',
                            'Settings': '设置',
                            'Profile': '个人资料',
                            'Logout': '退出登录',
                            'Welcome': '欢迎',
                            'Health': '健康',
                            'Medical': '医疗',
                            'Medication': '药物',
                            'Family': '家庭',
                            'Support': '支持',
                            'Appointment': '预约',
                            'Inventory': '库存',
                            'English': 'English',
                            'Chinese': '中文',
                            'SilverConnect': '银连健康'
                        };
                        
                        for (const [eng, chi] of Object.entries(wordMap)) {
                            if (translatedText.includes(eng)) {
                                translatedText = translatedText.replace(new RegExp(eng, 'g'), chi);
                                hasTranslation = true;
                            }
                        }
                        
                        if (hasTranslation) {
                            this.replaceOwnTextContent(element, ownText, translatedText);
                            translatedCount++;
                        } else {
                            // Log untranslated text for debugging
                            if (ownText.trim().length > 2 && !/^\d+$/.test(ownText.trim())) {
                                console.log(`Untranslated: "${ownText.trim()}"`);
                            }
                        }
                    }
                }
            }
        });
        
        console.log(`Ultra-aggressive pass translated ${translatedCount} additional elements`);
    }

    getOwnTextContent(element) {
        // Get text that belongs directly to this element, not its children
        const childNodes = Array.from(element.childNodes);
        return childNodes
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent)
            .join('');
    }

    replaceOwnTextContent(element, oldText, newText) {
        // Replace text in the element's own text nodes
        const childNodes = Array.from(element.childNodes);
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(oldText)) {
                node.textContent = node.textContent.replace(oldText, newText);
            }
        });
    }

    translateAllText(translations) {
        // Method 1: Use TreeWalker to find all text nodes
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    const parent = node.parentElement;
                    if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Translate each text node with exact matching
        textNodes.forEach(textNode => {
            const originalText = textNode.textContent.trim();
            if (originalText && translations[originalText]) {
                textNode.textContent = translations[originalText];
            }
        });

        // Method 2: Aggressively translate all elements that contain only text
        const elementsToTranslate = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'div', 'button', 'a',
            'label', 'th', 'td', 'li', 'option',
            'strong', 'em', 'b', 'i', 'u'
        ];

        elementsToTranslate.forEach(tagName => {
            const elements = document.querySelectorAll(tagName);
            elements.forEach(element => {
                // Only translate if element contains only text (no child elements) or has simple structure
                if (this.shouldTranslateElement(element)) {
                    const text = element.textContent.trim();
                    if (text && translations[text]) {
                        element.textContent = translations[text];
                    }
                }
            });
        });

        // Method 3: Handle elements with mixed content (text + icons)
        this.translateMixedContent(translations);

        // Method 4: Use fallback partial matching for missed content
        this.translateWithPartialMatching(translations);
    }

    shouldTranslateElement(element) {
        // Don't translate if element has complex nested structure
        const childElements = element.querySelectorAll('*');
        
        // Allow elements with only icon elements (bi, fa classes) or simple formatting
        const allowedChildren = Array.from(childElements).every(child => {
            return child.tagName === 'I' || 
                   child.classList.contains('bi') || 
                   child.classList.contains('fa') ||
                   ['B', 'STRONG', 'EM', 'U', 'SPAN'].includes(child.tagName);
        });

        return childElements.length === 0 || (childElements.length <= 3 && allowedChildren);
    }

    translateMixedContent(translations) {
        // Handle nav links and buttons that have icons + text
        const navLinks = document.querySelectorAll('a.nav-link, .btn');
        navLinks.forEach(link => {
            // Get text content excluding icon text
            const textContent = this.getTextContentExcludingIcons(link);
            if (textContent && translations[textContent]) {
                // Replace only the text part, keeping icons
                this.replaceTextKeepingIcons(link, textContent, translations[textContent]);
            }
        });

        // Handle elements with badges/spans
        const cardsWithBadges = document.querySelectorAll('.modern-feature-card');
        cardsWithBadges.forEach(card => {
            const textElements = card.querySelectorAll('h5, p');
            textElements.forEach(el => {
                const text = el.textContent.trim();
                if (text && translations[text]) {
                    el.textContent = translations[text];
                }
            });
            
            // Translate badges separately
            const badges = card.querySelectorAll('[class*="badge"]');
            badges.forEach(badge => {
                const badgeText = badge.textContent.trim();
                if (badgeText && translations[badgeText]) {
                    badge.textContent = translations[badgeText];
                }
            });
        });
    }

    getTextContentExcludingIcons(element) {
        // Clone the element to avoid modifying original
        const clone = element.cloneNode(true);
        // Remove icon elements
        clone.querySelectorAll('i[class*="bi-"], i[class*="fa-"]').forEach(icon => icon.remove());
        return clone.textContent.trim();
    }

    replaceTextKeepingIcons(element, oldText, newText) {
        // Find text nodes that contain the old text
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes(oldText)) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            textNode.textContent = textNode.textContent.replace(oldText, newText);
        });
    }

    translateWithPartialMatching(translations) {
        // Last resort: find any remaining English text and try partial matching
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            // Only check leaf elements (those without child elements or with only text)
            if (element.children.length === 0 || this.shouldTranslateElement(element)) {
                const text = element.textContent.trim();
                
                // Skip very short text or numbers
                if (text.length < 3 || /^\d+$/.test(text)) return;
                
                // Skip if already translated (contains Chinese characters)
                if (/[\u4e00-\u9fff]/.test(text)) return;
                
                // Try to find translation
                if (translations[text]) {
                    element.textContent = translations[text];
                } else {
                    // Try partial matching for common words
                    this.attemptPartialTranslation(element, text, translations);
                }
            }
        });
    }

    attemptPartialTranslation(element, text, translations) {
        // Common partial translations for words that might be missed
        const partialTranslations = {
            'English': 'English',
            'Chinese': '中文',
            'SilverConnect': '银连健康',
            'Login': '登录',
            'Register': '注册',
            'Settings': '设置',
            'Profile': '个人资料',
            'Logout': '退出登录',
            'Welcome': '欢迎',
            'Health': '健康',
            'Medical': '医疗',
            'Medication': '药物',
            'Family': '家庭',
            'Support': '支持',
            'Appointment': '预约',
            'Inventory': '库存'
        };

        // Check if text contains any of these words
        for (const [english, chinese] of Object.entries(partialTranslations)) {
            if (text.includes(english) && !translations[text]) {
                // Don't auto-translate complex sentences, just log for debugging
                console.log(`Untranslated text found: "${text}"`);
                break;
            }
        }
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

            // Initialize language switcher functions
            this.rebindLanguageSwitcher();

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
