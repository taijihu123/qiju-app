// 主题配置
export const theme = {
  // 颜色 - 豆瓣风格
  colors: {
    // 主色调 - 豆瓣豆绿色
    primary: '#41ac52',
    primaryHover: '#389446',
    primaryActive: '#2e7a3a',
    primaryLight: '#e8f4ea',
    
    // 辅助色
    secondary: '#f0f0f0',
    secondaryHover: '#e0e0e0',
    secondaryLight: '#fafafa',
    
    // 背景色
    background: '#fafafa',
    backgroundSecondary: '#f0f0f0',
    backgroundTertiary: '#e0e0e0',
    
    // 文本色
    textPrimary: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // 边框色
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    
    // 功能色
    success: '#41ac52',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    
    // 特殊色
    favorite: '#41ac52',
    favoriteHover: '#389446',
    
    // 中性色
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent'
  },
  
  // 字体大小
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36
  },
  
  // 字重
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  // 间距
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128
  },
  
  // 边框圆角
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999
  },
  
  // 阴影
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4
      },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 5
    }
  }
};