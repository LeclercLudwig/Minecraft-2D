// Initialisation du canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Paramètres de génération du monde
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BLOCK_SIZE = 16;

// Génération du monde aléatoire
const world = [];
for (let x = 0; x < WIDTH / BLOCK_SIZE; x++) {
  world[x] = [];
  for (let y = 0; y < HEIGHT / BLOCK_SIZE; y++) {
    // Couleur verte pour chaque bloc
    world[x][y] = "rgb(17, 107, 24)";
  }
}

// Position du joueur
let playerX = 0;
let playerY = 0;

// Contrôle du joueur
window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowUp":
      playerY -= 1;
      break;
    case "ArrowDown":
      playerY += 1;
      break;
    case "ArrowLeft":
      playerX -= 1;
      break;
    case "ArrowRight":
      playerX += 1;
      break;
  }
});

setInterval(() => {
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner les blocs
  for (let x = 0; x < WIDTH / BLOCK_SIZE; x++) {
    for (let y = 0; y < HEIGHT / BLOCK_SIZE; y++) {
      ctx.fillStyle = world[x][y];
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }

  // Dessiner le joueur
  ctx.fillStyle = "red";
  ctx.fillRect(playerX * BLOCK_SIZE, playerY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}, 1000 / 60);
