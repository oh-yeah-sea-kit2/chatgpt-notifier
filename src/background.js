import { logger } from './utils/logger';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.log('Background: メッセージを受信:', message);
  
  if (message.type === 'SHOW_NOTIFICATION') {
    // Promiseチェーンで処理を行う
    chrome.storage.sync.get({
      enableNotification: false,
      enableSound: true,
      volume: 70
    }).then(async (items) => {
      const promises = [];

      if (items.enableNotification) {
        const pageTitle = sender.tab?.title || 'ChatGPT';
        promises.push(
          chrome.notifications.create('', {
            type: 'basic',
            iconUrl: chrome.runtime.getURL('images/icon128.png'),
            title: 'ChatGPT 通知',
            message: `「${pageTitle}」で応答がありました`,
            silent: true
          })
        );
      }

      if (items.enableSound) {
        // タブに音声再生を依頼
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'PLAY_SOUND',
          volume: items.volume
        });
      }

      sendResponse({ success: true });
      return Promise.all(promises);
    })
    .catch(error => {
      logger.error('通知処理エラー:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true;
  }
});

// タブの更新を監視
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('chat.openai.com')) {
    logger.log('ChatGPTタブが更新されました:', tabId);
  }
});
