        const images = [
            '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg',
            '21.jpeg', '22.jpeg', '23.jpeg', '24.jpeg', '25.jpeg', '30.jpeg', '31.jpeg', '32.jpeg', '33.jpeg', '34.jpeg'
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