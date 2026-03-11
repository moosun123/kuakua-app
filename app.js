// 每天夸你一万遍 - 升级版 v2.0
// 支持用户画像、个性化推荐、智能推送

// ==================== 用户画像配置 ====================
const USER_PROFILE = {
  career: '',      // 职业
  age: '',         // 年龄段
  workMode: '',    // 工作模式
  workStart: '',   // 上班时间
  workEnd: '',     // 下班时间
  personality: [], // 性格标签
  nickname: '',    // 昵称
  firstLogin: true // 是否首次登录
};

// ==================== 职业定制夸夸库 ====================
const CAREER_PRAISES = {
  programmer: {
    keywords: ['代码', '逻辑', '架构', 'Debug', '算法'],
    praises: [
      "你的代码写得像诗一样优雅，每一行都充满智慧",
      "这个Bug难不倒你，因为你就是问题的解决者",
      "你的架构设计让复杂变得简单，这就是实力",
      "代码review看到你写的，总是让人放心",
      "你的逻辑思维清晰得像高速公路，畅通无阻",
      "今天又提交了这么多优质代码，生产队的驴都不敢这么干（开玩笑的，你很棒）",
      "你的技术深度让人佩服，继续保持这份热爱",
      "看到你在StackOverflow的回答，帮助了很多人"
    ]
  },
  designer: {
    keywords: ['审美', '配色', '排版', '灵感', '像素'],
    praises: [
      "你的审美永远在线，每个设计都恰到好处",
      "配色方案让人惊艳，你有双发现美的眼睛",
      "像素级的完美主义，这就是专业设计师的态度",
      "你的作品总能带来视觉上的惊喜",
      "设计不是装饰，是解决问题，你做到了",
      "你的灵感永远不会枯竭，创意无限",
      "用户因为你设计的界面多停留了10秒，这就是你的价值",
      "你的排版让信息有了呼吸感"
    ]
  },
  product: {
    keywords: ['需求', '用户', '逻辑', '策略', '协调'],
    praises: [
      "你对用户需求的洞察总是那么精准",
      "产品在你手里有了灵魂，不只是功能的堆砌",
      "协调资源的能力一流，团队因为有你运转更顺畅",
      "你的产品经理直觉很准，市场会验证这一点",
      "需求文档写得清晰明了，开发同学要给你点赞",
      "你对数据敏感，每个决策都有依据",
      "产品 roadmap 规划得很有远见",
      "你总能找到用户真正的痛点，而不是表面需求"
    ]
  },
  teacher: {
    keywords: ['学生', '知识', '耐心', '启发', '教育'],
    praises: [
      "孩子们遇到你是他们的幸运",
      "你的课堂总是充满启发性，学生爱听",
      "批改作业到深夜，你是最负责的园丁",
      "你不只是在传授知识，更是在塑造灵魂",
      "看到学生因为你的教导而进步，这就是教育的意义",
      "你的耐心让每个孩子都有被看见的机会",
      "你点燃了学生对知识的渴望，这比什么都重要",
      "教育是心与心的交流，你做得很好"
    ]
  },
  medical: {
    keywords: ['病人', '专业', '仁心', '坚守', '健康'],
    praises: [
      "你的专业让患者安心，这份信任来之不易",
      "白衣天使不只是称呼，是你每天的践行",
      "再晚的夜班也认真对待每个病人，辛苦了",
      "你的仁心和医术一样重要，病人很幸运",
      "医疗工作压力大，但你依然保持温柔",
      "你守护的不仅是健康，还有希望",
      "穿上白大褂的那一刻，你就扛起了责任",
      "谢谢你用专业让更多人重获健康"
    ]
  },
  sales: {
    keywords: ['业绩', '沟通', '客户', '目标', '突破'],
    praises: [
      "这个月的业绩数字真亮眼，你的努力有回报了",
      "客户信任你是因为你真诚，不只是为了成交",
      "被拒绝100次还能保持热情，这就是销售精神",
      "你的沟通能力让人舒服，难怪客户愿意跟你聊",
      "目标达成的那一刻，所有的汗水都值得",
      "你不仅是在卖产品，是在帮客户解决问题",
      "抗压能力超强，业绩波动不击垮你",
      "你的坚持和专业让不可能变成可能"
    ]
  },
  student: {
    keywords: ['学习', '考试', '成长', '未来', '知识'],
    praises: [
      "今天的你比昨天更博学，这就是进步",
      "备考辛苦，但你知道这一切都有意义",
      "你对知识的渴望会让你走得更远",
      "别焦虑，你已经在正确的路上了",
      "学生时代最珍贵的是这段纯粹的奋斗时光",
      "你为了梦想早起晚睡的样子很酷",
      "学习是场马拉松，你正在稳步前进",
      "今天的努力是未来的你在向现在的你道谢"
    ]
  },
  freelancer: {
    keywords: ['自由', '项目', '多面手', '自律', '创造'],
    praises: [
      "自由职业需要极强的自律，你做到了",
      "同时handle多个项目，你的时间管理能力一流",
      "没有老板监督也能高质量交付，这就是专业",
      "你证明了自由不等于散漫，而是更负责",
      "每个项目都是你的作品，口碑就是这样积累的",
      "为自己工作的感觉很棒吧，你值得这份自由",
      "平衡工作与生活，你找到了自己的节奏",
      "你的多面手能力让人佩服，技多不压身"
    ]
  },
  other: {
    keywords: ['工作', '努力', '专业', '价值', '贡献'],
    praises: [
      "你在自己的领域闪闪发光",
      "每一份工作都值得尊重，你做得很好",
      "你的努力让这个世界运转得更顺畅",
      "专业不分行业，你就是最好的证明",
      "工作再平凡，你也能做出不平凡",
      "你的价值不需要别人定义，你创造它",
      "认真工作的样子，是你最美的样子",
      "今天也为这个世界贡献了你的力量"
    ]
  }
};

