const audio = document.getElementById("backgroundMusic");
const specialAudio = document.getElementById("specialMusic");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const buttonText = document.getElementById("buttonText");
const songName = document.getElementById("songName");
const musicContent = document.getElementById("musicContent");

let isPlaying = false;

audio.currentTime = 28;

function togglePlayback() {
  if (isPlaying) {
    audio.pause();
    playIcon.className = "fas fa-play";
    buttonText.textContent = "Reproducir Nuestra Canción";
    songName.classList.add("blur-sm");
    isPlaying = false;
  } else {
    audio.currentTime = 28;
    audio
      .play()
      .then(() => {
        playIcon.className = "fas fa-pause";
        buttonText.textContent = "Pausar Música";
        songName.classList.remove("blur-sm");
        isPlaying = true;
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
        alert(
          "Error al reproducir la canción. Asegúrate de que el archivo esté disponible."
        );
      });
  }
}

audio.addEventListener("ended", () => {
  playIcon.className = "fas fa-play";
  buttonText.textContent = "Reproducir Nuestra Canción";
  songName.classList.add("blur-sm");
  isPlaying = false;
});

audio.addEventListener("pause", () => {
  playIcon.className = "fas fa-play";
  buttonText.textContent = "Reproducir Nuestra Canción";
  songName.classList.add("blur-sm");
  isPlaying = false;
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.getElementById("loadingScreen").style.opacity = "0";
    document.getElementById("loadingScreen").style.transition =
      "opacity 1s ease";

    setTimeout(function () {
      document.getElementById("loadingScreen").style.display = "none";
      document.getElementById("mainContent").classList.remove("hidden");
      document.getElementById("mainContent").style.opacity = "0";
      document.getElementById("mainContent").style.transition =
        "opacity 1s ease";

      setTimeout(function () {
        document.getElementById("mainContent").style.opacity = "1";
      }, 100);
    }, 1000);
  }, 5000);
});

document.getElementById("secretButton").addEventListener("click", function () {
  const hiddenSection = document.getElementById("hiddenSection");
  const button = document.getElementById("secretButton");

  if (hiddenSection.classList.contains("hidden")) {
    specialAudio.currentTime = 5;
    specialAudio
      .play()
      .then(() => {
        // Stop music after 20 seconds (from second 5 to 25)
        setTimeout(() => {
          specialAudio.pause();
          specialAudio.currentTime = 5; // Reset for next time
        }, 20000);
      })
      .catch((error) => {
        console.error("Error playing special audio:", error);
      });

    hiddenSection.classList.remove("hidden");
    hiddenSection.style.opacity = "0";
    hiddenSection.style.transform = "translateY(30px)";

    setTimeout(() => {
      hiddenSection.style.opacity = "1";
      hiddenSection.style.transform = "translateY(0)";
    }, 100);

    button.innerHTML =
      '<i class="fas fa-heart"></i><span>Ocultar Mensaje</span><i class="fas fa-eye-slash"></i>';
  } else {
    // Stop special music if playing
    specialAudio.pause();
    specialAudio.currentTime = 5;

    hiddenSection.style.opacity = "0";
    hiddenSection.style.transform = "translateY(30px)";

    setTimeout(() => {
      hiddenSection.classList.add("hidden");
    }, 300);

    button.innerHTML =
      '<i class="fas fa-heart"></i><span>Algo Especial Para Ti</span><i class="fas fa-eye"></i>';
  }
});

playButton.addEventListener("click", togglePlayback);

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(section);
  });
});

function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.innerHTML = "💖";
  heart.style.position = "fixed";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = "100vh";
  heart.style.fontSize = Math.random() * 20 + 10 + "px";
  heart.style.pointerEvents = "none";
  heart.style.zIndex = "1000";
  heart.style.animation = "floatUp 6s linear forwards";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 6000);
}

setInterval(createFloatingHeart, 3000);

const style = document.createElement("style");
style.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            .loading-heart-1 {
                animation: pulse 1.5s ease-in-out infinite;
            }
            
            .loading-heart-2 {
                animation: pulse 1.5s ease-in-out infinite 0.3s;
            }
            
            .loading-heart-3 {
                animation: pulse 1.5s ease-in-out infinite 0.6s;
            }
            
            .floating-heart {
                position: absolute;
                color: #EC4899;
                font-size: 1.5rem;
                animation: floatUpDown 3s ease-in-out infinite;
                top: 50%;
            }
            
            @keyframes floatUpDown {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            
            .loading-bar {
                width: 0%;
                animation: loadingProgress 5s ease-out forwards;
            }
            
            @keyframes loadingProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
        `;
document.head.appendChild(style);

function updateRelationshipTimer() {
  const startDate = new Date("2025-03-15");
  const currentDate = new Date();

  const timeDiff = currentDate.getTime() - startDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const monthsDiff = Math.floor(daysDiff / 30.44);

  document.getElementById("months").textContent = monthsDiff;
  document.getElementById("days").textContent = daysDiff;
}

updateRelationshipTimer();
setInterval(updateRelationshipTimer, 3600000);
