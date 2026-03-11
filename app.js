// 每天夸你一万遍 - 极简日式版 v3.1
// 霞鹜文楷字体，智能推送时间

// ==================== 智能推送时间计算 ====================
function calculatePushTime(career, workMode, workStart, workEnd) {
  // 职业特殊处理
  if (career === 'student') {
    return '07:30'; // 学生：上学前
  }
  
  if (career === 'programmer') {
    // 程序员：夜猫子，晚上10点
    return '22:00';
  }
  
  if (career === 'medical') {
    // 医护人员：根据轮班，默认早晚交接时
    if (workMode === 'shift') {
      // 如果设置了上班时间，在上班前1小时或下班后
      if (workStart) {
        const hour = parseInt(workStart.split(':')[0]);
        if (hour < 12) {
          // 早班：上班前1小时
          return String(hour - 1).padStart(2, '0') + ':00';
        } else {
          // 晚班：下午4点鼓励
          return '16:00';
        }
      }
    }
    return '08:00';
  }
  
  // 根据工作模式
  switch (workMode) {
    case 'nineToFive':
      // 朝九晚五：早上8:30 或 晚上下班后
      if (workEnd) {
        const endHour = parseInt(workEnd.split(':')[0]);
        // 下班后半小时
        return String(endHour + 1).padStart(2, '0') + ':30';
      }
      return '08:30';
      
    case 'flexible':
      return '09:30'; // 弹性工作：上午9:30
      
    case 'shift':
      if (workStart) {
        const hour = parseInt(workStart.split(':')[0]);
        if (hour < 10) {
          // 早班：上班前
          return String(hour - 1).padStart(2, '0') + ':30';
        } else if (hour < 14) {
          // 中班：上午鼓励
          return '10:00';
        } else {
          // 晚班：下午鼓励
          return '15:00';
        }
      }
      return '09:00';
      
    case 'freelance':
      return '09:00'; // 自由职业：早上9点
      
    case 'unemployed':
      return '09:30'; // 待业：上午9:30，开启新的一天
      
    default:
      return '09:00';
  }
}

// 获取职业中文名
function getCareerName(career) {
  const names = {
    programmer: '程序员',
    designer: '设计师',
    product: '产品经理',
    teacher: '教师',
    medical: '医护',
    sales: '销售',
    student: '学生',
    freelancer: '自由职业',
    other: '职场人'
  };
  return names[career] || '朋友';
}

// 获取推送时间描述
function getPushTimeDescription(career, workMode) {
  if (career === 'programmer') return '晚间';
  if (career === 'student') return '清晨';
  if (workMode === 'nineToFive') return '下班后';
  if (workMode === 'shift') return '根据班次';
  if (workMode === 'freelance') return '上午';
  return '上午';
}

// ==================== 夸夸库（中文日式治愈文案）====================
const PRAISE_LIBRARY = {
  // 基础夸夸 - 侘寂美学
  base: [
    "今日也辛苦了。",
    "按你的节奏来，没关系。",
    "慢慢来，你在前进就好。",
    "现在的你，已经足够好了。",
    "不必勉强，善待自己。",
    "细微之处，也有值得感恩的事。",
    "今天是不会重来的珍贵一天。",
    "深呼吸，放轻松。",
    "你的努力，终会开花结果。",
    "不必完美，你也值得被爱。",
    "一步一步，稳稳地走。",
    "今天的你，比昨天更闪耀。",
    "累了就休息，没关系的。",
    "你的存在本身，就是无可替代的价值。",
    "慢慢来，相信自己。",
    "世事无常，安心即是归处。",
    "平淡的日子里，也有光。",
    "你已经做得很好了。",
    "给自己一个拥抱吧。",
    "今天的阳光，是为你而洒。"
  ],
  
  // 场景化
  morning: [
    "早安。愿你今日安稳。",
    "清晨的宁静，请收入心底。",
    "新的一天，新的可能。"
  ],
  work: [
    "专注的你，很美丽。",
    "一件一件，慢慢来。",
    "记得适时休息。"
  ],
  lunch: [
    "好好吃饭，是今日的修行。",
    "午后的片刻安宁。"
  ],
  evening: [
    "一日的终了，请慰劳自己。",
    "如黄昏般温柔地，对待自己。"
  ],
  night: [
    "夜晚是休息的时间，请安心入睡。",
    "好梦。",
    "今天的你已经很努力了。"
  ],
  weekend: [
    "慢慢度过的时光，也是珍贵的时光。",
    "周末是属于自己的日子。"
  ]
};

