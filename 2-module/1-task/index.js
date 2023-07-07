function sumSalary(obj) {
  let result = 0

  for (const key in obj) {
    if (isFinite(obj[key])) {
      result += obj[key]
    }
    if (!isFinite(obj[key])) {
      break
    }
  }
  return result
}
