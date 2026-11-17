// Runs in Basecamp's page at document_start, before its rich_text bundle.
//
// Basecamp's bundle assigns window.Lexxy synchronously, then defines <lexxy-editor> in a
// later task. So: when window.Lexxy is assigned, build lexxy-math against it; when
// <lexxy-editor> is defined, add math to its base extensions. Editors then start with
// math, without touching Basecamp's own Lexxy configuration. Posted messages and comments
// are rendered too (renderPostedMath).

const EDITOR_TAG = "lexxy-editor"
let mathExtension = null

whenAssigned(window, "Lexxy", () => {
  try {
    const { BasecampMathExtension, addKatexStyles, renderPostedMath } = globalThis.__lexxyMathForBasecamp()
    addKatexStyles()
    mathExtension = BasecampMathExtension
    renderPostedMath()
  } catch (error) {
    console.warn("[lexxy-math] disabled:", error)
  }
})

whenDefining(EDITOR_TAG, (EditorElement) => {
  addBaseExtension(EditorElement, () => mathExtension)
})

function whenAssigned(target, key, callback) {
  if (target[key]) return callback(target[key])

  Object.defineProperty(target, key, {
    configurable: true,
    get: () => undefined,
    set(value) {
      Object.defineProperty(target, key, { value, configurable: true, enumerable: true, writable: true })
      callback(value)
    }
  })
}

function whenDefining(tag, callback) {
  const existing = customElements.get(tag)
  if (existing) return callback(existing)

  const registry = CustomElementRegistry.prototype
  const define = registry.define

  registry.define = function (name, constructor, options) {
    if (name === tag) {
      registry.define = define
      callback(constructor)
    }
    return define.call(this, name, constructor, options)
  }
}

// Wraps the element's baseExtensions getter; extensions are read when each editor connects
function addBaseExtension(EditorElement, getExtension) {
  let owner = EditorElement.prototype
  while (owner && !Object.hasOwn(owner, "baseExtensions")) owner = Object.getPrototypeOf(owner)
  if (!owner) return console.warn("[lexxy-math] disabled: <lexxy-editor> has no baseExtensions")

  const { get } = Object.getOwnPropertyDescriptor(owner, "baseExtensions")

  Object.defineProperty(owner, "baseExtensions", {
    configurable: true,
    get() {
      const extensions = get.call(this)
      const extension = getExtension()
      return extension ? [...extensions, extension] : extensions
    }
  })
}
