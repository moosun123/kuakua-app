// 每天夸你一万遍 - 智能分层推送系统 v4.0
// 根据用户画像定制推送策略

// ==================== 推送策略配置 ====================
const PUSH_STRATEGIES = {
  // 朝九晚五上班族
  nineToFive: {
    name: '朝九晚五',
    pushes: [
      { time: '08:30', type: 'morning', content: 'energy' },
      { time: '12:00', type: 'lunch', content: 'relax' },
      { time: '18:30', type: 'evening', content: 'heal' }
    ]
  },
  
  // 程序员（夜猫子）
  programmer: {
    name: '程序员',
    pushes: [
      { time: '10:00', type: 'work', content: 'tech' },
      { time: '15:00', type: 'break', content: 'relax' },
      { time: '22:00', type: 'night', content: 'nightOwl' }
    ]
  },
  
  // 学生
  student: {
    name: '学生',
    pushes: [
      { time: '07:30', type: 'morning', content: 'encourage' },
      { time: '12:00', type: 'lunch', content: 'rest' },
      { time: '21:00', type: 'night', content: 'summary' }
    ]
  },
  
  // 自由职业
  freelance: {
    name: '自由职业',
    pushes: [
      { time: '10:00', type: 'morning', content: 'inspire', random: true },
      { time: '15:00', type: 'afternoon', content: 'continue', random: true }
    ]
  },
  
  // 轮班制（医护等）
  shift: {
    name: '轮班工作',
    pushes: [
      { time: 'beforeWork', offset: -60, type: 'before', content: 'cheer' },
      { time: 'midWork', offset: 240, type: 'mid', content: 'persist' },
      { time: 'afterWork', offset: 30, type: 'after', content: 'rest' }
    ],
    dynamic: true // 动态计算
  },
  
  // 待业/求职
  unemployed: {
    name: '求职中',
    pushes: [
      { time: '09:00', type: 'morning', content: 'encourage' },
      { time: '14:00', type: 'afternoon', content: 'inspire' },
      { time: '20:00', type: 'evening', content: 'comfort' }
    ]
  }
};

// ==================== 性格加成策略 ====================
const PERSONALITY_MODIFIERS = {
  '容易焦虑': {
    extraPushes: [
      { type: 'random', chance: 0.3, content: 'calm' } // 30%概率额外推送安抚
    ],
    contentBias: 'calm'
  },
  '完美主义': {
    extraPushes: [
      { type: 'evening', time: '23:00', content: 'acceptance' }
    ],
    contentBias: 'acceptance'
  },
  '拖延症': {
    extraPushes: [
      { type: 'afternoon', time: '14:00', content: 'start' }
    ],
    contentBias: 'action'
  },
  '高敏感': {
    extraPushes: [
      { type: 'random', chance: 0.2, content: 'gentle' }
    ],
    contentBias: 'gentle'
  },
  '卷王': {
    extraPushes: [
      { type: 'evening', time: '21:00', content: 'restReminder' }
    ],
    contentBias: 'rest'
  },
  '佛系': {
    pushReduction: true, // 减少推送次数
    contentBias: 'zen'
  }
};

// ==================== 内容库（按类型分类）====================
const CONTENT_LIBRARY = {
  energy: [
    "新的一天，带着能量出发。",
    "今日的你，也会闪闪发光。",
    "开工了，慢慢来就好。"
  ],
  relax: [
    "午休时间，好好吃饭。",
    "停下来，休息也是工作的一部分。",
    "此刻的宁静，请收入心底。"
  ],
  heal: [
    "一日的辛劳，值得被温柔以待。",
    "下班了，今天也辛苦了。",
    "归途的风景，是给你我的礼物。"
  ],
  tech: [
    "代码的世界，由你构建。",
    "Bug总会解决，就像困难总会过去。",
    "你的逻辑，清晰如晨光。"
  ],
  nightOwl: [
    "深夜的屏幕，映着你的专注。",
    "夜色温柔，不必太晚。",
    "星光不负赶路人。"
  ],
  encourage: [
    "每一步都在前进，哪怕很小。",
    "相信自己的选择。",
    "今天的努力，明天的你会感谢。"
  ],
  calm: [
    "深呼吸，一切都好。",
    "不必着急，按你的节奏来。",
    "此刻的你，已经够好了。"
  ],
  inspire: [
    "灵感可能在下一刻到来。",
    "保持好奇，世界很大。",
    "你的独特，是世界的礼物。"
  ],
  gentle: [
    "轻轻地，善待自己。",
    "敏感是天赋，不是你的错。",
    "世界喧嚣，你可以安静。"
  ],
  zen: [
    "无事小神仙。",
    "随遇而安。",
    "云淡风轻。"
  ],
  cheer: [
    "新的一天，加油。",
    "你的付出，有人看见。",
    "辛苦了，再坚持一下。"
  ],
  persist: [
    " halfway there，继续。",
    "累的时候，想想为什么开始。",
    "你的坚守，有意义。"
  ],
  rest: [
    "终于可以休息了。",
    "卸下疲惫，好梦。",
    "你值得好好睡一觉。"
  ]
};

