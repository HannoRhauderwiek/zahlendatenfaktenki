// Presentation Logic
let currentSlide = 0;
let totalSlides = 0;

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;

    // Show first slide
    showSlide(0);

    // Click anywhere to go to next slide
    document.addEventListener('click', function(e) {
        // Don't advance if clicking on navigation buttons
        if (e.target.closest('.nav-button')) {
            return;
        }
        nextSlide();
    });

    // Back button
    const backButton = document.getElementById('btn-back');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.stopPropagation();
            previousSlide();
        });
    }

    // Reset button
    const resetButton = document.getElementById('btn-reset');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.stopPropagation();
            resetPresentation();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousSlide();
        } else if (e.key === 'Home') {
            e.preventDefault();
            resetPresentation();
        }
    });

    // Update progress bar
    updateProgress();

    // Animate country circles
    animateCountryCircles();
});

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');

    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
        currentSlide = index;
        updateProgress();

        // Animate elements in the slide
        animateSlideElements(slides[index]);

        // Update SCORM progress
        const progress = Math.round((currentSlide / (totalSlides - 1)) * 100);
        setSCORMValue("cmi.core.lesson_location", currentSlide.toString());
        setSCORMValue("cmi.core.score.raw", progress.toString());

        // Mark as completed if on last slide
        if (currentSlide === totalSlides - 1) {
            setSCORMValue("cmi.core.lesson_status", "completed");
        }
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function resetPresentation() {
    showSlide(0);
    setSCORMValue("cmi.core.lesson_location", "0");
    setSCORMValue("cmi.core.score.raw", "0");
    setSCORMValue("cmi.core.lesson_status", "incomplete");
}

function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = progress + '%';
    }
}

function animateSlideElements(slide) {
    const elements = slide.querySelectorAll('.animate-in');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, index * 200);
    });

    // Animate numbers with counting effect
    const bigNumbers = slide.querySelectorAll('.big-number[data-count]');
    bigNumbers.forEach(numberElement => {
        const targetValue = numberElement.getAttribute('data-count');
        animateNumber(numberElement, targetValue);
    });

    // Animate stat numbers
    const statNumbers = slide.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach(numberElement => {
        const targetValue = numberElement.getAttribute('data-count');
        animateNumber(numberElement, targetValue);
    });
}

function animateNumber(element, targetValue) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const end = parseFloat(targetValue.replace(/[^0-9.-]/g, ''));
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = start + (end - start) * easeOutQuart(progress);

        // Format the number
        if (targetValue.includes('Mrd') || targetValue.includes('Bio')) {
            element.textContent = current.toFixed(1) + ' ' + (targetValue.includes('Mrd') ? 'Mrd' : 'Bio');
        } else if (targetValue.includes('Mio')) {
            element.textContent = Math.round(current) + ' Mio';
        } else if (targetValue.includes('%')) {
            element.textContent = Math.round(current) + '%';
        } else {
            element.textContent = Math.round(current).toLocaleString('de-DE');
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

function animateCountryCircles() {
    // This will be called when the geographic slide is shown
    const circles = document.querySelectorAll('.country-circle');
    circles.forEach((circle, index) => {
        setTimeout(() => {
            circle.style.opacity = '1';
            circle.style.transform = 'scale(1)';
        }, index * 150);
    });
}

// Helper function to create pulsing effect on certain elements
function createPulseEffect(element) {
    setInterval(() => {
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 500);
    }, 2000);
}

// Add interactive hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
