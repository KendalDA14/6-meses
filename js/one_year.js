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

const memoryCards = Array.from(document.querySelectorAll(".memory-card"));
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

  setMemory(index);
  memoryModalImage.src = image.getAttribute("src") || "";
  memoryModalImage.alt = image.getAttribute("alt") || "";
  memoryModalCounter.textContent = `Recuerdo ${String(index + 1).padStart(2, "0")}`;
  memoryModalTitle.textContent = card.dataset.title || "";
  memoryModalText.textContent = card.dataset.text || "";
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
  const labels = ["¿Segura?", "¿Está seguraaa?"];

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
  label.textContent = "Sí";
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

const videoItems = [
  {
    src: "img/one_year/video1.mp4",
    poster: "img/one_year/foto14.jpeg",
    title: "Esto se mueve como recuerdo.",
    text: "Hay cosas que una foto deja quietas, pero un video las vuelve a prender. Este espacio queda para eso: para recordar movimiento, voces, risas, salidas y pedacitos que me hacen pensar en usted.",
  },
  {
    src: "img/one_year/video2.mp4",
    poster: "img/one_year/foto2.jpeg",
    title: "Una parte viva.",
    text: "Este video queda como una ventanita a un momento real. No perfecto, no posado, solo nuestro y bonito por eso.",
  },
  {
    src: "img/one_year/video3.mp4",
    poster: "img/one_year/foto5.jpeg",
    title: "El ritmo de nosotros.",
    text: "Me gusta que no todo sea estático. Hay recuerdos que necesitan moverse un poquito para sentirse completos.",
  },
  {
    src: "img/one_year/video4.mp4",
    poster: "img/one_year/foto9.jpeg",
    title: "Para repetirlo.",
    text: "Este queda como recordatorio de que quiero más momentos así: sencillos, lindos y con usted.",
  },
  {
    src: "img/one_year/video5.mp4",
    poster: "img/one_year/foto15.jpeg",
    title: "Otro video para guardarlo.",
    text: "Este también queda aquí, porque hay cosas que se sienten más vivas cuando se mueven. Y porque sí, porque me dio la gana guardarlo.",
  },
];
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
});

carouselVideo.addEventListener("pause", () => {
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
  currentVideo = (index + videoItems.length) % videoItems.length;
  const item = videoItems[currentVideo];

  gsap.timeline({ defaults: { duration: reduceMotionQuery.matches ? 0 : 0.26, ease: "power2.out" } })
    .to([carouselVideo, videoCounter, videoTitle, videoText], { autoAlpha: 0, y: 10 })
    .add(() => {
      carouselVideo.poster = item.poster;
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
        ".hero-actions",
        ".hero-photo",
        ".hero-note",
        ".intro-note",
        ".section-heading",
        ".feature-photo",
        ".video-section",
        ".final-card",
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
      .from(".hero-actions", { autoAlpha: 0, y: 18 }, "<0.16")
      .from(".hero-photo", {
        autoAlpha: 0,
        y: 46,
        scale: 0.86,
        rotation: (index) => [-14, 12, -8][index],
        stagger: 0.14,
      }, "<0.02")
      .from(".hero-note", { autoAlpha: 0, y: 24, scale: 0.92 }, "<0.28");

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

    ScrollTrigger.refresh();
  },
);

window.setInterval(spawnFloatingToken, 900);
