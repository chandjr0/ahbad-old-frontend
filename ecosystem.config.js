module.exports = {
    apps: [
      {
        name: "ahbab-frontend",
        script: "node_modules/next/dist/bin/next",
        args: "start",
        instances: 3,
        exec_mode: "cluster",
        ignore_watch: ["node_modules", "logs"],
        watch: false,
        max_memory_restart: "1G",
        log_file: "logs/pm2.log",
        log_date_format: "YYYY-MM-DD HH:mm Z",
        error_file: "logs/pm2-error.log",
        out_file: "logs/pm2-out.log",
        merge_logs: true,
        min_uptime: "10s",
        max_restarts: 10,
        restart_delay: 5000,
        autorestart: true,
        node_args: "--max-old-space-size=1000",
        listen_timeout: 100000,
        wait_ready: false,
        env : {PORT : 8071 }
      },
    ],
  };