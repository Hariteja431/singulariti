/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://singulariti.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/blog/search'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://singulariti.in/server-sitemap.xml',
    ],
  },
}
