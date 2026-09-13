(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =================================================
     INTRO — start button unlocks audio + reveals film
     ================================================= */
  var intro = document.getElementById("intro");
  var startBtn = document.getElementById("start-btn");
  var audio = document.getElementById("bg-audio");
  var musicPlayer = document.getElementById("music-player");

  startBtn.addEventListener("click", function () {
    intro.classList.add("hidden");
    document.body.style.overflow = "auto";

    audio.play().catch(function () {
      /* Autoplay may still be blocked on some browsers; player UI lets them press play manually. */
    });
    musicPlayer.classList.add("active");
    setPlayIcon(true);
    startAmbientConfetti();

    // gentle scroll nudge into chapter one
    setTimeout(function () {
      var c1 = document.getElementById("chapter-1");
      if (c1) c1.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }, 500);
  });

  // lock scroll until they press play, for a proper "title card" feel
  document.body.style.overflow = "hidden";

  /* =================================================
     MUSIC PLAYER controls
     ================================================= */
  var playPauseBtn = document.getElementById("play-pause-btn");
  var iconPlay = playPauseBtn.querySelector(".icon-play");
  var iconPause = playPauseBtn.querySelector(".icon-pause");
  var progressTrack = document.getElementById("progress-track");
  var progressFill = document.getElementById("progress-fill");
  var timeLabel = document.getElementById("music-time");

  function setPlayIcon(isPlaying) {
    iconPlay.style.display = isPlaying ? "none" : "block";
    iconPause.style.display = isPlaying ? "block" : "none";
  }

  playPauseBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      setPlayIcon(true);
    } else {
      audio.pause();
      setPlayIcon(false);
    }
  });

  audio.addEventListener("timeupdate", function () {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + "%";
    var mins = Math.floor(audio.currentTime / 60);
    var secs = Math.floor(audio.currentTime % 60);
    timeLabel.textContent = mins + ":" + (secs < 10 ? "0" : "") + secs;
  });

  progressTrack.addEventListener("click", function (e) {
    if (!audio.duration) return;
    var rect = progressTrack.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  /* =================================================
     SCROLL REVEAL
     ================================================= */
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.25 }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* =================================================
     TYPEWRITER EFFECT
     ================================================= */
  var twEls = document.querySelectorAll("[data-typewriter]");
  var twObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
          entry.target.dataset.typed = "true";
          typewrite(entry.target);
          twObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  twEls.forEach(function (el) {
    twObserver.observe(el);
  });

  function typewrite(el) {
    var text = el.getAttribute("data-typewriter") || el.textContent;
    el.textContent = "";
    var cursor = document.createElement("span");
    cursor.className = "tw-cursor";
    if (reduceMotion) {
      el.textContent = text;
      return;
    }
    var i = 0;
    function step() {
      el.textContent = text.slice(0, i);
      el.appendChild(cursor);
      i++;
      if (i <= text.length) {
        setTimeout(step, 55);
      } else {
        cursor.remove();
      }
    }
    step();
  }

  /* =================================================
     POLAROID DEVELOPING
     ================================================= */
  var polaroid = document.getElementById("polaroid");
  if (polaroid) {
    var polaroidObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              polaroid.classList.add("developed");
            }, 400);
            polaroidObserver.unobserve(polaroid);
          }
        });
      },
      { threshold: 0.4 }
    );
    polaroidObserver.observe(polaroid);
  }

  /* =================================================
     DUST PARTICLES (canvas)
     ================================================= */
  var canvas = document.getElementById("dust-canvas");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var particleCount = reduceMotion ? 0 : 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      speedY: Math.random() * 0.15 + 0.03,
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.1,
    };
  }
  for (var p = 0; p < particleCount; p++) particles.push(makeParticle());

  function drawDust() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (particle) {
      particle.y -= particle.speedY;
      particle.x += particle.speedX;
      if (particle.y < -5) {
        particle.y = canvas.height + 5;
        particle.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,215,225," + particle.alpha + ")";
      ctx.fill();
    });
    requestAnimationFrame(drawDust);
  }
  if (!reduceMotion) requestAnimationFrame(drawDust);

  /* =================================================
     PARALLAX on chapter frames
     ================================================= */
  var parallaxSections = document.querySelectorAll("[data-parallax]");
  function updateParallax() {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    parallaxSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var progress = (rect.top) / vh; // -1 (scrolled past) .. 1 (below viewport)
      var frame = section.querySelector(".chapter-frame");
      var roman = section.querySelector(".roman-numeral");
      if (frame) frame.style.transform = "translateY(" + (progress * 22) + "px)";
      if (roman) roman.style.transform = "translate(-50%, " + (progress * -18) + "px)";
    });
  }
  window.addEventListener("scroll", function () {
    window.requestAnimationFrame(updateParallax);
  });
  updateParallax();

  /* =================================================
     CONFETTI PILE — a persistent drift of confetti that
     falls, settles, and builds into a heap along the
     bottom of the frame for the whole story, plus a
     fresh burst every time a new chapter slides into view.
     ================================================= */
  var pileCanvas = document.getElementById("confetti-pile-canvas");
  var pileCtx = pileCanvas.getContext("2d");

  // pieces that have landed are "baked" onto this offscreen canvas
  // so the pile stays put without re-simulating thousands of shapes
  var bakeCanvas = document.createElement("canvas");
  var bakeCtx = bakeCanvas.getContext("2d");

  var confettiColors = ["#ff7a6b", "#e8b84b", "#4fd1b0", "#a9c3d1", "#f6a6c1", "#7fb5ff", "#ece5d3"];
  var activePieces = [];
  var BUCKET_COUNT = 48;
  var buckets = new Array(BUCKET_COUNT).fill(0);
  var settledCount = 0;
  var MAX_SETTLED = 420;

  function sizePileCanvas() {
    pileCanvas.width = window.innerWidth;
    pileCanvas.height = window.innerHeight;
    bakeCanvas.width = window.innerWidth;
    bakeCanvas.height = window.innerHeight;
    // a resize changes the ground entirely, so start the heap over
    bakeCtx.clearRect(0, 0, bakeCanvas.width, bakeCanvas.height);
    buckets = new Array(BUCKET_COUNT).fill(0);
    settledCount = 0;
  }
  sizePileCanvas();
  window.addEventListener("resize", sizePileCanvas);

  function getFloorY() {
    var lb = document.querySelector(".letterbox-bottom");
    var h = lb ? lb.getBoundingClientRect().height : 30;
    return pileCanvas.height - h - 4;
  }

  function drawPiece(context, p) {
    context.save();
    context.translate(p.x, p.y);
    context.rotate((p.rot * Math.PI) / 180);
    context.fillStyle = p.color;
    context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    context.restore();
  }

  function spawnConfetti(count, opts) {
    if (reduceMotion) return;
    opts = opts || {};
    for (var i = 0; i < count; i++) {
      activePieces.push({
        x: opts.x != null ? opts.x + (Math.random() * 120 - 60) : Math.random() * pileCanvas.width,
        y: opts.y != null ? opts.y : -20 - Math.random() * 120,
        vx: (Math.random() - 0.5) * (opts.spread || 1.8),
        vy: Math.random() * 1.4,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        w: 6 + Math.random() * 5,
        h: 9 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      });
    }
  }

  function updatePile() {
    pileCtx.clearRect(0, 0, pileCanvas.width, pileCanvas.height);
    pileCtx.drawImage(bakeCanvas, 0, 0);

    var fY = getFloorY();
    var bucketW = pileCanvas.width / BUCKET_COUNT;

    for (var i = activePieces.length - 1; i >= 0; i--) {
      var p = activePieces[i];
      p.vy = Math.min(p.vy + 0.16, 7);
      p.y += p.vy;
      p.x += p.vx;
      p.rot += p.vr;

      var bIdx = Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor(p.x / bucketW)));
      var restY = fY - buckets[bIdx];

      if (p.y >= restY) {
        if (settledCount < MAX_SETTLED) {
          p.y = restY;
          drawPiece(bakeCtx, p);
          buckets[bIdx] += p.h * 0.55;
          if (bIdx > 0) buckets[bIdx - 1] += p.h * 0.12;
          if (bIdx < BUCKET_COUNT - 1) buckets[bIdx + 1] += p.h * 0.12;
          settledCount++;
        }
        activePieces.splice(i, 1);
        continue;
      }
      if (p.y > pileCanvas.height + 60) {
        activePieces.splice(i, 1);
        continue;
      }
      drawPiece(pileCtx, p);
    }
    requestAnimationFrame(updatePile);
  }
  if (!reduceMotion) requestAnimationFrame(updatePile);

  // a steady trickle falling for the whole length of the story
  var ambientTimer = null;
  function startAmbientConfetti() {
    if (ambientTimer || reduceMotion) return;
    ambientTimer = setInterval(function () {
      if (settledCount < MAX_SETTLED) spawnConfetti(3);
    }, 450);
  }

  // a fresh burst every time a new chapter slides into view
  document.querySelectorAll(".chapter").forEach(function (section) {
    var visible = false;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !visible) {
            visible = true;
            spawnConfetti(55, { spread: 3.2 });
          } else if (!entry.isIntersecting) {
            visible = false;
          }
        });
      },
      { threshold: 0.45 }
    );
    obs.observe(section);
  });

  /* =================================================
     THE BIG REVEAL — Chapter IV
     ================================================= */
  var chapter4 = document.getElementById("chapter-4");
  var headline = document.querySelector(".birthday-headline");
  var message = document.querySelector(".birthday-message");
  var signoff = document.querySelector(".final-signoff");
  var balloonsContainer = document.getElementById("balloons");
  var revealFired = false;

  var balloonColors = ["#ff7a6b", "#4fd1b0", "#e8b84b", "#a9c3d1", "#f6a6c1", "#7fb5ff"];

  function launchBalloons() {
    if (reduceMotion) return;
    var count = 14;
    for (var i = 0; i < count; i++) {
      (function (idx) {
        setTimeout(function () {
          var b = document.createElement("div");
          b.className = "balloon";
          b.style.left = 5 + Math.random() * 90 + "%";
          b.style.background = balloonColors[idx % balloonColors.length];
          b.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
          b.style.animationDuration = 7 + Math.random() * 5 + "s";
          balloonsContainer.appendChild(b);
          setTimeout(function () {
            b.remove();
          }, 13000);
        }, idx * 220);
      })(i);
    }
  }

  function bigConfettiFinale() {
    if (typeof confetti !== "function") return;
    var duration = 3200;
    var end = Date.now() + duration;
    var colors = ["#ff7a6b", "#e8b84b", "#4fd1b0", "#a9c3d1", "#f6a6c1"];

    (function frame() {
      confetti({
        particleCount: reduceMotion ? 0 : 6,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: reduceMotion ? 0 : 6,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // a big central burst right away too
    confetti({
      particleCount: reduceMotion ? 0 : 140,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.4 },
      colors: colors,
    });
  }

  if (chapter4) {
    var finaleObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !revealFired) {
            revealFired = true;
            setTimeout(function () {
              headline.classList.add("pop");
              bigConfettiFinale();
              launchBalloons();
            }, 600);
            setTimeout(function () {
              message.classList.add("in-view");
            }, 1400);
            setTimeout(function () {
              signoff.classList.add("in-view");
            }, 2000);
          }
        });
      },
      { threshold: 0.5 }
    );
    finaleObserver.observe(chapter4);
  }
})();
