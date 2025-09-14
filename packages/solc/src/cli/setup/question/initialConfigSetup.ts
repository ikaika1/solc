import DEFAULT_CONFIG from '@/config/defaultConfig'
import {
  Network,
  NETWORK_TYPES,
  NODE_TYPES,
  NodeType,
  RPC_MODE,
  RpcType,
  ValidatorType,
} from '@/config/enums'
import { updateDefaultConfig } from '@/config/updateDefaultConfig'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { askJitoSetting } from '../askJitoSetting'
import askJitoRegion from '@/cli/setup/askJitoRegion'
import { JITO_REGIONS } from '@/config/jitConfig'
import updateFiredancerBundleUrl from '@/lib/updateFiredancerBundleUrl'
import { updateJitoSolvConfig } from '@/lib/updateJitoSolvConfig'
import { readOrCreateJitoConfig } from '@/lib/readOrCreateJitoConfig'

type SolvInitialConfig = {
  network: Network
  nodeType: NodeType
}

// Setup initial config in solc4.config.json
const initialConfigSetup = async () => {
  try {
    // Setup solc config
    let validatorType: ValidatorType = ValidatorType.NONE
    let rpcType: RpcType = RpcType.AGAVE
    let commission = DEFAULT_CONFIG.COMMISSION
    let isDummy = false
    const initial = await inquirer.prompt<SolvInitialConfig>([
      {
        name: 'network',
        type: 'list',
        message: 'Choose Network',
        choices: NETWORK_TYPES,
        default: Network.MAINNET,
      },
      {
        name: 'nodeType',
        type: 'list',
        message: 'Choose Node Type',
        choices: NODE_TYPES,
        default: NodeType.RPC,
      },
    ])
    if (initial.nodeType === NodeType.VALIDATOR) {
      const validatorChoices =
        initial.network === Network.MAINNET
          ? [ValidatorType.JITO, ValidatorType.SOLANA, ValidatorType.FRANKENDANCER]
          : [
              ValidatorType.AGAVE,
              ValidatorType.JITO,
              ValidatorType.FRANKENDANCER,
            ]
      validatorType = await inquirer
        .prompt<{ validatorType: ValidatorType }>({
          name: 'validatorType',
          type: 'list',
          message: 'Choose Validator Type',
          choices: validatorChoices,
          default: ValidatorType.AGAVE,
        })
        .then((answer) => answer.validatorType)
      rpcType = RpcType.NONE
    }
    if (initial.nodeType === NodeType.RPC) {
      rpcType = await inquirer
        .prompt<{ rpcType: RpcType }>({
          name: 'rpcType',
          type: 'list',
          message: 'Choose RPC Type',
          choices: RPC_MODE,
          default: RpcType.AGAVE,
        })
        .then((answer) => answer.rpcType)
    }

    if (initial.nodeType === NodeType.VALIDATOR) {
      const validatorAns = await inquirer.prompt<{
        commission: number
        isDummy: boolean
      }>([
        {
          name: 'commission',
          type: 'number',
          message: `What is your commission rate? You can change it later (default: ${DEFAULT_CONFIG.COMMISSION}%)'`,
          default: DEFAULT_CONFIG.COMMISSION,
        },
        {
          name: 'isDummy',
          type: 'confirm',
          message:
            'Do you want to setup as a dummy(Inactive) node?(※For Migration)',
          default: true,
        },
      ])
      commission = validatorAns.commission
      isDummy = validatorAns.isDummy
      if (validatorType === ValidatorType.JITO) {
        await readOrCreateJitoConfig()
        const jitoConfig = await askJitoSetting()
        await updateJitoSolvConfig(jitoConfig)
      } else if (
        validatorType === ValidatorType.FRANKENDANCER &&
        initial.network === Network.MAINNET
      ) {
        // Ask Jito region for Firedancer template and update mainnet template URL
        const region = await askJitoRegion()
        const { BLOCK_ENGINE_URL } = JITO_REGIONS[region]
        const updated = await updateFiredancerBundleUrl(BLOCK_ENGINE_URL)
        if (updated) {
          console.log(
            chalk.green(
              `Updated Firedancer mainnet template URL to ${BLOCK_ENGINE_URL} (region: ${region})`,
            ),
          )
        } else {
          console.log(
            chalk.yellow(
              'No change applied to Firedancer mainnet template (URL already set?)',
            ),
          )
        }
      }
    }

    const { network, nodeType } = initial
    console.log(chalk.white('Network:', network))
    console.log(chalk.white('Node Type:', nodeType))
    console.log(chalk.white('Validator Type:', validatorType))
    console.log(chalk.white('RPC Type:', rpcType))
    if (nodeType === NodeType.VALIDATOR) {
      console.log(chalk.white('Commission:', commission))
    }

    await updateDefaultConfig({
      NETWORK: network,
      NODE_TYPE: nodeType,
      VALIDATOR_TYPE: validatorType,
      RPC_TYPE: rpcType,
      COMMISSION: commission,
      IS_DUMMY: isDummy,
    })
    return true
  } catch (error: any) {
    throw new Error(error)
  }
}

export default initialConfigSetup
