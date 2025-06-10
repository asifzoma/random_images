/**
 * Image Assignment Application
 * 
 * This application allows users to:
 * 1. Generate and assign random images to email addresses
 * 2. Store assignments in local storage
 * 3. Manage email addresses (add/delete)
 * 4. Prevent duplicate image assignments
 */

// Initialize data structures for storing emails and image assignments
const savedEmails = new Set();  // Using Set to ensure unique email addresses
const emailImageMap = new Map(); // Maps emails to their assigned images array
let currentSeed = null; // Tracks current image seed for preventing duplicates

/**
 * Generates a random seed and returns a seeded image URL
 * Uses Lorem Picsum API with consistent dimensions (200x200)
 */
function getRandomImageUrl() {
  currentSeed = Math.random().toString(36).substring(2, 10);
  return `https://picsum.photos/seed/${currentSeed}/200`;
}

/**
 * Updates the preview image with a new random image
 * Called when loading new images or after assignments
 */
function loadRandomImage() {
  const img = document.getElementById('currentImage');
  img.src = getRandomImageUrl();
}

/**
 * Validates email format using regex
 * Checks for: username@domain.tld format
 */
function validateEmail(email) {
  return /^[\w-.]+@[\w-]+\.[\w-.]+$/.test(email);
}

/**
 * Renders all email-image assignments in the UI
 * Creates cards showing each email and its assigned images
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
 * Applies a shake animation and error styling to invalid inputs
 * Used for visual feedback on validation errors
 */
function applyShakeEffect(element) {
  element.classList.remove('shake');
  void element.offsetWidth; // Forces reflow to restart animation
  element.classList.add('input-error', 'shake');

  setTimeout(() => {
    element.classList.remove('input-error', 'shake');
  }, 500);
}

// Event Listener: Load New Random Image
document.getElementById('loadImageBtn').addEventListener('click', loadRandomImage);

/**
 * Adds a new email option to the dropdown select
 * Called after validating and saving a new email
 */
function addEmailToDropdown(email) {
  const dropdown = document.getElementById('emailSelect');
  const option = document.createElement('option');
  option.value = email;
  option.textContent = email;
  dropdown.appendChild(option);
}

/**
 * Creates and displays a toast notification
 * @param {string} message - The message to display
 * @param {string} bgColor - Background color (default: success green)
 */
function showToast(message, bgColor = '#28a745') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'fixed';
    toast.style.top = '50%';
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
  setTimeout(() => toast.style.opacity = '0', 4000);
}

// Event Listener: Save Email Button
// Validates and saves new email addresses
const saveEmailBtn = document.getElementById('saveEmailBtn');
saveEmailBtn.addEventListener('click', function () {
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim().toLowerCase();

  // Validate email format
  if (!validateEmail(email)) {
    showToast('Please enter a valid email address.', '#d9534f');
    applyShakeEffect(emailInput);
    return;
  }

  // Check for duplicate emails
  if (!savedEmails.has(email)) {
    savedEmails.add(email);
    localStorage.setItem('savedEmails', JSON.stringify([...savedEmails]));
    addEmailToDropdown(email);
    showToast(`Email ${email} added successfully.`);
  } else {
    showToast(`Email ${email} already exists.`, '#ffc107');
  }

  emailInput.value = '';
});

// Event Listener: Assign Image Button
// Assigns current image to selected email if not duplicate
const assignImageBtn = document.getElementById('assignImageBtn');
assignImageBtn.addEventListener('click', function () {
  const emailSelect = document.getElementById('emailSelect');
  const email = emailSelect.value;
  const imageUrl = `https://picsum.photos/seed/${currentSeed}/200`;

  // Validate email selection
  if (!email) {
    showToast('Please select an email address first.', '#d9534f');
    applyShakeEffect(emailSelect);
    return;
  }

  // Initialize empty array for new emails
  if (!emailImageMap.has(email)) {
    emailImageMap.set(email, []);
  }

  // Prevent duplicate image assignments
  const existingImages = emailImageMap.get(email);
  if (existingImages.includes(imageUrl)) {
    showToast('This image is already assigned to this email. Please load a new image.', '#ffc107');
    applyShakeEffect(document.getElementById('loadImageBtn'));
    return;
  }

  // Save assignment and update storage
  emailImageMap.get(email).push(imageUrl);
  const plainMap = Object.fromEntries(emailImageMap);
  localStorage.setItem('emailImageMap', JSON.stringify(plainMap));

  displayAssignments();
  showToast(`✅ Image successfully assigned to ${email}`);
  loadRandomImage(); // Auto-load new image to prevent duplicates
});

// Event Listener: Email Select Change
// Syncs dropdown selection with input field
const emailSelect = document.getElementById('emailSelect');
emailSelect.addEventListener('change', function () {
  document.getElementById('emailInput').value = this.value;
});

// Load initial random image on page load
document.addEventListener('DOMContentLoaded', loadRandomImage);

// Event Listener: Clear Images Button
// Removes all images from selected email
const clearImagesBtn = document.getElementById('clearImagesBtn');
clearImagesBtn.addEventListener('click', function () {
  const selectedEmail = emailSelect.value;

  if (!selectedEmail) {
    showToast('Please select an email address.', '#d9534f');
    applyShakeEffect(emailSelect);
    return;
  }

  if (emailImageMap.has(selectedEmail)) {
    emailImageMap.set(selectedEmail, []);
    localStorage.setItem('emailImageMap', JSON.stringify(Object.fromEntries(emailImageMap)));
    displayAssignments();
    showToast(`🗑️ All images cleared for ${selectedEmail}`);
  } else {
    showToast('No images found for that email.', '#ffc107');
  }
});

// Event Listener: Delete Email Button
// Removes email and its assignments completely
const deleteEmailBtn = document.getElementById('deleteEmailBtn');
deleteEmailBtn.addEventListener('click', function () {
  const selectedEmail = emailSelect.value;

  if (!selectedEmail) {
    showToast('Please select an email to delete.', '#d9534f');
    return;
  }

  // Remove from all data structures
  savedEmails.delete(selectedEmail);
  emailImageMap.delete(selectedEmail);

  // Remove from dropdown
  const optionToRemove = [...emailSelect.options].find(opt => opt.value === selectedEmail);
  if (optionToRemove) emailSelect.removeChild(optionToRemove);

  // Clear input field
  document.getElementById('emailInput').value = '';

  // Update storage
  localStorage.setItem('savedEmails', JSON.stringify([...savedEmails]));
  localStorage.setItem('emailImageMap', JSON.stringify(Object.fromEntries(emailImageMap)));

  displayAssignments();
  showToast(`❌ Email ${selectedEmail} deleted along with its images.`, '#d9534f');
});

