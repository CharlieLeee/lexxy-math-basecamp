// `npm run package`: zips each dist/<target>/ into lexxy-math-basecamp-<target>.zip, plus
// lexxy-math-basecamp-source.zip of the committed source (addons.mozilla.org asks for it
// because the scripts are bundled)
import { execFileSync } from "node:child_process"
import { rmSync } from "node:fs"
import { TARGETS } from "../rollup/targets.mjs"

for (const target of Object.keys(TARGETS)) {
  const zip = `lexxy-math-basecamp-${target}.zip`
  rmSync(zip, { force: true })
  execFileSync("zip", ["-qr", `../../${zip}`, "."], { cwd: `dist/${target}` })
  console.log(zip)
}

execFileSync("git", ["archive", "--format=zip", "--output=lexxy-math-basecamp-source.zip", "HEAD"])
console.log("lexxy-math-basecamp-source.zip")