// ==================== 通用夸夸库（按性格调整语气）====================
const BASE_PRAISES = {
  gentle: [
    "今天的你，已经在闪闪发光了✨",
    "慢慢来，你比自己想象的更厉害",
    "辛苦了，记得给自己一个大大的拥抱🤗",
    "你的努力，时间都会记得",
    "不管怎样，你今天已经很棒了！",
    "世界很大，但你独一无二💫",
    "累了就休息，你已经做得很好了",
    "你的存在本身就是一份礼物🎁",
    "相信直觉，你的选择都是对的",
    "温柔对待自己，像对待最好的朋友一样"
  ],
  energetic: [
    "冲鸭！今天也是元气满满的一天！🚀",
    "你就是自己的超级英雄！💪",
    "没有什么能阻挡你，前进吧！",
    "热血不会冷却，梦想不会褪色！",
    "今天也要做最飒的自己！🔥",
    "全力以赴，不留遗憾！",
    "你的潜力，远超你的想象！",
    "敢想敢做，你就是最棒的！",
    "每一滴汗水，都在为未来的你铺路",
    "别停下，最好的风景在前方！"
  ],
  humor: [
    "别低头，皇冠会掉；别流泪，妆会花😎",
    "确认过眼神，是今天最靓的崽🌟",
    "你的颜值和才华，让我词穷了",
    "警告：你的优秀已经藏不住了！",
    "如果帅/美是罪，那你已经无期徒刑了",
    "别谦虚了，接受自己很厉害这个事实吧",
    "你的存在，让这个世界多了几分颜色",
    "这么棒的人，我不夸谁夸？",
    "虽然夸你很累，但我乐意😏",
    "承认吧，你就是天生赢家"
  ],
  poetic: [
    "愿你有诗有酒，有远方也有故乡🌙",
    "你眼里的光，胜过万千星辰",
    "岁月漫长，值得等待，你更值得",
    "愿你被世界温柔以待，如你所愿",
    "你是自己的太阳，无需借谁的光☀️",
    "山河远阔，人间烟火，无一是你，无一不是你",
    "愿你走过半生，归来仍是少年",
    "生活明朗，万物可爱，你更可爱",
    "愿你所求皆如愿，所行皆坦途",
    "世间所有的美好，都与你环环相扣"
  ]
};

