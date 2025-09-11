import { SERVICE_PATHS } from '@/config/config'
import { execSync } from 'child_process'

export const rmServices = () => {
  console.log('rmServices')
  const paths = [
    SERVICE_PATHS.SOL_LOGROTATE,
    SERVICE_PATHS.SOL_SERVICE,
    '/etc/systemd/system/solc.service',
  ]
  for (const path of paths) {
    try {
      console.log(`removing ${path}`)
      execSync(`sudo rm ${path}`)
    } catch (error) {
      console.log(`rmServices: ${error}`)
    }
  }
}
