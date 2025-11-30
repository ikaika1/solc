import { SERVICE_PATHS, startupScriptPaths } from '@/config/config'
import chalk from 'chalk'
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'

const SOLANA_CLI_CONFIG_PATH = path.join(
  homedir(),
  '.config',
  'solana',
  'cli',
  'config.yml',
)

const showSolanaCliConfig = () => {
  const result = spawnSync('solana config get', {
    shell: true,
    stdio: 'pipe',
    encoding: 'utf-8',
  })
  if (!result.error && result.status === 0) {
    if (result.stdout) process.stdout.write(result.stdout)
    if (result.stderr) process.stderr.write(result.stderr)
    return true
  }

  const details =
    result.error?.message ||
    result.stderr?.toString().trim() ||
    result.stdout?.toString().trim()
  const fallbackMessage = details
    ? `Unable to run 'solana config get' (${details}). Falling back to the config file on disk.`
    : `Unable to run 'solana config get'. Falling back to the config file on disk.`
  console.log(chalk.yellow(fallbackMessage))
  return false
}

const showSolanaCliConfigFromDisk = () => {
  if (!existsSync(SOLANA_CLI_CONFIG_PATH)) {
    console.log(
      chalk.yellow(
        `Solana CLI config file not found at ${SOLANA_CLI_CONFIG_PATH}.`,
      ),
    )
    return
  }
  console.log(
    chalk.white(`Solana CLI config (${SOLANA_CLI_CONFIG_PATH}):`),
  )
  const fileContents = readFileSync(SOLANA_CLI_CONFIG_PATH, 'utf-8').trim()
  console.log(fileContents.length > 0 ? fileContents : chalk.gray('(empty)'))
}

export const showConfig = () => {
  if (!showSolanaCliConfig()) {
    showSolanaCliConfigFromDisk()
  }
  const config = startupScriptPaths()
  console.log(chalk.white('start-validator.sh: ') + config.scriptPath)
  console.log(chalk.white('service unit: ') + SERVICE_PATHS.SOL_SERVICE)
  console.log(chalk.white('logrotate: ') + SERVICE_PATHS.SOL_LOGROTATE)
  console.log(chalk.white('sysctl.d: ') + SERVICE_PATHS.SOL_SYSTEM_CONFIG21)
  console.log(chalk.white('limits.d: ') + SERVICE_PATHS.SOL_NOFILES_CONF)
  console.log(chalk.white('system.conf: ') + SERVICE_PATHS.SOL_SYSTEM_CONF)
}
