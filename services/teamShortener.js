module.exports = function shortenTeamName(
  name,
  maxLength = 18
) {

  if (!name) return "Unknown"

  // Grello Spezialfall

  if (
    name
      .toLowerCase()
      .includes("manthey")
  ) {

    return "#911 Manthey Grello"
  }

  let numberMatch =
    name.match(/^#?\d+/)

  let number =
    numberMatch
      ? numberMatch[0]
      : ""

  if (
    number &&
    !number.startsWith("#")
  ) {

    number =
      "#" + number
  }

  let short = name

  short =
    short
      .replace(/^#?\d+/, "")
      .trim()

  const removeWords = [

    "Team",
    "Racing",
    "Motorsport",
    "Performance",
    "Competition",
    "Factory",
    "Customer",
    "Sport"
  ]

  for (const word of removeWords) {

    short = short
      .replace(
        new RegExp(word, "gi"),
        ""
      )
      .replace(/  +/g, " ")
      .trim()
  }

  short = short
    .replace("Mercedes-AMG", "AMG")
    .replace("Bayerische Motoren Werke", "BMW")

  if (number) {

    short = `${number} ${short}`
  }

  if (short.length > maxLength) {

    short =
      short.substring(
        0,
        maxLength - 1
      ) + "…"
  }

  return short
}
