// Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });

        // Navbar scroll effect
        const nav = document.getElementById('mainNav');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }            
            lastScroll = currentScroll;
        });

        // Animate score bars on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const scoreObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scoreFills = entry.target.querySelectorAll('.score-fill');
                    scoreFills.forEach(fill => {
                        fill.style.width = fill.style.width;
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scorecard').forEach(scorecard => {
            scoreObserver.observe(scorecard);
        });

        // Store card click to expand (placeholder for future functionality)
        document.querySelectorAll('.store-card').forEach(card => {
            card.addEventListener('click', function() {
                // Placeholder for modal or expansion functionality
                console.log('Store card clicked:', this.querySelector('.store-title').textContent);
            });
        });

        // Hotspot interactions
        document.querySelectorAll('.hotspot').forEach((hotspot, index) => {
            hotspot.addEventListener('click', function(e) {
                e.stopPropagation();
                alert(`Hotspot ${index + 1}: [Feature details would appear here]\n\nExample features:\n- Adjustable LED lighting\n- Magnetic frame holders\n- Integrated pricing displays`);
            });
            
            hotspot.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2)';
            });
            
            hotspot.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Smooth scroll with offset for fixed nav
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add active state to nav links based on scroll position
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${current}`) {
                    link.style.color = 'var(--accent-teal)';
                }
            });
        });

        // Intersection Observer for fade-in animations
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Apply fade-in to cards and content blocks
        document.querySelectorAll('.store-card, .concept-card, .comparison-panel, .timeline-content').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            fadeObserver.observe(el);
        });

        // Download button functionality
        document.querySelector('.download-section .btn-primary').addEventListener('click', function() {
            // Placeholder for actual PDF download
            alert('PDF download functionality will be connected here.\n\nThe comprehensive report includes:\n✓ Full store audit with photos\n✓ Detailed cost breakdowns\n✓ Vendor contact information\n✓ Implementation checklists\n✓ Staff training materials');
        });

        // Add hover effects to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Concept card hover enhancement
        document.querySelectorAll('.concept-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderTop = '4px solid var(--accent-teal)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.borderTop = 'none';
            });
        });

        // Add pulse animation to metrics on scroll
        const metricObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.metric-value').forEach(value => {
                        value.style.animation = 'none';
                        setTimeout(() => {
                            value.style.animation = 'pulse 1s ease-in-out';
                        }, 10);
                    });
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.impact-metrics').forEach(metrics => {
            metricObserver.observe(metrics);
        });

        // Console welcome message
        console.log('%cSpecsmakers Visual Merchandising Assessment', 'color: #1a4d8f; font-size: 20px; font-weight: bold;');
        console.log('%cProfessionally crafted for interview presentation', 'color: #2c9faf; font-size: 14px;');
        console.log('Built with HTML, CSS, and vanilla JavaScript - fully responsive and interactive');