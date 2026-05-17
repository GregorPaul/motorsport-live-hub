const events =
  require("../data/events.json")

function getEventState() {

  const now =
    new Date()

  let currentEvent = null
  let nextEvent = null

  // =====================================
  // FIND CURRENT EVENT
  // =====================================

  for (const event of events) {

    const start =
      new Date(event.start)

    const end =
      new Date(event.end)

    // LIVE beginnt
    // 1 Stunde vor Event

    const liveStart =
      new Date(
        start.getTime() -
        60 * 60 * 1000
      )

    if (
      now >= liveStart &&
      now <= end
    ) {

      currentEvent = event
      break
    }
  }
  
  // =====================================
  // FIND NEXT EVENT
  // =====================================

  for (const event of events) {

    const start =
      new Date(event.start)

    if (start > now) {

      nextEvent = event
      break
    }
  }

  // =====================================
  // LIVE MODE
  // =====================================

  if (currentEvent) {

    const end =
      new Date(currentEvent.end)

    const diff =
      now - end

    // 2h finished screen

    if (
      diff > 0 &&
      diff < 2 * 60 * 60 * 1000
    ) {

      return {

        mode:
          "finished",

        currentEvent
      }
    }

    return {

      mode:
        "live",

      currentEvent
    }
  }

  // =====================================
  // COUNTDOWN MODE
  // =====================================

  if (nextEvent) {

    const start =
      new Date(nextEvent.start)

    const diff =
      start - now

    const days =
      Math.floor(
        diff /
        (1000 * 60 * 60 * 24)
      )

    const hours =
      Math.floor(
        (
          diff %
          (1000 * 60 * 60 * 24)
        ) /
        (1000 * 60 * 60)
      )

    return {

      mode:
        "countdown",

      nextEvent,

      countdown: {

        days,
        hours
      }
    }
  }

  return {

    mode:
      "offline"
  }
}

module.exports = {
  getEventState
}
