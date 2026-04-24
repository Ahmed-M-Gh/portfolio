// ===== NAVBAR TOGGLE =====
$(document).ready(function () {
  const $menu = $("#menu");
  const $navbar = $(".navbar");
  const $themeToggle = $("#theme-toggle");

  // ===== THEME TOGGLE =====
  // Check for saved theme in localStorage
  const currentTheme = localStorage.getItem("theme") || "light-mode";
  if (currentTheme === "dark-mode") {
    $("body").addClass("dark-mode");
    $themeToggle.removeClass("fa-moon").addClass("fa-sun");
  } else {
    $("body").removeClass("dark-mode");
    $themeToggle.removeClass("fa-sun").addClass("fa-moon");
  }

  $themeToggle.on("click", function () {
    $("body").toggleClass("dark-mode");

    let theme = "light-mode";
    if ($("body").hasClass("dark-mode")) {
      theme = "dark-mode";
      $(this).removeClass("fa-moon").addClass("fa-sun");
    } else {
      $(this).removeClass("fa-sun").addClass("fa-moon");
    }

    localStorage.setItem("theme", theme);
  });

  // Toggle mobile menu
  $menu.on("click", function () {
    $(this).toggleClass("fa-times");
    $navbar.toggleClass("nav-toggle");

    // Update aria-expanded for accessibility
    const isExpanded = $navbar.hasClass("nav-toggle");
    $menu.attr("aria-expanded", isExpanded);
  });

  // Close menu when clicking outside
  $(document).on("click", function (e) {
    if (
      !$(e.target).closest("header").length &&
      $navbar.hasClass("nav-toggle")
    ) {
      $menu.removeClass("fa-times");
      $navbar.removeClass("nav-toggle");
      $menu.attr("aria-expanded", "false");
    }
  });

  // Close menu when clicking on a link
  $(".navbar a").on("click", function () {
    if ($(window).width() <= 768) {
      $menu.removeClass("fa-times");
      $navbar.removeClass("nav-toggle");
      $menu.attr("aria-expanded", "false");
    }
  });

  // ===== SCROLL EFFECTS =====
  $(window).on("scroll load", function () {
    const scrollTop = $(window).scrollTop();
    const $scrollTopBtn = $("#scroll-top");
    const $header = $("header");

    // Close mobile menu on scroll
    if ($(window).width() <= 768) {
      $menu.removeClass("fa-times");
      $navbar.removeClass("nav-toggle");
      $menu.attr("aria-expanded", "false");
    }

    // Show/hide scroll to top button
    if (scrollTop > 60) {
      $scrollTopBtn.addClass("active");
      $header.addClass("scrolled");
    } else {
      $scrollTopBtn.removeClass("active");
      $header.removeClass("scrolled");
    }

    // Scroll spy - Update active navigation link
    $("section").each(function () {
      const $section = $(this);
      const height = $section.outerHeight();
      const offset = $section.offset().top - 200;
      const top = scrollTop;
      const id = $section.attr("id");

      if (top > offset && top < offset + height) {
        $(".navbar ul li a").removeClass("active");
        $(".navbar").find(`[href="#${id}"]`).addClass("active");
      }
    });
  });

  // ===== SMOOTH SCROLLING =====
  $('a[href*="#"]:not([href="#"])').on("click", function (e) {
    if (
      location.pathname.replace(/^\//, "") ===
        this.pathname.replace(/^\//, "") &&
      location.hostname === this.hostname
    ) {
      let target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");

      if (target.length) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 80,
          },
          800,
          "swing",
          function () {
            // Update URL without triggering scroll
            if (history.pushState) {
              history.pushState(null, null, "#" + target.attr("id"));
            }
          },
        );
      }
    }
  });

  // ===== CONTACT FORM SUBMISSION (AJAX) =====
  const $contactForm = $("#contact-form");
  if ($contactForm.length) {
    $contactForm.on("submit", async function (event) {
      event.preventDefault();

      if (!this.checkValidity()) {
        event.stopPropagation();
        showNotification("Please fill in all fields correctly.", "error");
        return false;
      }

      const $submitBtn = $(this).find('button[type="submit"]');
      const originalText = $submitBtn.html();
      $submitBtn
        .prop("disabled", true)
        .html('<i class="fas fa-spinner fa-spin"></i> Sending...');

      try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          showNotification(
            "Message sent successfully! I'll get back to you soon.",
            "success",
          );
          this.reset();
          // Reset validation states
          $(this)
            .find(".field input, .message textarea")
            .removeClass("valid invalid");
        } else {
          showNotification(
            "Something went wrong. Please try again later.",
            "error",
          );
        }
      } catch (error) {
        showNotification(
          "Network error. Please check your connection.",
          "error",
        );
      } finally {
        $submitBtn.prop("disabled", false).html(originalText);
      }
    });

    // Real-time validation feedback
    $contactForm.find("input, textarea").on("input blur", function () {
      const $field = $(this);
      if (this.checkValidity()) {
        $field.addClass("valid").removeClass("invalid");
      } else {
        $field.addClass("invalid").removeClass("valid");
      }
    });
  }

  // ===== NOTIFICATION FUNCTION =====
  function showNotification(message, type = "info") {
    // Remove existing notifications
    $(".notification").remove();

    const bgColor =
      type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6";
    const $notification = $(`
            <div class="notification" style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 1.5rem 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                font-size: 1.4rem;
                font-weight: 500;
            ">
                ${message}
            </div>
        `);

    $("body").append($notification);

    setTimeout(function () {
      $notification.fadeOut(300, function () {
        $(this).remove();
      });
    }, 5000);
  }

  // ===== PAGE VISIBILITY API =====
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      document.title = "Portfolio | Ahmed Ghoneim";
      $("#favicon").attr("href", "assets/images/favicon.png");
    } else {
      document.title = "Come Back To Portfolio";
      $("#favicon").attr("href", "assets/images/favhand.png");
    }
  });

  // ===== TYPED.JS INITIALIZATION =====
  if (typeof Typed !== "undefined" && $(".typing-text").length) {
    try {
      var typed = new Typed(".typing-text", {
        strings: [
          "AI Leadership",
          "Model Deployment",
          "AI Development",
          "AI Systems Architecture",
          "Generative AI Engineering",
        ],
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 500,
        showCursor: true,
        cursorChar: "|",
        smartBackspace: true,
      });
    } catch (error) {
      console.error("Error initializing Typed.js:", error);
    }
  }

  // ===== VANILLA TILT INITIALIZATION =====
  if (typeof VanillaTilt !== "undefined") {
    try {
      VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.05,
      });
    } catch (error) {
      console.error("Error initializing VanillaTilt:", error);
    }
  }

  // ===== SCROLL REVEAL ANIMATION =====
  if (typeof ScrollReveal !== "undefined") {
    try {
      const srtop = ScrollReveal({
        origin: "top",
        distance: "80px",
        duration: 1000,
        reset: false,
        easing: "ease-in-out",
        delay: 100,
      });

      // Reveal animations
      srtop.reveal(".home .content h1, .home .content h2", { delay: 200 });
      srtop.reveal(".home .content p", { delay: 400 });
      srtop.reveal(".home .content .btn", { delay: 600 });
      srtop.reveal(".home .image", { delay: 400 });
      srtop.reveal(".home .social-icons li", { interval: 200, delay: 800 });

      srtop.reveal(".about .content h3", { delay: 200 });
      srtop.reveal(".about .content .tag", { delay: 300 });
      srtop.reveal(".about .content p", { delay: 400 });
      srtop.reveal(".about .content .box-container", { delay: 500 });
      srtop.reveal(".about .content .resumebtn", { delay: 600 });
      srtop.reveal(".about .image", { delay: 300 });

      srtop.reveal(".skills .container", { delay: 200 });
      srtop.reveal(".skills .boxx", { interval: 200, delay: 400 });

      srtop.reveal(".experience .timeline", { delay: 400 });
      srtop.reveal(".experience .timeline .container", {
        interval: 300,
        delay: 400,
      });

      srtop.reveal(".contact .container", { delay: 400 });
      srtop.reveal(".contact .container .form-group", { delay: 500 });
    } catch (error) {
      console.error("Error initializing ScrollReveal:", error);
    }
  }

  // ===== FETCH DATA FUNCTIONS (if needed) =====
  async function fetchData(type = "skills") {
    try {
      let response;
      if (type === "skills") {
        response = await fetch("skills.json");
      } else {
        response = await fetch("./projects/projects.json");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return null;
    }
  }

  function showSkills(skills) {
    const skillsContainer = document.getElementById("skillsContainer");
    if (!skillsContainer || !skills) return;

    let skillHTML = "";
    skills.forEach((skill) => {
      skillHTML += `
                <div class="bar">
                    <div class="info">
                        <img src=${skill.icon} alt="${skill.name} skill" />
                        <span>${skill.name}</span>
                    </div>
                </div>`;
    });
    skillsContainer.innerHTML = skillHTML;
  }

  function showProjects(projects) {
    const projectsContainer = document.querySelector("#work .box-container");
    if (!projectsContainer || !projects) return;

    let projectHTML = "";
    projects
      .slice(0, 10)
      .filter((project) => project.category != "android")
      .forEach((project) => {
        projectHTML += `
                    <div class="box tilt">
                        <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="${project.name} project" />
                        <div class="content">
                            <div class="tag">
                                <h3>${project.name}</h3>
                            </div>
                            <div class="desc">
                                <p>${project.desc}</p>
                                <div class="btns">
                                    <a href="${project.links.view}" class="btn" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name}">
                                        <i class="fas fa-eye" aria-hidden="true"></i> View
                                    </a>
                                    <a href="${project.links.code}" class="btn" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name} code">
                                        Code <i class="fas fa-code" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
      });
    projectsContainer.innerHTML = projectHTML;

    // Reinitialize VanillaTilt for new elements
    if (typeof VanillaTilt !== "undefined") {
      VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
      });
    }
  }

  // ===== PERFORMANCE OPTIMIZATION =====
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
});

// ===== CSS ANIMATION FOR NOTIFICATIONS =====
if (!document.getElementById("notification-styles")) {
  const style = document.createElement("style");
  style.id = "notification-styles";
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(style);
}
