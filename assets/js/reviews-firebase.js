/* ================================================================
   REVIEWS — Firebase Firestore Integration
   ================================================================
   Firestore Collection: "reviews"
   Each document should have these fields:
     - name     (string)  e.g. "Denis Slavska"
     - position (string)  e.g. "CTO, Ailitic · New York"
     - review   (string)  e.g. "They tailor their solutions..."
     - order    (number)  e.g. 1  ← controls display order
   ================================================================ */

import { initializeApp }  from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js';
import { getAnalytics }   from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js';
import { getFirestore, collection, getDocs, query, orderBy, addDoc }
                          from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js';

// ── Firebase project credentials ────────────────────────────────
const firebaseConfig = {
    apiKey:            "AIzaSyDfHDVU4eEuj4R6qw8cEsw3MuHBkCjBjlQ",
    authDomain:        "rahim-bfe8e.firebaseapp.com",
    projectId:         "rahim-bfe8e",
    storageBucket:     "rahim-bfe8e.firebasestorage.app",
    messagingSenderId: "164221054753",
    appId:             "1:164221054753:web:79af1616b030e82c1b9860",
    measurementId:     "G-BFYZ889F5N"
};

// ── Bootstrap Firebase ──────────────────────────────────────────
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = getFirestore(app);

// ── Build one review card element ───────────────────────────────
function createReviewCard(data) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <div class="review-card-top">
            <div class="review-avatar-wrap">
                <i class="fa-regular fa-user review-avatar-icon"></i>
            </div>
        </div>
        <div class="review-quote-mark">"</div>
        <p class="review-text">${escapeHtml(data.review)}</p>
        <div class="review-author">
            <p class="review-name">${escapeHtml(data.name)}</p>
            <p class="review-role">${escapeHtml(data.position)}</p>
        </div>
    `;
    return card;
}

// ── Simple HTML escape to prevent XSS ──────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#39;');
}

// ── Show / hide loading spinner ─────────────────────────────────
function setLoading(isLoading) {
    const spinner = document.getElementById('reviews-loading');
    if (spinner) spinner.style.display = isLoading ? 'flex' : 'none';
}

// ── Fetch + render reviews ──────────────────────────────────────
async function loadReviews() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;

    setLoading(true);

    try {
        // Fetch all reviews without server-side ordering (so it catches docs missing the 'order' field)
        const snapshot = await getDocs(collection(db, 'reviews'));
        
        track.innerHTML = '';
        
        if (snapshot.empty) {
            track.innerHTML = '';
        } else {
            // Convert to array and sort locally
            const reviewsData = [];
            snapshot.forEach(doc => reviewsData.push(doc.data()));
            
            // Sort by order field (if missing, treat as 0 so it shows first)
            reviewsData.sort((a, b) => (a.order || 0) - (b.order || 0));
            
            reviewsData.forEach(data => {
                track.appendChild(createReviewCard(data));
            });
        }

    } catch (err) {
        console.error('Failed to load reviews:', err);
        track.innerHTML = `
            <div class="reviews-empty">
                <i class="fa-regular fa-circle-xmark"></i>
                <p>Could not load reviews. Please try again later.</p>
            </div>`;
    } finally {
        setLoading(false);
        if (typeof window.initReviewsSlider === 'function') {
            window.initReviewsSlider();
        }
    }
}

// ── Modal & Form Logic ──────────────────────────────────────────
function initReviewModal() {
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReviewModalBtn');
    const closeBtn = document.getElementById('closeReviewModalBtn');
    const form = document.getElementById('addReviewForm');
    const textarea = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    const feedback = document.getElementById('modalFeedback');
    const submitBtn = document.getElementById('submitReviewBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

    if (!modal || !openBtn || !closeBtn || !form) return;

    // Open Modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // lock background scroll
        
        // Clear inputs and feedback
        form.reset();
        if (charCount) charCount.textContent = '0';
        if (feedback) {
            feedback.style.display = 'none';
            feedback.className = 'modal-feedback';
            feedback.textContent = '';
        }
    });

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // unlock scroll
    }

    closeBtn.addEventListener('click', closeModal);

    // Close when clicking overlay backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Character limit counter
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            const count = textarea.value.length;
            charCount.textContent = count;
            if (count >= 300) {
                charCount.style.color = '#EA580C';
            } else {
                charCount.style.color = '';
            }
        });
    }

    // Handle form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get values
        const nameVal = document.getElementById('reviewName').value.trim();
        const posVal = document.getElementById('reviewPosition').value.trim();
        const whatsappVal = document.getElementById('reviewWhatsapp') ? document.getElementById('reviewWhatsapp').value.trim() : '';
        const textVal = textarea.value.trim();

        if (!nameVal || !posVal || !textVal) {
            showFeedback('Please fill out all fields.', 'error');
            return;
        }

        // Update button state (loading)
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Submitting...';
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        if (feedback) feedback.style.display = 'none';

        try {
            // Save to Firestore reviews collection
            await addDoc(collection(db, 'reviews'), {
                name: nameVal,
                position: posVal,
                review: textVal,
                whatsapp: whatsappVal,
                order: Date.now() // unique incremental order number based on timestamp
            });

            showFeedback('Thank you! Your review has been submitted successfully.', 'success');
            
            // Reload reviews to show the newly added review instantly
            await loadReviews();

            // Clear form
            form.reset();
            if (charCount) charCount.textContent = '0';

            // Close modal after brief delay so user sees success message
            setTimeout(() => {
                closeModal();
            }, 2000);

        } catch (err) {
            console.error('Error submitting review:', err);
            showFeedback('Firebase Error: ' + err.message, 'error');
        } finally {
            // Restore button state
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Submit Review';
            if (btnSpinner) btnSpinner.style.display = 'none';
        }
    });

    function showFeedback(message, type) {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.className = `modal-feedback ${type}`;
        feedback.style.display = 'block';
    }
}

// ── Run on DOM ready ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    initReviewModal();
});


