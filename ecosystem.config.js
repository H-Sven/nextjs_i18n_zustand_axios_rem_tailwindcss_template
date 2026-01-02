module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'server.js',
      instances: 'max', // 使用最大核心数，利用多核性能
      exec_mode: 'cluster', // 集群模式
      autorestart: true, // 崩溃自动重启
      watch: false, // 生产环境通常关闭监控
      max_memory_restart: '1G', // 内存超限重启
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};
