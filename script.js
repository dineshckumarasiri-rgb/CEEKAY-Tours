document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("placesContainer");
    const leftBtn = document.getElementById("leftArrow");
    const rightBtn = document.getElementById("rightArrow");

    if (!container || !leftBtn || !rightBtn) return;

    let scrollAmount = 0;

    function getCardWidth() {
        const card = container.querySelector(".card");
        return card.offsetWidth + 24; // width + gap
    }

    function updateArrows() {
        const maxScroll = container.scrollWidth - container.parentElement.clientWidth;

        leftBtn.classList.toggle("disabled", scrollAmount <= 0);
        rightBtn.classList.toggle("disabled", scrollAmount >= maxScroll - 5);
    }

    rightBtn.addEventListener("click", () => {
        const maxScroll = container.scrollWidth - container.parentElement.clientWidth;
        scrollAmount = Math.min(scrollAmount + getCardWidth(), maxScroll);
        container.style.transform = `translateX(-${scrollAmount}px)`;
        updateArrows();
    });

    leftBtn.addEventListener("click", () => {
        scrollAmount = Math.max(scrollAmount - getCardWidth(), 0);
        container.style.transform = `translateX(-${scrollAmount}px)`;
        updateArrows();
    });

    window.addEventListener("resize", updateArrows);
    updateArrows();
});

const cards = document.querySelectorAll(".places-container .card");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));

document.querySelectorAll(".places-container .card").forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / 20) * -1;
        const rotateY = (x - centerX) / 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
    });
});

const counters = document.querySelectorAll(".counter");
let started = false;

function runCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const speed = target / 120;

        const updateCount = () => {
            count += speed;
            if (count < target) {
                counter.innerText = Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + (target === 5 ? "★" : "+");
            }
        };

        updateCount();
    });
}

window.addEventListener("scroll", () => {
    const statsSection = document.querySelector(".stats");
    if (!statsSection) return;
    const sectionTop = statsSection.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight - 100 && !started) {
        runCounters();
        started = true;
    }
});



// Accessible automatic hero slideshow
document.addEventListener("DOMContentLoaded", () => {
    const slides = Array.from(document.querySelectorAll(".hero .slide"));
    if (!slides.length) return;

    let current = 0;
    let timer = null;

    // Keep the first image visible immediately, even before every image loads.
    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === 0);
        const image = slide.querySelector("img");
        if (image) {
            image.addEventListener("error", () => slide.classList.add("image-error"), { once: true });
        }
    });

    const showNextSlide = () => {
        const previous = current;
        let next = (current + 1) % slides.length;
        let checked = 0;

        // Skip an image that failed to load instead of showing an empty slide.
        while (slides[next].classList.contains("image-error") && checked < slides.length) {
            next = (next + 1) % slides.length;
            checked += 1;
        }

        if (next === previous || checked >= slides.length) return;
        slides[next].classList.add("active");
        slides[previous].classList.remove("active");
        current = next;
    };

    timer = window.setInterval(showNextSlide, 5500);

    // Avoid timing jumps when the browser tab becomes inactive.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            window.clearInterval(timer);
        } else {
            window.clearInterval(timer);
            timer = window.setInterval(showNextSlide, 5500);
        }
    });
});
