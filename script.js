// =========================================
//   KRISHNA DUBEY — PORTFOLIO JAVASCRIPT
//   Features:
//     1. Navbar background on scroll
//     2. Mobile menu open / close
//     3. Typing animation (Hero section)
//     4. Skill bar fill animation
//     5. Contact form submission
// =========================================


// -------------------------
// 1. NAVBAR — Add background when user scrolls down
// -------------------------

// Get the navbar element from HTML
const navbar = document.getElementById('navbar');

// This function runs every time the user scrolls
window.addEventListener('scroll', function () {

  // If user has scrolled more than 60px from top
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');      // add the "scrolled" CSS class
  } else {
    navbar.classList.remove('scrolled');   // remove it when near the top
  }

});


// -------------------------
// 2. MOBILE MENU — Open and close on hamburger click
// -------------------------

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', function () {

  // Toggle means: if it has the class, remove it. If not, add it.
  navLinks.classList.toggle('open');

  // Change the hamburger icon: ✕ when open, ☰ when closed
  if (navLinks.classList.contains('open')) {
    hamburger.innerHTML = '&#10005;';   // ✕ symbol
  } else {
    hamburger.innerHTML = '&#9776;';   // ☰ symbol
  }

});

// Close the menu when user clicks any nav link
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('open');
    hamburger.innerHTML = '&#9776;';
  });
});


// -------------------------
// 3. TYPING ANIMATION — Types different roles one by one
// -------------------------

// The element where text will appear
const typedText = document.getElementById('typedText');

// List of roles to type
const roles = [
  'Full Stack Developer',
  'JavaScript Engineer',
  'Python Enthusiast',
  'Problem Solver',
];

let roleIndex  = 0;    // which role we are currently on
let charIndex  = 0;    // how many characters have been typed
let isDeleting = false; // are we currently deleting text?

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typedText.textContent = currentRole.slice(0, charIndex - 1);
        charIndex--;
    } else {
        typedText.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;
    }

    let speed = 120;

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        speed = 1500; // pause at the end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
    } else if (isDeleting) {
        speed = 60;
    }

    setTimeout(type, speed);
}

// Start the typing animation
type();
// -------------------------
// 4. SKILL BARS — Fill the bar when it comes into view
// -------------------------


const skillFills = document.querySelectorAll('.skill-fill');

// IntersectionObserver watches when elements appear on screen
const skillObserver = new IntersectionObserver(function (entries) {

  entries.forEach(function (entry) {

    // entry.isIntersecting = true means the element is now visible on screen
    if (entry.isIntersecting) {
      const fill = entry.target;

      // Read the target width from HTML attribute (e.g. "85%")
      const targetWidth = fill.style.width;

      // Set the width — CSS transition will animate it smoothly
      fill.style.width = targetWidth;

      // Stop watching this element (we only want to animate once)
      skillObserver.unobserve(fill);
    }

  });

}, { threshold: 0.4 }); // trigger when 40% of the element is visible

// Tell the observer to watch all skill fills
skillFills.forEach(function (fill) {
  skillObserver.observe(fill);
});


// ---------------------------------------------
// 5. CONTACT FORM – Handle form submission
// ---------------------------------------------
const contactForm = document.getElementById('contactForm');
const sendBtn     = document.getElementById('sendBtn');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
        showNote('Please fill in all fields.', 'error');
        return;
    }

    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOK) {
        showNote('Please enter a valid email address.', 'error');
        return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    object.access_key =  "98247a05-cd6d-47b9-b8c5-26d42281e9f8";
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let resJson = await response.json();
        
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';

        if (response.status === 200) {
            showNote('✓ Message sent successfully! Check your inbox.', 'success');
            contactForm.reset();
        } else {
            showNote(resJson.message || 'Something went wrong!', 'error');
        }
    })
    .catch(error => {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';
        showNote('Network error! Please try again.', 'error');
    });
});

function showNote(message, type) {
    formNote.textContent = message;
    formNote.className = type;

    setTimeout(function () {
        formNote.textContent = '';
        formNote.className = '';
    }, 5000);
}