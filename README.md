# ChatGPT Notifier

ChatGPTの応答を監視して、デスクトップ通知と音声で知らせる Chrome 拡張機能です。

## 機能

- ChatGPTの応答完了時にデスクトップ通知
- 通知音の再生（音量調節可能）
- 監視対象モデルの選択と管理
- 開発モードでのデバッグログ表示

## インストール

1. このリポジトリをクローン

```bash
git clone https://github.com/oh-yeah-sea-kit2/chatgpt-notifier.git
cd chatgpt-notifier
```

2. 依存パッケージをインストール

```bash
npm install
```

3. 拡張機能をビルド

```bash
npm run build  # 本番用ビルド
# または
npm run build:dev  # 開発用ビルド
```

4. Chrome拡張機能の読み込み
   - 開発時：
     1. Chrome拡張機能ページ（chrome://extensions/）を開く
     2. 「デベロッパーモード」を有効化
     3. 「パッケージ化されていない拡張機能を読み込む」をクリック
     4. `dist`ディレクトリを選択
   
   - 本番リリース時：
     1. `npm run build`で生成された`chatgpt-notifier.zip`を使用

## 開発

```bash
npm run dev  # 開発モードで実行（ファイル監視）
```

## 設定

- デスクトップ通知の有効/無効
- 通知音の有効/無効と音量調節
- 監視対象モデルの追加/削除/有効化/無効化

## ビルドモード

- 開発モード：
  - デバッグログを出力
  - `dist`ディレクトリに必要なファイルを配置
  
- 本番モード：
  - デバッグログを出力しない
  - `dist`ディレクトリに必要なファイルを配置
  - `chatgpt-notifier.zip`を生成

## ライセンス

MIT

## 注意事項

- ChatGPTのUIが変更された場合、動作しなくなる可能性があります
- ChatGPTの利用規約に従って使用してください

## Chrome Web Storeへの公開手順

1. 拡張機能のパッケージング

```bash
npm run build  # 本番用ビルドを実行
```

2. 必要なアセットの準備

- アイコン画像（128x128px、48x48px、16x16px）
- スクリーンショット（1280x800px推奨）
- プロモーション用バナー（440x280px）
- 詳細な説明文（日本語・英語）
- プライバシーポリシー

3. Chrome Developer Dashboardでの登録

- https://chrome.google.com/webstore/devconsole/ にアクセス
- 開発者登録（一時金$5.00必要）
- 「新しい商品を追加」から拡張機能をアップロード
- 必要情報を入力：
  - 拡張機能の説明
  - カテゴリー選択
  - プライバシーポリシー
  - アイコンとスクリーンショット
- 審査提出

## 審査のポイント

- Manifest V3を使用していること
- プライバシーポリシーの提供
- 適切な権限要求
- セキュリティ上の考慮事項の明記
- 明確な機能説明
