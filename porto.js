document.addEventListener("DOMContentLoaded", () => {
  // Pastikan body bisa scroll
  document.body.style.overflowY = 'auto';
  document.body.style.overflowX = 'hidden';
  
  // ---------------- Word Animation ----------------
  const words = document.querySelectorAll(".word");
  if (words.length) {
    words.forEach(word => {
      const letters = word.textContent.split("");
      word.textContent = "";
      letters.forEach(letter => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.className = "letter";
        word.appendChild(span);
      });
    });

    let currentWordIndex = 0;
    const maxWordIndex = words.length - 1;

    words.forEach((w, i) => w.style.opacity = i === currentWordIndex ? "1" : "0");

    function changeText() {
      const currentWord = words[currentWordIndex];
      const nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];

      [...currentWord.children].forEach((letter, i) =>
        setTimeout(() => letter.className = "letter out", i * 80)
      );

      nextWord.style.opacity = "1";
      [...nextWord.children].forEach((letter, i) => {
        letter.className = "letter behind";
        setTimeout(() => letter.className = "letter in", 340 + i * 80);
      });

      currentWordIndex = (currentWordIndex + 1) % words.length;
      setTimeout(() => currentWord.style.opacity = "0", 1000);
    }

    changeText();
    setInterval(changeText, 3000);
  }

  // ---------------- Navbar Dropdown ----------------
  const menuIcon = document.getElementById("menu-icon");
  const dropdown = document.querySelector(".dropdown");

  if (menuIcon && dropdown) {
    // Prevent body scroll when menu is open on mobile
    function toggleBodyScroll(disable) {
      if (window.innerWidth <= 768) {
        if (disable) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
      }
    }

    menuIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = dropdown.classList.contains("active");
      
      if (isActive) {
        dropdown.classList.remove("active");
        menuIcon.textContent = "☰";
        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.classList.remove("active");
        toggleBodyScroll(false);
      } else {
        dropdown.classList.add("active");
        menuIcon.textContent = "✕";
        menuIcon.setAttribute("aria-expanded", "true");
        menuIcon.classList.add("active");
        toggleBodyScroll(true);
      }
    });

    // Close menu when clicking on links
    dropdown.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", (e) => {
        // Allow smooth scroll to work
        setTimeout(() => {
          dropdown.classList.remove("active");
          menuIcon.textContent = "☰";
          menuIcon.setAttribute("aria-expanded", "false");
          menuIcon.classList.remove("active");
          toggleBodyScroll(false);
        }, 100);
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown") && !e.target.closest("#menu-icon")) {
        dropdown.classList.remove("active");
        menuIcon.textContent = "☰";
        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.classList.remove("active");
        toggleBodyScroll(false);
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dropdown.classList.contains("active")) {
        dropdown.classList.remove("active");
        menuIcon.textContent = "☰";
        menuIcon.setAttribute("aria-expanded", "false");
        menuIcon.classList.remove("active");
        toggleBodyScroll(false);
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        dropdown.classList.remove("active");
        menuIcon.textContent = "☰";
        menuIcon.classList.remove("active");
        document.body.style.overflow = 'auto';
      }
    });
  }

  // ---------------- Smooth Scroll for All Links ----------------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = 70; // Fixed header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------------- Contact Form ----------------
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      
      if (!name || !email || !message) {
        alert('Mohon lengkapi semua field!');
        return;
      }
      
      const phoneNumber = "6288976707168";
      const text = `Halo, saya ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0APesan: ${encodeURIComponent(message)}`;
      window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
    });
  }

  // ---------------- Tab System ----------------
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabPanels = document.querySelectorAll(".tab-panel");

  if (tabLinks.length && tabPanels.length) {
    function activateTab(hash) {
      const targetId = hash.replace("#", "");
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      tabLinks.forEach(l => l.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      const activeLink = document.querySelector(`.tab-link[href="${hash}"]`);
      if (activeLink) activeLink.classList.add("active");
      targetPanel.classList.add("active");
    }

    tabLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const hash = link.getAttribute("href");
        activateTab(hash);
        history.replaceState(null, "", hash);
      });
    });

    // Handle direct tab navigation from navbar
    document.querySelectorAll('a[href^="#tab-"]').forEach(link => {
      link.addEventListener("click", (e) => {
        const hash = link.getAttribute("href");
        if (document.querySelector(hash)) {
          e.preventDefault();
          activateTab(hash);
          history.replaceState(null, "", hash);
          
          // Scroll to portfolio section
          const portfolioSection = document.querySelector("#portfolio");
          if (portfolioSection) {
            setTimeout(() => {
              const headerHeight = 70;
              const elementPosition = portfolioSection.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }, 100);
          }
        }
      });
    });

    // Initialize first tab or from URL hash
    const initialHash = window.location.hash;
    if (initialHash && document.querySelector(initialHash)) {
      activateTab(initialHash);
    } else {
      activateTab(tabLinks[0].getAttribute("href"));
    }
  }

  // ---------------- Certificate Modal ----------------
  const certCards = document.querySelectorAll(".cert-card");
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("modalImg");

  if (certCards.length && modal && modalImg) {
    certCards.forEach(card => {
      const img = card.querySelector(".cert-img");
      const viewBtn = card.querySelector(".view-btn");

      if (img && viewBtn) {
        viewBtn.addEventListener("click", (e) => {
          e.preventDefault();
          modalImg.src = img.src;
          modal.classList.add("active");
          document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
      }
    });

    // Close modal functionality
    const closeModal = modal.querySelector(".close");
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = 'auto'; // Restore scroll
      });
    }

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = 'auto'; // Restore scroll
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        modal.classList.remove("active");
        document.body.style.overflow = 'auto'; // Restore scroll
      }
    });
  }

  // ---------------- Fix Footer Visibility ----------------
  // Ensure footer is always visible by adding some bottom padding to body
  const footer = document.querySelector('.footer');
  if (footer) {
    // Force footer to be visible
    footer.style.display = 'block';
    footer.style.visibility = 'visible';
    
    // Add margin top to ensure it's separated from content
    footer.style.marginTop = '2rem';
  }

  // ---------------- Performance Optimization ----------------
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Any scroll-based functionality can go here
    }, 10);
  });

  // Lazy load images if needed
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    img.loading = 'lazy';
  });

  console.log('Portfolio website loaded successfully!');
});

// ---------------- Additional Fixes for Mobile ----------------
// Prevent horizontal scroll on mobile
window.addEventListener('load', () => {
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    window.scrollTo(0, window.pageYOffset);
  }, 100);
});
