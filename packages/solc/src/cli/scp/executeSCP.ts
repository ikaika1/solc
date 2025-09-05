import { spawnSync } from 'node:child_process'

export function executeSCP(
  ip: string,
  key: string,
  filePath: string,
  isDownload: boolean,
) {
  const cmd = isDownload
    ? `scp -o StrictHostKeyChecking=no solc@${ip}:${key} ${filePath}`
    : `scp -o StrictHostKeyChecking=no ${key} solc@${ip}:${filePath}`
  const result = spawnSync(cmd, { shell: true, stdio: 'inherit' })

  return result.status === 0
}
