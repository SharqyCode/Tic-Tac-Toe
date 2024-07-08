// ### HELPER FUNCTIONS ###
export function hideScreen(screen: HTMLDivElement): void {
  screen.style.display = "block";
  let comps = Array.from(screen.children);

  comps.forEach((comp) => {
    (comp as HTMLElement).style.transform = "scale(0)";
    if (!comp.classList.contains("topBar"))
      (comp as HTMLElement).style.transition = "transform 0.5s ease-out 0s";
  });
}

export function loadNextScreen(
  current: HTMLDivElement,
  next: HTMLDivElement,
  e: MouseEvent,
  soundEffect: string
): void {
  // Shrink the clicked button
  let target = getButton(e) as HTMLElement;

  if (!target.classList.contains("btnBack")) {
    target.style.animation = "shrink 0.5s forwards";
    playAudio(soundEffect);
  }

  let curr_comps = Array.from(current.children);

  curr_comps.forEach((comp) => {
    if (!comp.classList.contains("topBar")) {
      (comp as HTMLElement).style.transition = "transform 0.5s ease-out 0s";
      (comp as HTMLElement).style.animation = "shrink 0.5s 0.4s forwards";
    }
  });

  setTimeout(() => {
    playAudio(soundEffect);
  }, 350);

  setTimeout(() => {
    curr_comps.forEach((comp) => {
      if (!comp.classList.contains("topBar"))
        (comp as HTMLElement).style.transform = "scale(0)";
      (comp as HTMLElement).style.animation = "";
      target.style.animation = "";
    });
    current.style.display = "none";

    let next_comps = Array.from(next.children);
    next.style.display = "block";
    setTimeout(() => {
      next_comps.forEach((comp) => {
        (comp as HTMLElement).style.transform = "scale(1)";
      });
    }, 100);
  }, 900);
}

export function playAudio(path: string): void {
  let audio = new Audio(path);
  audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
}

export function getButton(e: MouseEvent): EventTarget | null {
  if ((e.target as HTMLElement).tagName === "BUTTON") {
    return e.target;
  } else {
    let target = e.target as HTMLElement;
    while (target.tagName !== "BUTTON") {
      target = target.parentElement as HTMLElement;
    }
    return target;
  }
}
