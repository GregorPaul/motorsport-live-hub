const {
  connectLiveTiming
} = require(
  "./services/timing/liveTimingSocket"
)

const express = require("express")
const cors = require("cors")

const timingService = require("./services/timingService")
const weatherService = require("./services/weatherService")
const shortenTeamName = require("./services/teamShortener")

const raceHub =

  require(

    "./services/timing/raceHub"

  )

const vehicleTracker =

  require(

    "./services/vehicleTracker"

  )

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// ==========================================
// MEMORY STORE
// ==========================================

let raceState = {

  series: "24H Nürburgring",
  session: "Race",

  leader:
    "#3 Mercedes-AMG Team Verstappen Racing",

  leaderShort:
    "#3 AMG Verstappen",

  grello: {

    car: "#911 Manthey EMA Grello",

    position: "DNF",

    classPosition: "P4 SP9",

    lap: 24,

    status: "OUT",

    flag: "Out of Race",

    gap: "-",

    lastUpdate:
      new Date().toISOString()
  },

  weather: {

    temp: "+5°C",

    condition: "Rain"
  }
}

// ==========================================
// API ROUTES
// ==========================================

app.get("/", (req, res) => {

  res.json({

    status: "online",

    service:
      "motorsport-live-hub"
  })
})

app.get("/live", (req, res) => {

  res.json(raceState)
})

app.get("/grello", (req, res) => {

  res.json(raceState.grello)
})

app.get(

  "/series",

  (req, res) => {

    res.json(

      raceState.seriesData || []

    )

  }

)

app.get(

  "/cars",

  (req, res) => {

    res.json({

      leader:

        raceState.leader,

      grello:

        raceState.grello

    })

  }

)

// ==========================================
// UPDATE LOOP
// ==========================================

async function updateLoop() {

  try {

    const allSeries =

      await raceHub.collectAllSeries()

    if (

      !allSeries.length

    ) {

      return

    }

    // --------------------------------------

    // NLS / 24H

    // --------------------------------------

    const nls =

      allSeries[0]

    // --------------------------------------

    // WEATHER

    // --------------------------------------

    const weather =

      await weatherService.getWeather()

    raceState.weather =

      weather

    // --------------------------------------

    // MAIN OUTPUT

    // --------------------------------------

    raceState.series =

      nls.series

    raceState.session =

      nls.session

    raceState.leader =

      nls.leader

    raceState.grello =

      nls.grello

    raceState.lastUpdate =

      new Date()

        .toISOString()

    console.log(

      "🏁 LIVE timing updated"

    )

  } catch (err) {

    console.log(

      "❌ Update failed",

      err.message

    )

  }

}

// ==========================================
// START
// ==========================================

connectLiveTiming(raceState)

updateLoop()

setInterval(

  updateLoop,

  1000 * 60 * 3

)

app.listen(PORT, () => {

  console.log(
    `🏁 Motorsport Live Hub running on ${PORT}`
  )
})
