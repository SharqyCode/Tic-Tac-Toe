let gameBoard = document.getElementById("game_board") as HTMLDivElement;

function generateBoard(): HTMLDivElement {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let tile = document.createElement("div");
      tile.classList.add(
        "game_board_tile",
        "bg-shadow",
        "rounded-lg",
        "w-[118px]",
        "aspect-square",
        "font-bold",
        "text-7xl",
        "text-center",
        "grid",
        "place-items-center"
      );
      tile.dataset.x = `${i}`;
      tile.dataset.y = `${j}`;
      tile.style.transform = "scale(0)";
      gameBoard.appendChild(tile);
    }
  }
  return gameBoard;
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function displayBoard(tiles: HTMLCollection) {
  for (let tile of tiles) {
    (tile as HTMLDivElement).style.transition = "transform 0.3s";
    (tile as HTMLDivElement).style.transform = "scale(1)";
    await delay(100);
  }
}

// Function to create and set up the MutationObserver
function observeDisplayChange(element: HTMLElement) {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        const currentTransform = element.style.transform;
        if (currentTransform === "scale(1)") {
          displayBoard(element.children);
        }
      }
    });
  });

  // Configure the observer to watch for changes to attributes
  observer.observe(element, {
    attributes: true,
    attributeFilter: ["style"],
  });
}

// Add event listener to the button to toggle display on click
document.addEventListener("DOMContentLoaded", () => {
  let newGameBoard = generateBoard();
  observeDisplayChange(newGameBoard);
});
