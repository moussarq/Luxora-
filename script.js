here// إدارة القائمة الجانبية
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

// فتح وإغلاق القائمة الجانبية
menuToggle.addEventListener('click', () => {
    sidebar.style.right = '0';
});

closeSidebar.addEventListener('click', () => {
    sidebar.style.right = '-350px';
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.style.right === '0px') {
        sidebar.style.right = '-350px';
    }
});

// التنقل بين الصفحات
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        
        // تحديث الروابط النشطة
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // إغلاق القائمة الجانبية
        sidebar.style.right = '-350px';
        
        // تبديل الصفحات
        switchPage(pageId);
    });
});

function switchPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // التمرير إلى أعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// زر التمرير لأسفل
const scrollDownBtn = document.getElementById('scrollDownBtn');
const bottomSection = document.getElementById('bottomSection');

scrollDownBtn.addEventListener('click', () => {
    bottomSection.scrollIntoView({ behavior: 'smooth' });
});

// نظام الدعم والدردشة
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const autoResponseModal = document.getElementById('autoResponseModal');
const closeModal = document.getElementById('closeModal');
const confirmBtn = document.getElementById('confirmBtn');

// تخزين محلي للرسائل (كل مستخدم له تخزين منفصل)
let userId = localStorage.getItem('luxora_user_id');
if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('luxora_user_id', userId);
}

// تحميل الرسائل السابقة
loadMessages();

// إرسال رسالة جديدة
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const messageText = messageInput.value.trim();
    if (!messageText) return;
    
    // إضافة رسالة المستخدم
    addMessage(messageText, 'user');
    
    // حفظ الرسالة في التخزين المحلي
    saveMessage(messageText, 'user');
    
    // محو حقل الإدخال
    messageInput.value = '';
    
    // إظهار نافذة الرد التلقائي بعد ثانية
    setTimeout(() => {
        autoResponseModal.style.display = 'flex';
        
        // إضافة رسالة الرد التلقائي
        setTimeout(() => {
            const autoResponse = "برجاء انتظار الدعم سيتم تلقي محادثتك والرد باقرب وقت وشكرا";
            addMessage(autoResponse, 'bot');
            saveMessage(autoResponse, 'bot');
        }, 1000);
    }, 500);
});

// إغلاق نافذة الرد التلقائي
closeModal.addEventListener('click', () => {
    autoResponseModal.style.display = 'none';
});

confirmBtn.addEventListener('click', () => {
    autoResponseModal.style.display = 'none';
});

// إغلاق النافذة عند النقر خارجها
autoResponseModal.addEventListener('click', (e) => {
    if (e.target === autoResponseModal) {
        autoResponseModal.style.display = 'none';
    }
});

// وظيفة إضافة رسالة إلى الدردشة
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    const messageTime = document.createElement('div');
    messageTime.classList.add('message-time');
    
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    messageTime.textContent = timeString;
    
    messageContent.appendChild(messageText);
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    
    chatMessages.appendChild(messageDiv);
    
    // التمرير لأسفل لرؤية الرسالة الجديدة
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// وظيفة حفظ الرسالة في التخزين المحلي
function saveMessage(text, sender) {
    const messages = JSON.parse(localStorage.getItem(`luxora_messages_${userId}`) || '[]');
    
    messages.push({
        text,
        sender,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`luxora_messages_${userId}`, JSON.stringify(messages));
    
    // محاكاة إرسال البريد الإلكتروني إلى المسؤول
    // في تطبيق حقيقي، سيتم هنا إرسال طلب إلى الخادم
    console.log(`تم إرسال رسالة إلى المسؤول: ${text}`);
    console.log(`سيتم إرسالها إلى: moussabn437@gmail.com`);
}

// وظيفة تحميل الرسائل من التخزين المحلي
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem(`luxora_messages_${userId}`) || '[]');
    
    // مسح الرسائل الحالية (عدا رسالة الترحيب)
    const existingMessages = chatMessages.querySelectorAll('.message');
    for (let i = 1; i < existingMessages.length; i++) {
        existingMessages[i].remove();
    }
    
    // تحميل الرسائل المحفوظة
    messages.forEach(msg => {
        addMessage(msg.text, msg.sender);
    });
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تعيين الصفحة النشطة بناءً على الرابط
    const currentPage = window.location.hash.substring(1) || 'home';
    switchPage(currentPage);
    
    // تحديث رابط القائمة الجانبية النشط
    sidebarLinks.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });
});
