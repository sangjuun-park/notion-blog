import { NotionAPI } from "notion-client"

// notion-client 6.x는 got 기본 User-Agent로 요청하고, notion.so(Cloudflare)가
// 이 값을 403으로 막는다. 모든 요청에 식별 가능한 UA를 붙인다.
const USER_AGENT = "parkaward-blog-build"

const RECORD_TABLES = [
  "block",
  "collection",
  "collection_view",
  "notion_user",
  "space",
] as const

// Notion 응답이 { value: { value: <레코드>, role } } 로 한 겹 더 감싸져 온다.
// notion-client 6.x는 { value: <레코드> } 를 기대해서, 감싸진 채로 두면
// 블록 type을 못 읽고 컬렉션(글 목록) 조회를 통째로 건너뛴다.
const unwrapRecordMap = (recordMap: any) => {
  if (!recordMap || typeof recordMap !== "object") return recordMap
  for (const table of RECORD_TABLES) {
    const records = recordMap[table]
    if (!records) continue
    for (const [id, entry] of Object.entries<any>(records)) {
      const inner = entry?.value
      if (inner && typeof inner === "object" && "value" in inner) {
        records[id] = {
          ...entry,
          role: inner.role ?? entry.role,
          value: inner.value,
        }
      }
    }
  }
  return recordMap
}

class BlogNotionAPI extends NotionAPI {
  async fetch<T>(params: Parameters<NotionAPI["fetch"]>[0]): Promise<T> {
    const response: any = await super.fetch<T>({
      ...params,
      gotOptions: {
        // 빌드 때 글마다 getPosts를 다시 부르면 notion.so가 429를 준다.
        // got은 POST를 재시도하지 않으므로 직접 켠다(Retry-After를 따른다).
        retry: {
          limit: 6,
          methods: ["POST"],
          statusCodes: [408, 429, 500, 502, 503, 504],
        },
        ...params.gotOptions,
        headers: {
          ...params.gotOptions?.headers,
          "user-agent": USER_AGENT,
        },
      },
    })
    // getPage 계열은 recordMap, getUsers(getRecordValues)는 recordMapWithRoles로 온다
    unwrapRecordMap(response?.recordMap)
    unwrapRecordMap(response?.recordMapWithRoles)
    return response as T
  }
}

export const createNotionApi = () => new BlogNotionAPI()
