// ============ GLOBAL VARIABLES ============
let allContents = [];
let currentLang = 'en';
let currentPage = 'home';
let currentItem = null;
let currentUser = null;

let conversations = {};
let chatHistory = {};
let currentChat = 'default';
let pendingDelete = null;
let isTypingAI = false;

// Quiz variables
let quizQuestions = [];
let currentQuizCategory = null;
let currentQuizIndex = 0;
let quizScore = 0;
let quizActive = false;

// Encyclopedia variables
let encyclopediaEntries = [];

// Calculator state
let calcExpression = "";

// ============ URL LANGUAGE ============
function getLangFromURL() {
    let path = window.location.pathname;
    if (path.startsWith('/ur/') || path === '/ur') return 'ur';
    if (path.startsWith('/ur-roman/') || path === '/ur-roman') return 'ur-roman';
    return 'en';
}

function updateURLFromLang() {
    let path = window.location.pathname;
    let newPath = '';
    if (currentLang === 'en') {
        newPath = path.replace(/^\/(ur|ur-roman)/, '');
        if (newPath === '') newPath = '/';
    } else if (currentLang === 'ur') {
        newPath = '/ur' + (path === '/' ? '' : path);
    } else if (currentLang === 'ur-roman') {
        newPath = '/ur-roman' + (path === '/' ? '' : path);
    }
    if (newPath !== path && window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath);
    }
}

