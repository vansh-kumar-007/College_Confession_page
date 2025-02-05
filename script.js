// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    document.documentElement.setAttribute('data-theme', savedTheme); 
    createThemeToggle(); 
}

function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    
    // Create a span inside the button for the moon/sun icon
    const icon = document.createElement('span');
    icon.innerHTML = (document.documentElement.getAttribute('data-theme') === 'dark') ? '🌞' : '🌙';
    toggle.appendChild(icon);
    
    toggle.addEventListener('click', toggleTheme);
    document.body.appendChild(toggle);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('.theme-toggle span');
    
    // Change the icon based on the theme
    icon.innerHTML = (newTheme === 'dark') ? '🌞' : '🌙';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    renderConfessions();
    setupEventDelegation();

    // Add the event listener for the "Share Your Confession" button
    newConfessionBtn.addEventListener('click', showConfessionModal);
});

// DOM Elements
const confessionFeed = document.querySelector('.confession-feed');
const newConfessionBtn = document.querySelector('.new-confession-btn');

// State Management
let confessions = [
    {
        id: 1,
        text: "I've been pretending to understand calculus all semester but I'm completely lost. Too embarrassed to ask for help now.",
        upvotes: 42,
        downvotes: 5,
        likes: 128,
        comments: [
            "It's never too late to ask for help! The math tutoring center is super friendly.",
            "Same here! Maybe we should start a study group?"
        ]
    },
    {
        id: 2,
        text: "I accidentally set off the library alarm today when I was running late to class. Sorry everyone! 🏃‍♂️",
        upvotes: 15,
        downvotes: 2,
        likes: 45,
        comments: []
    }
];

// Event Delegation for Dynamic Elements
function setupEventDelegation() {
    confessionFeed.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('upvote')) handleVote(target, 'up');
        if (target.classList.contains('downvote')) handleVote(target, 'down');
        if (target.classList.contains('like-btn')) handleLike(target);
        if (target.classList.contains('comment-btn')) showCommentModal(target);
    });
}

// Render Functions
function renderConfessions() {
    confessionFeed.innerHTML = confessions.map(confession => `
        <article class="confession-card" data-id="${confession.id}">
            <p class="confession-text">${confession.text}</p>
            <div class="interaction-bar">
                <div class="vote-buttons">
                    <button class="vote-btn upvote">⬆️ ${confession.upvotes}</button>
                    <button class="vote-btn downvote">⬇️ ${confession.downvotes}</button>
                </div>
                <button class="like-btn">❤️ ${confession.likes}</button>
                <button class="comment-btn">💬 ${confession.comments.length}</button>
            </div>
            <div class="comments-section">
                ${confession.comments.map(comment => `
                    <div class="comment">${comment}</div>
                `).join('')}
            </div>
        </article>
    `).join('');
}

// Interaction Handlers
function handleVote(button, type) {
    const card = button.closest('.confession-card');
    const confessionId = parseInt(card.dataset.id);
    const confession = confessions.find(c => c.id === confessionId);
    
    if (type === 'up') {
        confession.upvotes++;
    } else {
        confession.downvotes++;
    }
    
    updateCounter(button, type === 'up' ? confession.upvotes : confession.downvotes);
}

function handleLike(button) {
    const card = button.closest('.confession-card');
    const confessionId = parseInt(card.dataset.id);
    const confession = confessions.find(c => c.id === confessionId);
    
    confession.likes++;
    updateCounter(button, confession.likes);
}

function updateCounter(element, value) {
    element.classList.add('counter-update');
    element.textContent = element.textContent.replace(/\d+/, value);
    
    setTimeout(() => {
        element.classList.remove('counter-update');
    }, 300);
}

// Modal Functions
function showConfessionModal() {
    // Prevent opening multiple modals at once
    if (document.querySelector('.modal')) return;

    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    // Ensure modal uses the current theme
    modal.setAttribute('data-theme', document.documentElement.getAttribute('data-theme'));

    modal.innerHTML = `
        <div class="modal-content slide-up">
            <h2>Share Your Confession</h2>
            <textarea placeholder="Share your confession..." id="confession-text"></textarea>
            <div class="modal-buttons">
                <button id="submit-confession-btn">Submit</button>
                <button id="cancel-confession-btn">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Bind event listeners to the buttons after the modal is added
    const submitButton = document.getElementById('submit-confession-btn');
    const cancelButton = document.getElementById('cancel-confession-btn');
    
    if (submitButton && cancelButton) {
        submitButton.addEventListener('click', submitConfession);
        cancelButton.addEventListener('click', closeModal);
    }
}



// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => modal.remove(), 300); // Remove modal after animation
    }
}

// Submit confession
function submitConfession() {
    const confessionText = document.getElementById('confession-text').value;

    if (confessionText.trim()) {
        // Add the new confession to the confessions array
        const newConfession = {
            id: confessions.length + 1,
            text: confessionText,
            upvotes: 0,
            downvotes: 0,
            likes: 0,
            comments: []
        };
        
        confessions.unshift(newConfession);  // Add confession at the beginning of the array
        renderConfessions();  // Re-render confessions to show the new one
    }

    closeModal();  // Close the modal after submission
}

// Comment Modal Functions
function showCommentModal(button) {
    const modal = document.createElement('div');
    modal.className = 'modal fade-in';
    // Ensure modal uses the current theme
    modal.setAttribute('data-theme', document.documentElement.getAttribute('data-theme'));

    modal.innerHTML = `
        <div class="modal-content">
            <textarea placeholder="Add a comment..."></textarea>
            <button onclick="submitComment(this)">Submit</button>
            <button onclick="closeModal(this)">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);
}


function submitComment(button, confessionId) {
    const modal = button.closest('.modal');
    const commentText = modal.querySelector('textarea').value;

    if (commentText.trim()) {
        // Find the confession using the confessionId
        const confession = confessions.find(c => c.id === confessionId);
        
        // Add the new comment to the confession's comments array
        confession.comments.push(commentText);
        
        renderConfessions(); // Re-render confessions to display the new comment
    }

    closeModal(button); // Close the modal after submission
}
