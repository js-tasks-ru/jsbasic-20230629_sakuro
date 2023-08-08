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
      let cartItem = this.cartItems.find((item) => item.id === product.id);
      if (!cartItem) {
        this.cartItems.push({ ...product, count: 1 });
      } else {
        cartItem.count++;
      }
      this.onProductUpdate(cartItem);
    }
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.count += amount;
      if (cartItem.count === 0) {
        this.cartItems = this.cartItems.filter((item) => item.id !== productId);
      }
    }
    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.count,
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
    const createModal = createElement(`<div> </div>`);
    modal.elem = createModal;
    modal.setTitle("Your order");
    this.cartItems
      .map((item) => {
        createModal.append(this.renderProduct(item, item.count));
      })
      .join("");
    createModal.append(this.renderOrderForm());
    modal.setBody(createModal);
    modal.open();
    createModal.addEventListener("click", (e) => {
      const target = e.target;
      const minusButton = target.closest(".cart-counter__button_minus");
      const plusButton = target.closest(".cart-counter__button_plus");
      if (minusButton) {
        this.updateProductCount(
          target.closest(".cart-product").dataset.productId,
          -1
        );
      }
      if (plusButton) {
        this.updateProductCount(
          target.closest(".cart-product").dataset.productId,
          1
        );
      }
    });
    const submitButton = createModal.querySelector(".cart-form");
    submitButton.addEventListener("click", (e) => {
      this.onSubmit(e);
    });
  }

  onProductUpdate(cartItem) {
    const isModalOpen = document.body.classList.contains("is-modal-open");
    if (isModalOpen) {
      const productId = cartItem.id;
      const productCount = document.querySelector(
        `[data-product-id="${productId}"] .cart-counter__count`
      );
      const productPrice = document.querySelector(
        `[data-product-id="${productId}"] .cart-product__price`
      );
      const infoPrice = document.querySelector(".cart-buttons__info-price");
      productCount.textContent = cartItem.count;
      productPrice.textContent = `€${(cartItem.price * cartItem.count).toFixed(
        2
      )}`;
      infoPrice.textContent = `€${this.getTotalPrice().toFixed(2)}`;
      if (this.cartItems.length === 0) {
        this.modal.close();
      }
    }

    this.cartIcon.update(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const submitButton = document.querySelector('[type="submit"]');
    submitButton.classList.add("is-loading");

    const cartForm = document.querySelector(".cart-form");
    const formData = new FormData(cartForm);
    const url = "https://httpbin.org/post";

    const response = fetch(url, {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) {
        this.modal.setTitle("Success!");
        this.modal.setBody(
          createElement(
            ` <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
          `
          )
        );
        this.cartItems.length = 0;
        this.cartIcon.update(this);
      }
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
