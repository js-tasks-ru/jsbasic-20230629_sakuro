const showSalary = (arr, age) => {
  return arr.filter(e => e.age <= age).map(e => `${e.name}, ${e.balance}`).join('\n')
}