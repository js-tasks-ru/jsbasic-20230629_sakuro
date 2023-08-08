import createElement from "../../assets/lib/create-element.js";

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add("cart-icon_visible");

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart
            .getTotalPrice()
            .toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add("shake");
      this.elem.addEventListener(
        "transitionend",
        () => {
          this.elem.classList.remove("shake");
        },
        { once: true }
      );
    } else {
      this.elem.classList.remove("cart-icon_visible");
    }
  }

  addEventListeners() {
    document.addEventListener("scroll", () => this.updatePosition());
    window.addEventListener("resize", () => this.updatePosition());
  }

  updatePosition() {
    const elem = this.elem;

    if (elem.offsetHeight === 0 && elem.offsetWidth === 0) {
      return;
    }
    const contElem = document.querySelector(".container");
    const contRect = contElem.getBoundingClientRect();
    const leftPosition = contRect.right + 20;
    const maxLeftPosition =
      document.documentElement.clientWidth - elem.offsetWidth - 10;
    elem.style.position = "fixed";
    elem.style.zIndex = 1e3;
    elem.style.top = 50 + "px";
    elem.style.left = Math.min(leftPosition, maxLeftPosition) + "px";
    elem.style.right = 10 + "px";
    return elem;
  }
}
