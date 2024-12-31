import { 
  stopButtonSelector,
  speechButtonSelector, 
  sendButtonSelector,
  modelSelector,
  getTargetModels
} from './selectors.js';
import { logger } from './utils/logger';

let isListenerRegistered = false;
let currentObserver = null;
let currentUrl = null;
let currentMode = null;
let targetModels = [];

// 関数を先に定義
const getCurrentMode = () => {
  const stopButton = document.querySelector(stopButtonSelector);
  const speechButton = document.querySelector(speechButtonSelector);
  const sendButton = document.querySelector(sendButtonSelector);

  if (stopButton) {
    return "ストリーミングの停止";
  } else if (speechButton || sendButton) {
    return "音声モード, 送信モードを開始する";
  }
  return null;
};

const getCurrentModel = () => {
  const modelElement = document.querySelector(modelSelector);
  return modelElement ? modelElement.textContent.trim() : null;
};

export async function monitorButtonStates() {
  if (currentObserver) {
    currentObserver.disconnect();
  }

  // 初期設定
  targetModels = await getTargetModels();
  currentUrl = window.location.href;
  currentMode = getCurrentMode();

  const checkButtonStates = async () => {
    // 現在の状態を取得
    const newMode = getCurrentMode();
    const currentModel = getCurrentModel();

    // URLの変更を最初にチェック
    if (window.location.href !== currentUrl) {
      logger.log('URLが変更されました:', window.location.href);
      // 状態を更新
      currentUrl = window.location.href;
      targetModels = await getTargetModels();
      currentMode = newMode;
      
      // 新しい状態をログ
      logger.log('新しい状態:', {
        url: currentUrl,
        mode: currentMode,
        model: currentModel
      });
      
      // 次のチェックサイクルまで待機するため、ここで終了
      return;
    }

    // 前回の状態と比較して、意図した遷移かどうかを確認
    const isValidTransition = 
      currentMode === "ストリーミングの停止" && 
      newMode === "音声モード, 送信モードを開始する" &&
      currentModel && 
      targetModels.includes(currentModel) &&
      !isUrlChangeInProgress;  // URL変更中でないことを確認

    if (isValidTransition) {
      logger.log(`状態が変更されました (${currentModel}): ストリーミングの停止 -> 音声モードまたは送信モード`);
      await notifyUser("ChatGPT", "ChatGPTからのメッセージが届きました");
    }

    // 現在の状態を保存
    currentMode = newMode;
  };

  const notifyUser = async (title, message) => {
    logger.log('Content: 通知メッセージを送信:', { title, message });
    
    try {
      if (!chrome.runtime?.id) {
        logger.log('拡張機能のコンテキストが無効です。');
        return;
      }

      // 通知を送信するのみ
      await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          type: 'SHOW_NOTIFICATION',
          payload: { title, message }
        }, response => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });

    } catch (error) {
      if (error.message.includes('Extension context invalidated')) {
        logger.log('拡張機能のコンテキストが無効になりました。');
        currentObserver?.disconnect();
        return;
      }
      logger.error('メッセージ送信中にエラー:', error);
    }
  };

  // URL変更中かどうかを追跡するフラグ
  let isUrlChangeInProgress = false;

  // URLの変更を監視
  window.addEventListener('beforeunload', () => {
    isUrlChangeInProgress = true;
  });

  window.addEventListener('load', () => {
    isUrlChangeInProgress = false;
  });

  // ボタンの状態を監視
  const observer = new MutationObserver(() => checkButtonStates());
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  currentObserver = observer;
  await checkButtonStates();  // 初期状態をチェック

  // 音声再生のメッセージリスナーを追加
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PLAY_SOUND') {
      const audio = new Audio(chrome.runtime.getURL('sounds/notification.wav'));
      audio.volume = message.volume / 100;
      audio.play();
    }
  });
}
