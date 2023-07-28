import createElement from "../../assets/lib/create-element.js";

export default class Carousel {
  elem = null;
  constructor(slides) {
    this.slides = slides;
    this.elem = this.#render();
  }
  #template() {
    return `
    <div class="carousel">
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon" />
    </div>
    <div class="carousel__arrow carousel__arrow_left">
      <img src="/assets/images/icons/angle-left-icon.svg" alt="icon" />
    </div>
    <div class="carousel__inner">
    ${this.slides
      .map(
        (elem) => `<div class="carousel__slide" data-id="${elem.id}">
        <img src="/assets/images/carousel/${elem.image}"
          class="carousel__img"
          alt="slide"/>
        <div class="carousel__caption">
          <span class="carousel__price">€${elem.price.toFixed(2)}</span>
          <div class="carousel__title">${elem.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon"/>
          </button>
        </div>
      </div>`
      )
      .join("")}
    </div>
  </div>`;
  }

  #render() {
    this.elem = createElement(this.#template());

    const carouselButton = this.elem.querySelectorAll(".carousel__button");
    carouselButton.forEach((button) => {
      button.addEventListener("click", this.#onMenuClick);
    });

    this.#carusel();

    return this.elem;
  }

  #carusel() {
    const inner = this.elem.querySelector(".carousel__inner");
    const carouselslides = this.elem.querySelectorAll(".carousel__slide");

    const leftButton = this.elem.querySelector(".carousel__arrow_left");
    const rightButton = this.elem.querySelector(".carousel__arrow_right");
    let currentIndex = 0;

    leftButton.addEventListener("click", () => {
      const slideWidth =
        this.elem.querySelector(".carousel__inner").offsetWidth;
      if (currentIndex > 0) {
        currentIndex--;
        inner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        rightButton.style.display = "";
        if (currentIndex === 0) {
          leftButton.style.display = "none";
        }
      }
    });

    rightButton.addEventListener("click", () => {
      const slideWidth =
        this.elem.querySelector(".carousel__inner").offsetWidth;
      if (currentIndex < carouselslides.length - 1) {
        currentIndex++;
        inner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        leftButton.style.display = "";
        if (currentIndex === carouselslides.length - 1) {
          rightButton.style.display = "none";
        }
      }
    });

    leftButton.style.display = "none";
  }

  #onMenuClick = (event) => {
    const slide = event.target.closest(".carousel__slide");
    if (slide) {
      const id = slide.dataset.id;
      const event = new CustomEvent("product-add", {
        bubbles: true,
        detail: id,
      });
      this.elem.dispatchEvent(event);
    }
  };
}
