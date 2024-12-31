import { 
  stopButtonSelector,
  speechButtonSelector, 
  sendButtonSelector,
  modelSelector,
  getTargetModels
} from './selectors.js';

// グローバルで監視状態を管理
let isListenerRegistered = false;
let currentObserver = null;

export async function monitorButtonStates() {
  // 既存の監視を停止
  if (currentObserver) {
    currentObserver.disconnect();
  }

  let currentMode = null;
  const targetModels = await getTargetModels();

  // ボタン状態の変更を確認する関数
  const checkButtonStates = () => {
    const stopButton = document.querySelector(stopButtonSelector);
    const speechButton = document.querySelector(speechButtonSelector);
    const sendButton = document.querySelector(sendButtonSelector);
    const modelElement = document.querySelector(modelSelector);

    // 現在のモデルを取得
    const currentModel = modelElement ? modelElement.textContent.trim() : null;

    // 新しいモードを判定
    let newMode = null;
    if (stopButton) {
      newMode = "ストリーミングの停止";
    } else if (speechButton || sendButton) {
      newMode = "音声モード, 送信モードを開始する";
    }

    // 状態が変更され、かつtargetModelsに含まれる場合のみ通知
    if (currentMode === "ストリーミングの停止" && 
        newMode === "音声モード, 送信モードを開始する" && 
        currentModel && 
        targetModels.includes(currentModel)) {
      console.log(`状態が変更されました (${currentModel}): ストリーミングの停止 -> 音声モードまたは送信モード`);
      notifyUser("ChatGPT", "ChatGPTからのメッセージが届きました");
    }

    // 現在のモードを更新
    currentMode = newMode;
  };

  // 通知を送る関数
  const notifyUser = (title, message) => {
    console.log('Content: 通知メッセージを送信:', { title, message });
    
    try {
      // 拡張機能のコンテキストが有効かチェック
      if (!chrome.runtime?.id) {
        console.log('拡張機能のコンテキストが無効です。再読み込みが必要かもしれません。');
        return;
      }

      chrome.runtime.sendMessage({
        type: 'SHOW_NOTIFICATION',
        payload: {
          title: title,
          message: message
        }
      }).catch(error => {
        if (error.message.includes('Extension context invalidated')) {
          console.log('拡張機能のコンテキストが無効になりました。');
          // 必要に応じて監視を停止
          observer.disconnect();
          return;
        }
        console.log('送信エラー:', error);
      });
    } catch (error) {
      if (error.message.includes('Extension context invalidated')) {
        console.log('拡張機能のコンテキストが無効になりました。');
        // 必要に応じて監視を停止
        observer.disconnect();
        return;
      }
      console.error('メッセージ送信中にエラーが発生:', error);
    }
  };

  // 新しい監視を開始
  currentObserver = new MutationObserver(() => {
    try {
      if (!chrome.runtime?.id) {
        console.log('拡張機能のコンテキストが無効です。監視を停止します。');
        currentObserver.disconnect();
        return;
      }
      checkButtonStates();
    } catch (error) {
      console.error('監視中にエラーが発生:', error);
      currentObserver.disconnect();
    }
  });

  currentObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  checkButtonStates();

  // 音声再生のリスナーを1回だけ登録
  if (!isListenerRegistered) {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'PLAY_NOTIFICATION_SOUND') {
        try {
          chrome.storage.sync.get({
            volume: 100
          }, (items) => {
            const audio = new Audio(chrome.runtime.getURL('sounds/notification.wav'));
            audio.volume = items.volume / 100; // 0.0 から 1.0 の範囲に変換
            audio.play().catch(error => {
              console.error('音声再生エラー:', error);
            });
          });
        } catch (error) {
          console.error('音声初期化エラー:', error);
        }
      }
    });
    isListenerRegistered = true;
  }
}
