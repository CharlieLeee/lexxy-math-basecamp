// Browser targets: each gets dist/<target>/ with the same scripts and manifest.json plus these keys
export const TARGETS = {
  chrome: {},
  firefox: {
    browser_specific_settings: {
      gecko: {
        id: "lexxy-math-basecamp@charlieleee.github.io",
        // Main-world content scripts need 128+; data_collection_permissions needs 140+ (142+ on Android)
        strict_min_version: "140.0",
        data_collection_permissions: { required: ["none"] }
      },
      gecko_android: { strict_min_version: "142.0" }
    }
  }
}
