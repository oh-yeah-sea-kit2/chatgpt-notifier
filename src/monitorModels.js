import { modelSelector, targetModels } from './selectors.js';

export function monitorModelChange(onTargetModelDetected) {
  const modelElement = document.querySelector(modelSelector);

  if (!modelElement) {
    console.error("指定されたモデル要素が見つかりませんでした。");
    return;
  }

  console.log("モデル監視開始");

  // 初期モデルの確認と監視開始
  const initialModel = modelElement.textContent.trim();
  if (targetModels.includes(initialModel)) {
    console.log(`初期モデル (${initialModel}) が対象モデルに一致しました。監視を開始します。`);
    onTargetModelDetected();
  }

  // MutationObserverでモデルの変化を監視
  const observer = new MutationObserver(() => {
    const newModel = modelElement.textContent.trim();

    if (targetModels.includes(newModel)) {
      console.log(`モデルが変更されました: ${newModel}`);
      onTargetModelDetected();
    } else {
      console.log(`モデルが変更されましたが (${newModel}) 、対象モデルに一致しません。`);
    }
  });

  observer.observe(modelElement, {
    characterData: true,
    childList: true,
    subtree: true
  });
}
