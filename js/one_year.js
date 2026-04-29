gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function spawnFloatingToken() {
  if (reduceMotionQuery.matches) {
    return;
  }

  const layer = document.getElementById("floatingLayer");
  const token = document.createElement("span");
  const options = [
    { html: "Te amo", color: "#C44F87", size: "0.92rem" },
    { html: "&#10084;", color: "#FF7A8A", size: "1.35rem" },
    { html: "&#10049;", color: "#2F9D8F", size: "1.45rem" },
    { html: "Te amo", color: "#1E2444", size: "0.86rem" },
  ];
  const selected = options[Math.floor(Math.random() * options.length)];

  token.className = "floating-token";
  token.innerHTML = selected.html;
  token.style.left = `${Math.random() * 96}vw`;
  token.style.setProperty("--token-color", selected.color);
  token.style.setProperty("--token-size", selected.size);
  layer.appendChild(token);

  gsap.fromTo(token,
    {
      autoAlpha: 0,
      y: 0,
      x: 0,
      rotation: -8 + Math.random() * 16,
      scale: 0.8,
    },
    {
      autoAlpha: 0.82,
      y: "-118vh",
      x: -34 + Math.random() * 68,
      rotation: "+=18",
      scale: 1,
      duration: 10 + Math.random() * 5,
      ease: "none",
      onComplete: () => token.remove(),
    },
  );
}

function shuffleItems(items) {
  const storageKey = "oneYearMemoryOrder";
  const getItemKey = (item) => item.querySelector("img")?.getAttribute("src") || item.dataset.title || "";
  const getOrder = (list) => list.map(getItemKey).join("|");
  let previousOrder = "";

  try {
    previousOrder = localStorage.getItem(storageKey) || "";
  } catch {
    previousOrder = "";
  }

  const shuffled = [...items];

  for (let attempt = 0; attempt < 8; attempt += 1) {
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    if (getOrder(shuffled) !== previousOrder) {
      break;
    }
  }

  const matchesOriginalOrder = shuffled.every((item, index) => item === items[index]);

  if (shuffled.length > 1 && (getOrder(shuffled) === previousOrder || matchesOriginalOrder)) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  try {
    localStorage.setItem(storageKey, getOrder(shuffled));
  } catch {
    // If storage is blocked, the shuffle still works for this load.
  }

  return shuffled;
}

const memoryCards = shuffleItems(Array.from(document.querySelectorAll(".memory-card")));
const memoryPosition = document.getElementById("memoryPosition");
const memoryStage = document.getElementById("memoryStage");
const memoryModal = document.getElementById("memoryModal");
const memoryModalImage = document.getElementById("memoryModalImage");
const memoryModalCounter = document.getElementById("memoryModalCounter");
const memoryModalTitle = document.getElementById("memoryModalTitle");
const memoryModalText = document.getElementById("memoryModalText");
const closeMemoryModalButton = document.getElementById("closeMemoryModal");
const revealWord = document.getElementById("revealWord");
const photoStopButton = document.getElementById("photoStopButton");
const funnyModal = document.getElementById("funnyModal");
const funnyModalText = document.getElementById("funnyModalText");
const funnyModalVideo = document.getElementById("funnyModalVideo");
const funnyModalVideoSource = document.getElementById("funnyModalVideoSource");
const closeFunnyModalButton = document.getElementById("closeFunnyModal");
let currentMemory = 0;
let startX = 0;
let dragX = 0;
let isDragging = false;
let revealClicks = 0;
let photoStopClicks = 0;

function getMemorySpacing() {
  return window.innerWidth < 720 ? 112 : 168;
}

