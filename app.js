// 每天夸你一万遍 - 主程序
// 配置：使用内置文案库（无需API Key，开箱即用）

const PRAISE_LIBRARY = {
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
    "温柔对待自己，像对待最好的朋友一样",
    "每一天的你，都值得被温柔以待",
    "不必完美，足够好就已经很好了",
    "你的笑容，是今天最美的风景😊",
    "给自己一点耐心，成长需要时间",
    "你已经超越了昨天的自己"
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
    "别停下，最好的风景在前方！",
    "你可以的！这三个字说三遍！",
    "燃烧吧小宇宙！释放你的能量！",
    "今天不努力，明天徒伤悲，冲！",
    "你是打不倒的，因为你足够强大",
    "干就完了！相信自己！"
  ],
  humor: [
    "别低头，皇冠会掉；别流泪，妆会花😎",
    "虽然你长得好看，但内在更美（求生欲）",
    "确认过眼神，是今天最靓的崽🌟",
    "你的颜值和才华，让我词穷了",
    "警告：你的优秀已经藏不住了！",
    "如果帅/美是罪，那你已经无期徒刑了",
    "别谦虚了，接受自己很厉害这个事实吧",
    "你的存在，让这个世界多了几分颜色",
    "今天也是被你魅力折服的一天",
    "自信点，你就是这条gai最靓的仔",
    "别人用优秀形容你，我用你形容优秀",
    "这么棒的人，我不夸谁夸？",
    "你的回头率一定很高，因为我也在回头看你",
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
    "世间所有的美好，都与你环环相扣",
    "愿你的生活常温暖，日子总是温柔又闪光",
    "你值得这世间所有的美好与温柔",
    "愿你眼里有光，心中有爱，脚下有路",
    "时光不老，我们不散，你始终如初",
    "愿你的世界，星光满载"
  ]
};

// IndexedDB 封装
const DB_NAME = 'PraiseDB';
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
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  },

  async savePraise(date, content, style) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(['praises'], 'readwrite');
      const store = tx.objectStore('praises');
      store.put({ date, content, style, timestamp: Date.now() });
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
  },

  async saveSetting(key, value) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(['settings'], 'readwrite');
      const store = tx.objectStore('settings');
      store.put({ key, value });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  },

  async getSetting(key) {
    const database = await this.init();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(['settings'], 'readonly');
      const store = tx.objectStore('settings');
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }
};

// 生成随机夸夸
function generatePraise(styles = ['gentle']) {
  const style = styles[Math.floor(Math.random() * styles.length)];
  const praises = PRAISE_LIBRARY[style] || PRAISE_LIBRARY.gentle;
  return {
    content: praises[Math.floor(Math.random() * praises.length)],
    style: style
  };
}

// 预生成未来7天
async function preGeneratePraises(styles) {
  const statusBar = document.getElementById('statusBar');
  statusBar.innerHTML = '<span class="loading"></span> 正在为你准备温暖...';

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const existing = await db.getPraise(dateStr);
    if (!existing) {
      const praise = generatePraise(styles);
      await db.savePraise(dateStr, praise.content, praise.style);
    }
  }

  statusBar.textContent = '✅ 已准备好未来7天的夸夸！';
  setTimeout(() => {
    statusBar.textContent = '';
  }, 3000);
}

