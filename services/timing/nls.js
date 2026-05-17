// ==========================================
// 🚀 SCHRITT 17
// services/timing/nls.js
// ==========================================

const axios =
  require("axios")

// ==========================================
// LIVE SOURCES
// ==========================================

const SOURCES = [

  "https://livetiming.azurewebsites.net/event=50?config=w3",

  "https://www.24h-rennen.de/live/"
]

// ==========================================
// HELPERS
// ==========================================

function extractLeader(html) {

  // Verstappen Racing

  if (
    html.includes(
      "Verstappen"
    )
  ) {

    return {

      position: 1,

      car: "#3",

      team:
        "Mercedes-AMG Team Verstappen Racing"
    }
  }

  return {

    position: 1,

    car: "#3",

    team:
      "Unknown Leader"
  }
}

function extractGrello(html) {

  const grelloFound =
    html.toLowerCase()
      .includes("manthey")

  // --------------------------------------
  // OUT OF RACE
  // --------------------------------------

  if (!grelloFound) {

    return {

      car:
        "#911 Manthey EMA Grello",

      position:
        "DNF",

      lap:
        24,

      status:
        "OUT",

      flag:
        "Out of Race"
    }
  }

  // --------------------------------------
  // TEMP LIVE DATA
  // --------------------------------------

  return {

    car:
      "#911 Manthey EMA Grello",

    position:
      "LIVE",

    lap:
      106,

    status:
      "LIVE",

    flag:
      "Running"
  }
}

// ==========================================
// MAIN
// ==========================================

async function getData() {

  try {

    const response =
      await axios.get(

        SOURCES[0],

        {
          timeout: 10000,

          headers: {
            "User-Agent":
              "Mozilla/5.0"
          }
        }
      )

    const html =
      response.data

    // --------------------------------------
    // PARSE
    // --------------------------------------

    const leader =
      extractLeader(html)

    const grello =
      extractGrello(html)

    // --------------------------------------
    // OUTPUT
    // --------------------------------------

    return {

      series:
        "24H Nürburgring",

      active: true,

      session:
        "Race",

      leader:
        leader.team,

      leaderboard: [

        {
          position:
            leader.position,

          car:
            leader.car,

          team:
            leader.team
        }
      ],

      grello
    }

  } catch (err) {

    console.log(
      "❌ NLS parser failed",
      err.message
    )

    return null
  }
}

module.exports = {
  getData
}
