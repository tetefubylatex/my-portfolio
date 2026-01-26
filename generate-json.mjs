import fs from 'fs';
import path from 'path';

// 親となるフォルダ（この中を全探索します）
const rootWorksDir = './src/assets/works';

console.log('--- JSON再帰生成スクリプト開始 ---');

if (!fs.existsSync(rootWorksDir)) {
  console.error(`❌ フォルダが見つかりません: ${rootWorksDir}`);
  process.exit(1);
}

// フォルダ内を再帰的に探索する関数
function walkAndGenerate(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // フォルダなら、さらにその中を探索（再帰）
      walkAndGenerate(fullPath);
    } else if (/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i.test(file)) {
      // 画像ファイルなら、JSONがあるか確認して生成
      const fileInfo = path.parse(fullPath);
      const jsonPath = path.join(fileInfo.dir, `${fileInfo.name}.json`);

      if (!fs.existsSync(jsonPath)) {
        const template = {
          id: fileInfo.name,
          title: fileInfo.name,
          date: "2026.01.26",
          memo: "ここに説明文を書いてください。",
          tags: ["New"]
        };

        fs.writeFileSync(jsonPath, JSON.stringify(template, null, 2), 'utf8');
        console.log(`✅ 作成: ${path.relative(rootWorksDir, jsonPath)}`);
      }
    }
  });
}

walkAndGenerate(rootWorksDir);
console.log('--- すべての探索が終了しました ---');
