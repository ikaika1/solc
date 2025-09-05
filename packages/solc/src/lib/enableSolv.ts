import { spawnSync } from 'node:child_process'

export const enableSolv = () => {
spawnSync('sudo systemctl enable solc', { shell: true, stdio: 'inherit' })
}