function updateMemoryDeck() {
  const spacing = getMemorySpacing();
  memoryPosition.textContent = `${String(currentMemory + 1).padStart(2, "0")} / ${memoryCards.length}`;

  memoryCards.forEach((card, index) => {
    const offset = index - currentMemory;
    const wrappedOffset = ((offset + memoryCards.length / 2) % memoryCards.length) - memoryCards.length / 2;
    const distance = Math.abs(wrappedOffset);
    const isActive = index === currentMemory;
    const x = wrappedOffset * spacing + dragX;
    const z = isActive ? 190 : Math.max(-260, 90 - distance * 82);
    const rotationY = wrappedOffset * -17;
    const scale = isActive ? 1 : Math.max(0.64, 1 - distance * 0.11);
    const opacity = distance > 4 ? 0 : Math.max(0.12, 1 - distance * 0.18);

    card.classList.toggle("is-active", isActive);
    card.style.zIndex = String(100 - distance * 8);
    card.style.pointerEvents = distance > 4 ? "none" : "auto";

    gsap.to(card, {
      x,
      yPercent: -50,
      xPercent: -50,
      z,
      rotationY,
      scale,
      autoAlpha: opacity,
      duration: reduceMotionQuery.matches ? 0 : 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });
  });
}

function setMemory(index) {
  currentMemory = (index + memoryCards.length) % memoryCards.length;
  dragX = 0;
  updateMemoryDeck();
}

function openMemoryModal(index = currentMemory) {
  const card = memoryCards[index];
  const image = card.querySelector("img");
  const captionLabel = card.querySelector(".memory-caption span");
  const captionText = card.querySelector(".memory-caption strong");

  setMemory(index);
  memoryModalImage.src = image.getAttribute("src") || "";
  memoryModalImage.alt = image.getAttribute("alt") || "";
  // El modal lee el texto visible de cada foto para que editar el HTML sea suficiente.
  memoryModalCounter.textContent = captionLabel?.textContent?.trim() || `Recuerdo ${String(index + 1).padStart(2, "0")}`;
  memoryModalTitle.textContent = card.dataset.title || captionText?.textContent?.trim() || "";
  memoryModalText.textContent = captionText?.textContent?.trim() || "";
  memoryModal.classList.add("is-open");
  document.body.style.overflow = "hidden";

  gsap.fromTo(".memory-dialog",
    { y: 24, scale: 0.96 },
    { y: 0, scale: 1, duration: reduceMotionQuery.matches ? 0 : 0.32, ease: "power3.out" },
  );
}

function closeMemoryModal() {
  memoryModal.classList.remove("is-open");
  document.body.style.overflow = "";
}

