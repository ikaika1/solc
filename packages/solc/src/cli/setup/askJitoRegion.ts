import { JITO_REGIONS } from '@/config/jitConfig'
import inquirer from 'inquirer'

export const askJitoRegion = async (): Promise<keyof typeof JITO_REGIONS> => {
  const regions = Object.keys(JITO_REGIONS)
  const answer = await inquirer.prompt<{ region: string }>([
    {
      name: 'region',
      type: 'list',
      message: 'Select Jito region for Firedancer',
      choices: regions,
      default: 'Amsterdam',
    },
  ])
  return answer.region as keyof typeof JITO_REGIONS
}

export default askJitoRegion

