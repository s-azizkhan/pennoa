// Reveal sections on scroll
(function () {
  const targets = [
    ".manifesto",
    ".how",
    ".styles",
    ".aircraft",
    ".privacy",
    ".roadmap",
    ".download",
    ".compare__col",
    ".step",
    ".style-card",
    ".aircraft-card",
    ".privacy-card",
    ".phase",
  ]
    .flatMap((s) => Array.from(document.querySelectorAll(s)))
    .filter(Boolean);

  targets.forEach((el) => el.setAttribute("data-reveal", ""));

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );

  targets.forEach((el) => io.observe(el));
})();

// Smooth-scroll anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
