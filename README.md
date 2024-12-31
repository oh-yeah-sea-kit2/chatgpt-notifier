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

4. Chrome拡張機能ページ（chrome://extensions/）を開く
5. 「デベロッパーモード」を有効化
6. 「パッケージ化されていない拡張機能を読み込む」をクリック
7. このディレクトリを選択

## 開発

```bash
npm run dev  # 開発モードで実行（ファイル監視）
```

## 設定

- デスクトップ通知の有効/無効
- 通知音の有効/無効と音量調節
- 監視対象モデルの追加/削除/有効化/無効化

## ビルドモード

- 開発モード：デバッグログを出力
- 本番モード：デバッグログを出力しない

## ライセンス

MIT

## 注意事項

- ChatGPTのUIが変更された場合、動作しなくなる可能性があります
- ChatGPTの利用規約に従って使用してください