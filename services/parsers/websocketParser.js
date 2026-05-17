const fs = require("fs");
const path = require("path");
const logger = require("../../utils/logger");

const CACHE_PATH = path.join(__dirname, "../../data/cache.json");

function saveCache(data) {
  try {
    fs.writeFileSync(
      CACHE_PATH,
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    logger.error("❌ Cache schreiben fehlgeschlagen:", err.message);
  }
}

function parseLeaderboard(result) {
  return result.map(car => ({
    position: Number(car.POSITION),
    number: Number(car.STNR),
    team: car.TEAM || "",
    car: car.CAR || "",
    laps: Number(car.LAPS || 0),
    gap: car.GAP || "",
    lastLap: car.LASTLAPTIME || "",
    class: car.CLASSNAME || "",
    status: car.LLTS || "",
    inPit:
      car.LASTINTERMEDIATENUMBER === "8" ||
      car.LASTINTERMEDIATENUMBER === "9",

    dnf:
      car.LLTS === "DNF" ||
      car.GAP === "DNF"
  }));
}

function parse(data) {

  let cache = {};

  try {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH));
  } catch {
    cache = {};
  }

  cache.lastUpdate = Date.now();

  // PID 0 = Leaderboard
  if (data.PID === "0" && data.RESULT) {

    cache.leaderboard = parseLeaderboard(data.RESULT);

    const grello = cache.leaderboard.find(
      c => c.number === 911
    );

    cache.grello = grello || null;

    logger.info(
      `🏁 Leaderboard Update (${cache.leaderboard.length} Fahrzeuge)`
    );
  }

  // PID 4 = TrackState
  if (data.PID === "4") {

    cache.track = {
      state: data.TRACKSTATE,
      timeState: data.TIMESTATE,
      endTime: data.ENDTIME
    };

    logger.info(
      `🚦 TrackState: ${data.TRACKSTATE}`
    );
  }

  saveCache(cache);
}

module.exports = {
  parse
};
