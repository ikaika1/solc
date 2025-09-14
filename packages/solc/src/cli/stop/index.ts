import { program } from '@/index'
import { stopSolana, type StopOptions } from './stopSolana'
import { DefaultConfigType } from '@/config/types'

export const stopCommand = (config: DefaultConfigType) => {
  program
    .command('stop')
    .description('Stop Solana Validator')
    .option('-s, --service <service>', 'systemd service name to stop')
    .option('--debug', 'Print executed command')
    .action((options: StopOptions) => {
      stopSolana(config, options)
      process.exit(0)
    })
}
