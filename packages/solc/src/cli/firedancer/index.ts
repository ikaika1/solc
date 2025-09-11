import { program } from '@/index'
import readConfig from '@/config/readConfig'
import { Network } from '@/config/enums'
import configTomlTestnet from '@/cli/setup/template/firedancer/configToml'
import configTomlMainnet from '@/cli/setup/template/firedancer/configTomlMainnet'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import chalk from 'chalk'

type ConfigOptions = {
  network?: 'mainnet-beta' | 'testnet'
  identity?: string
  vote?: string
  auth?: string[]
  out?: string
  force?: boolean
  dryRun?: boolean
}

const renderWithOverrides = (
  body: string,
  opts: { identity?: string; vote?: string; auth?: string[] },
) => {
  let out = body
  if (opts.identity) {
    out = out.replace(
      /identity_path\s*=\s*\"[^\"]*\"/,
      `identity_path = "${opts.identity}"`,
    )
  }
  if (opts.vote) {
    out = out.replace(
      /vote_account_path\s*=\s*\"[^\"]*\"/,
      `vote_account_path = "${opts.vote}"`,
    )
  }
  if (opts.auth && opts.auth.length > 0) {
    const escaped = opts.auth.map((p) => `"${p}"`).join(',\n        ')
    out = out.replace(
      /authorized_voter_paths\s*=\s*\[[\s\S]*?\]/,
      `authorized_voter_paths = [\n        ${escaped}\n    ]`,
    )
  }
  return out
}

export const firedancerCommands = () => {
  const firedancer = program
    .command('firedancer')
    .description('Firedancer utilities')

  firedancer
    .command('config')
    .description('Generate Firedancer config.toml')
    .option('-n, --network <network>', 'Network: mainnet-beta|testnet')
    .option('-i, --identity <path>', 'Identity keypair path')
    .option('-v, --vote <path>', 'Vote account keypair path')
    .option('-a, --auth <paths...>', 'Authorized voter keypair paths')
    .option('-o, --out <path>', 'Output path', '/home/solv/firedancer/config.toml')
    .option('-f, --force', 'Overwrite if exists', false)
    .option('--dry-run', 'Print to stdout instead of writing', false)
    .action(async (options: ConfigOptions) => {
      const cfg = await readConfig()
      const network = (options.network as Network) || cfg.NETWORK

      const tmpl =
        network === Network.MAINNET
          ? configTomlMainnet()
          : configTomlTestnet()

      const rendered = renderWithOverrides(tmpl.body, {
        identity: options.identity,
        vote: options.vote,
        auth: options.auth,
      })

      if (options.dryRun) {
        console.log(rendered)
        return
      }

      const outPath = options.out || tmpl.filePath
      const dir = path.dirname(outPath)
      if (!existsSync(dir)) await mkdir(dir, { recursive: true })
      if (existsSync(outPath) && !options.force) {
        console.log(
          chalk.red(
            `File exists: ${outPath}. Use --force to overwrite or --dry-run to preview`,
          ),
        )
        return
      }
      await writeFile(outPath, rendered)
      console.log(chalk.green(`Wrote Firedancer config: ${outPath}`))
    })
}