// ==================== 场景化夸夸 ====================
const SCENE_PRAISES = {
  earlyMorning: [ // 6-9点
    "早起的人先享受世界，今天也要加油！",
    "清晨的第一缕阳光和第一个夸夸都给你",
    "早起的鸟儿有虫吃，早起的你有夸夸收",
    "新的一天开始了，你准备好了吗"
  ],
  workTime: [ // 工作时间
    "工作再忙，也要记得对自己好一点",
    "今天的任务看起来很挑战，但你搞得定",
    "专注力在线的你，效率一定很高",
    "喝杯咖啡，继续战斗，你可以的"
  ],
  lunchTime: [ // 午餐时间
    "午饭吃了吗？美食和夸夸都不可辜负",
    "午休时间到，给自己充充电",
    "吃饱了才有力气继续优秀",
    "今天也要好好吃饭，照顾好自己"
  ],
  overtime: [ // 加班时间（超过下班时间）
    "还在奋斗吗？辛苦你了，夜猫子",
    "加班到这么晚，记得给自己加鸡腿",
    "深夜还在工作的你，值得双倍夸夸",
    "努力的样子很美，但也要注意休息",
    "星光不问赶路人，时光不负有心人"
  ],
  weekend: [ // 周末
    "周末快乐！今天不加班，只加快乐",
    "终于到周末了，好好犒劳自己",
    "辛苦了一周，今天请躺平",
    "周末的你，可以慢下来享受生活"
  ],
  lateNight: [ // 深夜（23点后）
    "这么晚还没睡？是在等我的夸夸吗",
    "熬夜对身体不好，但对心情好（开玩笑的，快睡）",
    "深夜emo时刻，让我来给你一点温暖",
    "不管多晚，我都陪你"
  ]
};

// ==================== IndexedDB 封装 ====================
const DB_NAME = 'PraiseDB_v2';
const DB_VERSION = 2;

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
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'key' });
        }
      };
    });
  },

  async save(key, value, storeName = 'settings') {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      store.put({ key, value, timestamp: Date.now() });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  },

  async get(key, storeName = 'settings') {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  },

  async savePraise(date, content, meta = {}) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(['praises'], 'readwrite');
      const store = tx.objectStore('praises');
      store.put({ date, content, ...meta, timestamp: Date.now() });
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

// ==================== 用户画像管理 ====================
const ProfileManager = {
  async save(profile) {
    await db.save('userProfile', profile, 'profile');
  },

  async load() {
    const profile = await db.get('userProfile', 'profile');
    return profile || { ...USER_PROFILE, firstLogin: true };
  },

  async isFirstLogin() {
    const profile = await this.load();
    return !profile || profile.firstLogin !== false;
  }
};

// ==================== 智能夸夸生成器 ====================
const PraiseGenerator = {
  async generate(options = {}) {
    const profile = await ProfileManager.load();
    const now = new Date();
    const hour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    
    // 确定场景
    let scene = 'workTime';
    if (isWeekend) scene = 'weekend';
    else if (hour >= 6 && hour < 9) scene = 'earlyMorning';
    else if (hour >= 11 && hour < 14) scene = 'lunchTime';
    else if (profile.workEnd) {
      const [endHour] = profile.workEnd.split(':').map(Number);
      if (hour >= endHour + 1) scene = 'overtime';
    }
    if (hour >= 23) scene = 'lateNight';

    // 选择基础语料库
    let basePraises = [];
    if (profile.personality?.includes('社牛') || profile.personality?.includes('乐观派')) {
      basePraises = [...BASE_PRAISES.energetic, ...BASE_PRAISES.humor];
    } else if (profile.personality?.includes('社恐') || profile.personality?.includes('高敏感')) {
      basePraises = [...BASE_PRAISES.gentle, ...BASE_PRAISES.poetic];
    } else {
      basePraises = [...BASE_PRAISES.gentle, ...BASE_PRAISES.energetic];
    }

    // 添加职业定制夸夸
    if (profile.career && CAREER_PRAISES[profile.career]) {
      basePraises = [...CAREER_PRAISES[profile.career].praises, ...basePraises];
    }

    // 添加场景化夸夸
    if (SCENE_PRAISES[scene]) {
      basePraises = [...SCENE_PRAISES[scene], ...basePraises];
    }

    // 根据性格调整
    let selectedPraise = basePraises[Math.floor(Math.random() * basePraises.length)];
    
    // 个性化替换
    if (profile.nickname) {
      selectedPraise = selectedPraise.replace(/你/g, profile.nickname);
    }

    return {
      content: selectedPraise,
      scene,
      timestamp: Date.now()
    };
  },

  async preGenerate(days = 7) {
    const profile = await ProfileManager.load();
    const praises = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const existing = await db.getPraise(dateStr);
      if (!existing) {
        const praise = await this.generate();
        await db.savePraise(dateStr, praise.content, { scene: praise.scene });
        praises.push({ date: dateStr, ...praise });
      }
    }
    
    return praises;
  }
};

