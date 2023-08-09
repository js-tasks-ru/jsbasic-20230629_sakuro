import createElement from "../../assets/lib/create-element.js";
import ProductCard from "../../6-module/2-task/index.js";

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.#render();
  }
  #template() {
    const createCard = createElement(`<div class="products-grid">
    <div class="products-grid__inner">
  
    </div>
  </div>
    `);
    return createCard;
  }

  #render() {
    this.elem = this.#template();

    this.updateGrid();
    return this.elem;
  }

  updateFilter(filters) {
    this.filters = { ...this.filters, ...filters };
    this.updateGrid();
  }

  updateGrid() {
    const productsInner = this.elem.querySelector(".products-grid__inner");
    productsInner.innerHTML = "";

    this.products.forEach((product) => {
      if (this.#filterProduct(product)) {
        const card = new ProductCard(product);
        productsInner.append(card.elem);
      }
    });
  }

  #filterProduct(product) {
    const { noNuts, vegeterianOnly, maxSpiciness, category } = this.filters;

    if (noNuts && product.nuts) {
      return false;
    }

    if (
      vegeterianOnly !== undefined &&
      product.vegeterian !== vegeterianOnly &&
      vegeterianOnly === true
    ) {
      return false;
    }

    if (maxSpiciness !== undefined && product.spiciness > maxSpiciness) {
      return false;
    }

    if (
      category !== undefined &&
      category !== "" &&
      product.category !== category
    ) {
      return false;
    }

    return true;
  }
}