if (revealWord) {
  revealWord.style.setProperty("--reveal-progress", "0");
  revealWord.addEventListener("click", () => {
    const revealSteps = [0.18, 0.38, 0.62, 0.84, 1];
    revealClicks = Math.min(revealClicks + 1, revealSteps.length);
    const progress = revealSteps[revealClicks - 1];

    gsap.to(revealWord, {
      "--reveal-progress": progress,
      duration: reduceMotionQuery.matches ? 0 : 0.34,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.fromTo(revealWord,
      { x: -2, rotation: -2 },
      {
        x: 0,
        rotation: 0,
        duration: reduceMotionQuery.matches ? 0 : 0.34,
        ease: "elastic.out(1, 0.35)",
        overwrite: "auto",
      },
    );

    if (progress === 1) {
      revealWord.classList.add("is-revealed");
    }
  });
}

const funnyTexts = [
  "JAAJAJAJ, no me importa, ahora le voy a tomar masss.",
  "Siga, sigaa y le voy a secuestrar a Eli.",
];

const funnyVideos = [
  "img/one_year/funny1.mp4",
  "img/one_year/funny2.mp4",
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function openFunnyModal() {
  if (!funnyModal || !funnyModalText || !funnyModalVideo || !funnyModalVideoSource) {
    return;
  }

  funnyModalText.textContent = randomItem(funnyTexts);
  funnyModalVideoSource.src = randomItem(funnyVideos);
  funnyModalVideo.muted = false;
  funnyModalVideo.volume = 1;
  funnyModalVideo.load();
  funnyModal.classList.add("is-open");
  funnyModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  gsap.fromTo(".funny-dialog",
    { y: 28, scale: 0.92, rotation: -2 },
    {
      y: 0,
      scale: 1,
      rotation: 0,
      duration: reduceMotionQuery.matches ? 0 : 0.36,
      ease: "back.out(1.7)",
    },
  );

  funnyModalVideo.play().catch(() => {});
}

function closeFunnyModal() {
  if (!funnyModal || !funnyModalVideo) {
    return;
  }

  funnyModal.classList.remove("is-open");
  funnyModal.setAttribute("aria-hidden", "true");
  funnyModalVideo.pause();
  document.body.style.overflow = "";
}

photoStopButton?.addEventListener("click", () => {
  const label = photoStopButton.querySelector("span");
  const labels = ["\u00bfSegura?", "\u00bfEst\u00e1 seguraaa?"];

  photoStopClicks += 1;

  gsap.fromTo(photoStopButton,
    { scale: 0.92, rotation: -2 },
    {
      scale: 1,
      rotation: 0,
      duration: reduceMotionQuery.matches ? 0 : 0.28,
      ease: "back.out(2)",
      overwrite: "auto",
    },
  );

  if (photoStopClicks <= labels.length) {
    label.textContent = labels[photoStopClicks - 1];
    return;
  }

  photoStopClicks = 0;
  label.textContent = "S\u00ed";
  openFunnyModal();
});

closeFunnyModalButton?.addEventListener("click", closeFunnyModal);
funnyModal?.addEventListener("click", (event) => {
  if (event.target === funnyModal) {
    closeFunnyModal();
  }
});

document.getElementById("memoryPrev")?.addEventListener("click", () => setMemory(currentMemory - 1));
document.getElementById("memoryNext")?.addEventListener("click", () => setMemory(currentMemory + 1));

closeMemoryModalButton?.addEventListener("click", closeMemoryModal);
memoryModal?.addEventListener("click", (event) => {
  if (event.target === memoryModal) {
    closeMemoryModal();
  }
});

memoryStage?.addEventListener("pointerdown", (event) => {
  isDragging = true;
  startX = event.clientX;
  dragX = 0;
  memoryStage.setPointerCapture(event.pointerId);
});

memoryStage?.addEventListener("pointermove", (event) => {
  if (!isDragging) {
    return;
  }

  dragX = (event.clientX - startX) * 0.58;
  updateMemoryDeck();
});

memoryStage?.addEventListener("pointerup", (event) => {
  if (!isDragging) {
    return;
  }

  const delta = event.clientX - startX;
  isDragging = false;

  if (delta > 58) {
    setMemory(currentMemory - 1);
  } else if (delta < -58) {
    setMemory(currentMemory + 1);
  } else if (Math.abs(delta) < 12) {
    const tappedElement = document.elementFromPoint(event.clientX, event.clientY);
    const tappedCard = tappedElement?.closest(".memory-card");
    const tappedIndex = memoryCards.indexOf(tappedCard);

    if (tappedIndex >= 0) {
      openMemoryModal(tappedIndex);
    }
  } else {
    dragX = 0;
    updateMemoryDeck();
  }

});

memoryStage?.addEventListener("pointerleave", () => {
  if (!isDragging) {
    return;
  }

  isDragging = false;
  dragX = 0;
  updateMemoryDeck();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && funnyModal?.classList.contains("is-open")) {
    closeFunnyModal();
    return;
  }

  if (event.key === "Escape" && memoryModal.classList.contains("is-open")) {
    closeMemoryModal();
    return;
  }

  if (event.key === "ArrowLeft") {
    setMemory(currentMemory - 1);
    if (memoryModal.classList.contains("is-open")) {
      openMemoryModal(currentMemory);
    }
  }

  if (event.key === "ArrowRight") {
    setMemory(currentMemory + 1);
    if (memoryModal.classList.contains("is-open")) {
      openMemoryModal(currentMemory);
    }
  }
});

window.addEventListener("resize", updateMemoryDeck);
updateMemoryDeck();

function readVideoItemsFromHtml() {
  return Array.from(document.querySelectorAll(".video-data-item"))
    .map((item) => ({
      src: item.dataset.src || "",
      title: item.querySelector(".video-data-title")?.textContent?.trim() || "",
      text: item.querySelector(".video-data-text")?.textContent?.trim() || "",
    }))
    .filter((item) => item.src);
}

const videoItems = readVideoItemsFromHtml();
const videoCarousel = document.querySelector(".video-carousel");
const carouselVideo = document.getElementById("carouselVideo");
const carouselVideoSource = document.getElementById("carouselVideoSource");
const videoPosition = document.getElementById("videoPosition");
const videoCounter = document.getElementById("videoCounter");
const videoTitle = document.getElementById("videoTitle");
const videoText = document.getElementById("videoText");
const videoDots = Array.from(document.querySelectorAll(".video-dot"));
const videoSection = document.getElementById("video");
let currentVideo = 0;
let videoAudioStarted = false;
let resumeVideoOnReturn = false;
let videoSectionInView = false;

carouselVideo.muted = false;
carouselVideo.volume = 1;
carouselVideo.addEventListener("play", () => {
  videoAudioStarted = true;
  videoCarousel?.classList.add("is-playing");
});

carouselVideo.addEventListener("pause", () => {
  videoCarousel?.classList.remove("is-playing");

  if (videoSectionInView) {
    resumeVideoOnReturn = false;
  }
});

const videoVisibilityObserver = new IntersectionObserver(
  ([entry]) => {
    const isInView = entry.isIntersecting && entry.intersectionRatio >= 0.32;
    videoSectionInView = isInView;

    if (!isInView) {
      resumeVideoOnReturn = !carouselVideo.paused && !carouselVideo.ended;
      carouselVideo.pause();
      return;
    }

    if (resumeVideoOnReturn) {
      carouselVideo.play().catch(() => {});
    }
  },
  { threshold: [0, 0.32, 0.6] },
);

if (videoSection) {
  videoVisibilityObserver.observe(videoSection);
}

function setVideo(index, shouldPlay = false) {
  if (!videoItems.length) {
    return;
  }

  currentVideo = (index + videoItems.length) % videoItems.length;
  const item = videoItems[currentVideo];

  gsap.timeline({ defaults: { duration: reduceMotionQuery.matches ? 0 : 0.26, ease: "power2.out" } })
    .to([carouselVideo, videoCounter, videoTitle, videoText], { autoAlpha: 0, y: 10 })
    .add(() => {
      videoCarousel?.classList.remove("is-playing");
      carouselVideo.removeAttribute("poster");
      carouselVideoSource.src = item.src;
      carouselVideo.muted = false;
      carouselVideo.volume = 1;
      carouselVideo.load();
      if (shouldPlay || videoAudioStarted) {
        carouselVideo.play().catch(() => {});
      }
      videoPosition.textContent = `${String(currentVideo + 1).padStart(2, "0")} / ${videoItems.length}`;
      videoCounter.textContent = `Video ${String(currentVideo + 1).padStart(2, "0")}`;
      videoTitle.textContent = item.title;
      videoText.textContent = item.text;

      videoDots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === currentVideo);
      });
    })
    .to([carouselVideo, videoCounter, videoTitle, videoText], { autoAlpha: 1, y: 0, stagger: 0.04 });
}

