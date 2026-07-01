document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       CAROUSEL PROJECTS
    ========================== */

    const cards = document.querySelectorAll(".card");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const carousel = document.querySelector(".carousel");

    let current = 0;
    let interval = null;
    let pauseUntil = 0;

    const AUTO_TIME = 3000;
    const PAUSE_TIME = 10000;

    if (cards.length > 0) {

        function showCard(index) {
            cards.forEach(card => card.classList.remove("active"));
            cards[index].classList.add("active");
        }

        function nextCard() {
            current = (current + 1) % cards.length;
            showCard(current);
        }

        function prevCard() {
            current = (current - 1 + cards.length) % cards.length;
            showCard(current);
        }

        function startAuto() {
            stopAuto();

            interval = setInterval(() => {
                if (Date.now() < pauseUntil) return;
                nextCard();
            }, AUTO_TIME);
        }

        function stopAuto() {
            if (interval) clearInterval(interval);
        }

        function pauseFor(ms) {
            pauseUntil = Date.now() + ms;
        }

        nextBtn?.addEventListener("click", () => {
            nextCard();
            pauseFor(PAUSE_TIME);
        });

        prevBtn?.addEventListener("click", () => {
            prevCard();
            pauseFor(PAUSE_TIME);
        });

        carousel?.addEventListener("mouseenter", () => pauseFor(PAUSE_TIME));
        carousel?.addEventListener("mousemove", () => pauseFor(PAUSE_TIME));
        carousel?.addEventListener("mouseleave", () => pauseFor(0));

        showCard(0);
        startAuto();
    }


    /* =========================
       SCROLL NAVIGATION
    ========================== */

    const sections = document.querySelectorAll("section");
    const featuresSection = document.querySelector("#features");

    let currentSection = 0;
    let isScrolling = false;
    let disableSnap = false;

    const sectionObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                currentSection = [...sections].indexOf(entry.target);

            }

        });

    }, {
        threshold: 0.6
    });

    sections.forEach(section => sectionObserver.observe(section));

    function goToSection(index) {

        if (index < 0 || index >= sections.length) return;

        isScrolling = true;

        sections[index].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        currentSection = index;

        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }


    /* Detectar FEATURES */
    if (featuresSection) {

        const featuresObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                disableSnap = entry.isIntersecting;
            });
        }, {
            threshold: 0.7
        });

        featuresObserver.observe(featuresSection);
    }


    window.addEventListener("wheel", (e) => {

        if (isScrolling) return;

        if (disableSnap) return;

        if (Math.abs(e.deltaY) < 10) return;

        if (e.deltaY > 0) {
            goToSection(currentSection + 1);
        } else {
            goToSection(currentSection - 1);
        }

    }, { passive: true });


    /* =========================
       VISIBILITY ANIMATION
    ========================== */

    if (sections.length > 0) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });

        }, {
            threshold: 0.4
        });

        sections.forEach(section => observer.observe(section));
    }


    /* =========================
       MAGNETIC EFFECT
    ========================== */

    document.querySelectorAll(".card, .skill, .interest-card, .primary-btn")
        .forEach(el => {

            el.addEventListener("mousemove", (e) => {

                const rect = el.getBoundingClientRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const moveX = (x - centerX) / 12;
                const moveY = (y - centerY) / 12;

                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            el.addEventListener("mouseleave", () => {
                el.style.transform = "translate(0,0)";
            });
        });

});