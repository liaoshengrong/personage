/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  }.includePaths,
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'zh'],
  //   localePath: path.resolve('./public/locales'),
  // },
}


module.exports = nextConfig
