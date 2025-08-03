// Simple translation system for SilverConnect
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
                'Manage Appointment': '预约管理',
                'Profile': '个人资料',
                'Settings': '设置',
                'Logout': '退出登录',
                'Login': '登录',
                'Register': '注册',

                // Homepage hero section
                'Welcome to SilverConnect': '欢迎使用银连健康',
                'Your Health, Your Way, Your Life': '您的健康，您的方式，您的生活',
                'Track Your Medication': '追踪您的药物',
                'Manage your prescriptions, view dosage info, and get reminders daily.': '管理您的处方药，查看剂量信息，并每天获得提醒。',
                'Track your medication stock, get low inventory alerts, and share with family.': '追踪您的药物库存，获得低库存提醒，并与家人分享。',
                'Track your meals, nutrition, and dietary habits to maintain a healthy lifestyle.': '记录您的饮食，营养和饮食习惯，保持健康的生活方式。',
                'Your Appointments': '您的预约',
                'Schedule and manage upcoming visits with doctors or specialists.': '安排和管理与医生或专家的预约。',
                'Family & Support Group': '家庭支持小组',
                'Connect with trusted family members and caregivers who can help you manage your health.': '与值得信赖的家庭成员和护理人员联系，他们可以帮助您管理健康。',

                // Login page
                'Login to MerderkaLife': '登录到银连健康',
                'Login to Your Account': '登录您的账户',
                'Welcome back! Please enter your credentials to access your account.': '欢迎回来！请输入您的凭据以访问您的账户。',
                'Email Address': '电子邮箱',
                'Email': '电子邮箱',
                'Password': '密码',
                'Log In': '登录',
                'Forgot Password?': '忘记密码？',
                "Don't have an account?": '还没有账户？',
                'Sign Up': '注册',
                'Register here': '点击注册',

                // Registration page
                'Register for SilverConnect': '注册银连健康',
                'Create New Account': '创建新账户',
                'Join SilverConnect today and take control of your health journey.': '今天加入银连健康，掌控您的健康之旅。',
                'Username': '用户名',
                'First Name': '名',
                'Last Name': '姓',
                'Full Name': '姓名',
                'Confirm Password': '确认密码',
                'Register': '注册',
                'Already have an account?': '已有账户？',
                'Login here': '点击登录',

                // User settings page
                'Account Settings': '账户设置',
                'Personal Information': '个人信息',
                'Update Profile': '更新资料',
                'Language Preference': '语言偏好',
                'Choose Language': '选择语言',
                'English': 'English',
                '中文 (Chinese)': '中文',
                'New Password': '新密码',
                'Contact Information': '联系信息',
                'Emergency Contact': '紧急联系人',
                'Medical Information': '医疗信息',
                'Insurance Information': '保险信息',
                'Notification Preferences': '通知偏好',

                // Medication Tracker page
                'Medication Tracker': '药物追踪',
                'Daily Medication Schedule': '每日用药计划',
                'My Medications': '我的药物',
                'Add Medication': '添加药物',
                'Today\'s Schedule': '今日计划',
                'Upcoming Reminders': '即将到来的提醒',
                'Medication History': '用药历史',
                'Take Medication': '服用药物',
                'Mark as Taken': '标记为已服用',
                'Skip Dose': '跳过剂量',
                'Reschedule': '重新安排',
                'View Details': '查看详情',
                'Edit Medication': '编辑药物',

                // Add Medication page
                'Add New Medication': '添加新药物',
                'Medication Details': '药物详情',
                'Medication Name': '药物名称',
                'Generic Name': '通用名称',
                'Brand Name': '品牌名称',
                'Dosage': '剂量',
                'Strength': '浓度',
                'Form': '剂型',
                'Tablet': '片剂',
                'Capsule': '胶囊',
                'Liquid': '液体',
                'Injection': '注射',
                'Inhaler': '吸入器',
                'Topical': '外用',
                'Frequency': '频率',
                'Frequency per Day': '每日频率',
                'Once daily': '每日一次',
                'Twice daily': '每日两次',
                'Three times daily': '每日三次',
                'Four times daily': '每日四次',
                'As needed': '按需服用',
                'Start Date': '开始日期',
                'End Date': '结束日期',
                'Duration of Treatment': '治疗持续时间',
                'Instructions': '用药说明',
                'Special Instructions': '特殊说明',
                'Take with food': '饭后服用',
                'Take on empty stomach': '空腹服用',
                'Take at bedtime': '睡前服用',
                'Do not crush': '不要咀嚼',
                'Reminder Time': '提醒时间',

                // Schedule Medication page
                'Schedule Medication': '安排用药',
                'Medication Schedule': '用药计划',
                'Set Reminders': '设置提醒',
                'Reminder Settings': '提醒设置',
                'Morning': '早上',
                'Afternoon': '下午',
                'Evening': '晚上',
                'Night': '夜晚',
                'Before breakfast': '早餐前',
                'After breakfast': '早餐后',
                'Before lunch': '午餐前',
                'After lunch': '午餐后',
                'Before dinner': '晚餐前',
                'After dinner': '晚餐后',
                'Custom Time': '自定义时间',
                'Repeat': '重复',
                'Daily': '每日',
                'Weekly': '每周',
                'Monthly': '每月',

                // Medicine Inventory page
                'Medication Inventory': '药物库存',
                'Track your medication stock and stay informed about low supplies': '追踪您的药物库存并及时了解低库存情况',
                'Current Stock': '当前库存',
                'Low Stock Alert': '低库存提醒',
                'Restock': '补充库存',
                'Stock Level': '库存水平',
                'Quantity': '数量',
                'Expiry Date': '到期日期',
                'Expiration Date': '有效期',
                'Days Remaining': '剩余天数',
                'Add to Inventory': '添加到库存',
                'Update Stock': '更新库存',
                'Remove from Inventory': '从库存中移除',
                'Stock History': '库存历史',
                'Notifications': '通知',
                'Refill Reminder': '补药提醒',
                'Expired': '已过期',
                'Expires Soon': '即将过期',
                'In Stock': '有库存',
                'Low Stock': '库存不足',
                'Out of Stock': '缺货',

                // Meal Logging page
                'Meal Logging': '饮食记录',
                'Log Your Meals': '记录您的饮食',
                'Add Meal': '添加饮食',
                'Meal Type': '饮食类型',
                'Breakfast': '早餐',
                'Lunch': '午餐',
                'Dinner': '晚餐',
                'Snack': '零食',
                'Beverage': '饮品',
                'Food Items': '食物项目',
                'Food Name': '食物名称',
                'Portion Size': '份量',
                'Calories': '卡路里',
                'Meal Time': '用餐时间',
                'Notes': '备注',
                'Today\'s Meals': '今日饮食',
                'Meal History': '饮食历史',
                'Nutrition Summary': '营养摘要',
                'Weekly Report': '每周报告',
                'Daily Goal': '每日目标',
                'Calories Consumed': '已摄入卡路里',
                'Calories Remaining': '剩余卡路里',
                'Nutritional Information': '营养信息',
                'Protein': '蛋白质',
                'Carbohydrates': '碳水化合物',
                'Fat': '脂肪',
                'Fiber': '纤维',
                'Sugar': '糖分',
                'Sodium': '钠',

                // Healthcare Appointments page
                'Healthcare Appointments': '医疗预约',
                'Book Appointment': '预约',
                'Schedule New Appointment': '安排新预约',
                'Doctor Name': '医生姓名',
                'Doctor': '医生',
                'Specialty': '专科',
                'Clinic': '诊所',
                'Hospital': '医院',
                'Date': '日期',
                'Time': '时间',
                'Appointment Date': '预约日期',
                'Appointment Time': '预约时间',
                'Reason for Visit': '就诊原因',
                'Chief Complaint': '主要症状',
                'Location': '地点',
                'Address': '地址',
                'Upcoming Appointments': '即将到来的预约',
                'Past Appointments': '过往预约',
                'Appointment Details': '预约详情',
                'Reschedule Appointment': '重新安排预约',
                'Cancel Appointment': '取消预约',
                'Confirm Appointment': '确认预约',
                'Appointment Reminder': '预约提醒',
                'Check-in': '签到',
                'Waiting Time': '等待时间',
                'Follow-up': '复诊',
                'Consultation Notes': '诊疗记录',

                // Family & Support page
                'Family & Support': '家庭支持',
                'Family Members': '家庭成员',
                'Add Family Member': '添加家庭成员',
                'Member Name': '成员姓名',
                'Relationship': '关系',
                'Spouse': '配偶',
                'Child': '子女',
                'Parent': '父母',
                'Sibling': '兄弟姐妹',
                'Caregiver': '护理人员',
                'Friend': '朋友',
                'Phone Number': '电话号码',
                'Email Address': '电子邮箱',
                'Emergency Contact': '紧急联系人',
                'Primary Contact': '主要联系人',
                'Access Level': '访问级别',
                'Full Access': '完全访问',
                'Limited Access': '有限访问',
                'View Only': '仅查看',
                'Care Network': '护理网络',
                'Support Group': '支持小组',
                'Family Dashboard': '家庭仪表板',
                'Shared Information': '共享信息',
                'Medical Records': '医疗记录',
                'Permissions': '权限',
                'Invite Member': '邀请成员',
                'Send Invitation': '发送邀请',
                'Remove Member': '移除成员',

                // Credits page
                'Credits': '致谢',
                'Development Team': '开发团队',
                'Project Lead': '项目负责人',
                'Developer': '开发人员',
                'Designer': '设计师',
                'Special Thanks': '特别感谢',
                'Third Party Libraries': '第三方库',
                'Open Source': '开源',
                'Version': '版本',
                'Build Date': '构建日期',
                'Contact Us': '联系我们',
                'Support': '技术支持',
                'Feedback': '反馈',
                'Bug Report': '错误报告',
                'Feature Request': '功能请求',
                'About SilverConnect': '关于银连健康',
                'Privacy Policy': '隐私政策',
                'Terms of Service': '服务条款',
                'License': '许可证',

                // Page titles (for document.title)
                'SilverConnect - Healthcare Management for Seniors': '银连健康 - 为老年人提供的健康管理',
                'User Login - MerderkaLife': '用户登录 - 银连健康',
                'User Registration - SilverConnect': '用户注册 - 银连健康',
                'Medication Inventory - SilverConnect': '药物库存 - 银连健康',
                'Medication Tracker - SilverConnect': '药物追踪 - 银连健康',
                'Meal Logging - SilverConnect': '饮食记录 - 银连健康',
                'Healthcare Appointments - SilverConnect': '医疗预约 - 银连健康',
                'Family & Support - SilverConnect': '家庭支持 - 银连健康',
                'Add Medication - SilverConnect': '添加药物 - 银连健康',
                'Schedule Medication - SilverConnect': '安排用药 - 银连健康',
                'Account Settings - SilverConnect': '账户设置 - 银连健康',
                'Credits - SilverConnect': '致谢 - 银连健康',

                // Common buttons and actions
                'Save': '保存',
                'Cancel': '取消',
                'Edit': '编辑',
                'Delete': '删除',
                'Add': '添加',
                'Update': '更新',
                'Submit': '提交',
                'Close': '关闭',
                'Confirm': '确认',
                'Back': '返回',
                'Next': '下一步',
                'Previous': '上一步',
                'Continue': '继续',
                'Finish': '完成',
                'Search': '搜索',
                'Filter': '筛选',
                'Sort': '排序',
                'Export': '导出',
                'Import': '导入',
                'Print': '打印',
                'Share': '分享',
                'Copy': '复制',
                'Download': '下载',
                'Upload': '上传',
                'Refresh': '刷新',
                'Reload': '重新加载',
                'Reset': '重置',
                'Clear': '清除',
                'Select': '选择',
                'Deselect': '取消选择',
                'Select All': '全选',
                'View': '查看',
                'Hide': '隐藏',
                'Show': '显示',
                'Expand': '展开',
                'Collapse': '折叠',
                'Update My Info': '更新我的信息',
                'Save Language': '保存语言',
                'Save Changes': '保存更改',
                'Discard Changes': '放弃更改',

                // Common form elements and labels
                'Name': '姓名',
                'Description': '描述',
                'Details': '详情',
                'Category': '类别',
                'Type': '类型',
                'Status': '状态',
                'Priority': '优先级',
                'Comments': '评论',
                'Remarks': '备注',
                'Tags': '标签',
                'Created': '创建时间',
                'Modified': '修改时间',
                'Created By': '创建者',
                'Modified By': '修改者',
                'Owner': '所有者',
                'Size': '大小',
                'Duration': '持续时间',
                'From': '从',
                'To': '到',
                'Between': '之间',
                'Range': '范围',
                'Minimum': '最小值',
                'Maximum': '最大值',
                'Average': '平均值',
                'Total': '总计',
                'Count': '数量',
                'Number': '编号',
                'ID': '标识',
                'Code': '代码',
                'Reference': '参考',

                // Status values
                'Active': '活跃',
                'Inactive': '非活跃',
                'Enabled': '启用',
                'Disabled': '禁用',
                'Pending': '待处理',
                'Approved': '已批准',
                'Rejected': '已拒绝',
                'Completed': '已完成',
                'In Progress': '进行中',
                'Cancelled': '已取消',
                'Scheduled': '已安排',
                'Confirmed': '已确认',
                'Draft': '草稿',
                'Published': '已发布',
                'Archived': '已归档',
                'Available': '可用',
                'Unavailable': '不可用',
                'Online': '在线',
                'Offline': '离线',

                // Common values
                'Yes': '是',
                'No': '否',
                'True': '真',
                'False': '假',
                'None': '无',
                'All': '全部',
                'Any': '任意',
                'Other': '其他',
                'Unknown': '未知',
                'Not specified': '未指定',
                'Optional': '可选',
                'Required': '必填',
                'Recommended': '推荐',
                'Default': '默认',
                'Custom': '自定义',
                'Automatic': '自动',
                'Manual': '手动',
                'High': '高',
                'Medium': '中',
                'Low': '低',
                'Normal': '正常',
                'Critical': '严重',
                'Warning': '警告',
                'Info': '信息',
                'Success': '成功',
                'Error': '错误',
                'Failed': '失败',

                // Common messages and alerts
                'Loading...': '加载中...',
                'Loading': '加载中',
                'Please wait...': '请稍候...',
                'Processing...': '处理中...',
                'Saving...': '保存中...',
                'Sending...': '发送中...',
                'Connecting...': '连接中...',
                'Searching...': '搜索中...',
                'Success!': '成功！',
                'Done!': '完成！',
                'Failed!': '失败！',
                'Error!': '错误！',
                'Warning!': '警告！',
                'Information': '信息',
                'Notice': '通知',
                'Alert': '提醒',
                'Message': '消息',
                'Notification': '通知',
                'An error occurred': '发生错误',
                'Something went wrong': '出现了问题',
                'Please try again': '请重试',
                'Please try again later': '请稍后重试',
                'Operation completed successfully': '操作成功完成',
                'Changes saved successfully': '更改保存成功',
                'Item added successfully': '项目添加成功',
                'Item updated successfully': '项目更新成功',
                'Item deleted successfully': '项目删除成功',
                'Please fill in all required fields': '请填写所有必填字段',
                'Please check your input': '请检查您的输入',
                'Invalid input': '输入无效',
                'Invalid format': '格式无效',
                'Invalid email address': '电子邮箱格式无效',
                'Invalid phone number': '电话号码格式无效',
                'Password too short': '密码太短',
                'Passwords do not match': '密码不匹配',
                'Field is required': '此字段为必填项',
                'Are you sure?': '您确定吗？',
                'Are you sure you want to delete this item?': '您确定要删除此项目吗？',
                'Are you sure you want to cancel?': '您确定要取消吗？',
                'This action cannot be undone': '此操作无法撤销',
                'Confirm deletion': '确认删除',
                'Confirm action': '确认操作',
                'No items found': '未找到项目',
                'No results found': '未找到结果',
                'No data available': '无可用数据',
                'Empty list': '列表为空',
                'Connection error': '连接错误',
                'Network error': '网络错误',
                'Server error': '服务器错误',
                'Timeout error': '超时错误',
                'Access denied': '访问被拒绝',
                'Permission denied': '权限被拒绝',
                'Unauthorized': '未授权',
                'Session expired': '会话已过期',
                'Please log in': '请登录',
                'Please sign in': '请登录',
                'Sign In Required': '需要登录',
                'Account not found': '账户不存在',
                'Incorrect password': '密码错误',
                'Login failed': '登录失败',
                'Registration failed': '注册失败',
                'Welcome back': '欢迎回来',
                'Registration successful': '注册成功',
                'Profile updated': '个人资料已更新',
                'Settings saved': '设置已保存',
                'Password changed': '密码已更改',
                'Email sent': '邮件已发送',
                'Invitation sent': '邀请已发送',
                'Thank you': '谢谢您',

                // Specific page messages
                'Loading your medication inventory...': '正在加载您的药物库存...',
                'Please sign in to access your medication inventory.': '请登录以查看您的药物库存。',
                'No medications found': '未找到药物',
                'No appointments scheduled': '未安排预约',
                'No family members added': '未添加家庭成员',
                'No meals logged today': '今天未记录饮食',
                'Add your first medication': '添加您的第一个药物',
                'Schedule your first appointment': '安排您的第一个预约',
                'Invite your first family member': '邀请您的第一位家庭成员',
                'Log your first meal': '记录您的第一餐',

                // Time and date related
                'Today': '今天',
                'Yesterday': '昨天',
                'Tomorrow': '明天',
                'This Week': '本周',
                'Last Week': '上周',
                'Next Week': '下周',
                'This Month': '本月',
                'Last Month': '上月',
                'Next Month': '下月',
                'This Year': '今年',
                'Last Year': '去年',
                'Next Year': '明年',
                'Monday': '星期一',
                'Tuesday': '星期二',
                'Wednesday': '星期三',
                'Thursday': '星期四',
                'Friday': '星期五',
                'Saturday': '星期六',
                'Sunday': '星期日',
                'January': '一月',
                'February': '二月',
                'March': '三月',
                'April': '四月',
                'May': '五月',
                'June': '六月',
                'July': '七月',
                'August': '八月',
                'September': '九月',
                'October': '十月',
                'November': '十一月',
                'December': '十二月',
                'AM': '上午',
                'PM': '下午',
                'Hour': '小时',
                'Minute': '分钟',
                'Second': '秒',
                'Day': '天',
                'Week': '周',
                'Month': '月',
                'Year': '年',
                'Days': '天',
                'Weeks': '周',
                'Months': '月',
                'Years': '年'
            }
        };
    }

    translatePage(language = 'zh') {
        if (language === 'en') {
            // If switching to English, reload the page to restore original text
            location.reload();
            return;
        }

        const translations = this.translations[language];
        if (!translations) {
            console.error('Language not supported:', language);
            return;
        }

        // Find all text nodes and translate them
        this.translateTextNodes(document.body, translations);
        
        // Translate title
        if (document.title && translations[document.title]) {
            document.title = translations[document.title];
        }

        // Update language preference if user is logged in
        this.updateUserLanguagePreference(language);
        
        // Update current language
        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
    }

    translateTextNodes(element, translations) {
        if (element.nodeType === Node.TEXT_NODE) {
            const text = element.textContent.trim();
            if (text && translations[text]) {
                element.textContent = translations[text];
            }
        } else {
            // Recursively translate child nodes
            for (let child of element.childNodes) {
                this.translateTextNodes(child, translations);
            }
        }
    }

    async updateUserLanguagePreference(language) {
        const token = sessionStorage.getItem('authToken');
        if (!token) return;

        try {
            await fetch('/api/users/language', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ language })
            });
        } catch (error) {
            console.error('Error updating language preference:', error);
        }
    }

    // Auto-translate on page load if user has Chinese preference
    async init() {
        try {
            const savedLanguage = localStorage.getItem('preferredLanguage');
            const token = sessionStorage.getItem('authToken');
            
            let userLanguage = 'en';
            
            if (token) {
                // Get user preference from server
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