// ============ TRANSLATIONS ============
const translations = {
    en: {
        latest: "Latest from RSM",
        articles: "All Articles",
        videos: "All Videos",
        news: "Latest News",
        mysteries: "Unsolved Mysteries",
        encyclopedia: "Encyclopedia of the Unknown",
        quiz: "Mystery Quiz",
        calculator: "Scientific Calculator",
        ai: "AI Assistant",
        aboutTitle: "About RSM",
        aboutText1: "RSM is a multimedia platform dedicated to exploring mysteries, current events, and untold stories from around the world.",
        aboutText2: "Our mission is to inform, intrigue, and stimulate critical thinking about events that often remain on the margins of traditional information.",
        aboutText3: "We believe in the power of curiosity and the importance of looking beyond the surface to uncover the truth.",
        articlesLabel: "Articles",
        videosLabel: "Videos",
        newsLabel: "News",
        mysteriesLabel: "Mysteries",
        encyclopediaLabel: "Entries",
        languagesLabel: "Languages",
        contactsTitle: "Get in Touch",
        emailTitle: "Email",
        emailDesc: "Response within 24 hours",
        phoneTitle: "Phone",
        phoneDesc: "Mon-Fri, 9AM-6PM CET",
        locationTitle: "Location",
        locationDesc: "Digital headquarters",
        businessTitle: "Business Inquiries",
        businessText: "For partnerships, advertising, or media inquiries, please contact us at",
        aiWelcome: "🤖 Hello! I'm your RSM AI Assistant. Ask me anything! I can search Wikipedia, summarize articles, calculate, and answer questions.",
        aiPlaceholder: "Ask me anything...",
        article: "Article",
        video: "Video",
        news: "News",
        mystery: "Mystery",
        login: "Sign in",
        logout: "Logout",
        deleteConfirm: "Delete this conversation?",
        yes: "Yes",
        no: "Cancel",
        typing: "AI is thinking",
        searchPlaceholder: "Search...",
        chats: "Conversations",
        stopMessage: "✋ Stopped typing. What else can I help you with?",
        waitMessage: "⏳ Please wait, I'm still writing...",
        searchEncyclopedia: "Search encyclopedia...",
        searchBtn: "Search",
        nextQuestion: "Next Question",
        selectCategory: "Select a quiz category",
        quizComplete: "Quiz Complete!",
        yourScore: "Your score: ",
        outOf: " out of ",
        correct: "Correct!",
        incorrect: "Incorrect. The correct answer was: ",
        voiceNotSupported: "❌ Speech recognition not supported in this browser. Try Chrome, Edge, or Safari.",
        voiceListening: "🎤 Listening... Speak now",
        voiceSuccess: "✅ Speech recognized! Check and press send.",
        voiceNoSpeech: "No speech detected. Please try again.",
        voiceNoMic: "No microphone found. Please check your microphone.",
        voiceDenied: "Microphone access denied. Please allow microphone access.",
        voiceNetwork: "Network error. Please check your connection."
    },
    ur: {
        latest: "آر ایس ایم سے تازہ ترین",
        articles: "تمام مضامین",
        videos: "تمام ویڈیوز",
        news: "تازہ ترین خبریں",
        mysteries: "حل طلب معمہ",
        encyclopedia: "نامعلوم کا انسائیکلوپیڈیا",
        quiz: "معمہ کوئز",
        calculator: "سائنسی کیلکولیٹر",
        ai: "اے آئی اسسٹنٹ",
        aboutTitle: "آر ایس ایم کے بارے میں",
        aboutText1: "آر ایس ایم ایک ملٹی میڈیا پلیٹ فارم ہے جو دنیا بھر سے پراسرار واقعات، حالات اور ان کہی کہانیوں کی تلاش کے لیے وقف ہے۔",
        aboutText2: "ہمارا مشن روایتی معلومات کے کناروں پر رہنے والے واقعات کے بارے میں آگاہی، تجسس اور تنقیدی سوچ کو فروغ دینا ہے۔",
        aboutText3: "ہم تجسس کی طاقت اور حقیقت کو دریافت کرنے کے لیے سطح سے آگے دیکھنے کی اہمیت پر یقین رکھتے ہیں۔",
        articlesLabel: "مضامین",
        videosLabel: "ویڈیوز",
        newsLabel: "خبریں",
        mysteriesLabel: "معمہ",
        encyclopediaLabel: "اندراجات",
        languagesLabel: "زبانیں",
        contactsTitle: "رابطہ کریں",
        emailTitle: "ای میل",
        emailDesc: "24 گھنٹے میں جواب",
        phoneTitle: "فون",
        phoneDesc: "پیر تا جمعہ، صبح 9 تا شام 6",
        locationTitle: "مقام",
        locationDesc: "ڈیجیٹل ہیڈ کوارٹر",
        businessTitle: "کاروباری انکوائریز",
        businessText: "شراکت داری، تشہیر، یا میڈیا انکوائریز کے لیے، براہ کرم ہم سے رابطہ کریں",
        aiWelcome: "🤖 السلام علیکم! میں آر ایس ایم اے آئی اسسٹنٹ ہوں۔ مجھ سے کچھ بھی پوچھیں!",
        aiPlaceholder: "مجھ سے کچھ پوچھیں...",
        article: "مضمون",
        video: "ویڈیو",
        news: "خبر",
        mystery: "معمہ",
        login: "سائن ان",
        logout: "لاگ آؤٹ",
        deleteConfirm: "کیا آپ یہ گفتگو حذف کرنا چاہتے ہیں؟",
        yes: "ہاں",
        no: "نہیں",
        typing: "اے آئی سوچ رہی ہے",
        searchPlaceholder: "تلاش کریں...",
        chats: "گفتگو",
        stopMessage: "✋ ٹائپنگ روک دی گئی۔ اور کیا مدد چاہیے؟",
        waitMessage: "⏳ براہ کرم انتظار کریں، میں ابھی لکھ رہا ہوں۔",
        searchEncyclopedia: "انسائیکلوپیڈیا تلاش کریں...",
        searchBtn: "تلاش کریں",
        nextQuestion: "اگلا سوال",
        selectCategory: "کوئز کیٹیگری منتخب کریں",
        quizComplete: "کوئز مکمل!",
        yourScore: "آپ کا اسکور: ",
        outOf: " میں سے ",
        correct: "صحیح!",
        incorrect: "غلط۔ صحیح جواب تھا: ",
        voiceNotSupported: "❌ اس براؤزر میں اسپیچ ریکگنیشن سپورٹ نہیں ہے۔ کروم، ایج، یا سفاری استعمال کریں۔",
        voiceListening: "🎤 سن رہا ہوں... اب بولیں",
        voiceSuccess: "✅ تقریر پہچان لی گئی! چیک کریں اور بھیجیں۔",
        voiceNoSpeech: "کوئی تقریر نہیں سنی گئی۔ براہ کرم دوبارہ کوشش کریں۔",
        voiceNoMic: "مائیکروفون نہیں ملا۔ براہ کرم اپنا مائیکروفون چیک کریں۔",
        voiceDenied: "مائیکروفون تک رسائی سے انکار کر دیا گیا۔ براہ کرم مائیکروفون کی اجازت دیں۔",
        voiceNetwork: "نیٹ ورک کی خرابی۔ براہ کرم اپنا کنیکشن چیک کریں۔"
    },
    "ur-roman": {
        latest: "RSM se taaza tareen",
        articles: "Tamam mazameen",
        videos: "Tamam videos",
        news: "Taaza tareen khabrein",
        mysteries: "Hal talab mamay",
        encyclopedia: "Namaloom ka encyclopedia",
        quiz: "Mamya quiz",
        calculator: "Scientific calculator",
        ai: "AI Assistant",
        aboutTitle: "RSM ke baare mein",
        aboutText1: "RSM aik multimedia platform hai jo duniya bhar se pur-asrar waqiat, halaat aur an kahi kahaniyon ki talaash ke liye waqf hai.",
        aboutText2: "Hamara mission rawaiyati maloomat ke kinaron par rehne wale waqiat ke baare mein aagahi, tajassus aur tanqeedi soch ko farogh dena hai.",
        aboutText3: "Hum tajassus ki taaqat aur haqeeqat ko daryaft karne ke liye satah se aage dekhne ki ahmiyat par yaqeen rakhte hain.",
        articlesLabel: "Mazameen",
        videosLabel: "Videos",
        newsLabel: "Khabrein",
        mysteriesLabel: "Mamay",
        encyclopediaLabel: "Andarjaat",
        languagesLabel: "Zabanien",
        contactsTitle: "Rabta karein",
        emailTitle: "Email",
        emailDesc: "24 ghanton mein jawab",
        phoneTitle: "Phone",
        phoneDesc: "Peer se Juma, subah 9 se sham 6",
        locationTitle: "Maqam",
        locationDesc: "Digital headquarters",
        businessTitle: "Karobari inquiries",
        businessText: "Sharakat dari, tashheer, ya media inquiries ke liye, barah e karam hum se rabta karein",
        aiWelcome: "🤖 Assalam-o-Alaikum! Main RSM AI Assistant hoon. Mujh se kuch bhi poochiye!",
        aiPlaceholder: "Mujh se kuch poochiye...",
        article: "Mazmoon",
        video: "Video",
        news: "Khabar",
        mystery: "Mamya",
        login: "Sign in",
        logout: "Logout",
        deleteConfirm: "Kya aap yeh guftagu delete karna chahte hain?",
        yes: "Haan",
        no: "Nahi",
        typing: "AI soch rahi hai",
        searchPlaceholder: "Talaash karein...",
        chats: "Guftagu",
        stopMessage: "✋ Typing rok di gayi. Aur kya madad chahiye?",
        waitMessage: "⏳ Barah e karam intezar karein, main abhi likh raha hoon.",
        searchEncyclopedia: "Encyclopedia talaash karein...",
        searchBtn: "Talaash karein",
        nextQuestion: "Agla sawal",
        selectCategory: "Quiz category muntakhib karein",
        quizComplete: "Quiz mukammal!",
        yourScore: "Aap ka score: ",
        outOf: " mein se ",
        correct: "Sahi!",
        incorrect: "Ghalat. Sahi jawab tha: ",
        voiceNotSupported: "❌ Is browser mein speech recognition support nahi hai. Chrome, Edge, ya Safari use karein.",
        voiceListening: "🎤 Sun raha hoon... Ab boliye",
        voiceSuccess: "✅ Taqreer pehchan li gayi! Check karein aur bhejein.",
        voiceNoSpeech: "Koi taqreer nahi suni gayi. Barah e karam dobara koshish karein.",
        voiceNoMic: "Microphone nahi mila. Barah e karam apna microphone check karein.",
        voiceDenied: "Microphone tak rasai se inkar kar diya gaya. Barah e karam microphone ki ijazat dein.",
        voiceNetwork: "Network ki khharabi. Barah e karam apna connection check karein."
    }
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
    currentLang = getLangFromURL();
    await fetchData();
    setupEvents();
    applyLang(currentLang);
    loadHash();
    loadChats();
    createModal();
    initCalculator();
    window.addEventListener('hashchange', loadHash);
});

async function fetchData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        
        allContents = [
            ...(data.articles || []),
            ...(data.videos || []),
            ...(data.news || []),
            ...(data.mysteries || [])
        ];
        
        quizQuestions = data.quiz || [];
        encyclopediaEntries = data.encyclopedia || [];
        
        renderAll();
        updateStats();
    } catch(e) { 
        console.error('Error loading data:', e);
        showFallbackData();
    }
}

