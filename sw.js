const CACHE_NAME = 'praise-app-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icon-192.png.svg'
];

// 安装时缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// 激活
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});

// ==================== 推送相关 ====================

// 存储定时器ID
let pushTimer = null;
let nextPushTime = null;

// 夸夸文案库（用于推送）
const PUSH_PRAISES = [
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
];

// 接收消息
self.addEventListener('message', (event) => {
  if (event.data.type === 'START_PUSH') {
    startPushTimer(event.data.time);
  } else if (event.data.type === 'STOP_PUSH') {
    stopPushTimer();
  } else if (event.data.type === 'TEST_PUSH') {
    showNotification('推送测试', '这是测试通知，功能正常。');
  }
});

// 启动推送定时器
function startPushTimer(timeString) {
  stopPushTimer();
  
  const [targetHour, targetMinute] = timeString.split(':').map(Number);
  
  function scheduleNext() {
    const now = new Date();
    const next = new Date();
    next.setHours(targetHour, targetMinute, 0, 0);
    
    // 如果今天时间已过，推到明天
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    const delay = next - now;
    nextPushTime = next.getTime();
    
    console.log(`[SW] 下次推送: ${next.toLocaleString()}, 还有 ${Math.round(delay/1000/60)} 分钟`);
    
    pushTimer = setTimeout(() => {
      sendDailyPraise();
      scheduleNext(); // 继续安排下一次
    }, delay);
  }
  
  scheduleNext();
}

// 停止推送定时器
function stopPushTimer() {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
}

// 发送每日夸夸
function sendDailyPraise() {
  const praise = PUSH_PRAISES[Math.floor(Math.random() * PUSH_PRAISES.length)];
  showNotification('今日夸夸', praise);
}

// 显示通知
function showNotification(title, body) {
  const icon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%238B7355" width="192" height="192" rx="40"/><text x="96" y="130" font-size="100" text-anchor="middle" fill="white">文</text></svg>';
  
  self.registration.showNotification(title, {
    body: body,
    icon: icon,
    badge: icon,
    tag: 'daily-praise',
    requireInteraction: false,
    silent: false,
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  });
}

// 点击通知
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// 周期性同步（确保推送可靠）
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-praise') {
    event.waitUntil(sendDailyPraise());
  }
});
