// ボタンのセレクタ
export const stopButtonSelector = 'button[data-testid="stop-button"]';
export const speechButtonSelector = 'button[data-testid="composer-speech-button"]';
export const sendButtonSelector = 'button[data-testid="send-button"]';

// モデルのセレクタ
export const modelSelector = 'div.text-token-text-secondary > span.text-token-text-secondary';

// 有効な対象モデルを動的に取得する関数
export async function getTargetModels() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      activeModels: ['o1', 'o1 pro']  // デフォルト値
    }, (items) => {
      resolve(items.activeModels);
    });
  });
}
