function detectSession(data) {

  if (!data)
    return "Unknown"

  const text =
    JSON.stringify(data)
      .toLowerCase()

  if (text.includes("qualifying"))
    return "Qualifying"

  if (text.includes("practice"))
    return "Practice"

  if (text.includes("race"))
    return "Race"

  return "Race"
}

module.exports = {
  detectSession
}
