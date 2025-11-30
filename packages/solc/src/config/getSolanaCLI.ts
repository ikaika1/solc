import {
  AGAVE_VALIDATOR,
  SOLANA_VALIDATOR,
  SOLV4_CONFIG_FILE,
} from '@/config/constants'
import DEFAULT_CONFIG from '@/config/defaultConfig'
import { RpcType, ValidatorType } from '@/config/enums'
import type { DefaultConfigType } from '@/config/types'
import * as fs from 'node:fs'
import * as os from 'node:os'
import path from 'node:path'

const ENV_SOLANA_CLI = 'SOLC_SOLANA_CLI'

const isExecutable = (filePath: string) => {
  try {
    fs.accessSync(filePath, fs.constants.X_OK)
    return true
  } catch {
    return false
  }
}

const isCommandAvailable = (command: string) => {
  if (!command) return false
  const pathEntries = (process.env.PATH ?? '').split(path.delimiter)
  return pathEntries.some((entry) => {
    if (!entry) return false
    const candidate = path.join(entry, command)
    if (isExecutable(candidate)) return true
    if (process.platform === 'win32') {
      return isExecutable(`${candidate}.exe`)
    }
    return false
  })
}

const readConfigFromDisk = (): DefaultConfigType => {
  try {
    const configPath = path.join(os.homedir(), SOLV4_CONFIG_FILE)
    if (!fs.existsSync(configPath)) {
      return DEFAULT_CONFIG
    }
    const file = fs.readFileSync(configPath, 'utf-8')
    const parsed = JSON.parse(file) as Partial<DefaultConfigType>
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

const getPreferredBinaries = (): string[] => {
  const config = readConfigFromDisk()
  const preferred: string[] = []
  if (config.VALIDATOR_TYPE === ValidatorType.SOLANA) {
    preferred.push(SOLANA_VALIDATOR)
  }
  if (
    config.VALIDATOR_TYPE === ValidatorType.AGAVE ||
    config.VALIDATOR_TYPE === ValidatorType.JITO ||
    config.RPC_TYPE === RpcType.AGAVE ||
    config.RPC_TYPE === RpcType.JITO
  ) {
    preferred.push(AGAVE_VALIDATOR)
  }
  return [...preferred, AGAVE_VALIDATOR, SOLANA_VALIDATOR].filter(
    (value, index, self) => value && self.indexOf(value) === index,
  )
}

const getSolanaCLI = () => {
  const envOverride = process.env[ENV_SOLANA_CLI]?.trim()
  const searchOrder = [
    ...(envOverride ? [envOverride] : []),
    ...getPreferredBinaries(),
  ]
  for (const candidate of searchOrder) {
    if (isCommandAvailable(candidate)) {
      return candidate
    }
  }
  throw new Error(
    `Unable to locate a Solana validator binary. Install either "${AGAVE_VALIDATOR}" or "${SOLANA_VALIDATOR}" (or set ${ENV_SOLANA_CLI}) and ensure it is on PATH.`,
  )
}

export default getSolanaCLI
