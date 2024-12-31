import { modelSelector } from './selectors.js';
import { monitorModelChange } from './monitorModels.js';
import { monitorButtonStates } from './monitorButtons.js';

// ページ変化を監視してモデル要素が出現したら監視を開始
const pageObserver = new MutationObserver(() => {
  const modelElement = document.querySelector(modelSelector);

  if (modelElement) {
    monitorModelChange(monitorButtonStates); // ボタン監視をコールバックとして渡す
    pageObserver.disconnect();
  }
});

pageObserver.observe(document.body, {
  childList: true,
  subtree: true
});
