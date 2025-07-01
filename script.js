let progress = 0;
let maxProgress = 100; // Start with 100 for the first level
let currentLevel = 1; // Track the current level (1, 2, or 3)

function increaseProgress() {
    if (progress < maxProgress) {
        progress += 2;
        document.getElementById('progress').style.width = (progress / maxProgress * 100) + '%';
        document.getElementById('progress-counter').textContent = progress;
    }
    if (progress >= maxProgress && currentLevel < 3) {
        document.getElementById('next-level-button').style.display = 'block';
    }
}

function nextLevel() {
    // Animate image sliding out
    const image = document.getElementById('progress-image');
    image.style.transition = 'transform 0.5s ease';
    image.style.transform = 'translateX(-100vw)';
    
    // After animation, reset progress and update to new level
    setTimeout(() => {
        progress = 0;
        currentLevel += 1;
        if (currentLevel === 2) {
            maxProgress = 300; // Second level
            document.getElementById('progress').style.backgroundColor = '#f09826';
            image.src = 'ogonek2.png'; // Second level image
        } else if (currentLevel === 3) {
            maxProgress = 500; // Third level
            document.getElementById('progress').style.backgroundColor = '#f09826'; // Keep same color
            image.src = 'ogonek3.png'; // Third level image
        }
        document.getElementById('progress').style.width = '0%';
        document.getElementById('progress-counter').textContent = progress;
        document.getElementById('next-level-button').style.display = 'none';
        image.style.transform = 'translateX(0)';
        image.style.transition = ''; // Reset transition
    }, 500);
}

function openModal() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('label-input').value = document.getElementById('progress-label').textContent;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function updateLabel() {
    const input = document.getElementById('label-input').value;
    if (input.trim() !== '') {
        document.getElementById('progress-label-display').textContent = input;
    }
    closeModal();
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