// ==================== UI 控制器 ====================
const UI = {
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  },

  async renderPraise() {
    const today = new Date().toISOString().split('T')[0];
    let record = await db.getPraise(today);
    
    if (!record) {
      const praise = await PraiseGenerator.generate();
      await db.savePraise(today, praise.content, { scene: praise.scene });
      record = { content: praise.content };
    }

    const praiseText = document.getElementById('praiseText');
    const praiseDate = document.getElementById('praiseDate');
    
    // 打字机效果
    praiseText.textContent = '';
    const text = record.content;
    let i = 0;
    
    const typeWriter = () => {
      if (i < text.length) {
        praiseText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    };
    
    typeWriter();
    
    const dateStr = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    praiseDate.textContent = dateStr;
  },

  async renderProfile() {
    const profile = await ProfileManager.load();
    if (profile.nickname) {
      document.getElementById('displayNickname').textContent = profile.nickname;
    }
    if (profile.career) {
      const careerNames = {
        programmer: '程序员', designer: '设计师', product: '产品经理',
        teacher: '教师', medical: '医护人员', sales: '销售',
        student: '学生', freelancer: '自由职业', other: '职场人'
      };
      document.getElementById('displayCareer').textContent = careerNames[profile.career] || '职场人';
    }
  }
};

// ==================== Service Worker ====================
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      console.log('Service Worker 注册成功:', reg);
      return reg;
    } catch (err) {
      console.error('Service Worker 注册失败:', err);
    }
  }
}

// ==================== 通知管理 ====================
const NotificationManager = {
  async requestPermission() {
    if (!('Notification' in window)) {
      alert('你的设备不支持推送通知');
      return false;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async schedule(profile) {
    if (!profile.pushTime) return;
    
    await PraiseGenerator.preGenerate(7);
    
    const reg = await navigator.serviceWorker.ready;
    reg.active.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      time: profile.pushTime
    });
  },

  sendTest() {
    if (Notification.permission === 'granted') {
      new Notification('💫 夸夸时间到！', {
        body: '今天的你，已经在闪闪发光了✨',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23FF69B4" width="192" height="192" rx="40"/><text x="96" y="120" font-size="80" text-anchor="middle">💖</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23FF69B4" width="192" height="192" rx="40"/><text x="96" y="120" font-size="80" text-anchor="middle">💖</text></svg>'
      });
    }
  }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', async () => {
  // 初始化数据库和SW
  await db.init();
  await registerSW();
  
  // 检查是否首次登录
  const isFirstLogin = await ProfileManager.isFirstLogin();
  
  if (isFirstLogin) {
    UI.showScreen('onboardingScreen');
    setupOnboarding();
  } else {
    UI.showScreen('mainScreen');
    UI.renderProfile();
    UI.renderPraise();
    setupMainScreen();
  }
});

