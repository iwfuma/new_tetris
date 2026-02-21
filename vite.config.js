import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages では /リポジトリ名/ がベースパスになる
// 例: https://username.github.io/tetris-game/ → base: '/tetris-game/'
// ローカル開発では '/' のまま動作する
const base = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  : '/'

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})