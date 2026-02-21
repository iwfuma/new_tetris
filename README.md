# Tetris Game

React + Viteで構築されたテトリスゲームです。

## セットアップ

### ローカル開発環境

```bash
npm install
npm run dev
```

### Docker開発環境

```bash
# コンテナをビルドして起動
docker-compose up --build

# バックグラウンドで起動
docker-compose up -d

# コンテナを停止
docker-compose down
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## 操作方法

- **←**: 左に移動
- **→**: 右に移動
- **↓**: 下に移動
- **↑**: ブロックを回転

## ビルド

```bash
npm run build
```

## プレビュー

```bash
npm run preview
```
