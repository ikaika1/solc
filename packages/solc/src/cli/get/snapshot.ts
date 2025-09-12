import { spawnSync } from 'node:child_process'

export const getSnapshot = (
  isTest = false,
) => {
  try {
    // Use aria2c to download snapshots based on network
    if (isTest) {
      const testnetCmd = [
        'aria2c -x16 -s16 --force-sequential=true',
        `-d /mnt/ledger `,
        'https://snapshots.avorio.network/testnet/snapshot.tar.bz2',
        'https://snapshots.avorio.network/testnet/incremental-snapshot.tar.bz2',
      ].join(' ')
      spawnSync(testnetCmd, { shell: true, stdio: 'inherit' })
      return
    }

    const mainnetCmd = [
      // Ensure aria2 is installed before downloading on mainnet
      'sudo apt-get update && sudo apt-get install -y aria2',
      '&&',
      'aria2c -x16 -s16 --force-sequential=true',
      `-d /mnt/ledger`,
      'https://snapshots.avorio.network/mainnet-beta/snapshot.tar.bz2',
      'https://snapshots.avorio.network/mainnet-beta/incremental-snapshot.tar.bz2',
    ].join(' ')
    spawnSync(mainnetCmd, { shell: true, stdio: 'inherit' })
  } catch (error) {
    throw new Error(`getSnapshot Error: ${error}`)
  }
}
