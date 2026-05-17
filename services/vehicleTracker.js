const trackedCars = require(
  "../data/trackedCars.json"
)

function findTrackedCars(
  leaderboard
) {

  const found = []

  for (
    const entry of leaderboard
  ) {

    for (
      const tracked of trackedCars
    ) {

      const text = JSON.stringify(entry)
        .toLowerCase()

      const matched =
        tracked.keywords.some(
          keyword =>
            text.includes(
              keyword.toLowerCase()
            )
        )

      if (matched) {

        found.push({
          tracked,
          liveData: entry
        })
      }
    }
  }

  return found
}

module.exports = {
  findTrackedCars
}
