function RGBToHex(color) {
  let hex = color.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// Initialisation du canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Paramètres de génération du monde
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BLOCK_SIZE = 16;
const WATER_COLOR = "#C4E8E5";
const GRASS_COLOR = "#28a745";
const LAKE_CHANCE = 0.01;
const LAKE_SIZE_MIN = 3;
const LAKE_SIZE_MAX = 7;
const LAKE_SMOOTHING = 0.6;
const TREE_CHANCE = 0.05;

// Génération du monde aléatoire
const world = [];
for (let x = 0; x < WIDTH / BLOCK_SIZE; x++) {
  world[x] = [];
  for (let y = 0; y < HEIGHT / BLOCK_SIZE; y++) {
    // Couleur verte pour chaque bloc
    world[x][y] = GRASS_COLOR;
    
    // Génération des arbres
    if (Math.random() < TREE_CHANCE && world[x][y] === GRASS_COLOR) {
      const treeSize = Math.floor(Math.random() * 3) + 3;
      const treeX = x - Math.floor(treeSize / 2);
      const treeY = y - treeSize + 1;
      for (let i = treeX; i < treeX + treeSize; i++) {
        for (let j = treeY; j <= y; j++) {
          if (i >= 0 && i < WIDTH / BLOCK_SIZE && j >= 0 && j < HEIGHT / BLOCK_SIZE) {
            world[i][j] = "#8B4513";
          }
        }
      }
    }
  }
}

// Génération de l'eau
for (let x = 0; x < WIDTH / BLOCK_SIZE; x++) {
  for (let y = 0; y < HEIGHT / BLOCK_SIZE; y++) {
    if (Math.random() < LAKE_CHANCE) {
      const lakeSize = Math.floor(Math.random() * (LAKE_SIZE_MAX - LAKE_SIZE_MIN + 1)) + LAKE_SIZE_MIN;
      for (let i = x; i < x + lakeSize; i++) {
        for (let j = y; j < y + lakeSize; j++) {
          if (i >= 0 && i < WIDTH / BLOCK_SIZE && j >= 0 && j < HEIGHT / BLOCK_SIZE) {
            world[i][j] = "#C4E8E5";
          }
        }
      }
    }
  }
}

// Lissage des lacs
for (let x = 0; x < WIDTH / BLOCK_SIZE; x++) {
  for (let y = 0; y < HEIGHT / BLOCK_SIZE; y++) {
    if (world[x][y] === "#C4E8E5") {
      let count = 0;
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (i >= 0 && i < WIDTH / BLOCK_SIZE && j >= 0 && j < HEIGHT / BLOCK_SIZE) {
            count++;
            const [r, g, b] = hexToRGB(world[i][j]);
            sumR += r;
            sumG += g;
            sumB += b;
          }
        }
      }
      const r = Math.round(sumR / count);
      const g = Math.round(sumG / count);
      const b = Math.round(sumB / count);
      world[x][y] = "#ADD8E6";
    }
  }
}


// Position du joueur
let playerX = 0;
let playerY = 0;

// Inventaire
let inventoryOpen = false;

// Contrôle du joueur
window.addEventListener("keydown", (event) => {
  switch (event.code) {
  case "ArrowUp":
  if (playerY > 0 && world[playerX][playerY - 1] !== "#ADD8E6") {
  playerY -= 1;
  }
  break;
  case "ArrowDown":
  if (playerY < HEIGHT / BLOCK_SIZE - 1 && world[playerX][playerY + 1] !== "#ADD8E6") {
  playerY += 1;
  }
  break;
  case "ArrowLeft":
  if (playerX > 0 && world[playerX - 1][playerY] !== "#ADD8E6") {
  playerX -= 1;
  }
  break;
  case "ArrowRight":
  if (playerX < WIDTH / BLOCK_SIZE - 1 && world[playerX + 1][playerY] !== "#C4E8E5") {
  playerX += 1;
  }
      break;
    case "KeyI":
      inventoryOpen = !inventoryOpen;
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

  // Dessiner l'inventaire si ouvert
  if (inventoryOpen) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Inventory", 20, 50);
  }
}, 1000 / 60);
