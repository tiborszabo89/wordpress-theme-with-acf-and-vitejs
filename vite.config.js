
import react from "@vitejs/plugin-react";

import { defineConfig } from 'vite'
import liveReload from 'vite-plugin-live-reload'
import path, {resolve} from 'path'
import fs from 'fs';

const blocksDir = path.resolve(__dirname, 'assets/src/blocks');
const blockEntries = fs.readdirSync(blocksDir).reduce((entries, folder) => {
  const folderPath = path.resolve(blocksDir, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const jsFile = path.resolve(folderPath, `${folder}.js`);
    if (fs.existsSync(jsFile)) {
      entries[folder] = jsFile;
    }
  }
  return entries;
}, {});

export default defineConfig(({ mode }) => ({
  root: '',
  base: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : '/wp-content' + String(resolve(__dirname)).split('wp-content')[1] + '/dist',

  publicDir: resolve(__dirname, './assets/public'),

  build: {
    outDir: './dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        app: process.env.NODE_ENV === 'development'
          ? resolve( __dirname, 'main.js') 
          : resolve( __dirname, 'assets/src/app.js'),
        ...blockEntries
      },
      output: {
        entryFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          var info = assetInfo.name.split(".")
          var extType = info[info.length - 1]
          if(/svg/i.test(extType) && (/<font/).test(assetInfo.source) || /woff|ttf|eot|woff2/.test(extType)){
            extType = 'fonts/';
            return `${extType}[name][extname]`
          }
          else if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img/'
            return `${extType}[name][extname]`
          }
          return `css/[name][extname]`
        },
      }
    },
    minify: true,
    write: true,

  },
  server: {
    watch: {
      usePolling: true,
    },
    origin: 'http://127.0.0.1:3000',
    cors: true,
    host: true,
    strictPort: true,
    port: 3000,
    hmr: {
      port: 3000,
      host: 'localhost',
      protocol: 'ws',
    },

  },
  plugins: [

    react({
      fastRefresh: false
    }),
    liveReload(__dirname+'/**/*.php')
  ],
  css: {
      preprocessorOptions: {
          scss: {
              silenceDeprecations: ['legacy-js-api'],
          },
      },
  },
  resolve: {
    alias: [
      { find: "@" , replacement: process.env.NODE_ENV === 'development' ? '' : `${resolve(__dirname, 'assets/public' )}` }
    ],
  }
}));