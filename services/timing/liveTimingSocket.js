const WebSocket = require("ws");
const websocketParser = require("../parsers/websocketParser");
const logger = require("../../utils/logger");

let socket = null;
let reconnectTimer = null;

const EVENT_ID = 50;

function connectLiveTiming() {
  logger.info("🔌 Verbinde mit LiveTiming WebSocket...");

  socket = new WebSocket("wss://livetiming.azurewebsites.net");

  socket.on("open", () => {
    logger.info("✅ LiveTiming verbunden");

    socket.send(
      JSON.stringify({
        eventId: EVENT_ID,
        eventPid: [0, 4],
        clientLocalTime: Date.now()
      })
    );
  });

  socket.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      websocketParser.parse(data);

    } catch (err) {
      logger.error("❌ WebSocket JSON Fehler:", err.message);
    }
  });

  socket.on("close", () => {
    logger.warn("⚠️ LiveTiming Verbindung geschlossen");

    reconnect();
  });

  socket.on("error", (err) => {
    logger.error("❌ LiveTiming Fehler:", err.message);
  });
}

function reconnect() {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;

    logger.info("🔄 Reconnect LiveTiming...");

    connectLiveTiming();

  }, 5000);
}

module.exports = {
  connectLiveTiming
};
