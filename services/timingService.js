async function getTiming() {

  // ======================================
  // LIVE TIMING ENGINE PLACEHOLDER
  // ======================================
  //
  // Hier kommt später:
  // - WebSocket Parser
  // - SignalR
  // - GTWC APIs
  // - NLS Timing
  // - WEC Timing
  // - IMSA Timing
  //
  // ======================================

  return {

    series:
      "24H Nürburgring",

    session:
      "Race",

    leader:
      "#3 Mercedes-AMG Team Verstappen Racing",

    grello: {

      car:
        "#911 Manthey EMA Grello",

      position:
        "DNF",

      classPosition:
        "P4 SP9",

      lap: 24,

      status:
        "OUT",

      flag:
        "Out of Race",

      gap:
        "-",

      lastUpdate:
        new Date().toISOString()
    }
  }
}

module.exports = {
  getTiming
}