function showFallbackData() {
    allContents = [
        { id: "sample1", type: "article", category: "Mysteries", date: "2025-01-01", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800", translations: { en: { title: "Sample Article", excerpt: "This is a sample article.", content: "<p>Sample content.</p>" } } }
    ];
    encyclopediaEntries = [
        { translations: { en: { title: "Sample Entry", description: "This is a sample encyclopedia entry." } } }
    ];
    renderAll();
    updateStats();
}

function renderAll() {
    renderDashboard();
    renderHome();
    renderArticles();
    renderVideos();
    renderNews();
    renderMysteries();
    renderEncyclopedia();
    renderQuizCategories();
}

function renderDashboard() {
    const dashboard = document.getElementById('dashboardGrid');
    if (!dashboard) return;
    
    const items = [
        { icon: "fa-newspaper", name: "Articles", page: "articles", desc: "Read investigations" },
        { icon: "fa-play-circle", name: "Videos", page: "videos", desc: "Watch content" },
        { icon: "fa-bullhorn", name: "News", page: "news", desc: "Stay updated" },
        { icon: "fa-moon", name: "Mysteries", page: "mysteries", desc: "Unsolved cases" },
        { icon: "fa-book", name: "Encyclopedia", page: "encyclopedia", desc: "Knowledge base" },
        { icon: "fa-question-circle", name: "Quiz", page: "quiz", desc: "Test knowledge" },
        { icon: "fa-calculator", name: "Calculator", page: "calculator", desc: "Scientific tools" },
        { icon: "fa-brain", name: "AI", page: "ai", desc: "Your assistant" }
    ];
    
    dashboard.innerHTML = items.map(item => `
        <div class="dashboard-card" data-page="${item.page}">
            <i class="fas ${item.icon}"></i>
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
        </div>
    `).join('');
    
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.onclick = () => showPage(card.dataset.page);
    });
}

function renderHome() {
    const articles = allContents.filter(c => c.type === 'article').sort((a,b) => new Date(b.date) - new Date(a.date));
    const videos = allContents.filter(c => c.type === 'video').sort((a,b) => new Date(b.date) - new Date(a.date));
    const news = allContents.filter(c => c.type === 'news').sort((a,b) => new Date(b.date) - new Date(a.date));
    
    const t = translations[currentLang];
    const html = `
        ${articles[0] ? `<div class="card" data-id="${articles[0].id}">
            <img class="card-img" src="${articles[0].image}">
            <div class="card-content">
                <h3>${getText(articles[0], 'title')}</h3>
                <p>${(getText(articles[0], 'excerpt') || '').substring(0, 100)}...</p>
                <div class="card-meta"><span><i class="fas fa-newspaper"></i> ${t.article}</span><span><i class="far fa-calendar"></i> ${formatDate(articles[0].date)}</span></div>
            </div>
        </div>` : ''}
        ${videos[0] ? `<div class="card" data-id="${videos[0].id}">
            <img class="card-img" src="${videos[0].image}">
            <div class="card-content">
                <h3>${getText(videos[0], 'title')}</h3>
                <p>${(getText(videos[0], 'excerpt') || '').substring(0, 100)}...</p>
                <div class="card-meta"><span><i class="fas fa-play-circle"></i> ${t.video}</span><span><i class="far fa-calendar"></i> ${formatDate(videos[0].date)}</span></div>
            </div>
        </div>` : ''}
        ${news[0] ? `<div class="card" data-id="${news[0].id}">
            <img class="card-img" src="${news[0].image}">
            <div class="card-content">
                <h3>${getText(news[0], 'title')}</h3>
                <p>${(getText(news[0], 'excerpt') || '').substring(0, 100)}...</p>
                <div class="card-meta"><span><i class="fas fa-bullhorn"></i> ${t.news}</span><span><i class="far fa-calendar"></i> ${formatDate(news[0].date)}</span></div>
            </div>
        </div>` : ''}
    `;
    document.getElementById('latestGrid').innerHTML = html;
    document.querySelectorAll('#latestGrid .card').forEach(c => c.onclick = () => openContent(c.dataset.id));
}

function renderArticles() {
    const items = allContents.filter(c => c.type === 'article');
    document.getElementById('articlesGrid').innerHTML = items.map(i => createCard(i)).join('');
    attachCardEvents('articlesGrid');
}

function renderVideos() {
    const items = allContents.filter(c => c.type === 'video');
    document.getElementById('videosGrid').innerHTML = items.map(i => createCard(i)).join('');
    attachCardEvents('videosGrid');
}

function renderNews() {
    const items = allContents.filter(c => c.type === 'news');
    document.getElementById('newsGrid').innerHTML = items.map(i => createCard(i)).join('');
    attachCardEvents('newsGrid');
}

function renderMysteries() {
    const items = allContents.filter(c => c.type === 'mystery');
    document.getElementById('mysteriesGrid').innerHTML = items.map(i => createCard(i)).join('');
    attachCardEvents('mysteriesGrid');
}

function createCard(item) {
    const t = translations[currentLang];
    const typeIcon = item.type === 'article' ? 'fa-newspaper' : (item.type === 'video' ? 'fa-play-circle' : (item.type === 'news' ? 'fa-bullhorn' : 'fa-moon'));
    const typeLabel = item.type === 'article' ? t.article : (item.type === 'video' ? t.video : (item.type === 'news' ? t.news : t.mystery));
    return `
        <div class="card" data-id="${item.id}">
            <img class="card-img" src="${item.image}">
            <div class="card-content">
                <h3>${getText(item, 'title')}</h3>
                <p>${(getText(item, 'excerpt') || '').substring(0, 100)}...</p>
                <div class="card-meta"><span><i class="fas ${typeIcon}"></i> ${typeLabel}</span><span><i class="far fa-calendar"></i> ${formatDate(item.date)}</span></div>
            </div>
        </div>
    `;
}

function getText(item, field) {
    if (item.translations && item.translations[currentLang] && item.translations[currentLang][field]) {
        return item.translations[currentLang][field];
    }
    return item[field] || '';
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString(currentLang === 'ur' ? 'ur-PK' : 'en-US');
}

function attachCardEvents(gridId) {
    document.querySelectorAll(`#${gridId} .card`).forEach(c => c.onclick = () => openContent(c.dataset.id));
}

