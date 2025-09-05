export const relayerService = (blockEngineUrl: string) => {
  const filePath = '/etc/systemd/system/relayer.service'
  const body = `# Example Systemd File for Co-Hosted Relayer
[Unit]
Description=Solana transaction relayer
Requires=network-online.target
After=network-online.target

# User is required to install a keypair here that's used to auth against the block engine
ConditionPathExists=/home/solc/relayer-keypair.json
ConditionPathExists=/home/solc/private.pem
ConditionPathExists=/home/solc/public.pem

[Service]
Type=exec
User=solc
Restart=on-failure
Environment=RUST_LOG=info
Environment=SOLANA_METRICS_CONFIG="host=http://metrics.jito.wtf:8086,db=relayer,u=relayer-operators,p=jito-relayer-write"
Environment=BLOCK_ENGINE_URL=${blockEngineUrl}
Environment=GRPC_BIND_IP=127.0.0.1

ExecStart=/home/solc/jito-relayer/target/release/jito-transaction-relayer \\
          --keypair-path=/home/solc/relayer-keypair.json \\
          --signing-key-pem-path=/home/solc/private.pem \\
          --verifying-key-pem-path=/home/solc/public.pem

[Install]
WantedBy=multi-user.target`
  return { filePath, body }
}

export const jitoRelayerSeparateService = (blockEngineUrl: string) => {
  const filePath = '/etc/systemd/system/relayer.service'
  const body = `[Unit]
Description=Solana transaction relayer
Requires=network-online.target
After=network-online.target

# User is required to install a keypair here that's used to auth against the block engine
ConditionPathExists=/home/solc/relayer-keypair.json
ConditionPathExists=/home/solc/private.pem
ConditionPathExists=/home/solc/public.pem

[Service]
Type=exec
User=solc
Restart=on-failure
Environment=RUST_LOG=info
Environment=SOLANA_METRICS_CONFIG="host=http://metrics.jito.wtf:8086,db=relayer,u=relayer-operators,p=jito-relayer-write"
Environment=BLOCK_ENGINE_URL=${blockEngineUrl}
Environment=RPC_SERVERS=https://your.rpc.server
Environment=WEBSOCKET_SERVERS=wss://your.websocket.server

ExecStart=/home/solc/jito-relayer/target/release/jito-transaction-relayer \
          --keypair-path=/home/solc/relayer-keypair.json \
          --signing-key-pem-path=/home/solc/private.pem \
          --verifying-key-pem-path=/home/solc/public.pem \
          --forward-all

[Install]
WantedBy=multi-user.target`
  return { filePath, body }
}
