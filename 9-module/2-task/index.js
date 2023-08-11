import Carousel from "../../6-module/3-task/index.js";
import slides from "../../6-module/3-task/slides.js";

import RibbonMenu from "../../7-module/1-task/index.js";
import categories from "../../7-module/1-task/categories.js";

import StepSlider from "../../7-module/4-task/index.js";
import ProductsGrid from "../../8-module/2-task/index.js";

import CartIcon from "../../8-module/1-task/index.js";
import Cart from "../../8-module/4-task/index.js";

export default class Main {
  constructor() {}

  async render() {
    const carouselHolder = document.querySelector("[data-carousel-holder]");
    const ribbonMenuHolder = document.querySelector("[data-ribbon-holder]");
    const stepSliderHolder = document.querySelector("[data-slider-holder]");
    const cartIconHolder = document.querySelector("[data-cart-icon-holder]");
    const productsGridHolder = document.querySelector(
      "[data-products-grid-holder]"
    );

    const carousel = new Carousel(slides);
    const ribbonMenu = new RibbonMenu(categories);
    const stepSlider = new StepSlider({ steps: 5, value: 3 });

    const cartIcon = this.renderCartIcon();
    const cart = new Cart(cartIcon);

    const fetchProducts = await this.fetchProducts();

    const productsGrid = this.instanceProductsGrid(fetchProducts);

    carouselHolder.prepend(carousel.elem);
    ribbonMenuHolder.prepend(ribbonMenu.elem);
    stepSliderHolder.prepend(stepSlider.elem);
    cartIconHolder.append(cartIcon.elem);
    productsGridHolder.append(productsGrid.elem);

    productsGrid.updateFilter({
      noNuts: document.getElementById("nuts-checkbox").checked,
      vegeterianOnly: document.getElementById("vegeterian-checkbox").checked,
      maxSpiciness: stepSlider.value,
      category: ribbonMenu.currentCategoryId,
    });

    document.body.addEventListener("product-add", ({ detail: productId }) => {
      const prod = fetchProducts.find((product) => product.id === productId);
      cart.addProduct(prod);
    });

    stepSlider.elem.addEventListener(
      "slider-change",
      ({ detail: spiciness }) => {
        productsGrid.updateFilter({
          maxSpiciness: spiciness,
        });
      }
    );

    ribbonMenu.elem.addEventListener(
      "ribbon-select",
      ({ detail: categoryId }) => {
        productsGrid.updateFilter({
          category: categoryId,
        });
      }
    );

    document
      .getElementById("nuts-checkbox")
      .addEventListener("change", (event) => {
        productsGrid.updateFilter({
          noNuts: event.target.checked,
        });
      });

    document
      .getElementById("vegeterian-checkbox")
      .addEventListener("change", (event) => {
        productsGrid.updateFilter({
          vegeterianOnly: event.target.checked,
        });
      });
  }

  renderCartIcon() {
    const cartIcon = new CartIcon();
    return cartIcon;
  }

  async fetchProducts() {
    const response = await fetch("products.json");
    return response.json();
  }

  instanceProductsGrid(products) {
    return new ProductsGrid(products);
  }
}