function openContent(id) {
    const item = allContents.find(c => c.id === id);
    if (!item) return;
    currentItem = item;
    location.hash = `single/${id}`;
    
    const t = translations[currentLang];
    const typeIcon = item.type === 'article' ? 'fa-newspaper' : (item.type === 'video' ? 'fa-play-circle' : (item.type === 'news' ? 'fa-bullhorn' : 'fa-moon'));
    const typeLabel = item.type === 'article' ? t.article : (item.type === 'video' ? t.video : (item.type === 'news' ? t.news : t.mystery));
    
    document.getElementById('singleTitle').innerHTML = getText(item, 'title');
    document.getElementById('singleMeta').innerHTML = `<div class="card-meta"><span><i class="fas ${typeIcon}"></i> ${typeLabel}</span><span><i class="far fa-calendar"></i> ${formatDate(item.date)}</span></div>`;
    
    const media = document.getElementById('singleMedia');
    if (item.type === 'video' && item.videoUrl) {
        let vid = item.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (vid) {
            media.innerHTML = `<iframe src="https://www.youtube.com/embed/${vid[1]}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            media.innerHTML = `<div class="video-error"><p>Video not available</p><a href="${item.videoUrl}" target="_blank">Watch on YouTube <i class="fab fa-youtube"></i></a></div>`;
        }
    } else {
        media.innerHTML = `<img src="${item.image}" alt="${getText(item, 'title')}">`;
    }
    
    document.getElementById('singleContent').innerHTML = getText(item, 'content') || '';
    showPage('single');
}

function updateStats() {
    const articlesCount = allContents.filter(c => c.type === 'article').length;
    const videosCount = allContents.filter(c => c.type === 'video').length;
    const newsCount = allContents.filter(c => c.type === 'news').length;
    const mysteriesCount = allContents.filter(c => c.type === 'mystery').length;
    
    document.getElementById('heroStats').innerHTML = `
        <div class="stat"><span class="stat-number">${articlesCount}</span><span class="stat-label">Articles</span></div>
        <div class="stat"><span class="stat-number">${videosCount}</span><span class="stat-label">Videos</span></div>
        <div class="stat"><span class="stat-number">${newsCount}</span><span class="stat-label">News</span></div>
        <div class="stat"><span class="stat-number">${mysteriesCount}</span><span class="stat-label">Mysteries</span></div>
    `;
    
    document.getElementById('aboutStats').innerHTML = `
        <div class="stat"><span class="stat-number">${articlesCount}</span><span class="stat-label">Articles</span></div>
        <div class="stat"><span class="stat-number">${videosCount}</span><span class="stat-label">Videos</span></div>
        <div class="stat"><span class="stat-number">${newsCount}</span><span class="stat-label">News</span></div>
        <div class="stat"><span class="stat-number">${mysteriesCount}</span><span class="stat-label">Mysteries</span></div>
    `;
}

// ============ ENCYCLOPEDIA ============
function renderEncyclopedia() {
    const container = document.getElementById('encyclopediaResults');
    if (!container) return;
    
    container.innerHTML = encyclopediaEntries.map(entry => {
        const trans = entry.translations?.[currentLang] || entry.translations?.en || { title: "Unknown", description: "No description available" };
        return `
            <div class="encyclopedia-item">
                <h3>${trans.title}</h3>
                <p>${trans.description}</p>
            </div>
        `;
    }).join('');
}

function initEncyclopedia() {
    const searchBtn = document.getElementById('encyclopediaSearchBtn');
    const searchInput = document.getElementById('encyclopediaSearch');
    
    searchBtn?.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase().trim();
        const container = document.getElementById('encyclopediaResults');
        if (!query) {
            renderEncyclopedia();
            return;
        }
        const filtered = encyclopediaEntries.filter(entry => {
            const trans = entry.translations?.[currentLang] || entry.translations?.en || { title: "", description: "" };
            return trans.title.toLowerCase().includes(query) || trans.description.toLowerCase().includes(query);
        });
        container.innerHTML = filtered.map(entry => {
            const trans = entry.translations?.[currentLang] || entry.translations?.en || { title: "Unknown", description: "No description available" };
            return `
                <div class="encyclopedia-item">
                    <h3>${trans.title}</h3>
                    <p>${trans.description}</p>
                </div>
            `;
        }).join('');
    });
    
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });
}

// ============ QUIZ ============
function renderQuizCategories() {
    const container = document.getElementById('quizCategories');
    if (!container) return;
    
    if (!quizQuestions.length) {
        container.innerHTML = '<p>Loading quiz categories...</p>';
        return;
    }
    
    container.innerHTML = quizQuestions.map(cat => {
        const catTrans = cat.translations?.[currentLang] || { category: cat.category };
        return `
            <div class="quiz-category" data-category="${cat.category}">
                <i class="fas ${cat.icon || 'fa-question-circle'}"></i>
                <h3>${catTrans.category}</h3>
                <p>${cat.questions.length} questions</p>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.quiz-category').forEach(cat => {
        cat.onclick = () => startQuiz(cat.dataset.category);
    });
}

function startQuiz(categoryName) {
    const category = quizQuestions.find(c => c.category === categoryName);
    if (!category) return;
    
    currentQuizCategory = categoryName;
    currentQuizIndex = 0;
    quizScore = 0;
    quizActive = true;
    
    document.getElementById('quizCategories').style.display = 'none';
    document.getElementById('quizArea').style.display = 'block';
    
    showQuizQuestion();
}

function showQuizQuestion() {
    const category = quizQuestions.find(c => c.category === currentQuizCategory);
    if (!category || currentQuizIndex >= category.questions.length) {
        endQuiz();
        return;
    }
    
    const q = category.questions[currentQuizIndex];
    const trans = q.translations?.[currentLang] || q.translations?.en || { question: q.question, options: q.options, explanation: q.explanation };
    const t = translations[currentLang];
    
    document.getElementById('quizQuestion').innerHTML = `<h3>${currentQuizIndex + 1}. ${trans.question}</h3>`;
    document.getElementById('quizOptions').innerHTML = trans.options.map((opt, idx) => `
        <div class="quiz-option" data-opt="${idx}">${opt}</div>
    `).join('');
    document.getElementById('quizResult').innerHTML = '';
    
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.onclick = () => checkQuizAnswer(parseInt(opt.dataset.opt));
    });
}

function checkQuizAnswer(selected) {
    const category = quizQuestions.find(c => c.category === currentQuizCategory);
    const q = category.questions[currentQuizIndex];
    const trans = q.translations?.[currentLang] || q.translations?.en || { options: q.options, explanation: q.explanation };
    const t = translations[currentLang];
    const isCorrect = selected === q.correct;
    
    if (isCorrect) {
        quizScore++;
        document.getElementById('quizResult').innerHTML = `<p style="color: #4ade80;">✅ ${t.correct}</p>`;
    } else {
        document.getElementById('quizResult').innerHTML = `<p style="color: #ef4444;">❌ ${t.incorrect} ${trans.options[q.correct]}</p>`;
    }
    
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (parseInt(opt.dataset.opt) === q.correct) {
            opt.classList.add('correct');
        }
        if (parseInt(opt.dataset.opt) === selected && !isCorrect) {
            opt.classList.add('wrong');
        }
    });
    
    document.getElementById('nextQuizBtn').onclick = () => {
        currentQuizIndex++;
        if (currentQuizIndex < category.questions.length) {
            showQuizQuestion();
        } else {
            endQuiz();
        }
    };
}

function endQuiz() {
    const category = quizQuestions.find(c => c.category === currentQuizCategory);
    const t = translations[currentLang];
    const total = category ? category.questions.length : 0;
    
    document.getElementById('quizQuestion').innerHTML = `<h3>${t.quizComplete}</h3>`;
    document.getElementById('quizOptions').innerHTML = '';
    document.getElementById('quizResult').innerHTML = `<p style="color: #e50914; font-size: 1.2rem;">${t.yourScore} ${quizScore}${t.outOf}${total}</p>`;
    document.getElementById('nextQuizBtn').innerHTML = '← Back to Categories';
    document.getElementById('nextQuizBtn').onclick = () => {
        document.getElementById('quizCategories').style.display = 'grid';
        document.getElementById('quizArea').style.display = 'none';
        quizActive = false;
        renderQuizCategories();
    };
}

