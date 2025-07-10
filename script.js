document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');
    const image = document.querySelector('#news-image');
    const dots = document.querySelectorAll('.pagination .dot');
    const animationContainers = document.querySelectorAll('.animation-container');

    // Array of image URLs for the news carousel
    const images = [
        'giftdrop.png',
        'AKLuqiud1.png',
        'main.png',
    ];

    let currentImageIndex = 0;
    const autoRotateInterval = 10000; // 10 seconds in milliseconds

    // Function to update news image and active dot
    const updateImage = (index) => {
        image.src = images[index];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentImageIndex = index;
    };

    // Auto-rotate news images every 10 seconds
    let autoRotate = setInterval(() => {
        const nextIndex = (currentImageIndex + 1) % images.length;
        updateImage(nextIndex);
    }, autoRotateInterval);

    // Handle dot clicks for news carousel
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoRotate); // Stop auto-rotation
            updateImage(index);
            // Restart auto-rotation
            autoRotate = setInterval(() => {
                const nextIndex = (currentImageIndex + 1) % images.length;
                updateImage(nextIndex);
            }, autoRotateInterval);
        });
    });

    // Load Lottie animations for each animation-container
    animationContainers.forEach((container, index) => {
        const animationPath = container.getAttribute('data-animation-path');
        if (animationPath) {
            lottie.loadAnimation({
                container: container, // The DOM element to render the animation
                renderer: 'svg', // Render as SVG
                loop: true, // Loop the animation
                autoplay: true, // Start playing automatically
                path: animationPath, // Path to the .tgs file
            });
        } else {
            console.warn(`No animation path specified for container ${index}`);
        }
    });
});