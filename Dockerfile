FROM node:20-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