// ============ CALCULATOR ============
function initCalculator() {
    const display = document.getElementById('calcDisplay');
    const buttons = document.querySelectorAll('.calc-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            if (val === 'C') {
                calcExpression = '';
                display.value = '';
            } else if (val === '=') {
                try {
                    let expr = calcExpression.replace(/×/g, '*').replace(/÷/g, '/');
                    const result = eval(expr);
                    display.value = result;
                    calcExpression = result.toString();
                } catch(e) {
                    display.value = 'Error';
                    calcExpression = '';
                }
            } else if (val === 'sqrt') {
                try {
                    const num = parseFloat(calcExpression);
                    const result = Math.sqrt(num);
                    display.value = result;
                    calcExpression = result.toString();
                } catch(e) {
                    display.value = 'Error';
                }
            } else if (val === 'pow') {
                try {
                    const num = parseFloat(calcExpression);
                    const result = num * num;
                    display.value = result;
                    calcExpression = result.toString();
                } catch(e) {
                    display.value = 'Error';
                }
            } else if (val === '%') {
                try {
                    const num = parseFloat(calcExpression);
                    const result = num / 100;
                    display.value = result;
                    calcExpression = result.toString();
                } catch(e) {
                    display.value = 'Error';
                }
            } else {
                calcExpression += val;
                display.value = calcExpression;
            }
        });
    });
}

// ============ PAGE NAVIGATION ============
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const activePage = document.getElementById(page);
    if (activePage) activePage.classList.remove('hidden');
    currentPage = page;
    
    document.querySelectorAll('.nav-links a, .side-nav a').forEach(link => {
        if (link.dataset.page === page) link.classList.add('active');
        else link.classList.remove('active');
    });
    
    if (page === 'ai') refreshChat();
    if (page === 'encyclopedia') renderEncyclopedia();
    if (page === 'quiz') {
        document.getElementById('quizCategories').style.display = 'grid';
        document.getElementById('quizArea').style.display = 'none';
        renderQuizCategories();
    }
}

function loadHash() {
    let hash = location.hash.slice(1);
    if (hash.startsWith('single/')) {
        let id = hash.split('/')[1];
        let item = allContents.find(c => c.id === id);
        if (item) openContent(id);
        return;
    }
    const validPages = ['home', 'articles', 'videos', 'news', 'mysteries', 'encyclopedia', 'quiz', 'calculator', 'ai', 'about', 'contacts'];
    if (validPages.includes(hash)) showPage(hash);
    else showPage('home');
}

// ============ VOICE RECOGNITION ============
let voiceStatusDiv = null;

function showVoiceStatus(message, isError = false) {
    if (voiceStatusDiv) {
        voiceStatusDiv.remove();
    }
    
    voiceStatusDiv = document.createElement('div');
    voiceStatusDiv.className = 'voice-status';
    voiceStatusDiv.innerHTML = `
        <i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-microphone-alt'}"></i>
        <span class="status-text">${message}</span>
    `;
    document.body.appendChild(voiceStatusDiv);
    
    setTimeout(() => {
        if (voiceStatusDiv) {
            voiceStatusDiv.remove();
            voiceStatusDiv = null;
        }
    }, 3000);
}

function startVoiceRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showVoiceStatus(translations[currentLang].voiceNotSupported, true);
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'ur' ? 'ur-PK' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;
    
    voiceBtn.classList.add('recording');
    voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.classList.add('voice-active');
    }
    
    showVoiceStatus(translations[currentLang].voiceListening);
    
    recognition.start();
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcribed:', transcript);
        
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        if (aiInput) {
            aiInput.classList.remove('voice-active');
            aiInput.value = transcript;
            aiInput.focus();
            
            aiInput.style.borderColor = '#4ade80';
            setTimeout(() => {
                aiInput.style.borderColor = '';
            }, 1000);
        }
        
        showVoiceStatus(translations[currentLang].voiceSuccess);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        if (aiInput) {
            aiInput.classList.remove('voice-active');
        }
        
        let errorMessage = translations[currentLang].voiceNotSupported;
        if (event.error === 'no-speech') {
            errorMessage = translations[currentLang].voiceNoSpeech;
        } else if (event.error === 'audio-capture') {
            errorMessage = translations[currentLang].voiceNoMic;
        } else if (event.error === 'not-allowed') {
            errorMessage = translations[currentLang].voiceDenied;
        } else if (event.error === 'network') {
            errorMessage = translations[currentLang].voiceNetwork;
        }
        
        showVoiceStatus(errorMessage, true);
    };
    
    recognition.onend = () => {
        if (voiceBtn.classList.contains('recording')) {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            if (aiInput) {
                aiInput.classList.remove('voice-active');
            }
        }
    };
}

