// 每天夸你一万遍 - 极简日式版 v3.0
// MUJI风格，大量留白，低饱和度配色

// ==================== 配置 ====================
const CONFIG = {
  colors: {
    bg: '#F5F5F0',
    accent: '#8B7355'
  }
};

// ==================== 夸夸库（日式风格文案）====================
const PRAISE_LIBRARY = {
  // 基础夸夸 - 日式侘寂美学
  base: [
    "今日も一日、お疲れ様でした。",
    "あなたのペースで、大丈夫。",
    "少しずつでいい、前に進んでいる。",
    "今のあなたは、十分素敵です。",
    "無理しなくていい、自分を大切に。",
    "小さなことにも、感謝を忘れずに。",
    "今日という日は、二度と来ない大切な一日。",
    "深呼吸して、リラックスしてください。",
    "あなたの努力は、必ず実を結ぶ。",
    "完璧でなくても、あなたは愛されている。",
    "一歩ずつ、確実に。",
    "今日のあなたは、昨日より輝いている。",
    "疲れたら、休んでいいんだよ。",
    "あなたの存在自体が、かけがえのない価値。",
    "ゆっくりでいい、自分を信じて。"
  ],
  
  // 场景化
  morning: [
    "おはよう。今日も穏やかな一日を。",
    "朝の静けさを、心に刻んで。",
    "新しい一日は、新しい可能性。"
  ],
  work: [
    "集中しているあなたは、美しい。",
    "一つ一つ、丁寧に。",
    "無理は禁物、適度に休憩を。"
  ],
  lunch: [
    "美味しいものを、ゆっくり味わって。",
    "昼下がりの小さな幸せを。"
  ],
  evening: [
    "一日の終わりに、自分を労って。",
    "夕暮れ時の、穏やかな光のように。"
  ],
  night: [
    "夜は休息の時間、心を整えて。",
    "良質な睡眠が、明日の活力に。"
  ],
  weekend: [
    "のんびり過ごす時間も、大切な時間。",
    "週末は自分を振り返る日に。"
  ]
};

// ==================== IndexedDB ====================
const DB_NAME = 'PraiseDB_muji';
const DB_VERSION = 1;

const db = {
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('praises')) {
          db.createObjectStore('praises', { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'key' });
        }
      };
    });
  },

  async save(key, value, storeName = 'profile') {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      store.put({ key, value, timestamp: Date.now() });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  },

  async get(key, storeName = 'profile') {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  },

  async savePraise(date, content) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(['praises'], 'readwrite');
      const store = tx.objectStore('praises');
      store.put({ date, content, timestamp: Date.now() });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  },

  async getPraise(date) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(['praises'], 'readonly');
      const store = tx.objectStore('praises');
      const request = store.get(date);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
};

// ==================== 状态管理 ====================
let currentStep = 1;
const totalSteps = 5;
let profile = {
  nickname: '',
  age: '',
  career: '',
  workMode: '',
  workStart: '09:00',
  workEnd: '18:00',
  pushTime: '09:00'
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', async () => {
  await db.init();
  
  const savedProfile = await db.get('userProfile');
  
  if (savedProfile && savedProfile.nickname) {
    profile = savedProfile;
    showScreen('mainScreen');
    initMainScreen();
  } else {
    showScreen('onboardingScreen');
    initOnboarding();
  }
  
  initSettings();
});

