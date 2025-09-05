import { spawnSync } from 'child_process'

export const createSymLink = (isDummy = false, isTest = false) => {
  if (isDummy) {
    createInactiveSymLink()
  } else {
    createActiveSymLink(isTest)
  }
}

export const createActiveSymLink = (isTest = false) => {
  let network = 'mainnet'
  if (isTest) {
    network = 'testnet'
  }
  spawnSync(
    `ln -sf /home/solc/${network}-validator-keypair.json /home/solc/identity.json`,
    { shell: true, stdio: 'inherit' },
  )
}

export const createInactiveSymLink = () => {
  spawnSync(
    `ln -sf /home/solc/unstaked-identity.json /home/solc/identity.json`,
    { shell: true, stdio: 'inherit' },
  )
}