// ============ EVENT LISTENERS ============
function setupEvents() {
    document.querySelectorAll('.nav-links a, .side-nav a').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            let page = link.dataset.page;
            if (page) {
                location.hash = page;
                showPage(page);
                closeMenu();
            }
        };
    });
    
    const hamburger = document.getElementById('hamburgerBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    
    hamburger?.addEventListener('click', () => sideMenu.classList.add('open'));
    closeMenuBtn?.addEventListener('click', () => sideMenu.classList.remove('open'));
    document.addEventListener('click', (e) => {
        if (!sideMenu?.contains(e.target) && !hamburger?.contains(e.target)) {
            sideMenu?.classList.remove('open');
        }
    });
    
    document.getElementById('backBtn')?.addEventListener('click', () => {
        location.hash = currentPage;
        showPage(currentPage);
    });
    
    document.getElementById('langBtn')?.addEventListener('click', () => document.querySelector('.lang-dropdown')?.classList.toggle('show'));
    document.querySelectorAll('.lang-dropdown button').forEach(btn => {
        btn.onclick = () => {
            changeLang(btn.dataset.lang);
            document.querySelector('.lang-dropdown').classList.remove('show');
        };
    });
    
    // VOICE BUTTON - IMPORTANT: Make sure this is called
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', startVoiceRecording);
        console.log('Voice button initialized');
    } else {
        console.error('Voice button not found!');
    }
    
    // Search
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchInput && searchDropdown) {
        searchInput.addEventListener('input', (e) => {
            let q = e.target.value.toLowerCase().trim();
            if (!q) {
                searchDropdown.classList.remove('show');
                return;
            }
            let results = allContents.filter(item => {
                let title = getText(item, 'title').toLowerCase();
                return title.includes(q);
            }).slice(0, 6);
            
            if (!results.length) {
                searchDropdown.classList.remove('show');
                return;
            }
            
            searchDropdown.innerHTML = results.map(item => `
                <div class="search-item" data-id="${item.id}">
                    <div><strong>${getText(item, 'title')}</strong></div>
                    <small style="color: #e50914">${item.type === 'article' ? '📰 Article' : (item.type === 'video' ? '🎬 Video' : (item.type === 'news' ? '📢 News' : '🌙 Mystery'))}</small>
                </div>
            `).join('');
            
            searchDropdown.querySelectorAll('.search-item').forEach(el => {
                el.onclick = () => {
                    openContent(el.dataset.id);
                    searchDropdown.classList.remove('show');
                    searchInput.value = '';
                };
            });
            searchDropdown.classList.add('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.remove('show');
            }
        });
    }
    
    document.getElementById('aiSendBtn')?.addEventListener('click', sendMsg);
    document.getElementById('aiInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });
    document.querySelectorAll('.suggestion').forEach(s => s.onclick = () => {
        document.getElementById('aiInput').value = s.dataset.query;
        sendMsg();
    });
    document.getElementById('newChatBtn')?.addEventListener('click', newChat);
    document.getElementById('editTitleBtn')?.addEventListener('click', editTitle);
    
    document.getElementById('loginBtn')?.addEventListener('click', login);
    document.getElementById('sideLoginBtn')?.addEventListener('click', login);
    
    if (window.onAuthStateChanged) {
        window.onAuthStateChanged(window.auth, (user) => {
            currentUser = user;
            updateUserUI(user);
            if (user) loadUserChats(user.uid);
            else loadChats();
        });
    }
    
    document.querySelector('.scroll-hint')?.addEventListener('click', () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    });
    
    initEncyclopedia();
}

function closeMenu() { document.getElementById('sideMenu')?.classList.remove('open'); }

// ============ LANGUAGE ============
function changeLang(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem('rsm_lang', lang);
    updateURLFromLang();
    applyLang(lang);
    renderAll();
    if (currentItem) openContent(currentItem.id);
    if (currentPage === 'ai') refreshChat();
    if (currentPage === 'encyclopedia') renderEncyclopedia();
    if (currentPage === 'quiz') renderQuizCategories();
}

function applyLang(lang) {
    let t = translations[lang];
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.innerHTML = `🌐 ${lang === 'ur' ? 'اردو' : (lang === 'ur-roman' ? 'UR' : 'EN')} <i class="fas fa-chevron-down"></i>`;
    }
    const aiInput = document.getElementById('aiInput');
    if (aiInput) aiInput.placeholder = t.aiPlaceholder;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    const encSearch = document.getElementById('encyclopediaSearch');
    if (encSearch) encSearch.setAttribute('placeholder', t.searchEncyclopedia);
    const encBtn = document.getElementById('encyclopediaSearchBtn');
    if (encBtn) encBtn.innerHTML = `<i class="fas fa-search"></i> ${t.searchBtn}`;
    const nextBtn = document.getElementById('nextQuizBtn');
    if (nextBtn) nextBtn.innerHTML = t.nextQuestion;
    
    const homeHeader = document.querySelector('#home .section-header h2');
    if (homeHeader) homeHeader.innerHTML = t.latest;
    const articlesHeader = document.querySelector('#articles .section-header h2');
    if (articlesHeader) articlesHeader.innerHTML = t.articles;
    const videosHeader = document.querySelector('#videos .section-header h2');
    if (videosHeader) videosHeader.innerHTML = t.videos;
    const newsHeader = document.querySelector('#news .section-header h2');
    if (newsHeader) newsHeader.innerHTML = t.news;
    const mysteriesHeader = document.querySelector('#mysteries .section-header h2');
    if (mysteriesHeader) mysteriesHeader.innerHTML = t.mysteries;
    const encHeader = document.querySelector('#encyclopedia .section-header h2');
    if (encHeader) encHeader.innerHTML = t.encyclopedia;
    const quizHeader = document.querySelector('#quiz .quiz-header h2');
    if (quizHeader) quizHeader.innerHTML = t.quiz;
    const calcHeader = document.querySelector('#calculator .calculator-container h2');
    if (calcHeader) calcHeader.innerHTML = t.calculator;
    const aiSidebarHeader = document.querySelector('#ai .ai-sidebar-header span');
    if (aiSidebarHeader) aiSidebarHeader.innerHTML = `<i class="fas fa-comments"></i> ${t.chats}`;
    
    const aboutCard = document.querySelector('.about-card');
    if (aboutCard) {
        const aboutH2 = aboutCard.querySelector('h2');
        if (aboutH2) aboutH2.textContent = t.aboutTitle;
        const ps = aboutCard.querySelectorAll('p');
        if (ps[0]) ps[0].textContent = t.aboutText1;
        if (ps[1]) ps[1].textContent = t.aboutText2;
        if (ps[2]) ps[2].textContent = t.aboutText3;
    }
    
    const contactsH2 = document.querySelector('#contacts h2');
    if (contactsH2) contactsH2.textContent = t.contactsTitle;
    const contactCards = document.querySelectorAll('.contact-card');
    if (contactCards[0]) {
        const h3 = contactCards[0].querySelector('h3');
        if (h3) h3.textContent = t.emailTitle;
        const p = contactCards[0].querySelector('p');
        if (p) p.textContent = t.emailDesc;
    }
    if (contactCards[1]) {
        const h3 = contactCards[1].querySelector('h3');
        if (h3) h3.textContent = t.phoneTitle;
        const p = contactCards[1].querySelector('p');
        if (p) p.textContent = t.phoneDesc;
    }
    if (contactCards[2]) {
        const h3 = contactCards[2].querySelector('h3');
        if (h3) h3.textContent = t.locationTitle;
        const ps = contactCards[2].querySelectorAll('p');
        if (ps[1]) ps[1].textContent = t.locationDesc;
    }
    
    const businessCard = document.querySelector('.business-card');
    if (businessCard) {
        const h3 = businessCard.querySelector('h3');
        if (h3) h3.textContent = t.businessTitle;
        const p = businessCard.querySelector('p');
        if (p) p.innerHTML = `${t.businessText} <strong>rsm260511@gmail.com</strong>`;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const sideLoginBtn = document.getElementById('sideLoginBtn');
    if (loginBtn && !currentUser) loginBtn.innerHTML = `<i class="fab fa-google"></i> ${t.login}`;
    if (sideLoginBtn && !currentUser) sideLoginBtn.innerHTML = `<i class="fab fa-google"></i> ${t.login}`;
}

// ============ LOGIN ============
async function login() {
    if (currentUser) {
        if (window.signOutUser) await window.signOutUser();
        return;
    }
    if (window.signInWithGoogle) {
        let user = await window.signInWithGoogle();
        if (user) {
            currentUser = user;
            updateUserUI(user);
            loadUserChats(user.uid);
            if (currentPage === 'ai') refreshChat();
        }
    }
}

