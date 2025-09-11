import { VERSION_JITO_MAINNET } from '@/config/versionConfig'
import { spawnSync } from 'child_process'

// Default to mainnet Jito version to avoid accidentally installing testnet on mainnet.
export const installJito = (version = VERSION_JITO_MAINNET) => {
  const tag = `v${version}-jito`
  spawnSync(`sh -c "$(curl -sSfL https://release.jito.wtf/${tag}/install)"`, {
    shell: true,
    stdio: 'inherit',
  })
}
