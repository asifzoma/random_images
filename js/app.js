// Store emails and their assigned image URLs
const emailImageMap = new Map();

/**
 * Generate a random image URL
 * This gets a new image every time because of the changing query string
 */
function getRandomImageUrl() {
  return `https://picsum.photos/200?random=${Date.now()}`;
}

/**
 * Load a new image into the #currentImage <img>
 */
function loadRandomImage() {
  const img = document.getElementById('currentImage');
  img.src = getRandomImageUrl();
}

/**
 * Validate email with a basic regex
 */
function validateEmail(email) {
  return /^(?!test@test$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/t(email);


}

/**
 * Show a custom toast-style error and animate the input
 */
function showCustomError(inputElement, message) {
  inputElement.classList.add('input-error', 'shake');

  // Remove shake after animation
  setTimeout(() => inputElement.classList.remove('shake'), 400);

  // Create or reuse toast
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#d9534f';
    toast.style.color = '#fff';
    toast.style.padding = '1rem 1.5rem';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    toast.style.zIndex = '999';
    toast.style.fontSize = '1rem';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2500);
}

/**
 * Display all assigned images grouped by email
 */
function displayAssignments() {
  const container = document.getElementById('assignmentsList');
  container.innerHTML = '';

  emailImageMap.forEach((images, email) => {
    const card = document.createElement('div');
    card.classList.add('assignment-card');

    const emailHeader = document.createElement('h3');
    emailHeader.textContent = email;
    card.appendChild(emailHeader);

    images.forEach((imgUrl) => {
      const img = document.createElement('img');
      img.src = imgUrl;
      card.appendChild(img);
    });

    container.appendChild(card);
  });
}

/**
 * Handle form submission to assign an image
 */
document.getElementById('assignForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim().toLowerCase();
  const imageUrl = document.getElementById('currentImage').src;

  // Clear old error state
  emailInput.classList.remove('input-error');

  // Validate
  if (!validateEmail(email)) {
    showCustomError(emailInput, "Please add a real email address, thanks!");
    return;
  }

  // Add to map
  if (!emailImageMap.has(email)) {
    emailImageMap.set(email, []);
  }

  emailImageMap.get(email).push(imageUrl);

  // Update the UI
  displayAssignments();
  emailInput.value = '';
  loadRandomImage();
});

/**
 * Load a new image when "Load New Image" button is clicked
 */
document.getElementById('loadImageBtn').addEventListener('click', loadRandomImage);

/**
 * Load an image on first page load
 */
document.addEventListener('DOMContentLoaded', loadRandomImage);


/* successful toast 

/**
 * Show a toast message with custom content and optional background colour
 * @param {string} message - The message to display
 * @param {string} [bgColor='#28a745'] - Background colour (green by default)
 */
function showToast(message, bgColor = '#28a745') {
    let toast = document.getElementById('toast');
  
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '2rem';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.color = '#fff';
      toast.style.padding = '1rem 1.5rem';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
      toast.style.zIndex = '999';
      toast.style.fontSize = '1rem';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(toast);
    }
  
    toast.textContent = message;
    toast.style.backgroundColor = bgColor;
    toast.style.opacity = '1';
  
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2500);
  }
  