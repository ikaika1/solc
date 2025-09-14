import { VERSION_FIREDANCER } from '@/config/versionConfig'
import { spawnSync } from 'child_process'
import startFiredancerScript from './startFiredancerScript'
import firedancerService from '../template/firedancer/firedancerService'
import configTomlTestnet from '../template/firedancer/configToml'
import configTomlMainnet from '../template/firedancer/configTomlMainnet'
import readConfig from '@/config/readConfig'
import { Network } from '@/config/enums'

const setupFiredancer = async () => {
  spawnSync(
    `git clone --recurse-submodules https://github.com/firedancer-io/firedancer.git`,
    { shell: true, stdio: 'inherit' },
  )
  spawnSync(`git checkout v${VERSION_FIREDANCER}`, {
    shell: true,
    stdio: 'inherit',
    cwd: '/home/solv/firedancer',
  })
  spawnSync(`./deps.sh`, {
    shell: true,
    stdio: 'inherit',
    cwd: '/home/solv/firedancer',
  })
  spawnSync(`make -j fdctl solana`, {
    shell: true,
    stdio: 'inherit',
    cwd: '/home/solv/firedancer',
  })
  spawnSync(
    `sudo ln -s /home/solv/firedancer/build/native/gcc/bin/fdctl /usr/local/bin/fdctl`,
    {
      shell: true,
      stdio: 'inherit',
    },
  )
  const { filePath, body } = startFiredancerScript()
  // Write script with a single-quoted heredoc to preserve quotes and special chars
  spawnSync(
    `sudo tee ${filePath} > /dev/null << 'EOF'\n${body}\nEOF`,
    {
      shell: true,
      stdio: 'inherit',
    },
  )
  spawnSync(`sudo chmod +x ${filePath}`, { shell: true, stdio: 'inherit' })
  const fdService = firedancerService()
  // Write systemd unit via heredoc as well
  spawnSync(
    `sudo tee ${fdService.filePath} > /dev/null << 'EOF'\n${fdService.body}\nEOF`,
    {
      shell: true,
      stdio: 'inherit',
    },
  )

  spawnSync(`sudo systemctl daemon-reload`, { shell: true })
  // Choose config.toml template based on network (mainnet-beta or testnet)
  const cfg = await readConfig()
  const toml =
    cfg.NETWORK === Network.MAINNET
      ? configTomlMainnet()
      : configTomlTestnet()
  // Write Firedancer config.toml via heredoc to avoid stripping quotes
  spawnSync(
    `sudo tee ${toml.filePath} > /dev/null << 'EOF'\n${toml.body}\nEOF`,
    {
      shell: true,
      stdio: 'inherit',
    },
  )
}

export default setupFiredancer
