// chrome.runtime.onInstalled.addListener(() => {
//   // // 通知を作成
//   // chrome.notifications.create('', {
//   //   type: 'basic',
//   //   iconUrl: 'icon.png',
//   //   title: '通知テスト',
//   //   message: '通知と音のテストです！'
//   // }, (notificationId) => {
//   //   console.log('通知ID: ', notificationId);

//   //   // TTSを使用して音声を再生
//   //   chrome.tts.speak('通知が届きました', {
//   //     lang: 'ja-JP',
//   //     rate: 1.0,
//   //     pitch: 1.0,
//   //     volume: 1.0
//   //   });
//   // });
// });

chrome.runtime.onMessage.addListener((message) => {
  console.log('Background: メッセージを受信:', message);
  
  if (message.type === 'SHOW_NOTIFICATION') {
    // 通知を表示
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('images/icon128.png'),
      title: message.payload.title,
      message: message.payload.message,
      silent: true  // システムの通知音を無効化
    });

    // Content Scriptに音声再生を指示
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'PLAY_NOTIFICATION_SOUND'
        });
      }
    });
  }
});
