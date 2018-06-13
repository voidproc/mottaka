const webpack = require('webpack')

module.exports = {
  head: {
    title: 'MOTTAKA?',
    meta: [
      { charset: 'utf-8' },
    ],
    link: [
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css' }
    ]
  },
  css: [
    { src: '~assets/main.scss', lang: 'sass' }
  ],
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  build: {
    analyze: {
      analyzerMode: 'static',
    },
    vendor: [
      'axios',
    ],
  },
  router: {
  },
  modules: [
    '@nuxtjs/dotenv',
  ],
  env: {
    FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
    FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
    FIREBASE_DATABASEURL: process.env.FIREBASE_DATABASEURL,
    FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
    FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET,
    FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID
  },
  serverMiddleware: [
    '~/api/index.js',
  ]
}