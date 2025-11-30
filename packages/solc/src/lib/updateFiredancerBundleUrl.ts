import readConfig from '@/config/readConfig'
import { updateDefaultConfig } from '@/config/updateDefaultConfig'

export const updateFiredancerBundleUrl = async (
  blockEngineUrl: string,
  _legacyTemplatePath?: string,
) => {
  const config = await readConfig()
  if (config.FRANKENDANCER_BLOCK_ENGINE_URL === blockEngineUrl) return false
  await updateDefaultConfig({
    FRANKENDANCER_BLOCK_ENGINE_URL: blockEngineUrl,
  })
  return true
}

export default updateFiredancerBundleUrl
