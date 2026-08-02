const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');

// Variabel Utama Game
let score = 0;
let isGameOver = false;
let speed = 0.01; // Kecepatan laju kapal
const horizonY = canvas.height * 0.4; // Posisi garis cakrawala (40% dari atas)

// Posisi Pemain (Kemudi)
let playerX = 0; // -1 (Kiri penuh) sampai 1 (Kanan penuh)
const playerSpeed = 0.05;

// Array untuk menyimpan rintangan (karang)
let obstacles = [];

// Kontrol Keyboard
let keys = {};
window.addEventListener('keydown', (e) => { 
    keys[e.code] = true; 
    if (e.code === 'Space' && isGameOver) resetGame();
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function spawnObstacle() {
    // Munculkan rintangan secara acak di kiri, tengah, atau kanan
    const startX = (Math.random() * 4) - 2; // Nilai antara -2 hingga 2
    obstacles.push({
        x: startX,
        progress: 0 // 0 = di cakrawala, 1 = mengenai layar pemain
    });
}

function update() {
    if (isGameOver) return;

    // Pergerakan Pemain
    if ((keys['ArrowLeft'] || keys['KeyA']) && playerX > -1.5) playerX -= playerSpeed;
    if ((keys['ArrowRight'] || keys['KeyD']) && playerX < 1.5) playerX += playerSpeed;

    // Tambah Skor
    score += 0.1;
    scoreElement.innerText = Math.floor(score);

    // Spawn Rintangan Baru seiring waktu
    if (Math.random() < 0.03) spawnObstacle(); // 3% kemungkinan spawn setiap frame

    // Update posisi rintangan
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.progress += speed;

        // Deteksi Tabrakan
        // Jika rintangan sudah dekat dengan layar (progress > 0.8) dan posisinya sejajar dengan pemain
        if (obs.progress > 0.8 && obs.progress < 1.0) {
            let distanceX = Math.abs(obs.x - playerX);
            if (distanceX < 0.5) { // Jarak toleransi tabrakan
                isGameOver = true;
                gameOverScreen.style.display = 'block';
            }
        }
    }

    // Bersihkan rintangan yang sudah melewati layar (progress > 1)
    obstacles = obstacles.filter(obs => obs.progress <= 1);
}

function draw() {
    // 1. Gambar Langit
    ctx.fillStyle = '#6ab8cc'; // Warna langit retro
    ctx.fillRect(0, 0, canvas.width, horizonY);

    // 2. Gambar Laut
    ctx.fillStyle = '#216e8c'; // Warna laut biru tua
    ctx.fillRect(0, horizonY, canvas.width, canvas.height - horizonY);

    // Garis Cakrawala
    ctx.fillStyle = '#174f66';
    ctx.fillRect(0, horizonY, canvas.width, 2);

    // 3. Gambar Rintangan (Ilusi 2D Scaling)
    // Urutkan agar rintangan yang jauh digambar lebih dulu (z-sorting)
    obstacles.sort((a, b) => a.progress - b.progress);

    for (let obs of obstacles) {
        // Kalkulasi ilusi jarak
        // Skala membesar dari 0 (horizon) ke 1 (depan mata)
        let scale = obs.progress; 
        let y = horizonY + (canvas.height - horizonY) * scale;
        
        // Kalkulasi posisi X berdasarkan pergerakan kemudi pemain
        let x = (canvas.width / 2) + ((obs.x - playerX) * (canvas.width / 2) * scale);
        
        // Ukuran karang
        let width = 100 * scale;
        let height = 80 * scale;

        // Gambar Karang Sederhana (Warna Coklat/Abu)
        ctx.fillStyle = '#555';
        ctx.fillRect(x - width/2, y - height, width, height);
        // Highlight agar sedikit berbentuk
        ctx.fillStyle = '#777';
        ctx.fillRect(x - width/2 + (width*0.1), y - height + (height*0.1), width*0.3, height*0.3);
    }

    // 4. Gambar Kemudi Kapal (POV) di bagian bawah layar
    // Ini area di mana nanti kamu bisa meletakkan "image_f1749e.jpg"
    ctx.fillStyle = '#8b5a2b'; // Warna kayu
    
    // Dasar kapal
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // Setir Kemudi (hanya bentuk sederhana untuk ilustrasi)
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height - 30, 80, 0, Math.PI * 2);
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#5c3a21';
    ctx.stroke();
    // Efek putaran setir berdasarkan input pemain
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height - 30, 40, playerX * -0.5, (playerX * -0.5) + Math.PI, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#a67b5b';
    ctx.stroke();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    playerX = 0;
    obstacles = [];
    isGameOver = false;
    gameOverScreen.style.display = 'none';
}

// Mulai Game
gameLoop();
