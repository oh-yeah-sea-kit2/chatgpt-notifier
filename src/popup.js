document.addEventListener('DOMContentLoaded', () => {
  const notificationCheckbox = document.getElementById('enableNotification');
  const soundCheckbox = document.getElementById('enableSound');
  const volumeSlider = document.getElementById('volume');
  const volumeValue = document.getElementById('volumeValue');

  // デフォルト設定を変更
  chrome.storage.sync.get({
    enableNotification: false,  // デフォルトでオフ
    enableSound: true,         // デフォルトでオン
    volume: 70                 // デフォルトで70%
  }, (items) => {
    notificationCheckbox.checked = items.enableNotification;
    soundCheckbox.checked = items.enableSound;
    volumeSlider.value = items.volume;
    volumeValue.textContent = `${items.volume}%`;
  });

  // 設定の変更を保存
  notificationCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({
      enableNotification: notificationCheckbox.checked
    });
  });

  soundCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({
      enableSound: soundCheckbox.checked
    });
  });

  // 音量の変更を処理
  volumeSlider.addEventListener('input', () => {
    const value = volumeSlider.value;
    volumeValue.textContent = `${value}%`;
    chrome.storage.sync.set({
      volume: Number(value)
    });
  });
}); 
