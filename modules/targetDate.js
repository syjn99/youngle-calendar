const targetDate = (id) => {
  return [
    parseInt(id.substring(0, 4)),
    parseInt(id.substring(5, 7)),
    parseInt(id.substring(8)),
  ]
}

export default targetDate