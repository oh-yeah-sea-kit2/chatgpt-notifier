import { modelSelector } from './selectors.js';
import { monitorButtonStates } from './monitorButtons.js';

// ページ変化を監視してモデル要素が出現したら監視を開始
const pageObserver = new MutationObserver(() => {
  const modelElement = document.querySelector(modelSelector);

  if (modelElement) {
    monitorButtonStates(); // ボタン監視を開始
    pageObserver.disconnect();
  }
});

pageObserver.observe(document.body, {
  childList: true,
  subtree: true
});
