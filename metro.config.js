const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 添加API代理配置
config.server = {
  ...config.server,
  // 配置代理规则，处理跨域问题
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5001',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/api': '/api' },
    },
  },
};

// 支持web环境
config.resolver = {
  ...config.resolver,
  resolverMainFields: ['react-native', 'browser', 'main'],
};

module.exports = config;
