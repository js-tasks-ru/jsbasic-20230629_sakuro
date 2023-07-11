const camelize = (str) => str
  .split('-')
  .map((e, i) => i === 0 ? e : e[0].toUpperCase() + e.slice(1)).join('')