document.getElementById("videoPrev")?.addEventListener("click", () => setVideo(currentVideo - 1, true));
document.getElementById("videoNext")?.addEventListener("click", () => setVideo(currentVideo + 1, true));
videoDots.forEach((dot) => {
  dot.addEventListener("click", () => setVideo(Number(dot.dataset.videoIndex || 0), true));
});
setVideo(0, false);

function initLooseNumbers() {
  const box = document.getElementById("numberBox");
  const form = document.getElementById("numberPuzzleForm");
  const pieceA = document.getElementById("pieceA");
  const pieceB = document.getElementById("pieceB");
  const status = document.getElementById("numberPuzzleStatus");

  if (!box || !form || !pieceA || !pieceB || !status) {
    return;
  }

  const options = ["03", "05", "08", "11", "12", "14", "15", "20", "21", "25", "26", "30"];
  const floatingValues = ["05", "15", "20", "25", "30", "03", "08", "11", "12", "06", "26", "14", "21", "07"];
  const pieces = [];
  let solved = false;
  let animationFrameId = 0;
  let isBoxVisible = true;

  function fillSelect(select) {
    select.innerHTML = "";
    options.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function bounds() {
    return {
      width: Math.max(1, box.clientWidth),
      height: Math.max(1, box.clientHeight),
    };
  }

  function addPiece(text, extraClass = "", start = {}) {
    const { width, height } = bounds();
    const element = document.createElement("span");
    element.className = `puzzle-piece ${extraClass}`.trim();
    element.textContent = text;
    box.appendChild(element);

    const size = element.getBoundingClientRect();
    const piece = {
      element,
      x: start.x ?? Math.random() * Math.max(24, width - size.width),
      y: start.y ?? Math.random() * Math.max(24, height - size.height),
      vx: start.vx ?? (Math.random() * 2.4 - 1.2),
      vy: start.vy ?? (Math.random() * -1.8 - 0.3),
      rotation: Math.random() * 18 - 9,
      spin: Math.random() * 0.8 - 0.4,
      width: size.width,
      height: size.height,
    };

    pieces.push(piece);
    return piece;
  }

  function animatePieces() {
    if (!isBoxVisible || document.hidden || reduceMotionQuery.matches) {
      animationFrameId = 0;
      return;
    }

    const { width, height } = bounds();
    const gravity = solved ? 0.008 : 0.035;

    pieces.forEach((piece) => {
      piece.vy += gravity;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.spin;

      if (piece.x <= 0 || piece.x + piece.width >= width) {
        piece.x = gsap.utils.clamp(0, Math.max(0, width - piece.width), piece.x);
        piece.vx *= -0.92;
      }

      if (piece.y <= 0 || piece.y + piece.height >= height) {
        piece.y = gsap.utils.clamp(0, Math.max(0, height - piece.height), piece.y);
        piece.vy *= -0.82;
        piece.vx *= 0.99;
      }

      piece.element.style.transform = `translate(${piece.x}px, ${piece.y}px) rotate(${piece.rotation}deg)`;
    });

    animationFrameId = window.requestAnimationFrame(animatePieces);
  }

  function startPieces() {
    if (!animationFrameId && isBoxVisible && !document.hidden && !reduceMotionQuery.matches) {
      animationFrameId = window.requestAnimationFrame(animatePieces);
    }
  }

  function stopPieces() {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
  }

  function addWrongPiece(left, right) {
    const { width, height } = bounds();
    const piece = addPiece(`${left}/${right}`, "is-wrong", {
      x: width * 0.5 - 28,
      y: height - 72,
      vx: Math.random() * 7 - 3.5,
      vy: -8.5 - Math.random() * 3,
    });

    gsap.fromTo(piece.element,
      { scale: 0.4, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.34, ease: "back.out(2)" },
    );
  }

  function bloom(message) {
    solved = true;
    box.classList.add("is-open");
    status.classList.add("is-open");
    status.innerHTML = message;
    pieceA.disabled = true;
    pieceB.disabled = true;
    form.querySelector("button").disabled = true;

    pieces.forEach((piece) => {
      piece.vx *= 0.24;
      piece.vy *= 0.12;
      piece.spin *= 0.3;
    });

    const flowers = ["&#127799;", "&#127800;", "&#127801;", "&#127804;", "&#127803;"];
    const { width, height } = bounds();
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    for (let index = 0; index < 18; index += 1) {
      const flower = document.createElement("span");
      flower.className = "puzzle-flower";
      flower.innerHTML = flowers[index % flowers.length];
      flower.style.left = `${Math.random() * width}px`;
      flower.style.top = `${height + 16}px`;
      box.appendChild(flower);

      timeline.to(flower, {
        y: -(height * (0.25 + Math.random() * 0.65)),
        x: Math.random() * 80 - 40,
        rotation: Math.random() * 50 - 25,
        scale: 0.82 + Math.random() * 0.58,
        duration: 1.2 + Math.random() * 0.8,
      }, index * 0.035);
    }

    timeline
      .fromTo(status, { y: 14, scale: 0.94 }, { y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 0.2)
      .to(box, { boxShadow: "0 30px 100px rgba(196, 79, 135, 0.22)", duration: 0.6 }, 0);
  }

  async function checkPieces(left, right) {
    const response = await fetch("/api/hidden-piece", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ left, right }),
    });

    if (!response.ok) {
      throw new Error("request failed");
    }

    return response.json();
  }

  fillSelect(pieceA);
  fillSelect(pieceB);
  floatingValues.forEach((value) => addPiece(value));
  const observer = new IntersectionObserver(
    ([entry]) => {
      isBoxVisible = entry.isIntersecting;
      if (isBoxVisible) {
        startPieces();
      } else {
        stopPieces();
      }
    },
    { threshold: 0.04 },
  );

  observer.observe(box);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPieces();
    } else {
      startPieces();
    }
  });
  startPieces();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (solved) {
      return;
    }

    const left = pieceA.value;
    const right = pieceB.value;
    const submitButton = form.querySelector("button");
    submitButton.disabled = true;
    status.classList.remove("is-open");
    status.textContent = "Viendo si cae...";

    try {
      const result = await checkPieces(left, right);

      if (result.ok) {
        bloom(result.message);
        return;
      }

      addWrongPiece(left, right);
      status.innerHTML = result.message;
    } catch {
      addWrongPiece(left, right);
      status.innerHTML = "Esto solo despierta cuando la p&aacute;gina corre desde Vercel.";
    } finally {
      if (!solved) {
        submitButton.disabled = false;
      }
    }
  });
}

