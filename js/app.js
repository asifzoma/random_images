// Save validated email addresses and assigned images
const savedEmails = new Set();
const emailImageMap = new Map();
let currentSeed = null;

// Generate a seeded image URL
function getRandomImageUrl() {
  currentSeed = Math.random().toString(36).substring(2, 10);
  return `https://picsum.photos/seed/${currentSeed}/200`;
}

// Load a random image into the preview
function loadRandomImage() {
  const img = document.getElementById('currentImage');
  img.src = getRandomImageUrl();
}

// Validate email format
function validateEmail(email) {
  return /^[\w-.]+@[\w-]+\.[\w-.]+$/.test(email);
}

// Display all assignments under each email
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

// Add a new email to the dropdown
function addEmailToDropdown(email) {
  const dropdown = document.getElementById('emailSelect');
  const option = document.createElement('option');
  option.value = email;
  option.textContent = email;
  dropdown.appendChild(option);
}

// Show a toast message (success or error)
function showToast(message, bgColor = '#28a745') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '1rem 1.5rem';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    toast.style.zIndex = '999';
    toast.style.fontSize = '1rem';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.color = '#fff';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.backgroundColor = bgColor;
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2500);
}

// Save Email Button Click
const saveEmailBtn = document.getElementById('saveEmailBtn');
saveEmailBtn.addEventListener('click', function () {
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim().toLowerCase();

  if (!validateEmail(email)) {
    showToast('Please enter a valid email address.', '#d9534f');
    return;
  }

  if (!savedEmails.has(email)) {
    savedEmails.add(email);
    addEmailToDropdown(email);
    showToast(`Email ${email} added successfully.`);
  } else {
    showToast(`Email ${email} already exists.`, '#ffc107');
  }

  emailInput.value = '';
});

// Assign Image Button Click
const assignImageBtn = document.getElementById('assignImageBtn');
assignImageBtn.addEventListener('click', function () {
  const emailSelect = document.getElementById('emailSelect');
  const email = emailSelect.value;
  const imageUrl = `https://picsum.photos/seed/${currentSeed}/200`;

  if (!email) {
    showToast('Please select an email address first.', '#d9534f');
    return;
  }

  if (!emailImageMap.has(email)) {
    emailImageMap.set(email, []);
  }

  emailImageMap.get(email).push(imageUrl);
  displayAssignments();
  showToast(`✅ Image successfully assigned to ${email}`);
  loadRandomImage();
});

// Sync dropdown with input field if needed
const emailSelect = document.getElementById('emailSelect');
emailSelect.addEventListener('change', function () {
  document.getElementById('emailInput').value = this.value;
});

// Load an initial image on page load
document.addEventListener('DOMContentLoaded', loadRandomImage);
