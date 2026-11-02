// Copa Arena Turf Sodepur — Interactive Engine
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => drawer.classList.remove('open'));
    });
  }

  // Dynamic Character-by-Character Typewriter
  const typewriterEl = document.querySelector('.dynamic-typewriter');
  if (typewriterEl) {
    const phrases = [
      'Floodlit Rooftop Football',
      'Box Cricket Tournaments',
      'Corporate Match Nights',
      'Private Arena Hire',
      'Midnight Futsal Derbies'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 35 : 75;

      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }

    typeLoop();
  }

  // Interactive Turf Slot & Team Cost Estimator
  const calcForm = document.getElementById('turf-calc-form');
  if (calcForm) {
    calcForm.addEventListener('input', updateTurfCalculation);
    calcForm.addEventListener('change', updateTurfCalculation);
    updateTurfCalculation();
  }

  function updateTurfCalculation() {
    const sportSelect = document.getElementById('calc-sport');
    const slotSelect = document.getElementById('calc-slot');
    const hoursSelect = document.getElementById('calc-hours');
    const playersInput = document.getElementById('calc-players');
    const targetDisplay = document.getElementById('calc-target-display');
    const detailsDisplay = document.getElementById('calc-details-display');
    const waInquiryBtn = document.getElementById('calc-wa-btn');

    if (!sportSelect || !slotSelect || !hoursSelect || !targetDisplay) return;

    const sport = sportSelect.value;
    const slot = slotSelect.value;
    const hours = parseInt(hoursSelect.value) || 1;
    const players = parseInt(playersInput ? playersInput.value : 10) || 10;

    let hourlyRate = 700; // daytime base
    if (slot === 'night') {
      hourlyRate = 950; // floodlit peak night
    } else if (slot === 'weekend') {
      hourlyRate = 1000;
    }

    if (sport === 'cricket') {
      hourlyRate -= 50;
    }

    const totalEstimate = hourlyRate * hours;
    const perPlayer = Math.round(totalEstimate / players);

    targetDisplay.innerText = `₹${totalEstimate} Total (₹${perPlayer}/player)`;
    if (detailsDisplay) {
      const sportName = sportSelect.options[sportSelect.selectedIndex].text;
      const slotName = slotSelect.options[slotSelect.selectedIndex].text;
      detailsDisplay.innerText = `Based on ${hours} hr(s) ${slotName} for ~${players} players on 6th Floor Onex Rooftop. Includes floodlights, match football/cricket gear & bibs.`;
    }

    if (waInquiryBtn) {
      const sportLabel = sportSelect.options[sportSelect.selectedIndex].text;
      const slotLabel = slotSelect.options[slotSelect.selectedIndex].text;
      const message = encodeURIComponent(
        `Hello Copa Arena Turf Sodepur, I calculated match slot on your website: ${sportLabel} for ${hours} hour(s) (${slotLabel}, ~${players} players). Total estimated slot rate: ₹${totalEstimate}. I would like to lock in this slot time.`
      );
      waInquiryBtn.href = `https://wa.me/918910297337?text=${message}`;
    }
  }

  // Sticky Filter Rail for Sports
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sportCards = document.querySelectorAll('.sport-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      sportCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  // Animated Telemetry Counters
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const countTarget = entry.target.dataset.count;
        if (countTarget) {
          let current = 0;
          const target = parseFloat(countTarget);
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
              entry.target.innerText = Math.round(target);
              clearInterval(counter);
            } else {
              entry.target.innerText = Math.round(current);
            }
          }, stepTime);
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.hero-stat-card, .glass-card, .bento-card, .sport-card, .review-card').forEach(el => {
    observer.observe(el);
  });
});
