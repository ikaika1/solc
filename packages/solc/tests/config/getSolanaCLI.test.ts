import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as fs from 'node:fs'
import * as os from 'node:os'
import path from 'node:path'
import { SOLV4_CONFIG_FILE } from '../../src/config/constants'

const ORIGINAL_PATH = process.env.PATH ?? ''
const ORIGINAL_HOME = os.homedir()
const createdDirs: string[] = []

const createTempHome = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'solc-home-'))
  createdDirs.push(dir)
  return dir
}

const createBinary = (dir: string, name: string) => {
  const filePath = path.join(dir, name)
  fs.writeFileSync(filePath, '#!/bin/sh\nexit 0\n')
  fs.chmodSync(filePath, 0o755)
  return filePath
}

describe('getSolanaCLI', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    delete process.env.SOLC_SOLANA_CLI
    process.env.PATH = ORIGINAL_PATH
    vi.restoreAllMocks()
    for (const dir of createdDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('prefers the SOLC_SOLANA_CLI override when executable', async () => {
    const home = createTempHome()
    const binDir = path.join(home, 'bin')
    fs.mkdirSync(binDir)
    createBinary(binDir, 'custom-validator')
    process.env.PATH = `${binDir}:${ORIGINAL_PATH}`
    process.env.SOLC_SOLANA_CLI = 'custom-validator'
    vi.spyOn(os, 'homedir').mockReturnValue(home)

    const { default: getSolanaCLI } = await import(
      '../../src/config/getSolanaCLI'
    )

    expect(getSolanaCLI()).toBe('custom-validator')
  })

  it('reads the config file and prefers solana-validator', async () => {
    const home = createTempHome()
    const binDir = path.join(home, 'bin')
    fs.mkdirSync(binDir)
    createBinary(binDir, 'solana-validator')
    fs.writeFileSync(
      path.join(home, SOLV4_CONFIG_FILE),
      JSON.stringify({ VALIDATOR_TYPE: 'solana' }),
    )
    process.env.PATH = `${binDir}:${ORIGINAL_PATH}`
    vi.spyOn(os, 'homedir').mockReturnValue(home)

    const { default: getSolanaCLI } = await import(
      '../../src/config/getSolanaCLI'
    )

    expect(getSolanaCLI()).toBe('solana-validator')
  })

  it('throws when no validator binary is available', async () => {
    const home = createTempHome()
    vi.spyOn(os, 'homedir').mockReturnValue(home)
    process.env.PATH = ''

    const { default: getSolanaCLI } = await import(
      '../../src/config/getSolanaCLI'
    )

    expect(() => getSolanaCLI()).toThrowError(/Unable to locate/)
  })
})
