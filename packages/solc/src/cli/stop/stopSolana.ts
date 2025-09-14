import { ValidatorType } from '@/config/enums'
import { DefaultConfigType } from '@/config/types'
import { spawnSync } from 'node:child_process'

export type StopOptions = {
  service?: string
  debug?: boolean
}

export const stopSolana = (config: DefaultConfigType, opts: StopOptions = {}) => {
  const inferredService =
    config.VALIDATOR_TYPE === ValidatorType.FRANKENDANCER
      ? 'frankendancer.service'
      : 'solv.service'
  const service = opts.service ?? inferredService
  const cmd = `sudo systemctl stop ${service}`
  if (opts.debug) {
    console.log(`[solc] stop -> ${cmd}`)
  }
  spawnSync(cmd, { shell: true, stdio: 'inherit' })
}
