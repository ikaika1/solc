import { spawnSync } from 'node:child_process'

export function checkSSHConnection(ip: string) {
  const cmd = `ssh -o BatchMode=yes -o ConnectTimeout=5 solc@${ip} exit`
  const result = spawnSync(cmd, { shell: true, stdio: 'inherit' })

  return result.status === 0
}
