import { spawnSync } from 'node:child_process'
import chalk from 'chalk'

type SnapshotFinderOptions = {
  minDownloadSpeed: string
  maxLatency: string
  snapshotPath: string
}

export const runSnapshotFinder = (options: SnapshotFinderOptions) => {
  const { minDownloadSpeed, maxLatency, snapshotPath } = options

  try {
    console.log(chalk.white('🔎 Running solana-snapshot-finder...'))

    const cmd = [
      // Prepare repo
      'rm -rf solana-snapshot-finder',
      'git clone https://github.com/ikaika1/solana-snapshot-finder.git',
      // Ensure required packages
      'sudo apt-get update',
      'sudo apt-get install -y python3-venv git',
      // Set up venv and install deps
      'cd solana-snapshot-finder',
      'python3 -m venv venv',
      'bash -lc "source ./venv/bin/activate && pip3 install -r requirements.txt"',
      // Execute finder
      `bash -lc "source ./venv/bin/activate && python3 snapshot-finder.py --min_download_speed ${minDownloadSpeed} --max_latency ${maxLatency} --snapshot_path ${snapshotPath}"`,
    ].join(' && ')

    spawnSync(cmd, { shell: true, stdio: 'inherit' })
  } catch (e) {
    throw new Error(`runSnapshotFinder Error: ${e}`)
  }
}

