      const hasGsap = Boolean(window.gsap);
      const hasScrollTrigger = hasGsap && Boolean(window.ScrollTrigger);
      const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

      if (hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      const heroMedia = [
        {
          type: "image",
          src: "img/six_months/1.jpeg",
          alt: "Recuerdo de seis meses",
        },
        {
          type: "image",
          src: "img/six_months/2.jpeg",
          alt: "Recuerdo de seis meses",
        },
        {
          type: "image",
          src: "img/six_months/3.jpeg",
          alt: "Recuerdo de seis meses",
        },
        {
          type: "image",
          src: "img/six_months/4.jpeg",
          alt: "Recuerdo de seis meses",
        },
        {
          type: "image",
          src: "img/six_months/5.jpeg",
          alt: "Recuerdo de seis meses",
        },
        {
          type: "image",
          src: "img/six_months/6.1.jpeg",
          alt: "Recuerdo de seis meses",
        },
        {
          type: "image",
          src: "img/six_months/6.png",
          alt: "Recuerdo de seis meses",
        },
        {
          type: "image",
          src: "img/one_year/foto1.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto2.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto3.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto4.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto5.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto6.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto7.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto8.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto9.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto10.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto11.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto12.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto13.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto14.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto15.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto16.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto17.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto18.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "image",
          src: "img/one_year/foto19.jpeg",
          alt: "Recuerdo del primer ano",
        },
        {
          type: "video",
          src: "img/one_year/video1.mp4",
          alt: "Video del primer ano",
        },
        {
          type: "video",
          src: "img/one_year/video2.mp4",
          alt: "Video del primer ano",
        },
        {
          type: "video",
          src: "img/one_year/video3.mp4",
          alt: "Video del primer ano",
        },
        {
          type: "video",
          src: "img/one_year/video4.mp4",
          alt: "Video del primer ano",
        },
        {
          type: "video",
          src: "img/one_year/video5.mp4",
          alt: "Video del primer ano",
        },
      ];

      function getRandomMediaSet(count) {
        return [...heroMedia].sort(() => Math.random() - 0.5).slice(0, count);
      }

      function createMediaElement(media) {
        if (media.type === "video") {
          const video = document.createElement("video");
          video.src = media.src;
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          video.playsInline = true;
          video.setAttribute("aria-label", media.alt);
          video.addEventListener(
            "canplay",
            () => video.play().catch(() => {}),
            { once: true },
          );
          return video;
        }

        const image = document.createElement("img");
        image.src = media.src;
        image.alt = media.alt;
        image.loading = "eager";
        return image;
      }

      function renderHeroMedia(animate = true) {
        const slots = Array.from(document.querySelectorAll(".hero-media"));
        const selected = getRandomMediaSet(slots.length);

        slots.forEach((slot, index) => {
          const nextElement = createMediaElement(selected[index]);

          if (!animate || !slot.firstElementChild) {
            slot.replaceChildren(nextElement);
            if (hasGsap) {
              gsap.set(nextElement, { autoAlpha: 1, scale: 1 });
            }
            return;
          }

          if (!hasGsap) {
            slot.replaceChildren(nextElement);
            return;
          }

          const previousElement = slot.firstElementChild;
          slot.appendChild(nextElement);
          gsap.set(nextElement, { autoAlpha: 0, scale: 1.08 });

          gsap
            .timeline({
              defaults: { duration: 0.72, ease: "power3.out" },
              onComplete: () => previousElement.remove(),
            })
            .to(previousElement, { autoAlpha: 0, scale: 0.96 }, 0)
            .to(nextElement, { autoAlpha: 1, scale: 1 }, 0.08);
        });
      }

      const mm = hasGsap ? gsap.matchMedia() : null;

      renderHeroMedia(false);

      const yearGateModal = document.getElementById("yearGateModal");
      const yearGateDialog = yearGateModal?.querySelector(".year-gate-dialog");
      const yearGateForm = document.getElementById("yearGateForm");
      const yearGateQuestion = document.getElementById("yearGateQuestion");
      const yearGateAnswer = document.getElementById("yearGateAnswer");
      const yearGateStatus = document.getElementById("yearGateStatus");
      const yearGateSubmit = document.getElementById("yearGateSubmit");
      const closeYearGate = document.getElementById("closeYearGate");
      let pendingYearHref = "one_year.html";

      function setYearGateStatus(message, state = "") {
        if (!yearGateStatus) return;
        yearGateStatus.textContent = message;
        yearGateStatus.className = `year-gate-status mt-4 text-sm leading-6${state ? ` is-${state}` : ""}`;
      }

      function updateYearQuestion(data) {
        if (yearGateQuestion && data.question) {
          yearGateQuestion.textContent = data.question;
        }

        if (Number.isInteger(data.attemptsLeft)) {
          const suffix = data.attemptsLeft === 1 ? "intento" : "intentos";
          setYearGateStatus(`Quedan ${data.attemptsLeft} ${suffix}.`, "");
        }
      }

      async function loadYearQuestion() {
        if (!yearGateQuestion || !yearGateSubmit) return;

        yearGateSubmit.disabled = true;
        yearGateQuestion.textContent = "Cargando pregunta...";
        setYearGateStatus("", "");

        try {
          const response = await fetch("/api/year-gate", {
            credentials: "same-origin",
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("No se pudo cargar la pregunta.");
          }

          updateYearQuestion(await response.json());
        } catch {
          yearGateQuestion.textContent = "No pude cargar la pregunta.";
          setYearGateStatus(
            "Para probar este candado usa npx vercel dev o el deploy en Vercel.",
            "error",
          );
        } finally {
          yearGateSubmit.disabled = false;
        }
      }

      function openYearGate(href = "one_year.html") {
        if (!yearGateModal) return;

        pendingYearHref = href;
        yearGateModal.classList.add("is-open");
        yearGateModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("year-gate-lock");
        loadYearQuestion();

        if (
          hasGsap &&
          !reduceMotionQuery.matches &&
          yearGateDialog
        ) {
          gsap.fromTo(
            yearGateDialog,
            { autoAlpha: 0, y: 26, scale: 0.95 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.42,
              ease: "power3.out",
            },
          );
        }

        window.setTimeout(() => yearGateAnswer?.focus(), 160);
      }

      function closeYearGateModal() {
        if (!yearGateModal) return;

        yearGateModal.classList.remove("is-open");
        yearGateModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("year-gate-lock");
        if (yearGateAnswer) yearGateAnswer.value = "";
      }

      document.querySelectorAll("[data-year-gate]").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          openYearGate(link.getAttribute("href") || "one_year.html");
        });
      });

      closeYearGate?.addEventListener("click", closeYearGateModal);
      yearGateModal?.addEventListener("click", (event) => {
        if (event.target === yearGateModal) {
          closeYearGateModal();
        }
      });
      window.addEventListener("keydown", (event) => {
        if (
          event.key === "Escape" &&
          yearGateModal?.classList.contains("is-open")
        ) {
          closeYearGateModal();
        }
      });

      yearGateForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const answer = yearGateAnswer?.value.trim() || "";
        if (!answer) {
          setYearGateStatus("Escribe una respuesta para intentar.", "error");
          return;
        }

        yearGateSubmit.disabled = true;
        setYearGateStatus("Revisando...", "");

        try {
          const response = await fetch("/api/year-gate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ answer }),
          });
          const data = await response.json();

          if (data.ok) {
            setYearGateStatus("Listo. Entrando...", "success");
            window.location.href =
              pendingYearHref || data.redirect || "one_year.html";
            return;
          }

          if (yearGateAnswer) yearGateAnswer.value = "";
          if (data.question) {
            updateYearQuestion(data);
            if (
              hasGsap &&
              !reduceMotionQuery.matches
            ) {
              gsap.fromTo(
                yearGateQuestion,
                { autoAlpha: 0, y: 10 },
                { autoAlpha: 1, y: 0, duration: 0.32 },
              );
            }
          } else if (Number.isInteger(data.attemptsLeft)) {
            updateYearQuestion(data);
          }

          const attemptsText = Number.isInteger(data.attemptsLeft)
            ? ` Quedan ${data.attemptsLeft} ${data.attemptsLeft === 1 ? "intento" : "intentos"}.`
            : "";
          setYearGateStatus(
            `${data.message || "Todavia no. Prueba otra vez."}${attemptsText}`,
            "error",
          );
        } catch {
          setYearGateStatus(
            "No pude revisar la respuesta. Usa npx vercel dev para probarlo local.",
            "error",
          );
        } finally {
          yearGateSubmit.disabled = false;
          yearGateAnswer?.focus();
        }
      });

      if (
        new URLSearchParams(window.location.search).get("locked") === "year"
      ) {
        openYearGate("one_year.html");
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.hash,
        );
      }

      const loveHeart = document.getElementById("loveHeart");
      const heroVisual = document.querySelector(".hero-visual");
      const loveHeartSvg = loveHeart?.querySelector("svg");
      const loveHeartGlow = loveHeart?.querySelector(".love-heart-glow");
      const loveHeartPath = document.getElementById("loveHeartPath");
      const heartParticles = document.getElementById("heartParticles");
      const heartOrbitDots = Array.from(loveHeart?.querySelectorAll(".heart-orbit-dot") || []);
      const loveDecision = document.getElementById("loveDecision");
      const decisionYes = document.getElementById("decisionYes");
      const decisionNo = document.getElementById("decisionNo");
      const momentCards = document.getElementById("momentCards");
      const destroyLayer = document.getElementById("destroyLayer");
      const destroyPrompt = document.getElementById("destroyPrompt");
      const destroyChoices = document.getElementById("destroyChoices");
      const destroyYes = document.getElementById("destroyYes");
      const destroyNo = document.getElementById("destroyNo");
      const heartThemeClasses = [
        "theme-purple",
        "theme-sky",
        "theme-red",
        "theme-flower",
        "theme-spark",
      ];
      const heartThemes = [
        { name: "purple", emojis: ["💜", "💕", "✨", "🌙"], count: 7 },
        { name: "sky", emojis: ["🤍", "💙", "💫", "✨"], count: 6 },
        { name: "red", emojis: ["❤️", "🖤", "🌹", "✨"], count: 6 },
        { name: "flower", emojis: ["🌸", "🌷", "💐", "💖"], count: 8 },
        { name: "spark", emojis: ["💖", "✨", "💫", "💕"], count: 7 },
      ];
      let currentHeartTheme = "purple";
      let restRevealed = false;
      let webDestroyed = false;
      let normalHeartStarted = false;
      let heartRefreshFrame = 0;

      function pickRandomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
      }

      function getNormalizedHeartPoints(pointCount) {
        return Array.from({ length: pointCount }, (_, index) => {
          const angle = (index / pointCount) * Math.PI * 2;
          const x = 16 * Math.pow(Math.sin(angle), 3);
          const y = -(
            13 * Math.cos(angle) -
            5 * Math.cos(2 * angle) -
            2 * Math.cos(3 * angle) -
            Math.cos(4 * angle)
          );

          return { x, y };
        });
      }

      function getHeroPhotoBounds() {
        if (!heroVisual) return null;

        const visualRect = heroVisual.getBoundingClientRect();
        const tileRects = Array.from(heroVisual.querySelectorAll(".photo-tile"))
          .map((tile) => {
            const rect = tile.getBoundingClientRect();
            return {
              left: rect.left - visualRect.left,
              top: rect.top - visualRect.top,
              right: rect.right - visualRect.left,
              bottom: rect.bottom - visualRect.top,
              width: rect.width,
              height: rect.height,
            };
          })
          .filter((rect) => rect.width > 4 && rect.height > 4);

        if (!tileRects.length || visualRect.width <= 0 || visualRect.height <= 0) {
          return null;
        }

        const minX = Math.min(...tileRects.map((rect) => rect.left));
        const minY = Math.min(...tileRects.map((rect) => rect.top));
        const maxX = Math.max(...tileRects.map((rect) => rect.right));
        const maxY = Math.max(...tileRects.map((rect) => rect.bottom));

        return {
          tileRects,
          minX,
          minY,
          maxX,
          maxY,
          width: maxX - minX,
          height: maxY - minY,
          centerX: (minX + maxX) / 2,
          centerY: (minY + maxY) / 2,
          visualWidth: visualRect.width,
          visualHeight: visualRect.height,
        };
      }

      function getHeartLayout(pointCount = 160) {
        const bounds = getHeroPhotoBounds();
        if (!bounds) return null;

        const normalized = getNormalizedHeartPoints(pointCount);
        const minNormX = Math.min(...normalized.map((point) => point.x));
        const maxNormX = Math.max(...normalized.map((point) => point.x));
        const minNormY = Math.min(...normalized.map((point) => point.y));
        const maxNormY = Math.max(...normalized.map((point) => point.y));
        const normCenterX = (minNormX + maxNormX) / 2;
        const normCenterY = (minNormY + maxNormY) / 2;
        const isMobile = bounds.visualWidth < 640;
        const paddingX = isMobile ? 42 : 86;
        const paddingY = isMobile ? 52 : 104;
        const minHeartWidth = bounds.visualWidth * (isMobile ? 0.86 : 0.8);
        const minHeartHeight = bounds.visualHeight * (isMobile ? 0.86 : 0.9);
        const targetWidth = Math.max(bounds.width + paddingX * 2, minHeartWidth);
        const targetHeight = Math.max(bounds.height + paddingY * 2, minHeartHeight);
        const scaleX = targetWidth / (maxNormX - minNormX);
        const scaleY = targetHeight / (maxNormY - minNormY);
        const centerX = bounds.centerX;
        const centerY = bounds.centerY + (isMobile ? 4 : 10);
        const originX = centerX - normCenterX * scaleX;
        const originY = centerY - normCenterY * scaleY;
        const points = normalized.map((point) => ({
          x: originX + point.x * scaleX,
          y: originY + point.y * scaleY,
        }));

        return {
          ...bounds,
          isMobile,
          centerX,
          centerY,
          points,
        };
      }

      function pointsToPath(points) {
        return `${points
          .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
          .join(" ")} Z`;
      }

      function positionHeartOrbitDots(geometry) {
        if (!geometry || !heartOrbitDots.length) return;

        const anchors = [0.88, 0.12, 0.64, 0.36];
        heartOrbitDots.forEach((dot, index) => {
          const point = geometry.points[Math.floor(anchors[index] * (geometry.points.length - 1))];
          dot.style.left = `${point.x}px`;
          dot.style.top = `${point.y}px`;
          dot.style.transform = "translate(-50%, -50%)";
        });

        if (hasGsap) {
          gsap.set(heartOrbitDots, { xPercent: -50, yPercent: -50 });
        }
      }

      function updateHeartGeometry(pointCount = 180) {
        if (!loveHeart) return null;

        const geometry = getHeartLayout(pointCount);
        if (!geometry) return null;

        loveHeart.style.setProperty("--heart-center-x", `${geometry.centerX}px`);
        loveHeart.style.setProperty("--heart-center-y", `${geometry.centerY}px`);

        if (loveHeartSvg) {
          const extra = geometry.isMobile ? 48 : 96;
          loveHeartSvg.setAttribute(
            "viewBox",
            `${-extra} ${-extra} ${geometry.visualWidth + extra * 2} ${geometry.visualHeight + extra * 2}`,
          );
        }

        const path = pointsToPath(geometry.points);
        loveHeartGlow?.setAttribute("d", path);
        loveHeartPath?.setAttribute("d", path);
        positionHeartOrbitDots(geometry);
        return geometry;
      }

      function scheduleHeartRefresh() {
        if (!loveHeart) return;

        window.cancelAnimationFrame(heartRefreshFrame);
        heartRefreshFrame = window.requestAnimationFrame(() => {
          updateHeartGeometry();
        });
      }

      function getHeartAuraPoint() {
        const geometry = getHeartLayout(96);
        return geometry ? pickRandomItem(geometry.points) : null;
      }

      // Decorative heart cycle with color and aura changes.
      function spawnHeartParticles(theme) {
        if (!heartParticles || !hasGsap || reduceMotionQuery.matches) return;

        heartParticles.replaceChildren();
        const particleCount = window.innerWidth < 640 ? Math.min(theme.count, 5) : theme.count;

        for (let index = 0; index < particleCount; index += 1) {
          const particle = document.createElement("span");
          particle.className = "heart-particle";
          particle.textContent = pickRandomItem(theme.emojis);
          const auraPoint = getHeartAuraPoint();
          if (auraPoint) {
            particle.style.left = `${auraPoint.x}px`;
            particle.style.top = `${auraPoint.y}px`;
          } else {
            particle.style.left = `${8 + Math.random() * 84}%`;
            particle.style.top = `${8 + Math.random() * 78}%`;
          }
          heartParticles.appendChild(particle);

          gsap.fromTo(
            particle,
            { autoAlpha: 0, scale: 0.68, y: 10 },
            {
              autoAlpha: 0.82,
              scale: 1,
              y: -18 - Math.random() * 18,
              duration: 1.8 + Math.random() * 1.2,
              delay: index * 0.08,
              ease: "sine.inOut",
              repeat: 1,
              yoyo: true,
              onComplete: () => particle.remove(),
            },
          );
        }
      }

      function applyHeartTheme(theme) {
        if (!loveHeart) return;

        currentHeartTheme = theme.name;
        loveHeart.classList.remove(...heartThemeClasses);
        loveHeart.classList.add(`theme-${theme.name}`);
        updateHeartGeometry();
        spawnHeartParticles(theme);

        if (hasGsap && !reduceMotionQuery.matches) {
          gsap.fromTo(
            loveHeart,
            { scale: 0.965, rotation: -1.5 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.7,
              ease: "back.out(1.8)",
              overwrite: "auto",
            },
          );
        }
      }

      function cycleHeartTheme() {
        const availableThemes = heartThemes.filter((theme) => theme.name !== currentHeartTheme);
        applyHeartTheme(pickRandomItem(availableThemes));
      }

      function startLoveHeart() {
        startNormalHeart();
      }

      function startNormalHeart() {
        if (!loveHeart || normalHeartStarted) return;

        normalHeartStarted = true;
        loveHeart.classList.add("is-normal-phase");

        const selectedTheme = pickRandomItem(heartThemes);
        currentHeartTheme = selectedTheme.name;
        loveHeart.classList.remove(...heartThemeClasses);
        loveHeart.classList.add(`theme-${selectedTheme.name}`);
        updateHeartGeometry();

        const pathLength = loveHeartPath?.getTotalLength?.() || 0;
        if (hasGsap && !reduceMotionQuery.matches && pathLength) {
          gsap.set(loveHeartPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });
        }

        if (!hasGsap || reduceMotionQuery.matches) {
          spawnHeartParticles(selectedTheme);
          return;
        }

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            [".love-heart-glow", ".love-heart-path"],
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.3 },
          )
          .to(loveHeartPath, {
            strokeDashoffset: 0,
            duration: 1.55,
            ease: "power3.out",
          }, "<")
          .fromTo(
            ".heart-orbit-dot",
            { autoAlpha: 0, xPercent: -50, yPercent: -50, scale: 0.62 },
            {
              autoAlpha: 1,
              xPercent: -50,
              yPercent: -50,
              scale: 1,
              duration: 0.48,
              ease: "back.out(1.8)",
              stagger: 0.08,
            },
            "<0.08",
          )
          .add(() => spawnHeartParticles(selectedTheme), "<0.08");

        gsap.to(".heart-orbit-dot", {
          y: (index) => [-8, 8, -6, 7][index],
          x: (index) => [5, -5, 4, -4][index],
          duration: 3.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.18,
        });

        gsap.to(loveHeart, {
          scale: 1.018,
          rotation: 0.8,
          duration: 4.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          overwrite: "auto",
        });
      }

      function setupScrollReveals() {
        if (!hasGsap) return;

        const revealItems = gsap.utils.toArray("[data-scroll-reveal]");
        if (!revealItems.length) return;

        if (!hasScrollTrigger || reduceMotionQuery.matches) {
          gsap.set(revealItems, { autoAlpha: 1, clearProps: "transform" });
          return;
        }

        gsap.set(revealItems, { autoAlpha: 0, y: 26 });
        ScrollTrigger.batch(revealItems, {
          start: "top 84%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
            });
          },
        });
      }

      function revealRestContent() {
        if (!momentCards || restRevealed) return;

        restRevealed = true;
        momentCards.classList.remove("is-locked");
        momentCards.setAttribute("aria-hidden", "false");

        if (!hasGsap || reduceMotionQuery.matches) {
          momentCards.style.opacity = "1";
          return;
        }

        gsap.set(momentCards, { display: "grid", autoAlpha: 0, y: 28 });
        gsap
          .timeline({
            defaults: { duration: 0.68, ease: "power3.out" },
            onComplete: () => hasScrollTrigger && ScrollTrigger.refresh(),
          })
          .to(momentCards, { autoAlpha: 1, y: 0 })
          .fromTo(
            ".milestone-card",
            { autoAlpha: 0, y: 42, scale: 0.94 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              stagger: { each: 0.08, from: "start" },
              clearProps: "transform",
            },
            "<0.08",
          );
      }

      function hideDecision(onComplete = () => {}) {
        if (!loveDecision) {
          onComplete();
          return;
        }

        if (!hasGsap || reduceMotionQuery.matches) {
          loveDecision.style.display = "none";
          onComplete();
          return;
        }

        gsap.to(loveDecision, {
          autoAlpha: 0,
          y: -18,
          scale: 0.96,
          duration: 0.38,
          ease: "power2.in",
          onComplete: () => {
            loveDecision.style.display = "none";
            onComplete();
          },
        });
      }

      function getDestroyTargets(includeDecision = true) {
        return [
          ...document.querySelectorAll(
            ".hero-float, .hero-kicker, .hero-title, .hero-copy, .hero-visual, .section-heading, .milestone-card",
          ),
          includeDecision ? loveDecision : null,
        ].filter(Boolean);
      }

      function createDestroyPieces(targets) {
        if (!destroyLayer) return [];

        destroyLayer.replaceChildren();
        destroyLayer.classList.add("is-active");
        destroyLayer.setAttribute("aria-hidden", "true");

        return targets
          .map((target) => {
            const rect = target.getBoundingClientRect();
            const isVisible = rect.width > 2 && rect.height > 2;

            if (!isVisible) return null;

            const clone = target.cloneNode(true);
            clone.removeAttribute("id");
            clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
            clone.classList.add("destroy-piece");
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.style.maxWidth = "none";
            clone.style.transform = "none";
            destroyLayer.appendChild(clone);
            return clone;
          })
          .filter(Boolean);
      }

      function createBuildSparks(count = 24) {
        if (!destroyLayer) return [];

        destroyLayer.replaceChildren();
        destroyLayer.classList.add("is-active");

        return Array.from({ length: count }, () => {
          const spark = document.createElement("span");
          spark.className = "destroy-piece";
          spark.style.left = `${Math.random() * 100}vw`;
          spark.style.top = `${35 + Math.random() * 42}vh`;
          spark.style.width = `${5 + Math.random() * 18}px`;
          spark.style.height = `${5 + Math.random() * 18}px`;
          spark.style.borderRadius = "999px";
          spark.style.background = Math.random() > 0.5 ? "#ff7a8a" : "#ffe79a";
          spark.style.boxShadow = "0 0 28px rgba(255, 122, 138, 0.45)";
          destroyLayer.appendChild(spark);
          return spark;
        });
      }

      function showDestroyPrompt(showButtons = true) {
        if (!destroyPrompt) return;

        destroyPrompt.classList.add("is-open");
        destroyPrompt.setAttribute("aria-hidden", "false");
        if (destroyChoices) {
          destroyChoices.style.display = showButtons ? "flex" : "none";
        }

        if (hasGsap && !reduceMotionQuery.matches) {
          gsap.fromTo(destroyPrompt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 });
          gsap.fromTo(
            "#destroyChoices .choice-button",
            { autoAlpha: 0, y: 18, scale: 0.88 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.46,
              ease: "back.out(1.8)",
              stagger: 0.08,
            },
          );
        }
      }

      function hideDestroyPrompt() {
        if (!destroyPrompt) return;

        destroyPrompt.classList.remove("is-open");
        destroyPrompt.setAttribute("aria-hidden", "true");
      }

      // Funny decision flow: one path breaks the page, the other reveals it.
      function destroyWeb() {
        if (webDestroyed) return;
        webDestroyed = true;
        const targets = getDestroyTargets(true);
        const pieces = createDestroyPieces(targets);
        document.body.classList.add("is-web-destroyed");

        if (!hasGsap || reduceMotionQuery.matches) {
          targets.forEach((target) => {
            target.style.visibility = "hidden";
          });
          showDestroyPrompt(true);
          return;
        }

        gsap
          .timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
              gsap.set(targets, { autoAlpha: 0, visibility: "hidden" });
              pieces.forEach((piece) => piece.remove());
              showDestroyPrompt(true);
            },
          })
          .set(destroyLayer, { autoAlpha: 1, backgroundColor: "rgba(0,0,0,0)" })
          .to(destroyLayer, { backgroundColor: "#000", duration: 1.25 }, 0)
          .to(targets, { autoAlpha: 0, duration: 0.34, stagger: 0.025 }, 0.06)
          .to(
            pieces,
            {
              autoAlpha: 0,
              x: () => gsap.utils.random(-220, 220),
              y: () => gsap.utils.random(180, 460),
              rotation: () => gsap.utils.random(-34, 34),
              scale: () => gsap.utils.random(0.58, 0.84),
              filter: "blur(12px)",
              duration: 1.7,
              stagger: { each: 0.045, from: "random" },
            },
            0.08,
          );
      }

      function keepDestroyed() {
        if (!destroyChoices) return;

        if (!hasGsap || reduceMotionQuery.matches) {
          destroyChoices.style.display = "none";
          return;
        }

        gsap.to("#destroyChoices .choice-button", {
          autoAlpha: 0,
          y: 18,
          scale: 0.86,
          duration: 0.34,
          ease: "power2.in",
          stagger: 0.04,
          onComplete: () => {
            destroyChoices.style.display = "none";
          },
        });
      }

      function rebuildWeb() {
        const targets = getDestroyTargets(false);
        const sparks = createBuildSparks();
        webDestroyed = false;

        if (loveDecision) {
          loveDecision.style.display = "none";
        }

        if (!hasGsap || reduceMotionQuery.matches) {
          hideDestroyPrompt();
          document.body.classList.remove("is-web-destroyed");
          targets.forEach((target) => {
            target.style.visibility = "";
            target.style.opacity = "1";
            target.style.transform = "";
          });
          revealRestContent();
          return;
        }

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            onStart: () => {
              gsap.set(targets, {
                visibility: "visible",
                autoAlpha: 0,
                x: () => gsap.utils.random(-70, 70),
                y: () => gsap.utils.random(36, 120),
                rotation: () => gsap.utils.random(-12, 12),
                scale: 0.9,
              });
            },
            onComplete: () => {
              document.body.classList.remove("is-web-destroyed");
              if (destroyLayer) {
                destroyLayer.classList.remove("is-active");
                destroyLayer.replaceChildren();
                gsap.set(destroyLayer, { clearProps: "all" });
              }
              revealRestContent();
            },
          })
          .to("#destroyChoices .choice-button", {
            autoAlpha: 0,
            y: -16,
            scale: 0.9,
            duration: 0.24,
            stagger: 0.04,
          })
          .to(destroyPrompt, {
            autoAlpha: 0,
            duration: 0.36,
            onComplete: hideDestroyPrompt,
          }, "<0.08")
          .to(destroyLayer, { backgroundColor: "rgba(0,0,0,0)", duration: 1.05 }, 0.28)
          .fromTo(
            sparks,
            { autoAlpha: 0, scale: 0.4, y: 30 },
            {
              autoAlpha: 0.9,
              scale: 1,
              y: -80,
              duration: 0.78,
              stagger: { each: 0.018, from: "random" },
            },
            0.18,
          )
          .to(sparks, { autoAlpha: 0, scale: 0.2, duration: 0.42 }, ">-0.18")
          .to(targets, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.82,
            clearProps: "transform,opacity,visibility",
            stagger: { each: 0.045, from: "start" },
          }, 0.54);
      }

      decisionYes?.addEventListener("click", () => {
        hideDecision(revealRestContent);
      });

      decisionNo?.addEventListener("click", destroyWeb);
      destroyYes?.addEventListener("click", keepDestroyed);
      destroyNo?.addEventListener("click", rebuildWeb);

      setupScrollReveals();
      startLoveHeart();
      window.addEventListener("resize", scheduleHeartRefresh);
      window.addEventListener("load", scheduleHeartRefresh);
      document.fonts?.ready?.then(scheduleHeartRefresh).catch(() => {});

      mm?.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 900px)",
        },
        (context) => {
          const { reduceMotion, isDesktop } = context.conditions;

          if (reduceMotion) {
            gsap.set(
              [
                ".hero-kicker",
                ".hero-title",
                ".hero-copy",
                ".hero-actions",
                ".love-heart",
                ".photo-tile",
                ".hero-note",
                "[data-scroll-reveal]",
              ],
              { autoAlpha: 1, clearProps: "transform" },
            );
            return;
          }

          const intro = gsap.timeline({
            defaults: {
              duration: 0.82,
              ease: "power3.out",
            },
            onComplete: scheduleHeartRefresh,
          });

          intro
            .from(".hero-kicker", { autoAlpha: 0, y: 18 })
            .from(".hero-title", { autoAlpha: 0, y: 30 }, "<0.12")
            .from(".hero-copy", { autoAlpha: 0, y: 22 }, "<0.16")
            .from(".hero-actions", { autoAlpha: 0, y: 18 }, "<0.16")
            .from(".love-heart", { autoAlpha: 0, scale: 0.9 }, "<0.03")
            .from(
              ".photo-tile",
              {
                autoAlpha: 0,
                y: 42,
                scale: 0.88,
                rotation: (index) => [-13, 11, -7][index],
                stagger: 0.12,
              },
              "<0.05",
            )
            .from(".hero-note", { autoAlpha: 0, y: 22, scale: 0.92 }, "<0.3");

          gsap.to(".hero-float", {
            y: (index) => [-18, 22, -14, 18][index],
            x: (index) => [12, -10, 8, -12][index],
            rotation: (index) => [-8, 9, 7, -10][index],
            duration: 3.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.25,
          });

          gsap.to(".photo-tile", {
            y: (index) => [10, -12, 8][index],
            duration: 3.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.3,
          });

          if (isDesktop) {
            const visual = document.querySelector(".hero-visual");
            const tiles = gsap.utils.toArray(".photo-tile");

            visual?.addEventListener("mousemove", (event) => {
              const rect = visual.getBoundingClientRect();
              const x = (event.clientX - rect.left) / rect.width - 0.5;
              const y = (event.clientY - rect.top) / rect.height - 0.5;

              tiles.forEach((tile, index) => {
                const depth = (index + 1) * 10;
                gsap.to(tile, {
                  x: x * depth,
                  y: y * depth,
                  rotationY: x * 5,
                  rotationX: -y * 5,
                  duration: 0.45,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              });
            });

            visual?.addEventListener("mouseleave", () => {
              gsap.to(tiles, {
                x: 0,
                rotationX: 0,
                rotationY: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto",
              });
            });
          }
        },
      );

      document.querySelectorAll(".milestone-card").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
          const rect = card.getBoundingClientRect();
          const percentX = ((event.clientX - rect.left) / rect.width) * 100;
          const percentY = ((event.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--shine-x", `${percentX.toFixed(2)}%`);
          card.style.setProperty("--shine-y", `${percentY.toFixed(2)}%`);
        });
      });

      window.setInterval(() => {
        renderHeroMedia(true);
        cycleHeartTheme();
      }, 14000);
    

