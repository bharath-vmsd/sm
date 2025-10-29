        const images = [
            '1.jpeg', '10.jpeg', '11.jpeg', '12.jpeg', '13.jpeg', '14.jpeg', '15.jpeg', '16.jpeg', '17.jpeg', '18.jpeg', '19.jpeg', '2.jpeg', '20.jpeg', '21.jpeg', '22.jpeg', '22b.jpeg', '22c.jpeg', '23.jpeg', '23a.jpeg', '24.jpeg', '25.jpeg', '26.jpeg', '27.jpeg', '28.jpeg', '29.jpeg', '3.jpeg', '30.jpeg', '31.jpeg', '32.jpeg', '33.jpeg', '34.jpeg', '35.jpeg', '36.jpeg', '4.jpeg', '5.jpeg', '7.jpeg', '80.jpeg', '9.jpeg', 'competitor 90.jpeg'
        ].sort((a, b) => {
            const numA = parseInt(a.split('.')[0]);
            const numB = parseInt(b.split('.')[0]);
            return numA - numB;
        });

        let currentPhotoIndex = 0;
        const totalPhotos = images.length;

        // Generate photo placeholders
        const gallery = document.getElementById('photoGallery');
        images.forEach((img, i) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-item';
            const imgTag = document.createElement('img');
            imgTag.src = img;
            photoDiv.appendChild(imgTag);
            photoDiv.onclick = () => openModal(i);
            gallery.appendChild(photoDiv);
        });

        function openModal(index) {
            currentPhotoIndex = index;
            updateModalContent();
            document.getElementById('photoModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('photoModal').style.display = 'none';
        }

        function previousPhoto() {
            currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
            updateModalContent();
        }

        function nextPhoto() {
            currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
            updateModalContent();
        }

        function updateModalContent() {
            const modalImage = document.getElementById('modalImage');
            modalImage.innerHTML = '';
            const imgTag = document.createElement('img');
            imgTag.src = images[currentPhotoIndex];
            imgTag.style.width = '100%';
            imgTag.style.height = '100%';
            imgTag.style.objectFit = 'contain';
            modalImage.appendChild(imgTag);
            document.getElementById('photoCounter').textContent = `Photo ${currentPhotoIndex + 1} of ${totalPhotos}`;
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') previousPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
        });

        // Close modal on background click
        document.getElementById('photoModal').addEventListener('click', (e) => {
            if (e.target.id === 'photoModal') closeModal();
        });

        // Add event listeners for modal navigation buttons
        document.querySelector('#photoModal .close-modal').addEventListener('click', closeModal);
        document.querySelector('#photoModal .modal-nav button:first-child').addEventListener('click', previousPhoto);
        document.querySelector('#photoModal .modal-nav button:last-child').addEventListener('click', nextPhoto);

        // Image Compare Slider Logic
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