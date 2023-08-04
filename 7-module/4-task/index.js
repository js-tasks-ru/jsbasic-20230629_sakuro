import createElement from "../../assets/lib/create-element.js";

export default class StepSlider {
  constructor({ steps, value = 2 }) {
    this.steps = steps;
    this.value = value;
    this.elem = this.#render();
    this.createSteps = this.#createSteps();
  }

  #template() {
    return `
    <div class="slider">

    <!--Ползунок слайдера с активным значением-->
    <div class="slider__thumb">
      <span class="slider__value">${this.value}</span>
    </div>

    <!--Заполненная часть слайдера-->
    <div class="slider__progress" ></div>

    <!--Шаги слайдера-->
    <div class="slider__steps"></div>
  </div>`;
  }

  #render() {
    this.elem = createElement(this.#template());
    const progress = this.elem.querySelector(".slider__progress");
    const sliderThumb = this.elem.querySelector(".slider__thumb");
    progress.style.width = "50%";
    sliderThumb.style.left = "50%";

    this.elem.addEventListener("pointerdown", this.#onDown);
    document.addEventListener("pointermove", this.#onMove);
    this.elem.addEventListener("click", this.#onClick);

    sliderThumb.ondragstart = () => false;

    return this.elem;
  }

  #createSteps() {
    let num = Math.trunc(this.steps);
    const sliderSteps = this.elem.querySelector(".slider__steps");

    for (let i = 0; i < num; i++) {
      const steps = createElement(` <span data-value = ${i}> </span>`);
      sliderSteps.append(steps);
    }
    const firsStepActive = sliderSteps.querySelector(
      `[data-value = '${this.value}']`
    );
    firsStepActive.classList.add("slider__step-active");
  }

  #onDown = (event) => {
    event.preventDefault();

    this.elem.classList.add("slider_dragging");

    document.addEventListener("pointerup", this.#onUp, { once: true });
    const customEvent = new CustomEvent("slider-change", {
      detail: this.value,
      bubbles: true,
    });
    this.elem.dispatchEvent(customEvent);
    this.#updatePosition(event);
  };

  #onMove = (event) => {
    if (!this.elem.classList.contains("slider_dragging")) {
      return;
    }

    event.preventDefault();

    this.#updatePosition(event);
  };

  #onUp = () => {
    this.elem.classList.remove("slider_dragging");

    const customEvent = new CustomEvent("slider-change", {
      detail: this.value,
      bubbles: true,
    });
    this.elem.dispatchEvent(customEvent);
  };

  #updatePosition(event) {
    const sliderThumb = this.elem.querySelector(".slider__thumb");
    const sliderValue = this.elem.querySelector(".slider__value");
    const progress = this.elem.querySelector(".slider__progress");
    const sliderSteps = this.elem.querySelectorAll(".slider__steps span");

    let left = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) {
      leftRelative = 0;
    }

    if (leftRelative > 1) {
      leftRelative = 1;
    }

    let leftPercents = leftRelative * 100;

    sliderThumb.style.left = `${leftPercents}%`;
    progress.style.width = `${leftPercents}%`;

    let segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);

    sliderValue.textContent = value;

    sliderSteps.forEach((span, index) => {
      if (index === value) {
        span.classList.add("slider__step-active");
      } else {
        span.classList.remove("slider__step-active");
      }
    });

    this.value = value;
  }
  #onClick = () => {
    const sliderThumb = this.elem.querySelector(".slider__thumb");
    const sliderValue = this.elem.querySelector(".slider__value");
    const progress = this.elem.querySelector(".slider__progress");
    const sliderSteps = this.elem.querySelectorAll(".slider__steps span");

    let left = event.clientX - this.elem.getBoundingClientRect().left;
    let leftRelative =
      left / this.elem.querySelector(".slider__steps").offsetWidth;
    let segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);
    let valuePercents = (value / segments) * 100;
    sliderThumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`;
    this.value = value;
    sliderValue.textContent = value;

    sliderSteps.forEach((span, index) => {
      if (index === value) {
        span.classList.add("slider__step-active");
      } else {
        span.classList.remove("slider__step-active");
      }
    });
    const customEvent = new CustomEvent("slider-change", {
      detail: this.value,
      bubbles: true,
    });
    this.elem.dispatchEvent(customEvent);
  };
}
