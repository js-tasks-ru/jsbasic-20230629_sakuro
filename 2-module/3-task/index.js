let calculator = {
  read(a, b) {
    this.numOne = a;
    this.numTwo = b
  },
  sum() {
    return this.numOne + this.numTwo
  },
  mul() {
    return this.numOne * this.numTwo
  }
};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
