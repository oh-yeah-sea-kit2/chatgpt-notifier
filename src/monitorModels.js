import { logger } from './utils/logger';
import { modelSelector, getTargetModels } from './selectors.js';

export async function monitorModelChange(onTargetModelDetected) {
  const modelElement = document.querySelector(modelSelector);
  const targetModels = await getTargetModels();

  if (!modelElement) {
    logger.error("指定されたモデル要素が見つかりませんでした。");
    return;
  }

  logger.log("モデル監視開始");

  // 初期モデルの確認と監視開始
  const initialModel = modelElement.textContent.trim();
  if (targetModels.includes(initialModel)) {
    logger.log(`初期モデル (${initialModel}) が対象モデルに一致しました。監視を開始します。`);
    onTargetModelDetected();
  }

  // MutationObserverでモデルの変化を監視
  const observer = new MutationObserver(async () => {
    const newModel = modelElement.textContent.trim();
    const currentTargetModels = await getTargetModels();

    if (currentTargetModels.includes(newModel)) {
      logger.log(`モデルが変更されました: ${newModel}`);
      onTargetModelDetected();
    } else {
      logger.log(`モデルが変更されましたが (${newModel}) 、対象モデルに一致しません。`);
    }
  });

  observer.observe(modelElement, {
    characterData: true,
    childList: true,
    subtree: true
  });
}
