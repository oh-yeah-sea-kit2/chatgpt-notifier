document.addEventListener('DOMContentLoaded', () => {
  const notificationCheckbox = document.getElementById('enableNotification');
  const soundCheckbox = document.getElementById('enableSound');
  const volumeSlider = document.getElementById('volume');
  const volumeValue = document.getElementById('volumeValue');
  const modelList = document.getElementById('modelList');
  const newModelInput = document.getElementById('newModel');
  const addModelButton = document.getElementById('addModel');

  // 設定を読み込む
  chrome.storage.sync.get({
    enableNotification: false,
    enableSound: true,
    volume: 70,
    targetModels: ['4o', 'o1', 'o1-mini', 'o1 pro'],  // デフォルトのモデル
    activeModels: ['o1', 'o1 pro']   // 有効なモデル
  }, (items) => {
    notificationCheckbox.checked = items.enableNotification;
    soundCheckbox.checked = items.enableSound;
    volumeSlider.value = items.volume;
    volumeValue.textContent = `${items.volume}%`;
    renderModelList(items.targetModels, items.activeModels);
  });

  // モデルリストを描画
  function renderModelList(models, activeModels) {
    modelList.innerHTML = '';
    models.forEach(model => {
      const div = document.createElement('div');
      div.className = 'model-item';
      div.innerHTML = `
        <label>
          <input type="checkbox" class="model-checkbox" 
                 data-model="${model}" 
                 ${activeModels.includes(model) ? 'checked' : ''}>
          <span class="model-name">${model}</span>
        </label>
        <button class="delete-btn" data-model="${model}">削除</button>
      `;
      modelList.appendChild(div);
    });

    // チェックボックスのイベントリスナーを設定
    document.querySelectorAll('.model-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const model = e.target.dataset.model;
        chrome.storage.sync.get(['activeModels'], (items) => {
          let activeModels = items.activeModels || [];
          if (e.target.checked) {
            activeModels = [...new Set([...activeModels, model])];
          } else {
            activeModels = activeModels.filter(m => m !== model);
          }
          chrome.storage.sync.set({ activeModels });
        });
      });
    });

    // 削除ボタンのイベントリスナーを設定
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modelToDelete = e.target.dataset.model;
        chrome.storage.sync.get(['targetModels', 'activeModels'], (items) => {
          const updatedModels = items.targetModels.filter(m => m !== modelToDelete);
          const updatedActiveModels = items.activeModels.filter(m => m !== modelToDelete);
          chrome.storage.sync.set({ 
            targetModels: updatedModels,
            activeModels: updatedActiveModels
          }, () => {
            renderModelList(updatedModels, updatedActiveModels);
          });
        });
      });
    });
  }

  // モデル追加機能
  addModelButton.addEventListener('click', () => {
    const newModel = newModelInput.value.trim();
    if (newModel) {
      chrome.storage.sync.get({
        targetModels: ['4o', 'o1', 'o1-mini', 'o1 pro'],  // デフォルト値を設定
        activeModels: ['o1', 'o1 pro']   // デフォルト値を設定
      }, (items) => {
        if (!items.targetModels.includes(newModel)) {
          const updatedModels = [...items.targetModels, newModel];
          const updatedActiveModels = [...(items.activeModels || []), newModel]; // nullチェックを追加
          chrome.storage.sync.set({ 
            targetModels: updatedModels,
            activeModels: updatedActiveModels
          }, () => {
            renderModelList(updatedModels, updatedActiveModels);
            newModelInput.value = '';
          });
        }
      });
    }
  });

  // Enterキーでもモデルを追加できるように
  newModelInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addModelButton.click();
    }
  });

  // 既存の設定変更リスナー
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

  volumeSlider.addEventListener('input', () => {
    const value = volumeSlider.value;
    volumeValue.textContent = `${value}%`;
    chrome.storage.sync.set({
      volume: Number(value)
    });
  });
}); 
