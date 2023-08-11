import createElement from "../../assets/lib/create-element.js";
import escapeHtml from "../../assets/lib/escape-html.js";

import Modal from "../../7-module/2-task/index.js";

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (product) {
      let existingItem = this.cartItems.find((item) => item.id === product.id);
      if (!existingItem) {
        this.cartItems.push({ ...product, count: 1 });
      } else {
        existingItem.count++;
      }
      this.onProductUpdate(existingItem);
    }
  }

  updateProductCount(productId, amount) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === productId);
    if (itemIndex !== -1) {
      const item = this.cartItems[itemIndex];
      item.count += amount;
      if (item.count === 0) {
        this.cartItems.splice(itemIndex, 1);
      }
      this.onProductUpdate(item);
    }
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((total, item) => total + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (totalCount, item) => totalCount + item.price * item.count,
      0
    );
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    const modal = new Modal();
    this.modal = modal;
    const modalBody = createElement(`<div></div>`);
    this.modalBody = modalBody;

    modal.setTitle("Your order");
    this.cartItems.forEach((item) => {
      modalBody.append(this.renderProduct(item, item.count));
    });
    modalBody.append(this.renderOrderForm());
    modal.setBody(modalBody);
    modal.open();

    modalBody.addEventListener("click", this.modalClick);

    const submitForm = modalBody.querySelector(".cart-form");
    submitForm.addEventListener("submit", this.onSubmit.bind(this));
  }

  modalClick = (event) => {
    const target = event.target;
    const closestCartProduct = target.closest(".cart-product");
    if (closestCartProduct) {
      const productId = closestCartProduct.dataset.productId;
      const minusButton = target.closest(".cart-counter__button_minus");
      const plusButton = target.closest(".cart-counter__button_plus");
      if (minusButton) {
        this.updateProductCount(productId, -1);
      } else if (plusButton) {
        this.updateProductCount(productId, 1);
      }
    }
  };

  onProductUpdate(cartItem) {
    const isModalOpen = document.body.classList.contains("is-modal-open");

    if (isModalOpen) {
      const productId = cartItem.id;
      const modalBody = document.querySelector(".modal__body");
      const productCount = modalBody.querySelector(
        `[data-product-id="${productId}"] .cart-counter__count`
      );
      const productPrice = modalBody.querySelector(
        `[data-product-id="${productId}"] .cart-product__price`
      );
      const parentPrice = this.getParentElement(productPrice, 3);
      const infoPrice = modalBody.querySelector(".cart-buttons__info-price");

      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.price * cartItem.count).toFixed(
        2
      )}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

      if (this.cartItems.length === 0) {
        productCount.innerHTML = "";
      }

      if (productPrice.innerHTML === "€0.00") {
        parentPrice.remove();
      }

      if (!this.getTotalPrice()) {
        this.modal.close();
      }
    }

    this.cartIcon.update(this);
  }

  async onSubmit(event) {
    event.preventDefault();

    const modal = document.querySelector(".modal");
    const submitButton = modal.querySelector('[type="submit"]');
    submitButton.classList.add("is-loading");

    const cartForm = modal.querySelector(".cart-form");
    const formData = new FormData(cartForm);
    const url = "https://httpbin.org/post";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        this.modal.setTitle("Success!");
        this.cartItems.length = 0;
        this.modalBody.innerHTML = `
        <div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="/assets/images/delivery.gif">
          </p>
        </div>
      `;

        this.cartIcon.update(this);
      }
    } catch (error) {
      console.error(error);
    }
  }
  getParentElement(element, levels) {
    let parentElement = element;
    for (let i = 0; i < levels; i++) {
      parentElement = parentElement.parentNode;
      if (!parentElement) {
        return null;
      }
    }
    return parentElement;
  }
  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