// 显示今天的夸夸
async function showTodayPraise() {
  const today = new Date().toISOString().split('T')[0];
  const praiseText = document.getElementById('praiseText');
  const praiseDate = document.getElementById('praiseDate');
  const generateBtn = document.getElementById('generateBtn');

  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="loading"></span> 生成中...';

  let record = await db.getPraise(today);

  if (!record) {
    const settings = await db.getSetting('styles') || ['gentle'];
    const praise = generatePraise(settings);
    await db.savePraise(today, praise.content, praise.style);
    record = { content: praise.content };
  }

  // 打字机效果
  praiseText.textContent = '';
  const text = record.content;
  let i = 0;

  const typeWriter = () => {
    if (i < text.length) {
      praiseText.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    } else {
      generateBtn.disabled = false;
      generateBtn.textContent = '✨ 再夸一次';
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
}

// 注册 Service Worker
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

// 请求通知权限
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('你的设备不支持推送通知');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// 发送测试通知
function sendTestNotification() {
  if (Notification.permission === 'granted') {
    new Notification('💫 夸夸时间到！', {
      body: '今天的你，已经在闪闪发光了✨',
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23FF69B4" width="192" height="192" rx="40"/><text x="96" y="120" font-size="80" text-anchor="middle">💖</text></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23FF69B4" width="192" height="192" rx="40"/><text x="96" y="120" font-size="80" text-anchor="middle">💖</text></svg>',
      requireInteraction: true
    });
  }
}

// 设置定时推送（简化版）
async function scheduleDailyPraise(time, styles) {
  // 保存设置
  await db.saveSetting('pushTime', time);
  await db.saveSetting('styles', styles);
  await db.saveSetting('pushEnabled', true);

  // 预生成文案
  await preGeneratePraises(styles);

  // 通知 Service Worker
  const reg = await navigator.serviceWorker.ready;
  reg.active.postMessage({
    type: 'SCHEDULE_NOTIFICATION',
    time: time
  });

  // 发送测试通知
  sendTestNotification();

  return true;
}

// 初始化漂浮的心
function initHearts() {
  const container = document.getElementById('hearts');
  const hearts = ['💕', '💖', '💗', '💝', '💘'];

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 10 + 's';
    heart.style.animationDuration = (8 + Math.random() * 6) + 's';
    container.appendChild(heart);
  }
}

// 显示安装提示
function showInstallHint() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (!isStandalone) {
    const hint = document.getElementById('installHint');
    const text = document.getElementById('installText');
    hint.classList.add('active');

    if (isIOS) {
      text.innerHTML = '点击分享按钮 <span style="font-size:1.2em">⎋</span> → 添加到主屏幕';
    } else if (isAndroid) {
      text.textContent = '点击菜单 ⋮ → 添加到主屏幕/安装应用';
    }
  }
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 初始化
  initHearts();
  await registerSW();
  showInstallHint();

  // 加载保存的设置
  const savedNickname = await db.getSetting('nickname');
  const savedStyles = await db.getSetting('styles');
  const savedTime = await db.getSetting('pushTime');

  if (savedNickname) {
    document.getElementById('nickname').value = savedNickname;
  }
  if (savedTime) {
    document.getElementById('pushTime').value = savedTime;
  }
  if (savedStyles) {
    document.querySelectorAll('.tag').forEach(tag => {
      tag.classList.toggle('active', savedStyles.includes(tag.dataset.style));
    });
  }

  // 生成按钮
  document.getElementById('generateBtn').addEventListener('click', showTodayPraise);

  // 设置面板切换
  document.getElementById('settingsBtn').addEventListener('click', () => {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('active');
  });

  // 标签选择
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  // 保存设置
  document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
    const nickname = document.getElementById('nickname').value.trim();
    const time = document.getElementById('pushTime').value;
    const activeTags = Array.from(document.querySelectorAll('.tag.active')).map(t => t.dataset.style);

    if (activeTags.length === 0) {
      alert('请至少选择一种风格');
      return;
    }

    // 保存昵称
    if (nickname) {
      await db.saveSetting('nickname', nickname);
    }

    // 请求通知权限并设置推送
    const granted = await requestNotificationPermission();
    if (granted) {
      await scheduleDailyPraise(time, activeTags);

      const statusBar = document.getElementById('statusBar');
      statusBar.textContent = `✅ 设置成功！每天 ${time} 准时收到夸夸~`;

      document.getElementById('settingsPanel').classList.remove('active');
    } else {
      alert('需要通知权限才能定时推送夸夸哦~');
    }
  });

  // 检查今天是否已有夸夸，有则直接显示
  const today = new Date().toISOString().split('T')[0];
  const todayPraise = await db.getPraise(today);
  if (todayPraise) {
    document.getElementById('praiseText').textContent = todayPraise.content;
    document.getElementById('praiseDate').textContent = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    document.getElementById('generateBtn').textContent = '✨ 再夸一次';
  }
});
