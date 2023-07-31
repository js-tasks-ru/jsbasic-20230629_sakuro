/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  #title = ["Имя", "Возраст", "Зарплата", "Город"];
  #list = [];
  #elem = null;
  constructor(list) {
    this.#list = list || this.#list;

    this.elem = this.#render();
  }
  #template() {
    return `<table>
    <thead>
        <tr>
        ${this.#title.map((e) => `<th>${e}</th>`).join("")}
            <th></th>
        </tr>
    </thead>
    <tbody>
        ${this.#list
          .map(
            (user) => `
        <tr>
          <td>${user.name}</td>
          <td>${user.age}</td>
          <td>${user.salary}</td>
          <td>${user.city}</td>
        </tr>`
          )
          .join("")}
       
    </tbody>
</table>`;
  }

  #render() {
    function createElement(template) {
      const tmp = document.createElement("div");
      tmp.innerHTML = template;
      return tmp.firstElementChild;
    }

    const element = (this.elem = createElement(this.#template()));
    const tr = this.elem.querySelectorAll("tbody tr");
    const buttons = `<td><button>X</button></td>`;
    tr.forEach((button) => {
      button.insertAdjacentHTML("beforeend", buttons);
      const buttonRemove = button.querySelector("button");

      buttonRemove.addEventListener("click", () => button.remove(), {
        once: true,
      });
    });

    return element;
  }
}
