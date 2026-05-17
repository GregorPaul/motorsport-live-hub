const axios = require("axios")

// Nürburgring Koordinaten
const LAT = 50.3356
const LON = 6.9475

async function getWeather() {

  try {

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code`

    const res =
      await axios.get(url)

    const current =
      res.data.current

    const temp =
      Math.round(
        current.temperature_2m
      )

    const code =
      current.weather_code

    let condition =
      "Clear"

    // Wettercodes
    if (
      [51,53,55,61,63,65,80,81,82]
      .includes(code)
    ) {

      condition = "Rain"

    } else if (

      [71,73,75]
      .includes(code)

    ) {

      condition = "Snow"

    } else if (

      [45,48]
      .includes(code)

    ) {

      condition = "Fog"

    } else if (

      [95,96,99]
      .includes(code)

    ) {

      condition = "Storm"
    }

    return {

      temp:
        `${temp}°C`,

      condition
    }

  } catch (err) {

    console.log(
      "❌ Weather API failed",
      err.message
    )

    return {

      temp: "--°C",
      condition: "Unknown"
    }
  }
}

module.exports = {
  getWeather
}
