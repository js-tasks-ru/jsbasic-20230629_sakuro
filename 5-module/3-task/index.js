function initCarousel() {
  const inner = document.querySelector('.carousel__inner');
  const carouselslides = document.querySelectorAll('.carousel__slide');
  const slideWidth = carouselslides[0].offsetWidth;
  const leftButton = document.querySelector('.carousel__arrow_left');
  const rightButton = document.querySelector('.carousel__arrow_right');
  let currentIndex = 0;


  leftButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      inner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      rightButton.style.display = '';
      if (currentIndex === 0) {
        leftButton.style.display = 'none';
      }

    }
  });


  rightButton.addEventListener('click', () => {
    if (currentIndex < carouselslides.length - 1) {
      currentIndex++;
      inner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      leftButton.style.display = '';
      if (currentIndex === carouselslides.length - 1) {
        rightButton.style.display = 'none';
      }
    }
  });

  leftButton.style.display = 'none';
}
