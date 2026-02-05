// 日志工具类
// 在开发环境显示调试日志，生产环境自动屏蔽

// 环境判断
const isDev = process.env.NODE_ENV === 'development';

/**
 * 日志工具
 */
export const logger = {
  /**
   * 调试日志
   * @param {string} msg - 日志消息
   * @param {any} data - 附加数据
   */
  debug: (msg, data) => {
    if (isDev) {
      console.log(`[调试] ${new Date().toLocaleTimeString()}：`, msg, data || '');
    }
  },
  
  /**
   * 错误日志
   * @param {string} msg - 日志消息
   * @param {Error} err - 错误对象
   */
  error: (msg, err) => {
    console.error(`[错误] ${new Date().toLocaleTimeString()}：`, msg, err || '');
  },
  
  /**
   * 信息日志
   * @param {string} msg - 日志消息
   * @param {any} data - 附加数据
   */
  info: (msg, data) => {
    if (isDev) {
      console.info(`[信息] ${new Date().toLocaleTimeString()}：`, msg, data || '');
    }
  }
};
