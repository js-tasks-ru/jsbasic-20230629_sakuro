import createElement from "../../assets/lib/create-element.js";

export default class Modal {
  constructor() {
    this.element = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `);

    this.overlayElement = this.element.querySelector(".modal__overlay");
    this.innerElement = this.element.querySelector(".modal__inner");
    this.headerElement = this.element.querySelector(".modal__header");
    this.closeButtonElement = this.element.querySelector(".modal__close");
    this.titleElement = this.element.querySelector(".modal__title");
    this.bodyElement = this.element.querySelector(".modal__body");

    this.overlayElement = createElement('<div class="modal-overlay"></div>');

    this.isOpened = false;

    this.closeButtonElement.addEventListener("click", this.close);
  }

  closeOnEsc = (event) => {
    if (event.code === "Escape") {
      this.close();
    }
  };

  open() {
    if (this.isOpened) {
      return;
    }

    this.isOpened = true;

    document.body.prepend(this.element);
    document.body.classList.add("is-modal-open");
    document.addEventListener("keydown", this.closeOnEsc);
  }

  close = () => {
    if (!this.isOpened) {
      return;
    }

    this.isOpened = false;

    document.body.removeChild(this.element);
    document.body.classList.remove("is-modal-open");
    document.removeEventListener("keydown", this.closeOnEsc);
  };

  setTitle(title) {
    this.titleElement.textContent = title;
  }

  setBody(node) {
    this.bodyElement.innerHTML = "";
    this.bodyElement.appendChild(node);
  }
}
