const CACHE_NAME = 'praise-app-v4';
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

// ==================== 推送系统 ====================
let activeTimers = [];
let pushSchedule = [];

// 内容库
const CONTENT_LIBRARY = {
  energy: ["新的一天，带着能量出发。", "今日的你，也会闪闪发光。", "开工了，慢慢来就好。"],
  relax: ["午休时间，好好吃饭。", "停下来，休息也是工作的一部分。", "此刻的宁静，请收入心底。"],
  heal: ["一日的辛劳，值得被温柔以待。", "下班了，今天也辛苦了。", "归途的风景，是给你我的礼物。"],
  tech: ["代码的世界，由你构建。", "Bug总会解决，就像困难总会过去。", "你的逻辑，清晰如晨光。"],
  nightOwl: ["深夜的屏幕，映着你的专注。", "夜色温柔，不必太晚。", "星光不负赶路人。"],
  encourage: ["每一步都在前进，哪怕很小。", "相信自己的选择。", "今天的努力，明天的你会感谢。"],
  calm: ["深呼吸，一切都好。", "不必着急，按你的节奏来。", "此刻的你，已经够好了。"],
  inspire: ["灵感可能在下一刻到来。", "保持好奇，世界很大。", "你的独特，是世界的礼物。"],
  gentle: ["轻轻地，善待自己。", "敏感是天赋，不是你的错。", "世界喧嚣，你可以安静。"],
  zen: ["无事小神仙。", "随遇而安。", "云淡风轻。"],
  cheer: ["新的一天，加油。", "你的付出，有人看见。", "辛苦了，再坚持一下。"],
  persist: ["halfway there，继续。", "累的时候，想想为什么开始。", "你的坚守，有意义。"],
  rest: ["终于可以休息了。", "卸下疲惫，好梦。", "你值得好好睡一觉。"]
};

// 接收消息
self.addEventListener('message', (event) => {
  if (event.data.type === 'SET_SCHEDULE') {
    setPushSchedule(event.data.schedule);
  } else if (event.data.type === 'STOP_PUSH') {
    stopAllPushes();
  } else if (event.data.type === 'TEST_PUSH') {
    sendTestPush(event.data.contentType);
  }
});

// 设置推送计划
function setPushSchedule(schedule) {
  stopAllPushes();
  pushSchedule = schedule;
  
  console.log('[SW] 设置推送计划:', schedule);
  
  schedule.forEach((push, index) => {
    schedulePush(push, index);
  });
}

// 安排单次推送
function schedulePush(push, index) {
  const [hour, minute] = push.time.split(':').map(Number);
  
  function calculateNext() {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    return next - now;
  }
  
  const delay = calculateNext();
  
  console.log(`[SW] 推送 #${index + 1} 安排在 ${push.time}, ${Math.round(delay/1000/60)}分钟后`);
  
  const timer = setTimeout(() => {
    sendPush(push);
    // 每天重复
    schedulePush(push, index);
  }, delay);
  
  activeTimers.push(timer);
}

// 发送推送
function sendPush(push) {
  const contents = CONTENT_LIBRARY[push.content] || CONTENT_LIBRARY.energy;
  const content = contents[Math.floor(Math.random() * contents.length)];
  
  const icon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%238B7355" width="192" height="192" rx="40"/><text x="96" y="130" font-size="100" text-anchor="middle" fill="white">文</text></svg>';
  
  self.registration.showNotification('今日夸夸', {
    body: content,
    icon: icon,
    badge: icon,
    tag: `praise-${Date.now()}`,
    requireInteraction: false,
    vibrate: [100, 50, 100],
    data: { url: '/' }
  });
  
  console.log('[SW] 推送已发送:', content);
}

// 测试推送
function sendTestPush(contentType = 'energy') {
  const contents = CONTENT_LIBRARY[contentType] || Object.values(CONTENT_LIBRARY).flat();
  const content = contents[Math.floor(Math.random() * contents.length)];
  
  const icon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%238B7355" width="192" height="192" rx="40"/><text x="96" y="130" font-size="100" text-anchor="middle" fill="white">测</text></svg>';
  
  self.registration.showNotification('推送测试', {
    body: content,
    icon: icon,
    badge: icon,
    tag: 'test-push',
    requireInteraction: false,
    vibrate: [100, 50, 100],
    data: { url: '/' }
  });
}

// 停止所有推送
function stopAllPushes() {
  activeTimers.forEach(timer => clearTimeout(timer));
  activeTimers = [];
  console.log('[SW] 所有推送已停止');
}

// 点击通知
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
