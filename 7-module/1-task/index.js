import createElement from "../../assets/lib/create-element.js";

export default class RibbonMenu {
  elem = null;
  constructor(categories) {
    this.categories = categories;
    this.elem = this.#render();
  }

  #template() {
    return `<div class="ribbon">
    <!--Кнопка прокрутки влево-->
    <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>

    <!--Ссылки на категории-->
    <nav class="ribbon__inner">
   ${this.categories
     .map(
       (categories) => ` 
   <a href="#" class="ribbon__item ribbon__item_active" data-id='${categories.id}'>${categories.name}</a>`
     )
     .join("")}
     </nav>
    <!--Кнопка прокрутки вправо-->
    <button class="ribbon__arrow ribbon__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
    </div>`;
  }

  #render() {
    this.elem = createElement(this.#template());

    const leftArrow = this.elem.querySelector(".ribbon__arrow_left");
    const rightArrow = this.elem.querySelector(".ribbon__arrow_right");
    const ribbonInner = this.elem.querySelector(".ribbon__inner");

    leftArrow.addEventListener("click", () => {
      let scrollLeft = ribbonInner.scrollLeft;
      ribbonInner.scrollBy(-350, 0);
      if (scrollLeft < 1) {
        leftArrow.classList.remove("ribbon__arrow_visible");
        rightArrow.classList.add("ribbon__arrow_visible");
      }
      if (scrollLeft > 1) {
        rightArrow.classList.add("ribbon__arrow_visible");
      }
    });
    rightArrow.addEventListener("click", () => {
      let scrollWidth = ribbonInner.scrollWidth;
      let scrollLeft = ribbonInner.scrollLeft;
      let clientWidth = ribbonInner.clientWidth;

      let scrollRight = scrollWidth - scrollLeft - clientWidth;
      if (scrollRight < 1) {
        leftArrow.classList.add("ribbon__arrow_visible");
        rightArrow.classList.remove("ribbon__arrow_visible");
      }
      if (scrollRight > 1) {
        leftArrow.classList.add("ribbon__arrow_visible");
      }
      ribbonInner.scrollBy(350, 0);
    });

    const ribbonItem = this.elem.querySelectorAll(".ribbon__item");

    ribbonItem.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        ribbonItem.forEach((item) => {
          item.classList.remove("ribbon__item_active");
        });

        const item = event.target.closest(".ribbon__item");
        if (item) {
          item.classList.add("ribbon__item_active");
          const id = item.dataset.id;
          const customEvent = new CustomEvent("ribbon-select", {
            detail: id,
            bubbles: true,
          });
          this.elem.dispatchEvent(customEvent);
        }
      });
    });

    return this.elem;
  }
}
