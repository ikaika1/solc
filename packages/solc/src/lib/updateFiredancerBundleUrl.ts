import { promises as fs } from 'fs'
import path from 'path'

const DEFAULT_TEMPLATE_PATH = path.join(
  process.cwd(),
  'src/cli/setup/template/firedancer/configTomlMainnet.ts',
)

export const updateFiredancerBundleUrl = async (
  blockEngineUrl: string,
  templatePath: string = DEFAULT_TEMPLATE_PATH,
) => {
  const content = await fs.readFile(templatePath, 'utf-8')
  const replaced = content.replace(
    /url\s*=\s*\\\"[^\\\"]*\\\"/,
    `url = \\\"${blockEngineUrl}\\\"`,
  )
  if (content === replaced) return false
  await fs.writeFile(templatePath, replaced, 'utf-8')
  return true
}

export default updateFiredancerBundleUrl

