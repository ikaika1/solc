import { SERVICE_PATHS } from '@/config/config'
import { execSync } from 'child_process'
import inquirer from 'inquirer'
import { sleep } from '@skeet-framework/utils'
import { existsSync } from 'fs'

export const uninstall = async () => {
  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to uninstall Solc?',
      default() {
        return false
      },
    },
  ])
  if (!confirm.confirm) {
    return false
  }
  console.log('Uninstalling Solc...')
  execSync(`sudo systemctl stop solc`)
  await sleep(2000)
  const servicePaths = Object.values(SERVICE_PATHS)
  //servicePaths.push('/mnt/*')

  // Remove all solc.service files
  for (const path of servicePaths) {
    console.log(`Removing ${path}`)
    execSync(`sudo rm -rf ${path}`)
  }

  const solvTrashPath = 'home/solc/solcKeys/trash'
  if (!existsSync(solvTrashPath)) {
    execSync(`mkdir -p ${solvTrashPath}`)
  }

  // Backup all *.json files in ~/
  const homePaths = execSync(`ls ~/ | grep .json`).toString().split('\n')
  for (const path of homePaths) {
    // move *.json files to ~/solvKeys/trash

    if (path) {
      console.log(`Moving ${path} to ${solvTrashPath}`)
      execSync(`sudo mv ~/${path} ${solvTrashPath}/${path}`)
    }
  }
  // remove all files in ~/
  execSync(`sudo rm -rf ~/validator*`)
  execSync(`sudo systemctl daemon-reload`)
  console.log('Completely uninstalled Solc ⭐️')
}