// ==================== IndexedDB ====================
const DB_NAME = 'PraiseDB_v4';
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
        if (!db.objectStoreNames.contains('pushLog')) {
          db.createObjectStore('pushLog', { keyPath: 'id', autoIncrement: true });
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
  }
};

// ==================== 推送计划生成器 ====================
function generatePushSchedule(profile) {
  const schedule = [];
  const workMode = profile.workMode || 'nineToFive';
  const strategy = PUSH_STRATEGIES[workMode] || PUSH_STRATEGIES.nineToFive;
  
  // 基础推送
  strategy.pushes.forEach(push => {
    let time = push.time;
    
    // 动态计算时间（轮班制）
    if (strategy.dynamic && push.time === 'beforeWork') {
      const [hour, minute] = (profile.workStart || '09:00').split(':').map(Number);
      const date = new Date();
      date.setHours(hour, minute + push.offset, 0, 0);
      time = `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    } else if (strategy.dynamic && push.time === 'midWork') {
      const [hour, minute] = (profile.workStart || '09:00').split(':').map(Number);
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      date.setMinutes(date.getMinutes() + push.offset);
      time = `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    } else if (strategy.dynamic && push.time === 'afterWork') {
      const [hour, minute] = (profile.workEnd || '18:00').split(':').map(Number);
      const date = new Date();
      date.setHours(hour, minute + push.offset, 0, 0);
      time = `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    }
    
    schedule.push({
      time,
      type: push.type,
      content: push.content,
      random: push.random || false
    });
  });
  
  // 性格加成
  const personality = profile.personality || [];
  personality.forEach(p => {
    const modifier = PERSONALITY_MODIFIERS[p];
    if (modifier && modifier.extraPushes) {
      modifier.extraPushes.forEach(extra => {
        if (extra.chance && Math.random() > extra.chance) return;
        
        schedule.push({
          time: extra.time || 'random',
          type: extra.type,
          content: extra.content,
          isExtra: true
        });
      });
    }
    
    // 佛系减少推送
    if (modifier && modifier.pushReduction) {
      return schedule.slice(0, 1); // 只保留第一个
    }
  });
  
  return schedule;
}

// ==================== 状态管理 ====================
let profile = {
  nickname: '',
  age: '',
  career: '',
  workMode: '',
  workStart: '09:00',
  workEnd: '18:00',
  pushTime: '',
  pushEnabled: true,
  personality: []
};
let pushSchedule = [];

// ==================== 推送管理器 ====================
const PushManager = {
  timers: [],
  
  async init() {
    if (!('serviceWorker' in navigator)) return false;
    if (!('Notification' in window)) return false;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },
  
  async start(schedule) {
    this.stop();
    pushSchedule = schedule;
    
    // 向Service Worker发送推送计划
    const reg = await navigator.serviceWorker.ready;
    reg.active.postMessage({
      type: 'SET_SCHEDULE',
      schedule: schedule
    });
    
    console.log('[Push] 推送计划已设置:', schedule);
  },
  
  stop() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  },
  
  async test(type = 'random') {
    const reg = await navigator.serviceWorker.ready;
    reg.active.postMessage({ 
      type: 'TEST_PUSH',
      contentType: type
    });
  }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', async () => {
  await db.init();
  
  const savedProfile = await db.get('userProfile');
  
  if (savedProfile && savedProfile.nickname) {
    // 合并保存的数据和默认值
    profile = { ...profile, ...savedProfile };
    // 确保personality是数组
    if (!profile.personality) profile.personality = [];
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

// ==================== 引导页逻辑 ====================
function initOnboarding() {
  const totalSteps = 4;
  let currentStep = 1;
  
  function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === step - 1));
    currentStep = step;
  }
  
  // 步骤1：昵称
  document.getElementById('nextStep1').addEventListener('click', () => {
    const nickname = document.getElementById('inputNickname').value.trim();
    if (!nickname) return alert('请输入名字');
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
    if (!profile.age) return alert('请选择年龄段');
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
    if (!profile.career) return alert('请选择职业');
    showStep(4);
  });
  
  // 步骤4：工作模式
  document.querySelectorAll('#workModeOptions .option-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('#workModeOptions .option-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      profile.workMode = item.dataset.value;
      
      const timeSection = document.getElementById('workTimeSection');
      timeSection.style.display = (profile.workMode === 'nineToFive' || profile.workMode === 'shift') ? 'block' : 'none';
      
      updatePushPreview();
    });
  });
  
  // 性格标签
  document.querySelectorAll('#personalityOptions .tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
      profile.personality = Array.from(document.querySelectorAll('#personalityOptions .tag.selected'))
        .map(t => t.dataset.value);
      updatePushPreview();
    });
  });
  
  function updatePushPreview() {
    if (!profile.workMode) return;
    
    const preview = document.getElementById('pushPreview');
    const schedule = generatePushSchedule(profile);
    
    let html = '<strong>预计今日推送：</strong><br>';
    schedule.forEach((s, i) => {
      html += `${i + 1}. ${s.time} - ${getContentTypeName(s.content)}<br>`;
    });
    
    preview.innerHTML = html;
    preview.style.display = 'block';
  }
  
  document.getElementById('prevStep4').addEventListener('click', () => showStep(3));
  document.getElementById('finishOnboarding').addEventListener('click', async () => {
    if (!profile.workMode) return alert('请选择工作模式');
    
    if (profile.workMode === 'nineToFive' || profile.workMode === 'shift') {
      profile.workStart = document.getElementById('workStart').value;
      profile.workEnd = document.getElementById('workEnd').value;
    }
    
    profile.pushEnabled = true;
    await db.save('userProfile', profile);
    await PushManager.init();
    
    // 生成并启动推送计划
    const schedule = generatePushSchedule(profile);
    await PushManager.start(schedule);
    
    showScreen('mainScreen');
    initMainScreen();
  });
}

function getContentTypeName(type) {
  const names = {
    energy: '能量', relax: '放松', heal: '治愈',
    tech: '技术', nightOwl: '深夜', encourage: '鼓励',
    calm: '安抚', inspire: '灵感', gentle: '温柔',
    zen: '佛系', cheer: '加油', persist: '坚持', rest: '休息'
  };
  return names[type] || type;
}

// ==================== 主界面逻辑 ====================
async function initMainScreen() {
  document.getElementById('displayNickname').textContent = profile.nickname || '朋友';
  
  // 初始化推送
  await PushManager.init();
  if (profile.pushEnabled !== false && profile.pushTime) {
    await PushManager.start(profile.pushTime);
  }
  
  // 检查今天是否已有夸夸
  const today = new Date().toISOString().split('T')[0];
  const saved = await db.getPraise(today);
  
  if (saved) {
    displayPraise(saved.content);
  } else {
    // 显示默认文案
    document.getElementById('praiseText').textContent = '点击下方按钮，接收今日份温暖。';
  }
  
  // 绑定按钮事件
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateNewPraise);
  }
  
  document.getElementById('settingsBtn').addEventListener('click', () => {
    showScreen('settingsScreen');
    loadSettings();
  });
}

async function generateNewPraise() {
  const btn = document.getElementById('generateBtn');
  if (btn) {
    btn.textContent = '...';
    btn.disabled = true;
  }
  
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
  const pool = [...CONTENT_LIBRARY.base, ...(CONTENT_LIBRARY[scene] || [])];
  const praise = pool[Math.floor(Math.random() * pool.length)];
  
  // 保存
  const today = new Date().toISOString().split('T')[0];
  await db.savePraise(today, praise);
  
  displayPraise(praise);
  
  if (btn) {
    btn.textContent = '再读一句';
    btn.disabled = false;
  }
}

function displayPraise(text) {
  const container = document.getElementById('praiseText');
  if (container) {
    container.textContent = text;
  }
  
  // 日期
  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  const dateEl = document.getElementById('praiseDate');
  if (dateEl) {
    dateEl.textContent = dateStr;
  }
}

// ==================== 设置页逻辑 ====================
function initSettings() {
  document.getElementById('closeSettings').addEventListener('click', () => {
    showScreen('mainScreen');
  });
  
  const toggle = document.getElementById('pushToggle');
  toggle.addEventListener('click', async () => {
    toggle.classList.toggle('active');
    const isActive = toggle.classList.contains('active');
    
    if (isActive) {
      const schedule = generatePushSchedule(profile);
      await PushManager.start(schedule);
    } else {
      await PushManager.stop();
    }
  });
  
  // 测试推送
  document.getElementById('testPushBtn').addEventListener('click', () => {
    PushManager.test('random');
  });
  
  document.getElementById('resetProfile').addEventListener('click', async () => {
    if (confirm('确定要重新设置吗？')) {
      await PushManager.stop();
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
  toggle.classList.toggle('active', profile.pushEnabled !== false);
  
  // 显示推送统计
  const schedule = generatePushSchedule(profile);
  document.getElementById('pushCount').textContent = `今日${schedule.length}次`;
}
