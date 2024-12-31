const fs = require('fs');
const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';

// distディレクトリが存在しない場合は作成
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const manifest = {
  manifest_version: 3,
  name: isDevelopment ? '[DEV] ChatGPT Notifier' : 'ChatGPT Notifier',
  version: '1.0',
  description: 'ChatGPTのレスポンスを監視して通知を送る拡張機能',
  permissions: [
    'activeTab',
    'scripting',
    'notifications',
    'tts',
    'tabs',
    'storage'
  ],
  host_permissions: [
    'https://chatgpt.com/*'
  ],
  background: {
    service_worker: 'background.js'
  },
  content_scripts: [
    {
      matches: ['https://chatgpt.com/*'],
      js: ['content.js'],
      type: 'module'
    }
  ],
  action: {
    default_title: isDevelopment ? '[DEV] ChatGPT Notifier' : 'ChatGPT Notifier',
    default_popup: 'popup.html',
    default_icon: 'images/icon128.png'
  },
  icons: {
    '128': 'images/icon128.png'
  },
  web_accessible_resources: [{
    resources: ['sounds/notification.wav'],
    matches: ['https://chatgpt.com/*']
  }]
};

// distディレクトリに直接書き出し
fs.writeFileSync(
  path.join(__dirname, '../dist/manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`Manifest file generated in dist/ (${isDevelopment ? 'development' : 'production'} mode)`); 
