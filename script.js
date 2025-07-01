// Initialize Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD8ExTubkF3I7o3Mq25C2Z6IxJ7g",
    authDomain: "ogonek-55d89.firebaseapp.com",
    projectId: "ogonek-55d89",
    storageBucket: "ogonek-55d89.appspot.com",
    messagingSenderId: "90489517366",
    appId: "1:90489517366:web:abcdef1234567890"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get Telegram user data
const user = tg.initDataUnsafe.user;
let progress = 0;
let maxProgress = 100;
let currentLevel = 1;
let partnerId = null;

// Load pet data from Firebase
function loadPetData() {
    if (user) {
        db.collection("pets").doc(user.id.toString()).get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                progress = data.experience || 0;
                currentLevel = data.level || 1;
                maxProgress = currentLevel === 1 ? 100 : currentLevel === 2 ? 300 : 500;
                partnerId = data.partnerId || null;
                document.getElementById('progress-label-display').textContent = data.name || "Прогресс";
                document.getElementById('progress').style.width = (progress / maxProgress * 100) + '%';
                document.getElementById('progress-counter').textContent = progress;
                document.getElementById('progress-image').src = `ogonek${currentLevel}.png`;
                document.getElementById('adoption-status').textContent = partnerId 
                    ? `Усыновлен с @${data.partnerUsername}`
                    : "Статус усыновления: Ожидание";
                if (progress >= maxProgress && currentLevel < 3) {
                    document.getElementById('next-level-button').style.display = 'block';
                }
            }
        });
    }
}

function increaseProgress() {
    if (progress < maxProgress) {
        progress += 2;
        document.getElementById('progress').style.width = (progress / maxProgress * 100) + '%';
        document.getElementById('progress-counter').textContent = progress;
        // Update Firebase
        if (user) {
            db.collection("pets").doc(user.id.toString()).set({
                experience: progress,
                level: currentLevel,
                name: document.getElementById('progress-label-display').textContent,
                partnerId: partnerId,
                partnerUsername: partnerId ? document.getElementById('adoption-status').textContent.split('@')[1] : null
            }, { merge: true });
        }
    }
    if (progress >= maxProgress && currentLevel < 3) {
        document.getElementById('next-level-button').style.display = 'block';
    }
}

function nextLevel() {
    const image = document.getElementById('progress-image');
    image.style.transition = 'transform 0.5s ease';
    image.style.transform = 'translateX(-100vw)';
    
    setTimeout(() => {
        progress = 0;
        currentLevel += 1;
        maxProgress = currentLevel === 2 ? 300 : 500;
        document.getElementById('progress').style.backgroundColor = '#f09826';
        image.src = `ogonek${currentLevel}.png`;
        document.getElementById('progress').style.width = '0%';
        document.getElementById('progress-counter').textContent = progress;
        document.getElementById('next-level-button').style.display = 'none';
        image.style.transform = 'translateX(0)';
        image.style.transition = '';
        // Update Firebase
        if (user) {
            db.collection("pets").doc(user.id.toString()).set({
                experience: progress,
                level: currentLevel,
                name: document.getElementById('progress-label-display').textContent,
                partnerId: partnerId,
                partnerUsername: partnerId ? document.getElementById('adoption-status').textContent.split('@')[1] : null
            }, { merge: true });
        }
    }, 500);
}

function openModal() {
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('label-input').value = document.getElementById('progress-label-display').textContent;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function updateLabel() {
    const input = document.getElementById('label-input').value;
    if (input.trim() !== '') {
        document.getElementById('progress-label-display').textContent = input;
        // Update Firebase
        if (user) {
            db.collection("pets").doc(user.id.toString()).set({
                name: input,
                experience: progress,
                level: currentLevel,
                partnerId: partnerId,
                partnerUsername: partnerId ? document.getElementById('adoption-status').textContent.split('@')[1] : null
            }, { merge: true });
        }
    }
    closeModal();
}

function sendAdoptionRequest() {
    const username = document.getElementById('adopt-username').value;
    if (!username.startsWith('@') || username.length <= 1) {
        tg.showAlert('Пожалуйста, введите корректный Telegram username (начинается с @).');
        return;
    }
    // Send adoption request via bot
    fetch('YOUR_SERVER_ENDPOINT/adopt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            requesterId: user.id,
            requesterUsername: user.username || user.first_name,
            targetUsername: username.substring(1) // Remove @
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            tg.showAlert('Запрос на усыновление отправлен!');
        } else {
            tg.showAlert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        tg.showAlert('Ошибка при отправке запроса.');
        console.error(error);
    });
}

// Load data on initialization
loadPetData();

// Close modal on click outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}