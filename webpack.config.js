const path = require('path');

module.exports = {
  entry: {
    background: path.join(__dirname, "src/background.js"),
    content: path.join(__dirname, "src/content.js"),
    popup: path.join(__dirname, "src/popup.js")
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 出力先ディレクトリ
    filename: '[name].js', // 出力ファイル名
  },
  mode: 'production', // 本番モード
};
