const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })

module.exports = withBundleAnalyzer({
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}) 