import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import updateFiredancerBundleUrl from '../../src/lib/updateFiredancerBundleUrl'
import * as readConfigModule from '../../src/config/readConfig'
import * as updateDefaultConfigModule from '../../src/config/updateDefaultConfig'

const readConfigSpy = vi.spyOn(readConfigModule, 'default')
const updateDefaultConfigSpy = vi.spyOn(
  updateDefaultConfigModule,
  'updateDefaultConfig',
)

describe('updateFiredancerBundleUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    updateDefaultConfigSpy.mockResolvedValue()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('updates the persisted config when the URL changes', async () => {
    readConfigSpy.mockResolvedValue({
      FRANKENDANCER_BLOCK_ENGINE_URL: 'https://old.example',
    })

    const updated = await updateFiredancerBundleUrl('https://new.example')

    expect(updated).toBe(true)
    expect(updateDefaultConfigSpy).toHaveBeenCalledWith({
      FRANKENDANCER_BLOCK_ENGINE_URL: 'https://new.example',
    })
  })

  it('skips updates when the URL is already set', async () => {
    readConfigSpy.mockResolvedValue({
      FRANKENDANCER_BLOCK_ENGINE_URL: 'https://same.example',
    })

    const updated = await updateFiredancerBundleUrl(
      'https://same.example',
      'legacy-path',
    )

    expect(updated).toBe(false)
    expect(updateDefaultConfigSpy).not.toHaveBeenCalled()
  })
})
