import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname } from "node:path"

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css" }

// Serves the repo on a random local port (tests and store screenshots)
export function serve(rootUrl = new URL("../", import.meta.url)) {
  const server = createServer(async (request, response) => {
    const path = new URL(request.url, "http://localhost").pathname.replace(/^\//, "")
    try {
      const body = await readFile(new URL(path, rootUrl))
      response.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" })
      response.end(body)
    } catch {
      response.writeHead(404)
      response.end()
    }
  })

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({
      url: `http://127.0.0.1:${server.address().port}/`,
      close: () => server.close()
    }))
  })
}
