const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');

// Variabel Utama Game
let score = 0;
let isGameOver = false;
let speed = 0.012; // Kecepatan kapal mendekati rintangan

// Mengatur titik prespektif berdasarkan gambar yang kamu kirim
const horizonY = canvas.height * 0.35; // Cakrawala di gambar (sekitar 35% dari atas)
const deckY = canvas.height * 0.75;    // Posisi ujung dek kapal di gambar

let playerX = 0;
const playerSpeed = 0.04;
let sway = 0; // Efek kamera bergoyang saat belok

let obstacles = [];

// Memuat Gambar Latar Belakang (Gambar yang kamu kirim)
const bgImage = new Image();
bgImage.src = 'image_f1749e.jpg';

// Kontrol Keyboard
let keys = {};
window.addEventListener('keydown', (e) => { 
    keys[e.code] = true; 
    if (e.code === 'Space' && isGameOver) resetGame();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function spawnObstacle() {
    const startX = (Math.random() * 4) - 2; 
    obstacles.push({
        x: startX,
        progress: 0 
    });
}

// Fungsi menggambar Karang bergaya Pixel Art
function drawPixelRock(x, y, width, height) {
    ctx.fillStyle = '#4a3c31'; // Warna dasar karang
    ctx.fillRect(x - width/2, y - height, width, height);
    
    // Highlight dan Bayangan (Pixel effect)
    ctx.fillStyle = '#6b5744'; 
    ctx.fillRect(x - width/2 + width*0.1, y - height + height*0.1, width*0.8, height*0.4);
    
    ctx.fillStyle = '#30261f'; 
    ctx.fillRect(x - width/2 + width*0.6, y - height + height*0.5, width*0.4, height*0.5);
    
    // Ujung tajam karang
    ctx.fillStyle = '#7a6450';
    ctx.fillRect(x - width/4, y - height - height*0.2, width/2, height*0.2);
}

function update() {
    if (isGameOver) return;

    // Logika Mengemudi (Menggeser posisi rintangan & efek kamera)
    if ((keys['ArrowLeft'] || keys['KeyA']) && playerX > -1.5) {
        playerX -= playerSpeed;
        sway = Math.max(sway - 1, -20); // Kamera miring ke kiri
    } else if ((keys['ArrowRight'] || keys['KeyD']) && playerX < 1.5) {
        playerX += playerSpeed;
        sway = Math.min(sway + 1, 20); // Kamera miring ke kanan
    } else {
        // Kamera kembali ke tengah perlahan
        if (sway > 0) sway -= 0.5;
        if (sway < 0) sway += 0.5;
    }

    // Tambah Skor
    score += 0.05;
    scoreElement.innerText = Math.floor(score);

    // Semakin tinggi skor, kemungkinan muncul rintangan semakin besar
    if (Math.random() < 0.02 + (score * 0.0001)) spawnObstacle();

    // Update posisi rintangan
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.progress += speed + (score * 0.00002); // Kecepatan perlahan naik

        // Deteksi Tabrakan di depan kapal (progress ~0.9)
        if (obs.progress > 0.85 && obs.progress < 1.0) {
            let distanceX = Math.abs(obs.x - playerX);
            if (distanceX < 0.4) {
                isGameOver = true;
                gameOverScreen.style.display = 'block';
            }
        }
    }

    // Buang rintangan yang sudah menabrak / lewat
    obstacles = obstacles.filter(obs => obs.progress <= 1.0);
}

function draw() {
    // 1. Gambar Background (Gambar Pixel Art)
    if (bgImage.complete) {
        // Menggambar background lebih besar agar saat 'sway' pinggirannya tidak terpotong (Ilusi 3D)
        ctx.drawImage(bgImage, -30 - sway, -20, canvas.width + 60, canvas.height + 40);
    } else {
        // Fallback jika gambar belum dimuat
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Urutkan rintangan dari yang terjauh ke terdekat (Z-sorting)
    obstacles.sort((a, b) => a.progress - b.progress);

    // 2. Gambar Rintangan (Karang)
    for (let obs of obstacles) {
        let scale = obs.progress; 
        
        // Y membesar dari garis cakrawala ke arah dek kapal
        let y = horizonY + (deckY - horizonY) * scale;
        
        // X bergeser berdasarkan input setir pemain
        let x = (canvas.width / 2) + ((obs.x - playerX) * (canvas.width / 2) * scale) - sway;
        
        let width = 140 * scale;
        let height = 110 * scale;

        // Hanya gambar jika rintangan masih di area laut (belum menyentuh kamera / bagian bawah layar)
        if (scale < 1.0) {
            drawPixelRock(x, y, width, height);
        }
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    playerX = 0;
    sway = 0;
    obstacles = [];
    isGameOver = false;
    gameOverScreen.style.display = 'none';
}

// Tunggu gambar termuat baru mulai game
bgImage.onload = () => {
    gameLoop();
};

// Jaga-jaga jika gambar tidak ada, game tetap jalan setelah 1 detik
setTimeout(() => {
    if (!bgImage.complete) gameLoop();
}, 1000);
