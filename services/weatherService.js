const axios = require("axios")

async function getWeather() {

  try {

    const response =
      await axios.get(
        "https://wttr.in/Nurburgring?format=j1"
      )

    const current =
      response.data.current_condition[0]

    return {

      temp:
        current.temp_C + "°C",

      condition:
        current.weatherDesc[0].value
    }

  } catch (err) {

    console.log(
      "Weather failed"
    )

    return null
  }
}

module.exports = {
  getWeather
}
