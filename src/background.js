import { logger } from './utils/logger';

chrome.runtime.onMessage.addListener((message, sender) => {
  logger.log('Background: メッセージを受信:', message);
  
  if (message.type === 'SHOW_NOTIFICATION') {
    chrome.storage.sync.get({
      enableNotification: false,
      enableSound: true
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
        // 通知を発生させたタブにのみ音声再生メッセージを送信
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'PLAY_NOTIFICATION_SOUND'
        }).catch(error => {
          logger.error('音声再生メッセージの送信エラー:', error);
        });
      }
    });

    // メッセージを処理したことを示すために true を返す
    return true;
  }
});

// タブの更新を監視
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('chat.openai.com')) {
    logger.log('ChatGPTタブが更新されました:', tabId);
  }
});
