document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('carouselContainer');
    const carouselSlides = Array.from(carouselContainer.children);
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');
    const carouselNav = document.getElementById('carouselNav');

    let currentSlide = 0;
    let autoSlideInterval;

    // Create navigation dots
    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
        carouselNav.appendChild(dot);
    });

    const carouselDots = Array.from(carouselNav.children);

    function showSlide(index) {
        // Handle looping
        if (index >= carouselSlides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = carouselSlides.length - 1;
        } else {
            currentSlide = index;
        }

        // Set background image for the current slide
        carouselSlides.forEach((slide, i) => {
            if (i === currentSlide) {
                const imageUrl = slide.dataset.background;
                if (imageUrl) {
                    slide.style.backgroundImage = `url('${imageUrl}')`;
                    console.log(`Setting background for slide ${i}: ${imageUrl}`);
                }
            } else {
                slide.style.backgroundImage = ''; // Clear background for inactive slides
            }
        });

        // Scroll to the current slide
        carouselContainer.scrollLeft = carouselSlides[currentSlide].offsetLeft;
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 10000); // 10 seconds (doubled from a hypothetical 5 seconds base)
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    prevArrow.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetAutoSlide();
    });
    nextArrow.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetAutoSlide();
    });

    // Initial display and start auto-slide
    showSlide(currentSlide);
    startAutoSlide();
});