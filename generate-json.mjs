import fs from 'fs';
import path from 'path';

// 画像が保存されているルートディレクトリ
const rootWorksDir = './src/assets/works';
const contentWorksDir = './src/content/works';
const publicWorksDir = './public/images/works';

// ディレクトリが存在しなければ作成
if (!fs.existsSync(contentWorksDir)) {
  fs.mkdirSync(contentWorksDir, { recursive: true });
}

if (!fs.existsSync(publicWorksDir)) {
  fs.mkdirSync(publicWorksDir, { recursive: true });
}

function getImageRelativePath(imagePath) {
  // src/assets/works の下での相対パスを取得
  const relativePath = path.relative('./src/assets/works', imagePath);
  return relativePath.replace(/\\/g, '/'); // Windows対応：バックスラッシュをスラッシュに変換
}

function copyImageToPublic(sourcePath, relativePath) {
  // public/images/works/26Feb/IMG_2536.jpeg のようなフルパスを構築
  const destPath = path.join(publicWorksDir, relativePath);
  const destDir = path.dirname(destPath);

  // ディレクトリが存在しなければ作成
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 画像をコピー
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`📋 画像をコピーしました: ${relativePath}`);
  }
}

function generateMarkdownTemplate(fileName, relativePath) {
  // ファイル名をタイトルに変換（IMG_2536 -> IMG_2536）
  const title = fileName;
  
  // slug を小文字で生成
  const slug = fileName.toLowerCase();
  
  // 日付を取得（YYYY-MM-DD形式）
  const date = new Date().toISOString().split('T')[0];

  return `---
slug: "${slug}"
title: "${title}"
author: "テテフでLaTeX"
charName: "None"
date: ${date}
image: "${relativePath}"
software: "Procreate"
tags: ["ファンアート"]
---

説明文がありません。
`;
}

function walkAndGenerate(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      walkAndGenerate(fullPath);
    } else if (/\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i.test(file)) {
      const fileInfo = path.parse(fullPath);
      const mdPath = path.join(contentWorksDir, `${fileInfo.name}.md`);

      // マークダウンがまだ存在しない場合のみ新規作成
      if (!fs.existsSync(mdPath)) {
        const relativePath = getImageRelativePath(fullPath);
        const mdContent = generateMarkdownTemplate(fileInfo.name, relativePath);

        fs.writeFileSync(mdPath, mdContent, 'utf8');
        console.log(`✅ マークダウンを生成しました: ${fileInfo.name}.md`);
      }

      // 画像を public にコピー
      const relativePath = getImageRelativePath(fullPath);
      copyImageToPublic(fullPath, relativePath);
    }
  });
}

console.log("🚀 マークダウン生成・画像コピープロセスを開始します...");
walkAndGenerate(rootWorksDir);
console.log("✨ すべての処理が完了しました。");
