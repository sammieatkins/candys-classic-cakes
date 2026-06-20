const menu = document.getElementById("menu");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  navLinks.classList.remove("open");

  menu.classList.add("mingcute--menu-fill");
  menu.classList.remove("mingcute--close-fill");
  menu.classList.remove("active-icon");

  menu.setAttribute("aria-expanded", "false");
}

menu.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menu.classList.toggle("mingcute--menu-fill");
  menu.classList.toggle("mingcute--close-fill");
  menu.classList.toggle("active-icon");

  menu.setAttribute("aria-expanded", isOpen);
});

// Close when focus leaves BOTH button + nav
document.addEventListener("focusin", (e) => {
  const isInsideMenu = navLinks.contains(e.target) || menu.contains(e.target);

  if (!isInsideMenu && navLinks.classList.contains("open")) {
    closeMenu();
  }
});

class Carousel {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector(".carousel-track");

    this.prevBtn = root.querySelector(".carousel-btn.prev");
    this.nextBtn = root.querySelector(".carousel-btn.next");
    this.dotsContainer = root.querySelector(".carousel-dots");

    this.slides = Array.from(this.track.children);

    this.position = 1; // IMPORTANT: starts on first REAL slide
    this.startX = 0;
    this.endX = 0;

    this.transitionDuration = 400;

    this.init();
  }

  init() {
    this.setupClones();
    this.setupDots();

    this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
    this.update(false);

    this.prevBtn?.addEventListener("click", () => this.prev());
    this.nextBtn?.addEventListener("click", () => this.next());

    this.root.addEventListener("keydown", (e) => this.onKeydown(e));

    this.root.addEventListener("touchstart", (e) => this.onTouchStart(e), {
      passive: true,
    });

    this.root.addEventListener("touchend", (e) => this.onTouchEnd(e));

    this.dotsContainer?.addEventListener("click", (e) => {
      if (e.target.dataset.index) {
        this.goTo(Number(e.target.dataset.index));
      }
    });

    this.track.addEventListener("transitionend", () => this.onTransitionEnd());
  }

  /* =========================
     CLONES (INFINITE LOOP CORE)
  ========================= */

  setupClones() {
    const realSlides = Array.from(this.track.children);

    this.firstClone = realSlides[0].cloneNode(true);
    this.lastClone = realSlides[realSlides.length - 1].cloneNode(true);

    this.firstClone.classList.add("clone");
    this.lastClone.classList.add("clone");

    this.track.appendChild(this.firstClone);
    this.track.insertBefore(this.lastClone, realSlides[0]);

    this.slides = Array.from(this.track.children);

    // start at first real slide (after prepended clone)
    this.position = 1;
  }

  /* =========================
     DOTS
  ========================= */

  setupDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = "";

    const realCount = this.track.children.length - 2;

    for (let i = 0; i < realCount; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.dataset.index = i;
      dot.setAttribute("aria-label", `Go to image ${i + 1}`);
      this.dotsContainer.appendChild(dot);
    }
  }

  /* =========================
     UPDATE POSITION
  ========================= */

  update(animate = true) {
    if (!animate) {
      this.track.style.transition = "none";
    } else {
      this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
    }

    this.track.style.transform = `translateX(${this.position * -100}%)`;

    this.updateCounter();
    this.updateDots();

    if (!animate) {
      // force reflow then restore transition
      this.track.offsetHeight;
      this.track.style.transition = `transform ${this.transitionDuration}ms ease`;
    }
  }

  updateCounter() {
    const counter = this.root.querySelector(".carousel-counter");
    if (!counter) return;

    let index = this.position - 1;

    const realCount = this.slides.length - 2;

    if (index < 0) index = realCount - 1;
    if (index >= realCount) index = 0;

    counter.querySelector(".current").textContent = index + 1;
    counter.querySelector(".total").textContent = realCount;
  }

  updateDots() {
    if (!this.dotsContainer) return;

    const dots = Array.from(this.dotsContainer.children);
    let index = this.position - 1;

    const realCount = this.slides.length - 2;

    if (index < 0) index = realCount - 1;
    if (index >= realCount) index = 0;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  /* =========================
     NAVIGATION
  ========================= */

  next() {
    this.position++;
    this.update();
  }

  prev() {
    this.position--;
    this.update();
  }

  goTo(i) {
    this.position = i + 1;
    this.update();
  }

  /* =========================
     INFINITE CORRECTION
  ========================= */

  onTransitionEnd() {
    const slides = this.slides;

    // jumped past last clone → reset to first real
    if (slides[this.position].classList.contains("clone")) {
      this.update(false);

      if (this.position === slides.length - 1) {
        this.position = 1;
      }

      if (this.position === 0) {
        this.position = slides.length - 2;
      }

      this.update(false);
    }
  }

  /* =========================
     KEYBOARD
  ========================= */

  onKeydown(e) {
    if (e.key === "ArrowRight") this.next();
    if (e.key === "ArrowLeft") this.prev();
  }

  /* =========================
     TOUCH SWIPE
  ========================= */

  onTouchStart(e) {
    this.startX = e.changedTouches[0].clientX;
  }

  onTouchEnd(e) {
    this.endX = e.changedTouches[0].clientX;
    const diff = this.startX - this.endX;

    if (Math.abs(diff) > 40) {
      diff > 0 ? this.next() : this.prev();
    }
  }
}

// init ALL carousels
document.querySelectorAll(".carousel").forEach((el) => new Carousel(el));
