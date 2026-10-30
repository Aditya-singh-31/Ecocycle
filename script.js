const wasteDatabase = [
  {
    type: "Plastic Waste",
    confidence: "95.2%",
    recyclable: "YES",
    container: "Plastic Recycling Bin",
    impact: "Recycling plastic reduces landfill waste and lowers production emissions.",
    tip: "Wash before disposal.",
  },
  {
    type: "Organic Waste",
    confidence: "98.1%",
    recyclable: "YES",
    container: "Compost Bin",
    impact: "Composting organic waste prevents methane build-up in landfills.",
    tip: "Separate food scraps from non-compostables.",
  },
  {
    type: "Glass Waste",
    confidence: "96.3%",
    recyclable: "YES",
    container: "Glass Recycling Bin",
    impact: "Recycling glass saves raw materials and energy.",
    tip: "Rinse and sort by color when possible.",
  },
  {
    type: "Metal Waste",
    confidence: "94.8%",
    recyclable: "YES",
    container: "Metal Recycling Bin",
    impact: "Metal recovery reduces mining demand and conserves resources.",
    tip: "Empty cans and remove attached labels.",
  },
  {
    type: "Paper Waste",
    confidence: "95.9%",
    recyclable: "YES",
    container: "Paper Recycling Container",
    impact: "Recycling paper saves trees and reduces water usage.",
    tip: "Keep paper dry and free of grease.",
  },
  {
    type: "E-Waste",
    confidence: "94.7%",
    recyclable: "YES",
    container: "E-Waste Collection Center",
    impact: "Proper e-waste recycling recovers valuable metals safely.",
    tip: "Do not dispose of electronics in regular trash.",
  },
  {
    type: "Hazardous Waste",
    confidence: "93.4%",
    recyclable: "NO",
    container: "Hazardous Waste Facility",
    impact: "Correct disposal prevents soil and water contamination.",
    tip: "Store separately and bring to a certified drop-off.",
  },
];

function initPage() {
  document.body.classList.add("loaded");
  initNavHighlight();
  initContactForm();
  initStatCounters();
  initScanner();
}

function initNavHighlight() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");

  if (!contactForm || !contactFeedback) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactFeedback.textContent = "Thanks! Your message has been received.";
    contactFeedback.classList.add("visible");
    contactForm.reset();
    setTimeout(() => contactFeedback.classList.remove("visible"), 4000);
  });
}

function initStatCounters() {
  const statValues = document.querySelectorAll(".stat-value");
  if (!statValues.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateStat(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  statValues.forEach((value) => observer.observe(value));
}

function animateStat(target) {
  const value = parseFloat(target.dataset.target);
  if (Number.isNaN(value)) return;
  const duration = 1400;
  const startTime = performance.now();
  const isDecimal = target.dataset.target.includes(".");

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = value * progress;
    target.textContent = isDecimal ? `${current.toFixed(1)}%` : `${Math.floor(current).toLocaleString()}+`;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initScanner() {
  const imageUpload = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");
  const dropZone = document.getElementById("dropZone");
  const scanButton = document.getElementById("scanButton");
  const loader = document.getElementById("loader");
  const resultCard = document.getElementById("resultCard");
  const resultType = document.getElementById("resultType");
  const resultConfidence = document.getElementById("resultConfidence");
  const resultRecyclable = document.getElementById("resultRecyclable");
  const resultContainer = document.getElementById("resultContainer");
  const resultImpact = document.getElementById("resultImpact");
  const resultTip = document.getElementById("resultTip");

  if (!imageUpload || !imagePreview || !scanButton) return;

  function showPreview(file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.innerHTML = "";
      const img = document.createElement("img");
      img.src = reader.result;
      img.alt = "Waste preview";
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) {
      imagePreview.innerHTML = "<span>No image selected</span>";
      return;
    }
    showPreview(file);
  });

  if (dropZone) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
    });

    dropZone.addEventListener("dragover", () => {
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (event) => {
      dropZone.classList.remove("drag-over");
      const files = event.dataTransfer.files;
      if (!files.length) return;
      imageUpload.files = files;
      showPreview(files[0]);
    });
  }

  scanButton.addEventListener("click", () => {
    if (!imageUpload.files.length) {
      imagePreview.innerHTML = "<span>Please upload an image first.</span>";
      return;
    }

    if (resultCard) resultCard.hidden = true;
    if (loader) loader.hidden = false;
    scanButton.disabled = true;
    scanButton.textContent = "Scanning...";

    setTimeout(() => {
      const result = wasteDatabase[Math.floor(Math.random() * wasteDatabase.length)];
      if (resultType) resultType.textContent = result.type;
      if (resultConfidence) resultConfidence.textContent = result.confidence;
      if (resultRecyclable) resultRecyclable.textContent = result.recyclable;
      if (resultContainer) resultContainer.textContent = result.container;
      if (resultImpact) resultImpact.textContent = result.impact;
      if (resultTip) resultTip.textContent = result.tip;

      if (loader) loader.hidden = true;
      if (resultCard) resultCard.hidden = false;
      scanButton.disabled = false;
      scanButton.textContent = "Scan";
    }, 3000);
  });
}

window.addEventListener("DOMContentLoaded", initPage);
