const fs = require('fs');
const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';

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
    service_worker: 'dist/background.js'
  },
  content_scripts: [
    {
      matches: ['https://chatgpt.com/*'],
      js: ['dist/content.js'],
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

// プロジェクトのルートディレクトリに書き出し
fs.writeFileSync(
  path.join(__dirname, '../manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`Manifest file generated (${isDevelopment ? 'development' : 'production'} mode)`); 
