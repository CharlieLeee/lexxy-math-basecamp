import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import { basename, dirname, join } from "node:path"
import { TARGETS } from "./targets.mjs"

// For each output dist/<target>/, writes manifest.json (shared manifest, the target's keys,
// version from package.json), icons and bundled licenses
export function writeExtensionFiles() {
  return {
    name: "extension-files",
    async writeBundle({ file }) {
      const destination = dirname(file)
      const { version } = JSON.parse(await readFile("package.json", "utf8"))
      const manifest = JSON.parse(await readFile("manifest.json", "utf8"))
      const targetManifest = { ...manifest, ...TARGETS[basename(destination)], version }

      await writeFile(join(destination, "manifest.json"), JSON.stringify(targetManifest, null, 2) + "\n")
      await cp("icons", join(destination, "icons"), { recursive: true })

      await mkdir(join(destination, "licenses"), { recursive: true })
      await cp("LICENSE", join(destination, "licenses", "lexxy-math-basecamp.txt"))
      for (const name of ["lexxy-math", "katex"]) {
        await cp(join("node_modules", name, "LICENSE"), join(destination, "licenses", `${name}.txt`))
      }
    }
  }
}
