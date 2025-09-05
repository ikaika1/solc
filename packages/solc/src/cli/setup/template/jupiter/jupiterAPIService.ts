const jupiterAPIService = (
  rpcUrl: string,
  grpcUrl: string,
  grpcToken: string,
  port = 2001,
) => {
  const filePath = '/etc/systemd/system/jupiter-api.service'
  const body = `[Unit]
Description=Jupiter API Service Instance
After=network.target

[Service]
Type=simple
ExecStart=/home/solc/jupiter-swap-api --rpc-url ${rpcUrl} --yellowstone-grpc-endpoint ${grpcUrl} --yellowstone-grpc-x-token "${grpcToken}" --port ${port}
WorkingDirectory=/home/solc
Restart=always
User=solc
Environment=NODE_ENV=production
Environment=RUST_LOG=info
Environment=PATH=/home/solc/.local/share/solana/install/active_release/bin:/home/solc/.local/share/pnpm:/home/solc/.cargo/env:/home/solc/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/home/solc/.local/share/pnpm/npx

[Install]
WantedBy=multi-user.target`
  return { filePath, body }
}

export default jupiterAPIService
