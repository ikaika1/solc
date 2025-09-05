import { spawnSync } from 'child_process'

export const ensureSolvOwnership = (dir: string = '/mt'): void => {
  const output = spawnSync(`find ${dir} -not -user solc`, {
    shell: true,
    encoding: 'utf8',
  })
  if (output.stdout) {
    spawnSync(`chown -R solc:solc ${dir}`, { shell: true })
  }
}