function updateUserUI(user) {
    let t = translations[currentLang];
    document.querySelectorAll('#userName, #sideUserName').forEach(el => {
        el.textContent = user ? (user.displayName || user.email?.split('@')[0] || 'User') : 'Guest';
    });
    document.querySelectorAll('#loginBtn, #sideLoginBtn').forEach(btn => {
        if (user) {
            btn.innerHTML = `<i class="fas fa-sign-out-alt"></i> ${t.logout}`;
        } else {
            btn.innerHTML = `<i class="fab fa-google"></i> ${t.login}`;
        }
        btn.onclick = login;
    });
    if (currentPage === 'ai') refreshChat();
}

// ============ CHATS ============
function loadChats() {
    let key = currentUser ? `rsm_user_${currentUser.uid}` : 'rsm_conversations';
    let saved = localStorage.getItem(key);
    if (saved) { let d = JSON.parse(saved); conversations = d.conversations || {}; chatHistory = d.chatHistory || {}; }
    if (Object.keys(conversations).length === 0) conversations = { default: { title: 'New Chat' } };
    currentChat = Object.keys(conversations)[0];
    renderChatList();
    loadMessages(currentChat);
}

function loadUserChats(uid) { loadChats(); }

function saveChats() {
    let key = currentUser ? `rsm_user_${currentUser.uid}` : 'rsm_conversations';
    localStorage.setItem(key, JSON.stringify({ conversations, chatHistory }));
}

function renderChatList() {
    let container = document.getElementById('chatList');
    if (!container) return;
    container.innerHTML = Object.entries(conversations).map(([id, conv]) => `
        <div class="chat-item ${id === currentChat ? 'active' : ''}" data-id="${id}">
            <span>${conv.title}</span>
            <button class="chat-delete" data-id="${id}"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
    container.querySelectorAll('.chat-item').forEach(el => {
        el.onclick = (e) => { if (!e.target.classList.contains('chat-delete')) switchChat(el.dataset.id); };
        let del = el.querySelector('.chat-delete');
        if (del) del.onclick = (e) => { e.stopPropagation(); pendingDelete = el.dataset.id; showModal(translations[currentLang].deleteConfirm); };
    });
}

function switchChat(id) { currentChat = id; renderChatList(); loadMessages(id); document.getElementById('chatTitle').innerText = conversations[id]?.title || 'Chat'; }

function loadMessages(chatId) {
    let msgs = chatHistory[chatId] || [];
    let container = document.getElementById('aiMessages');
    if (!container) return;
    container.innerHTML = '';
    if (msgs.length === 0) addWelcomeMessage();
    else msgs.forEach(m => addMsg(m.sender, m.text, m.time));
}

function addWelcomeMessage() {
    let userName = currentUser ? (currentUser.displayName || currentUser.email?.split('@')[0] || 'User') : null;
    let welcomeText = translations[currentLang].aiWelcome;
    if (userName) {
        welcomeText = `🤖 Hello **${userName}**! I'm your RSM AI Assistant. Ask me anything!`;
    }
    addMsg('bot', welcomeText, getTime());
}

function addMsg(sender, text, time = getTime()) {
    let container = document.getElementById('aiMessages');
    if (!container) return;
    let div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="msg-bubble">${text.replace(/\n/g, '<br>')}<div class="msg-time"><i class="far fa-clock"></i> ${time}</div></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function refreshChat() { 
    loadMessages(currentChat); 
    document.getElementById('chatTitle').innerText = conversations[currentChat]?.title || 'Chat';
}

function newChat() {
    let id = 'chat_' + Date.now();
    conversations[id] = { title: `New Chat ${new Date().toLocaleTimeString().slice(0,5)}` };
    chatHistory[id] = [];
    saveChats();
    currentChat = id;
    renderChatList();
    loadMessages(id);
    document.getElementById('chatTitle').innerText = conversations[id].title;
}

function deleteChat(id) {
    if (!id || !conversations[id]) {
        closeModal();
        pendingDelete = null;
        return;
    }

    delete conversations[id];
    delete chatHistory[id];
    saveChats();

    if (currentChat === id) {
        let first = Object.keys(conversations)[0];
        if (first) {
            currentChat = first;
            loadMessages(first);
            document.getElementById('chatTitle').innerText = conversations[first]?.title || 'Chat';
        } else {
            newChat();
        }
    }

    renderChatList();
    pendingDelete = null;
    closeModal();
}

function editTitle() {
    if (!currentUser) { alert("Login to edit titles"); return; }
    let newTitle = prompt("New title:", conversations[currentChat]?.title);
    if (newTitle) { conversations[currentChat].title = newTitle.slice(0, 40); saveChats(); renderChatList(); document.getElementById('chatTitle').innerText = newTitle; }
}

function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ============ MODAL ============
function createModal() {
    let modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-content"><p id="modalMsg"></p><div class="modal-buttons"><button id="modalYes" class="confirm-yes">Yes</button><button id="modalNo" class="confirm-no">Cancel</button></div></div>`;
    document.body.appendChild(modal);
    document.getElementById('modalYes').onclick = () => {
        if (pendingDelete) {
            deleteChat(pendingDelete);
        } else {
            closeModal();
        }
        pendingDelete = null;
    };
    document.getElementById('modalNo').onclick = () => { closeModal(); pendingDelete = null; };
}

function showModal(msg) { let m = document.getElementById('confirmModal'); document.getElementById('modalMsg').innerText = msg; m.classList.add('show'); }
function closeModal() { document.getElementById('confirmModal').classList.remove('show'); pendingDelete = null; }

// ============ AI WITH STOP BUTTON ============
async function sendMsg() {
    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg) return;
    
    const time = getTime();
    addMsg('user', msg, time);
    input.value = '';
    
    if (!chatHistory[currentChat]) chatHistory[currentChat] = [];
    chatHistory[currentChat].push({ sender: 'user', text: msg, time });
    saveChats();
    
    const sendBtn = document.getElementById('aiSendBtn');
    sendBtn.innerHTML = '<i class="fas fa-stop"></i>';
    sendBtn.classList.add('stop-btn');
    sendBtn.onclick = stopTyping;
    
    try {
        const response = await getAI(msg);
        const resTime = getTime();
        
        await typewriterEffect(response, (partial) => {
            const lastPartial = document.querySelector('#aiMessages .message.bot[data-typing="true"]');
            if (lastPartial) lastPartial.remove();
            const tempDiv = document.createElement('div');
            tempDiv.className = 'message bot';
            tempDiv.setAttribute('data-typing', 'true');
            tempDiv.innerHTML = `<div class="msg-bubble">${partial.replace(/\n/g, '<br>')}<div class="msg-time"><i class="far fa-clock"></i> ${resTime}</div></div>`;
            document.getElementById('aiMessages').appendChild(tempDiv);
            document.getElementById('aiMessages').scrollTop = document.getElementById('aiMessages').scrollHeight;
        });
        
        const lastPartial = document.querySelector('#aiMessages .message.bot[data-typing="true"]');
        if (lastPartial) lastPartial.remove();
        addMsg('bot', response, resTime);
        
        chatHistory[currentChat].push({ sender: 'bot', text: response, time: resTime });
        saveChats();
        updateTitleFromMsg();
        
    } catch (e) {
        console.error(e);
        addMsg('bot', 'Sorry, an error occurred.', getTime());
    } finally {
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendBtn.classList.remove('stop-btn');
        sendBtn.onclick = sendMsg;
        isTypingAI = false;
    }
}

