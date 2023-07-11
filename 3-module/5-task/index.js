const getMinMax = (str) => {
  const arr = str.split(' ').map(e => isFinite(e) ? e : null)
  const resultMinMax = {
    min: Math.min.apply(arr, arr),
    max: Math.max.apply(arr, arr),
  }
  return resultMinMax
}