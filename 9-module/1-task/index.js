export default function promiseClick(button) {
  return new Promise((resolve) => {
    button.addEventListener("click", resolve, { once: true });
  });
}
promiseClick(button).then((event) => console.log(event));
