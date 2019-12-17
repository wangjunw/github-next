/**pm2配置文件 */
module.exports = {
    apps: [
        {
            name: 'next-github', //启动的项目名
            script: './server.js', //启动文件
            instances: 1, //要启动的实例个数
            autorestart: true, //自动重启
            watch: false,
            max_memory_restart: '1G', //应用使用了多少内存之后重启（最大使用内存）
            env: {
                NODE_ENV: 'production'
            } // 使用到的变量
        }
    ]
};
