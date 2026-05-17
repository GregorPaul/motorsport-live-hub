const express = require("express")
const cors = require("cors")

const timingService = require("./services/timingService")
const weatherService = require("./services/weatherService")
const shortenTeamName = require("./services/teamShortener")

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

// ==========================================
// UPDATE LOOP
// ==========================================

async function updateLoop() {

  try {

    // --------------------------------------
    // WEATHER
    // --------------------------------------

    const weather =
      await weatherService.getWeather()

    if (weather) {

      raceState.weather = weather
    }

    // --------------------------------------
    // TIMING
    // --------------------------------------

    const timing =
      await timingService.getTiming()

    if (timing) {

      raceState = {
        ...raceState,
        ...timing
      }

      raceState.leaderShort =
        shortenTeamName(
          raceState.leader,
          24
        )
    }

    console.log(
      "🏁 Timing updated"
    )

  } catch (err) {

    console.log(
      "❌ Update failed",
      err.message
    )
  }
}

updateLoop()

setInterval(
  updateLoop,
  30000
)

// ==========================================
// START
// ==========================================

app.listen(PORT, () => {

  console.log(
    `🏁 Motorsport Live Hub running on ${PORT}`
  )
})