// ==================== 引导页逻辑 ====================
function setupOnboarding() {
  const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
  let currentStep = 0;
  
  const profile = { ...USER_PROFILE };
  
  function showStep(index) {
    steps.forEach((step, i) => {
      document.getElementById(step).classList.toggle('active', i === index);
    });
    document.getElementById('stepIndicator').textContent = `${index + 1}/${steps.length}`;
    
    // 更新进度条
    const progress = ((index + 1) / steps.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
  }
  
  // 步骤1：基本信息
  document.getElementById('nextStep1').addEventListener('click', () => {
    const nickname = document.getElementById('inputNickname').value.trim();
    const age = document.querySelector('input[name="age"]:checked')?.value;
    
    if (!nickname) {
      alert('请告诉我怎么称呼你~');
      return;
    }
    
    profile.nickname = nickname;
    profile.age = age || '26-30';
    currentStep = 1;
    showStep(currentStep);
  });
  
  // 步骤2：职业
  document.getElementById('careerOptions').addEventListener('click', (e) => {
    if (e.target.dataset.career) {
      profile.career = e.target.dataset.career;
      document.querySelectorAll('#careerOptions .option-card').forEach(c => c.classList.remove('selected'));
      e.target.classList.add('selected');
    }
  });
  
  document.getElementById('nextStep2').addEventListener('click', () => {
    if (!profile.career) {
      alert('请选择你的职业~');
      return;
    }
    currentStep = 2;
    showStep(currentStep);
  });
  
  document.getElementById('prevStep2').addEventListener('click', () => {
    currentStep = 0;
    showStep(currentStep);
  });
  
  // 步骤3：工作模式
  document.getElementById('workModeOptions').addEventListener('click', (e) => {
    if (e.target.dataset.workmode) {
      profile.workMode = e.target.dataset.workmode;
      document.querySelectorAll('#workModeOptions .option-card').forEach(c => c.classList.remove('selected'));
      e.target.classList.add('selected');
      
      // 显示/隐藏时间选择
      const timeSelector = document.getElementById('workTimeSelector');
      if (profile.workMode === 'nineToFive' || profile.workMode === 'shift') {
        timeSelector.classList.add('active');
      } else {
        timeSelector.classList.remove('active');
      }
    }
  });
  
  document.getElementById('nextStep3').addEventListener('click', () => {
    if (!profile.workMode) {
      alert('请选择你的工作模式~');
      return;
    }
    
    const workStart = document.getElementById('workStart').value;
    const workEnd = document.getElementById('workEnd').value;
    
    if ((profile.workMode === 'nineToFive' || profile.workMode === 'shift') && (!workStart || !workEnd)) {
      alert('请设置上下班时间~');
      return;
    }
    
    profile.workStart = workStart || '09:00';
    profile.workEnd = workEnd || '18:00';
    
    currentStep = 3;
    showStep(currentStep);
  });
  
  document.getElementById('prevStep3').addEventListener('click', () => {
    currentStep = 1;
    showStep(currentStep);
  });
  
  // 步骤4：性格标签
  document.getElementById('personalityOptions').addEventListener('click', (e) => {
    if (e.target.dataset.personality) {
      e.target.classList.toggle('selected');
      const selected = document.querySelectorAll('#personalityOptions .tag.selected');
      profile.personality = Array.from(selected).map(t => t.dataset.personality);
    }
  });
  
  document.getElementById('nextStep4').addEventListener('click', () => {
    if (profile.personality.length === 0) {
      alert('至少选择一个性格标签~');
      return;
    }
    currentStep = 4;
    showStep(currentStep);
  });
  
  document.getElementById('prevStep4').addEventListener('click', () => {
    currentStep = 2;
    showStep(currentStep);
  });
  
  // 步骤5：推送设置
  document.getElementById('finishOnboarding').addEventListener('click', async () => {
    const pushTime = document.getElementById('onboardingPushTime').value;
    profile.pushTime = pushTime;
    profile.pushEnabled = true;
    profile.firstLogin = false;
    
    await ProfileManager.save(profile);
    
    const granted = await NotificationManager.requestPermission();
    if (granted) {
      await NotificationManager.schedule(profile);
      await PraiseGenerator.preGenerate(7);
    }
    
    UI.showScreen('mainScreen');
    UI.renderProfile();
    UI.renderPraise();
    setupMainScreen();
  });
  
  document.getElementById('prevStep5').addEventListener('click', () => {
    currentStep = 3;
    showStep(currentStep);
  });
  
  // 初始化显示
  showStep(0);
}

// ==================== 主界面逻辑 ====================
function setupMainScreen() {
  // 生成按钮
  document.getElementById('generateBtn').addEventListener('click', async () => {
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span>生成中...';
    
    await UI.renderPraise();
    
    btn.disabled = false;
    btn.innerHTML = '✨ 再夸一次';
  });
  
  // 设置按钮
  document.getElementById('settingsBtn').addEventListener('click', () => {
    UI.showScreen('settingsScreen');
    loadSettings();
  });
  
  // 关闭设置
  document.getElementById('closeSettings').addEventListener('click', () => {
    UI.showScreen('mainScreen');
  });
  
  // 保存设置
  document.getElementById('saveSettings').addEventListener('click', async () => {
    const profile = await ProfileManager.load();
    
    profile.pushTime = document.getElementById('settingPushTime').value;
    profile.pushEnabled = document.getElementById('enablePush').checked;
    
    await ProfileManager.save(profile);
    
    if (profile.pushEnabled) {
      await NotificationManager.schedule(profile);
    }
    
    document.getElementById('saveStatus').textContent = '✅ 保存成功！';
    setTimeout(() => {
      document.getElementById('saveStatus').textContent = '';
    }, 2000);
  });
  
  // 重置引导
  document.getElementById('resetOnboarding').addEventListener('click', async () => {
    if (confirm('确定要重新设置个人资料吗？')) {
      const profile = await ProfileManager.load();
      profile.firstLogin = true;
      await ProfileManager.save(profile);
      location.reload();
    }
  });
}

async function loadSettings() {
  const profile = await ProfileManager.load();
  
  document.getElementById('settingPushTime').value = profile.pushTime || '09:00';
  document.getElementById('enablePush').checked = profile.pushEnabled !== false;
}
