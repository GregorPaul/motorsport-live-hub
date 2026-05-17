const WebSocket = require("ws")

let socket = null
let reconnectTimer = null

const EVENT_ID = 50

function connectLiveTiming(raceState) {

  console.log(
    "🔌 Connecting LiveTiming..."
  )

  socket = new WebSocket(
    "wss://livetiming.azurewebsites.net"
  )

  socket.on("open", () => {

    console.log(
      "✅ LiveTiming connected"
    )

    socket.send(
      JSON.stringify({
        eventId: EVENT_ID,
        eventPid: [0, 4],
        clientLocalTime: Date.now()
      })
    )
  })

  socket.on("message", (msg) => {

    try {

      const data =
        JSON.parse(msg.toString())

      // =====================================
      // LEADERBOARD
      // =====================================

      if (
        data.PID === "0" &&
        data.RESULT
      ) {

        const leaderboard =
          data.RESULT

        // Leader
        const leader =
          leaderboard[0]

        if (leader) {

          raceState.leader =
            `#${leader.STNR} ${leader.TEAM}`

          raceState.leaderShort =
            `#${leader.STNR} ${shortenTeamName(
              leader.TEAM || ""
            )}`
        }

        // Grello
        const grello =
          leaderboard.find(
            car =>
              String(car.STNR) === "911"
          )

        if (grello) {

          raceState.grello = {

            car:
              `#${grello.STNR} ${grello.TEAM}`,

            position:
              grello.POSITION || "-",

            classPosition:
              grello.CLASSNAME || "",

            lap:
              Number(grello.LAPS || 0),

            status:
              grello.LLTS || "RUN",

            flag:
              grello.GAP === "DNF"
                ? "Out of Race"
                : "Running",

            gap:
              grello.GAP || "-",

            lastUpdate:
              new Date()
                .toISOString()
          }
        }

        raceState.lastUpdate =
          new Date().toISOString()

        console.log(
          `🏁 Live update (${leaderboard.length} cars)`
        )
      }

      // =====================================
      // TRACK STATE
      // =====================================

      if (
        data.PID === "4"
      ) {

        raceState.track = {

          state:
            data.TRACKSTATE,

          timeState:
            data.TIMESTATE,

          endTime:
            data.ENDTIME
        }

        console.log(
          `🚦 TrackState: ${data.TRACKSTATE}`
        )
      }

    } catch (err) {

      console.log(
        "❌ WebSocket parse error",
        err.message
      )
    }
  })

  socket.on("close", () => {

    console.log(
      "⚠️ LiveTiming disconnected"
    )

    reconnect(raceState)
  })

  socket.on("error", (err) => {

    console.log(
      "❌ LiveTiming error",
      err.message
    )
  })
}

function reconnect(raceState) {

  if (reconnectTimer) return

  reconnectTimer =
    setTimeout(() => {

      reconnectTimer = null

      console.log(
        "🔄 Reconnecting..."
      )

      connectLiveTiming(
        raceState
      )

    }, 5000)
}

module.exports = {
  connectLiveTiming
}
