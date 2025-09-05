import { spawnSync } from 'child_process'

export const rmMtDir = () => {
  try {
    const killCmd = `sudo lsof /mt | awk '{print $2}' | tail -n +2 | xargs -r sudo kill -9`
    spawnSync(killCmd, { shell: true, stdio: 'inherit' })
    const cmds = [
      `sudo umount /mt`,
      `sudo rm -rf /mt`,
      `sudo umount /mnt`,
      `sudo umount /mnt/ramdrive`,
      `sudo umount /mnt/solana-accounts`,
      `sudo rm -rf /mnt`,
    ]
    for (const cmd of cmds) {
      try {
        spawnSync(cmd, { shell: true, stdio: 'inherit' })
      } catch (error) {
        //console.log(`rmMtDir: ${error} - ${cmd}`)
      }
    }
  } catch (error) {
    //console.log(`rmMtDir: ${error}`)
  }
}
