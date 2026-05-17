// ==========================================
// 🚀 SCHRITT 16
// services/timing/raceHub.js
// ==========================================

const nls =
  require("./nls")

async function collectAllSeries() {

  const results =
    await Promise.allSettled([

      nls.getData()
    ])

  return results
    .filter(
      r => r.status === "fulfilled"
    )
    .map(
      r => r.value
    )
    .filter(Boolean)
}

module.exports = {
  collectAllSeries
}