initLooseNumbers();

mm.add(
  {
    reduceMotion: "(prefers-reduced-motion: reduce)",
    isDesktop: "(min-width: 900px)",
  },
  (context) => {
    const { reduceMotion, isDesktop } = context.conditions;

    if (reduceMotion) {
      gsap.set([
        ".hero-chip",
        ".hero-kicker",
        ".hero-title",
        ".hero-copy",
        ".hero-photo",
        ".intro-note",
        ".section-heading",
        ".feature-photo",
        ".video-section",
        ".final-card",
        ".loose-card",
      ], { autoAlpha: 1, clearProps: "transform" });
      return;
    }

    const heroTimeline = gsap.timeline({
      defaults: { duration: 0.86, ease: "power3.out" },
    });

    heroTimeline
      .from(".hero-chip", { autoAlpha: 0, y: 18 })
      .from(".hero-kicker", { autoAlpha: 0, y: 16 }, "<0.08")
      .from(".hero-title", { autoAlpha: 0, y: 34 }, "<0.12")
      .from(".hero-copy", { autoAlpha: 0, y: 24 }, "<0.16")
      .from(".hero-photo", {
        autoAlpha: 0,
        y: 46,
        scale: 0.86,
        rotation: (index) => [-14, 12, -8][index],
        stagger: 0.14,
      }, "<0.02");

    gsap.to(".hero-photo", {
      y: (index) => [12, -14, 10][index],
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.28,
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".intro-note",
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
      defaults: { duration: 0.76, ease: "power3.out" },
    }).from(".intro-note", { autoAlpha: 0, y: 36, scale: 0.96 });

    gsap.timeline({
      scrollTrigger: {
        trigger: "#tres-fotos",
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
      defaults: { duration: 0.78, ease: "power3.out" },
    })
      .from("#tres-fotos .section-heading", { autoAlpha: 0, y: 28 })
      .from(".feature-photo", {
        autoAlpha: 0,
        y: 54,
        scale: 0.92,
        rotation: (index) => [-5, 3, -3][index],
        stagger: 0.16,
      }, "<0.18");

    gsap.timeline({
      scrollTrigger: {
        trigger: "#panel",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      defaults: { duration: 0.82, ease: "power3.out" },
    })
      .from("#panel .section-heading", { autoAlpha: 0, y: 28 })
      .from(".memory-card", {
        autoAlpha: 0,
        y: 60,
        z: -120,
        rotationY: (index) => index % 2 === 0 ? -18 : 18,
        rotationX: 10,
        stagger: { each: 0.055, from: "center" },
      }, "<0.1");

    gsap.timeline({
      scrollTrigger: {
        trigger: "#video",
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
      defaults: { duration: 0.82, ease: "power3.out" },
    })
      .from(".video-carousel", { autoAlpha: 0, x: isDesktop ? -44 : 0, y: isDesktop ? 0 : 36, scale: 0.96 })
      .from(".video-copy", { autoAlpha: 0, x: isDesktop ? 44 : 0, y: isDesktop ? 0 : 36 }, "<0.18");

    gsap.from(".final-card", {
      autoAlpha: 0,
      y: 44,
      scale: 0.96,
      duration: 0.84,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".final-card",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(".loose-card", {
      autoAlpha: 0,
      y: 44,
      scale: 0.96,
      duration: 0.84,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".loose-card",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    ScrollTrigger.refresh();
  },
);

window.setInterval(spawnFloatingToken, 900);
