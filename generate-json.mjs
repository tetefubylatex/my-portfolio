import fs from 'fs';
import path from 'path';

// 画像が保存されているルートディレクトリ
const rootWorksDir = './src/assets/works';

function walkAndGenerate(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      walkAndGenerate(fullPath);
    } else if (/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i.test(file)) {
      const fileInfo = path.parse(fullPath);
      const jsonPath = path.join(fileInfo.dir, `${fileInfo.name}.json`);

      // JSONがまだ存在しない場合のみ新規作成
      if (!fs.existsSync(jsonPath)) {
        const template = {
          id: fileInfo.name,
          title: fileInfo.name,
          author: "テテフでLaTeX",
          charName: "None", // キャラクター名
          date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
          memo: "No description provided.",
          software: "Procreate", // 使用ソフト
          tags: ["ファンアート"]
        };

        fs.writeFileSync(jsonPath, JSON.stringify(template, null, 2), 'utf8');
        console.log(`✅ JSONを生成しました: ${fileInfo.name}.json`);
      }
    }
  });
}

console.log("🚀 JSON生成プロセスを開始します...");
walkAndGenerate(rootWorksDir);
console.log("✨ すべての処理が完了しました。");