// ==================== 屏幕切换 ====================
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function showStep(stepNum) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${stepNum}`).classList.add('active');
  
  // 更新dots
  document.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === stepNum - 1);
  });
  
  currentStep = stepNum;
}

// ==================== 引导页逻辑 ====================
function initOnboarding() {
  // 步骤1：昵称
  document.getElementById('nextStep1').addEventListener('click', () => {
    const nickname = document.getElementById('inputNickname').value.trim();
    if (!nickname) {
      alert('请输入你的名字');
      return;
    }
    profile.nickname = nickname;
    showStep(2);
  });
  
  // 步骤2：年龄
  document.querySelectorAll('#ageOptions .option-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('#ageOptions .option-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      profile.age = item.dataset.value;
    });
  });
  
  document.getElementById('prevStep2').addEventListener('click', () => showStep(1));
  document.getElementById('nextStep2').addEventListener('click', () => {
    if (!profile.age) {
      alert('请选择年龄段');
      return;
    }
    showStep(3);
  });
  
  // 步骤3：职业
  document.querySelectorAll('#careerOptions .option-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('#careerOptions .option-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      profile.career = item.dataset.value;
    });
  });
  
  document.getElementById('prevStep3').addEventListener('click', () => showStep(2));
  document.getElementById('nextStep3').addEventListener('click', () => {
    if (!profile.career) {
      alert('请选择职业');
      return;
    }
    showStep(4);
  });
  
  // 步骤4：工作模式
  document.querySelectorAll('#workModeOptions .option-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('#workModeOptions .option-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      profile.workMode = item.dataset.value;
      
      // 显示/隐藏时间选择
      const timeSelector = document.getElementById('workTimeSelector');
      if (profile.workMode === 'nineToFive' || profile.workMode === 'shift') {
        timeSelector.style.display = 'block';
      } else {
        timeSelector.style.display = 'none';
      }
    });
  });
  
  document.getElementById('prevStep4').addEventListener('click', () => showStep(3));
  document.getElementById('nextStep4').addEventListener('click', () => {
    if (!profile.workMode) {
      alert('请选择工作模式');
      return;
    }
    
    if (profile.workMode === 'nineToFive' || profile.workMode === 'shift') {
      profile.workStart = document.getElementById('workStart').value;
      profile.workEnd = document.getElementById('workEnd').value;
    }
    
    showStep(5);
  });
  
  // 步骤5：推送时间
  document.querySelectorAll('#pushTimeOptions .option-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('#pushTimeOptions .option-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      profile.pushTime = item.dataset.value;
    });
  });
  
  document.getElementById('prevStep5').addEventListener('click', () => showStep(4));
  document.getElementById('finishOnboarding').addEventListener('click', async () => {
    await db.save('userProfile', profile);
    
    // 请求通知权限
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
    
    showScreen('mainScreen');
    initMainScreen();
  });
}

// ==================== 主界面逻辑 ====================
async function initMainScreen() {
  const nickname = profile.nickname || '朋友';
  document.getElementById('displayNickname').textContent = nickname;
  
  // 检查今天是否已有夸夸
  const today = new Date().toISOString().split('T')[0];
  const saved = await db.getPraise(today);
  
  if (saved) {
    displayPraise(saved.content);
  } else {
    generateNewPraise();
  }
  
  document.getElementById('generateBtn').addEventListener('click', generateNewPraise);
  document.getElementById('settingsBtn').addEventListener('click', () => {
    showScreen('settingsScreen');
    loadSettings();
  });
}

async function generateNewPraise() {
  const btn = document.getElementById('generateBtn');
  btn.textContent = '...';
  btn.disabled = true;
  
  // 根据时间选择场景
  const hour = new Date().getHours();
  let scene = 'base';
  
  if (hour >= 5 && hour < 9) scene = 'morning';
  else if (hour >= 9 && hour < 12) scene = 'work';
  else if (hour >= 12 && hour < 14) scene = 'lunch';
  else if (hour >= 14 && hour < 18) scene = 'work';
  else if (hour >= 18 && hour < 22) scene = 'evening';
  else scene = 'night';
  
  // 周末
  const day = new Date().getDay();
  if (day === 0 || day === 6) {
    scene = 'weekend';
  }
  
  // 合并文案池
  const pool = [...PRAISE_LIBRARY.base, ...(PRAISE_LIBRARY[scene] || [])];
  const praise = pool[Math.floor(Math.random() * pool.length)];
  
  // 保存
  const today = new Date().toISOString().split('T')[0];
  await db.savePraise(today, praise);
  
  displayPraise(praise);
  
  btn.textContent = '再接收一次';
  btn.disabled = false;
}

function displayPraise(text) {
  const container = document.getElementById('praiseText');
  container.textContent = text;
  
  // 日期
  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  document.getElementById('praiseDate').textContent = dateStr;
}

// ==================== 设置页逻辑 ====================
function initSettings() {
  document.getElementById('closeSettings').addEventListener('click', () => {
    showScreen('mainScreen');
  });
  
  // 切换开关
  const toggle = document.getElementById('pushToggle');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
  });
  
  // 重置资料
  document.getElementById('resetProfile').addEventListener('click', async () => {
    if (confirm('确定要重新设置吗？')) {
      await db.save('userProfile', null);
      location.reload();
    }
  });
  
  // 保存设置
  document.getElementById('saveSettings').addEventListener('click', async () => {
    profile.pushTime = document.getElementById('settingPushTime').value;
    profile.pushEnabled = document.getElementById('pushToggle').classList.contains('active');
    
    await db.save('userProfile', profile);
    
    alert('已保存');
    showScreen('mainScreen');
  });
}

async function loadSettings() {
  const pushToggle = document.getElementById('pushToggle');
  if (profile.pushEnabled !== false) {
    pushToggle.classList.add('active');
  } else {
    pushToggle.classList.remove('active');
  }
  
  document.getElementById('settingPushTime').value = profile.pushTime || '09:00';
}
