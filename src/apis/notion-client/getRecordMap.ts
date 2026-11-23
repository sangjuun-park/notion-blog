import { createNotionApi } from "./createNotionApi"

export const getRecordMap = async (pageId: string) => {
  const api = createNotionApi()
  const recordMap = await api.getPage(pageId)
  return recordMap
}
