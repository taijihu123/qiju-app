#!/bin/bash

# 隔离前端环境启动脚本

export EXPO_HOME="./.expo-local"
echo "✅ 设置EXPO_HOME为: $EXPO_HOME"

# 检查目录存在性
if [ ! -d "$EXPO_HOME" ]; then
  echo "⚠️  创建EXPO本地目录"
  mkdir -p "$EXPO_HOME"
  chmod 755 "$EXPO_HOME"
fi

echo "\n🚀 启动隔离的前端环境"
echo "📋 配置信息:"
echo "- EXPO_HOME: $EXPO_HOME"
echo "- 项目目录: $(pwd)"
echo "- 启动命令: npx expo start -c"
echo "\n💡 快捷键:"
echo "- w: 在Web浏览器中打开"
echo "- a: 在Android模拟器中打开"
echo "- i: 在iOS模拟器中打开"
echo "- q: 退出"
echo "\n=============================="

# 启动前端
npx expo start -c