// ==================== IndexedDB ====================
const DB_NAME = 'PraiseDB_muji_v2';
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
const totalSteps = 4;
let profile = {
  nickname: '',
  age: '',
  career: '',
  workMode: '',
  workStart: '09:00',
  workEnd: '18:00',
  pushTime: '',
  pushEnabled: true
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
  
  // 步骤4：工作模式（最后一步）
  document.querySelectorAll('#workModeOptions .option-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('#workModeOptions .option-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      profile.workMode = item.dataset.value;
      
      // 显示/隐藏时间选择
      const timeSection = document.getElementById('workTimeSection');
      if (profile.workMode === 'nineToFive' || profile.workMode === 'shift') {
        timeSection.style.display = 'block';
      } else {
        timeSection.style.display = 'none';
      }
      
      // 更新智能推送提示
      updateSmartHint();
    });
  });
  
  document.getElementById('prevStep4').addEventListener('click', () => showStep(3));
  document.getElementById('finishOnboarding').addEventListener('click', async () => {
    if (!profile.workMode) {
      alert('请选择工作模式');
      return;
    }
    
    if (profile.workMode === 'nineToFive' || profile.workMode === 'shift') {
      profile.workStart = document.getElementById('workStart').value;
      profile.workEnd = document.getElementById('workEnd').value;
    }
    
    // 计算智能推送时间
    profile.pushTime = calculatePushTime(profile.career, profile.workMode, profile.workStart, profile.workEnd);
    
    await db.save('userProfile', profile);
    
    // 请求通知权限
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
    
    showScreen('mainScreen');
    initMainScreen();
  });
}

function updateSmartHint() {
  const hint = document.getElementById('smartPushHint');
  if (!profile.career || !profile.workMode) {
    hint.textContent = '根据你的职业和时间，我们会在最合适的时刻送上夸夸。';
    return;
  }
  
  const desc = getPushTimeDescription(profile.career, profile.workMode);
  hint.innerHTML = `根据你的职业和工作模式，推送时间已智能设置为：<strong>${desc}</strong>。`;
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
  
  const day = new Date().getDay();
  if (day === 0 || day === 6) {
    scene = 'weekend';
  }
  
  const pool = [...PRAISE_LIBRARY.base, ...(PRAISE_LIBRARY[scene] || [])];
  const praise = pool[Math.floor(Math.random() * pool.length)];
  
  const today = new Date().toISOString().split('T')[0];
  await db.savePraise(today, praise);
  
  displayPraise(praise);
  
  btn.textContent = '再读一句';
  btn.disabled = false;
}

function displayPraise(text) {
  const container = document.getElementById('praiseText');
  container.textContent = text;
  
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
  
  const toggle = document.getElementById('pushToggle');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
  });
  
  document.getElementById('resetProfile').addEventListener('click', async () => {
    if (confirm('确定要重新设置吗？')) {
      await db.save('userProfile', null);
      location.reload();
    }
  });
  
  document.getElementById('saveSettings').addEventListener('click', async () => {
    profile.pushEnabled = document.getElementById('pushToggle').classList.contains('active');
    await db.save('userProfile', profile);
    alert('已保存');
    showScreen('mainScreen');
  });
}

async function loadSettings() {
  const toggle = document.getElementById('pushToggle');
  if (profile.pushEnabled !== false) {
    toggle.classList.add('active');
  } else {
    toggle.classList.remove('active');
  }
  
  // 显示智能推送时间描述
  const desc = getPushTimeDescription(profile.career, profile.workMode);
  document.getElementById('pushTimeDisplay').textContent = desc;
}
