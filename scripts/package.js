const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// distにコピーする必要があるファイル
const filesToCopy = [
  { from: 'popup.html', to: 'popup.html' },
  { from: 'images', to: 'images' },
  { from: 'sounds', to: 'sounds' }
];

// distディレクトリにファイルをコピー
function copyToDist() {
  filesToCopy.forEach(({ from, to }) => {
    const sourcePath = path.join(__dirname, '..', from);
    const targetPath = path.join(__dirname, '../dist', to);

    if (fs.statSync(sourcePath).isDirectory()) {
      // ディレクトリの場合は再帰的にコピー
      fs.cpSync(sourcePath, targetPath, { recursive: true });
      console.log(`Copied directory: ${from} -> dist/${to}`);
    } else {
      // ファイルの場合は単純にコピー
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied file: ${from} -> dist/${to}`);
    }
  });
}

// メイン処理
copyToDist(); 

// 本番環境の場合のみzipを作成
if (process.env.NODE_ENV === 'production') {
  const output = fs.createWriteStream(path.join(__dirname, '../chatgpt-notifier.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Package created: ${archive.pointer()} bytes`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory('dist/', false);
  archive.finalize();
} 
