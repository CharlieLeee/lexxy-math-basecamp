import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

// Writes manifest.json (versioned from package.json), icons and bundled licenses into the build
export function copyStatic(destination) {
  return {
    name: "copy-static",
    async writeBundle() {
      const { version } = JSON.parse(await readFile("package.json", "utf8"))
      const manifest = JSON.parse(await readFile("manifest.json", "utf8"))
      await writeFile(join(destination, "manifest.json"), JSON.stringify({ ...manifest, version }, null, 2) + "\n")

      await cp("icons", join(destination, "icons"), { recursive: true })

      await mkdir(join(destination, "licenses"), { recursive: true })
      await cp("LICENSE", join(destination, "licenses", "lexxy-math-basecamp.txt"))
      for (const name of ["lexxy-math", "katex"]) {
        await cp(join("node_modules", name, "LICENSE"), join(destination, "licenses", `${name}.txt`))
      }
    }
  }
}
