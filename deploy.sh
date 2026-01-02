#!/bin/bash

# ==========================================
# 自动化构建与部署脚本
# 使用方法: ./deploy.sh [env]
# 示例: ./deploy.sh prod
# ==========================================

# --- 配置项 (请根据实际服务器修改) ---
SERVER_USER="root"  # 服务器登录用户名
SERVER_IP="your.server.ip.address"  # 服务器 IP 地址
SERVER_DIR="/var/www/next-app" # 服务器部署目录
PM2_APP_NAME="next-app" # PM2 应用名

# 检查参数
ENV=$1
if [ -z "$ENV" ]; then
  echo "❌ 请指定部署环境: test, pre, prod"
  echo "示例: ./deploy.sh prod"
  exit 1
fi

# 确定构建命令
BUILD_CMD=""
case "$ENV" in
  "test")
    BUILD_CMD="build:test"
    ;;
  "pre")
    BUILD_CMD="build:pre"
    ;;
  "prod")
    BUILD_CMD="build:prod"
    ;;
  *)
    echo "❌ 未知的环境: $ENV"
    exit 1
    ;;
esac

echo "🚀 开始部署流程 - 环境: $ENV"

# 1. 本地构建
echo "📦 [1/3] 正在执行本地构建..."
pnpm run $BUILD_CMD

if [ $? -ne 0 ]; then
  echo "❌ 构建失败，终止部署"
  exit 1
fi

# 2. 上传文件
echo "📤 [2/3] 正在上传文件到服务器..."
# 确保目标目录存在
ssh $SERVER_USER@$SERVER_IP "mkdir -p $SERVER_DIR"

# 使用 rsync 同步 .next/standalone/ 目录到服务器
# --delete: 删除服务器上本地不存在的文件
# -avz: 归档模式，详细输出，压缩传输
rsync -avz --delete .next/standalone/ $SERVER_USER@$SERVER_IP:$SERVER_DIR/

if [ $? -ne 0 ]; then
  echo "❌ 文件上传失败，终止部署"
  exit 1
fi

# 3. 重启服务
echo "🔄 [3/3] 正在重启服务器服务..."
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_DIR && pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js"

echo "✅ 部署完成!"
