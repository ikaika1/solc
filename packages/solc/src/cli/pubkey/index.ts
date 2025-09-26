import { program } from '@/index'
import { spawnSync } from 'node:child_process'

type PubkeyOptions = {
  file?: string
}

export const pubkeyCommand = () => {
  program
    .command('pubkey')
    .alias('p')
    .description('Print pubkey from a keypair file (wrapper of solana-keygen)')
    .option('-f, --file <path>', 'Keypair file path', 'identity.json')
    .addHelpText(
      'after',
      `\nExamples:\n  $ solc pubkey\n  $ solc pubkey -f ~/.config/solana/id.json\n  $ solc pubkey --file /path/to/mainnet-validator-keypair.json\n\nNotes:\n  - This runs: solana-keygen pubkey <file>\n  - Defaults to "identity.json" in the current directory`,
    )
    .action((options: PubkeyOptions) => {
      const filePath = options.file || 'identity.json'
      const cmd = `solana-keygen pubkey ${filePath}`
      const result = spawnSync(cmd, { shell: true, stdio: 'inherit' })
      process.exit(result.status ?? 0)
    })
}