function stopTyping() {
    if (isTypingAI) {
        isTypingAI = false;
        const typingMsg = document.querySelector('#aiMessages .message.bot[data-typing="true"]');
        if (typingMsg) typingMsg.remove();
        
        const sendBtn = document.getElementById('aiSendBtn');
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendBtn.classList.remove('stop-btn');
        sendBtn.onclick = sendMsg;
        
        addMsg('bot', translations[currentLang].stopMessage, getTime());
    }
}

function typewriterEffect(text, callback) {
    return new Promise((resolve) => {
        let i = 0;
        isTypingAI = true;
        const type = () => {
            if (!isTypingAI) {
                resolve();
                return;
            }
            if (i <= text.length) {
                callback(text.substring(0, i));
                i++;
                setTimeout(type, 20 + Math.random() * 15);
            } else {
                isTypingAI = false;
                resolve();
            }
        };
        type();
    });
}

function updateTitleFromMsg() {
    const firstUser = chatHistory[currentChat]?.find(m => m.sender === 'user');
    if (firstUser && (conversations[currentChat]?.title?.startsWith('New Chat') || conversations[currentChat]?.title?.startsWith('New'))) {
        let newTitle = firstUser.text.slice(0, 28);
        if (newTitle.length > 25) newTitle = newTitle.slice(0, 22) + '...';
        conversations[currentChat].title = newTitle;
        saveChats();
        renderChatList();
        document.getElementById('chatTitle').innerText = newTitle;
    }
}

// ============ AI RESPONSE ============
async function getAI(msg) {
    const lower = msg.toLowerCase().trim();
    
    if (lower.includes('search') || lower.includes('find') || lower.includes('look up') || lower.includes('tell me about') || lower.includes('what is')) {
        let query = msg.replace(/search|find|look up|tell me about|what is/gi, '').trim();
        if (!query) query = msg;
        return await wikiSearch(query);
    }
    
    if (lower.includes('summarize') || lower.includes('summary') || lower.includes('sum up')) {
        if (currentItem) {
            const content = getText(currentItem, 'content');
            if (content) {
                const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
                const summary = sentences.slice(0, 4).join('. ') + '.';
                return `📝 **Summary:**\n\n${summary.substring(0, 600)}...`;
            }
        }
        return "📄 Open an article or video first, then ask me to summarize it!";
    }
    
    if (lower.includes('fact') || lower.includes('fun fact') || lower.includes('tell me a fact')) {
        const facts = [
            "🐝 **Bees** can recognize human faces! They remember you like a friend.",
            "🌌 The **universe** is 13.8 billion years old. That's 13,800,000,000 years!",
            "🐙 **Octopuses** have three hearts! Two pump blood to the gills, one to the rest of the body.",
            "🪐 A day on **Venus** is longer than a year on Venus! It takes 243 Earth days to rotate, but only 225 to orbit the Sun.",
            "🐘 **Elephants** are the only mammals that can't jump. But they can run up to 25 mph!",
            "🍓 **Strawberries** have more vitamin C than oranges!",
            "🦒 **Giraffes** have the same number of neck vertebrae as humans - 7!",
            "🐧 **Penguins** can't fly, but they can swim faster than Olympic swimmers!"
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    }
    
    if (lower.includes('calculate') || lower.includes('calc') || lower.includes('+') || lower.includes('-') || lower.includes('*') || lower.includes('/') || lower.includes('×') || lower.includes('÷')) {
        try {
            let expr = msg.replace(/calculate|calc/gi, '').replace(/×/g, '*').replace(/÷/g, '/');
            const result = eval(expr);
            return `🧮 **Result:** ${result}`;
        } catch(e) {
            return "❌ I couldn't calculate that. Please use numbers and operators (+, -, *, /).";
        }
    }
    
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        const name = currentUser ? currentUser.displayName?.split(' ')[0] || 'friend' : 'friend';
        return `👋 Hello ${name}! How can I help you today?\n\nYou can:\n• Ask me to search Wikipedia\n• Tell me a fun fact\n• Summarize articles\n• Calculate numbers\n• Click the **🎤 microphone** to speak!\n• Ask any question!`;
    }
    
    if (lower.includes('help') || lower.includes('what can you do')) {
        return `🤖 **I can help you with:**\n\n🔍 **Search Wikipedia** - "Search for pyramids"\n📝 **Summarize content** - Open an article and say "Summarize this"\n✨ **Fun facts** - "Tell me a fun fact"\n🧮 **Calculate** - "Calculate 25 * 4"\n🎤 **Voice input** - Click the microphone button to speak!\n💬 **Answer questions** - Ask me anything!\n🌍 **3 languages** - English, Urdu, Roman Urdu\n\nWhat would you like to know?`;
    }
    
    return `🤖 I'm here to help!\n\n**Try these:**\n• "Search Wikipedia for pyramids"\n• "Tell me a fun fact"\n• "Calculate 15 * 8"\n• "What is artificial intelligence?"\n• "Summarize this article" (open one first)\n• Click the **🎤 microphone** to speak!\n\nOr ask me anything!`;
}

async function wikiSearch(q) {
    const lang = currentLang === 'ur' ? 'ur' : 'en';
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*&srlimit=1`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        if (!data.query?.search?.length) {
            return `🔍 No results found for "${q}". Try a different search term.`;
        }
        
        const title = data.query.search[0].title;
        const contentUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`;
        const cRes = await fetch(contentUrl, { signal: controller.signal });
        const cData = await cRes.json();
        
        const pages = cData.query.pages;
        const page = Object.values(pages)[0];
        const extract = page.extract || '';
        const wikiUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
        
        return `📚 **${title}**\n\n${extract.substring(0, 700)}...\n\n🔗 [Read more on Wikipedia](${wikiUrl})`;
    } catch(e) {
        if (e.name === 'AbortError') {
            return "⏰ Search timed out. Please try again.";
        }
        return "⚠️ Wikipedia search failed. Please check your internet connection.";
    }
}
