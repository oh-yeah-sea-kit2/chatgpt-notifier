chrome.runtime.onMessage.addListener((message) => {
  console.log('Background: メッセージを受信:', message);
  
  if (message.type === 'SHOW_NOTIFICATION') {
    // デフォルト設定を変更
    chrome.storage.sync.get({
      enableNotification: false,  // デフォルトでオフ
      enableSound: true,         // デフォルトでオン
      volume: 70                 // デフォルトで70%
    }, (items) => {
      if (items.enableNotification) {
        chrome.notifications.create('', {
          type: 'basic',
          iconUrl: chrome.runtime.getURL('images/icon128.png'),
          title: message.payload.title,
          message: message.payload.message,
          silent: true
        });
      }

      if (items.enableSound) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'PLAY_NOTIFICATION_SOUND'
            });
          }
        });
      }
    });
  }
});
