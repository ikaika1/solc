import { DEFAULT_FRANKENDANCER_BLOCK_ENGINE_URL } from '@/config/constants'

type ConfigTomlMainnetOptions = {
  blockEngineUrl?: string
}

const configTomlMainnet = (options: ConfigTomlMainnetOptions = {}) => {
  const filePath = '/home/solv/firedancer/config.toml'
  const blockEngineUrl =
    options.blockEngineUrl || DEFAULT_FRANKENDANCER_BLOCK_ENGINE_URL
  const body = `name = \"solv\"
user = \"solv\"
scratch_directory = \"/home/solv\"
dynamic_port_range = \"8100-8125\"

[log]
    path = \"/home/solv/solana-validator.log\"
    colorize = \"auto\"
    level_logfile = \"INFO\"
    level_stderr = \"NOTICE\"
    level_flush = \"WARNING\"

[rpc]
    port = 8899
    full_api = false
    private = true

[reporting]
    solana_metrics_config = \"host=https://metrics.solana.com:8086,db=mainnet-beta,u=mainnet-beta_write,p=password\"

[ledger]
    path = \"/mnt/ledger\"
    accounts_path = \"/mnt/accounts\"
    limit_size = 200_000_000
    account_indexes = []
    account_index_exclude_keys = []
    snapshot_archive_format = \"zstd\"
    require_tower = true

[snapshots]
    incremental_snapshots = true
    full_snapshot_interval_slots = 25000
    incremental_snapshot_interval_slots = 1000
    path = \"/mnt/ledger\"

[gossip]
    entrypoints = [
      \"entrypoint.mainnet-beta.solana.com:8001\",
      \"entrypoint2.mainnet-beta.solana.com:8001\",
      \"entrypoint3.mainnet-beta.solana.com:8001\",
      \"entrypoint4.mainnet-beta.solana.com:8001\",
      \"entrypoint5.mainnet-beta.solana.com:8001\",
    ]
    port_check = false

[consensus]
    identity_path = \"/home/solv/identity.json\"
    vote_account_path = \"/home/solv/mainnet-vote-account-keypair.json\"
    authorized_voter_paths = [
        \"/home/solv/mainnet-validator-keypair.json\"
    ]
    snapshot_fetch = false
    genesis_fetch = true
    known_validators = [
        \"Certusm1sa411sMpV9FPqU5dXAYhmmhygvxJ23S6hJ24\",
        \"7Np41oeYqPefeNQEHSv1UDhYrehxin3NStELsSKCT4K2\",
        \"GdnSyH3YtwcxFvQrVVJMm1JhTS4QVX7MFsX56uJLUfiZ\",
        \"CakcnaRDHka2gXyfbEd2d3xsvkJkqsLw2akB3zsN1D2S\",
        \"D3htsc6iRQJLqCNWcC2xcZgUuvcd1JT8zoYNqraNcTQz\",
        \"Fumin2Kx6BjkbUGMi4E7ZkRQg4KmgDv2j5xJBi98nUAD\",
        \"9J2PT4gSpxc3pWbnKH5shvXTazcwVpA5XbnF6yAfuFG4\",
        \"7mF8NZJdREuM1uwYcvKffuY9QJBEoHhNp4hZ4NS2fuXW\",
        \"FLVgaCPvSGFguumN9ao188izB4K4rxSWzkHneQMtkwQJ\",
        \"mds2fZEpJP688PqJHvfLxGyf2VFrcNkvjuUxNYCwjrq\",
        \"5t4shVsKnUqgjmhK3fFNsvyju2E6Rd7cc4S5pmqqEVEW\",
    ]
    expected_genesis_hash = \"5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d\"
    expected_shred_version = 50093

[layout]
    affinity = \"auto\"
    agave_affinity = \"auto\"
    net_tile_count = 1
    quic_tile_count = 1
    verify_tile_count = 6
    bank_tile_count = 4
    shred_tile_count = 1

[hugetlbfs]
    mount_path = \"/mnt/accounts/.fd\"

[tiles.pack]
    schedule_strategy = \"revenue\"

[tiles.gui]
    enabled = true
    gui_listen_address = \"0.0.0.0\"
    gui_listen_port = 80

[tiles.bundle]
    enabled = true
    url = \"${blockEngineUrl}\"
    tip_distribution_program_addr = \"4R3gSG8BpU4t19KYj8CfnbtRpnT8gtk4dvTHxVRwc2r7\"
    tip_payment_program_addr = \"T1pyyaTNZsKv2WcRAB8oVnk93mLJw2XzjtVYqCsaHqt\"
    tip_distribution_authority = \"GZctHpWXmsZC1YHACTGGcHhYxjdRqQvTpYkb9LMvxDib\"
    commission_bps = 1000

[net]
    provider = \"xdp\"`
  return { filePath, body }
}

export default configTomlMainnet
