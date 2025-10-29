let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const container = document.getElementById('carouselContainer');
        const navContainer = document.getElementById('carouselNav');

        // Create navigation dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            navContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.carousel-dot');

        function updateCarousel() {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function changeSlide(direction) {
            currentSlide += direction;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            if (currentSlide >= slides.length) currentSlide = 0;
            updateCarousel();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }

        // Auto-advance carousel
        setInterval(() => {
            changeSlide(1);
        }, 5000);

        // Add event listeners for arrow buttons
        document.querySelector('.carousel-arrow.prev').addEventListener('click', () => changeSlide(-1));
        document.querySelector('.carousel-arrow.next').addEventListener('click', () => changeSlide(1));

        // Image Compare Slider Logic (from adayar/script.js)
        document.querySelectorAll('.image-compare-container').forEach(container => {
            const afterImage = container.querySelector('.image-compare-after');
            const slider = container.querySelector('.image-compare-slider');
            let isDragging = false;

            const updateSlider = (x) => {
                const containerRect = container.getBoundingClientRect();
                let newX = x - containerRect.left;

                if (newX < 0) newX = 0;
                if (newX > containerRect.width) newX = containerRect.width;

                slider.style.left = `${newX}px`;
                afterImage.style.clipPath = `inset(0 0 0 ${newX}px)`;
            };

            slider.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault(); // Prevent default browser drag behavior
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                updateSlider(e.clientX);
            });

            // Touch events for mobile
            slider.addEventListener('touchstart', (e) => {
                isDragging = true;
                e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                updateSlider(e.touches[0].clientX);
            });

            // Initialize slider position
            updateSlider(container.getBoundingClientRect().left + container.offsetWidth / 2);
        });