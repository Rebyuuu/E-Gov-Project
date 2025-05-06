let currentSlide = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slides img').length;

function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    slides.style.transform = `translateX(${-currentSlide * 100}%)`;
}

function nextSlide() {
    // showSlide(currentSlide + 1);
    currentSlide = (currentSlide + 1) % totalSlides;
    document.querySelector('.slides').style.transform = `translateX(-${currentSlide * 25}%)`;
}

function prevSlide() {
    // showSlide(currentSlide - 1);
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    document.querySelector('.slides').style.transform = `translateX(-${currentSlide * 25}%)`;
}

let autoSlideInterval = setInterval(() => {
    nextSlide();
}, 5000);
const slider = document.querySelector('.slider');
slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});
slider.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
});