// Harvard Poops - Landing Page

const API_BASE = window.location.origin;

// Check if already authenticated
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    if (token) {
        // Already authenticated, redirect to events
        window.location.href = '/events';
        return;
    }

    setupForm();
});

// Setup form submission
function setupForm() {
    const form = document.getElementById('gate-form');
    form.addEventListener('submit', handleSubmit);

    // Add enter key support
    const input = document.getElementById('referral-code');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const codeInput = document.getElementById('referral-code');
    const code = codeInput.value.trim();
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');

    // Hide previous messages
    errorDiv.classList.remove('show');
    errorDiv.style.display = 'none';
    successDiv.classList.remove('show');
    successDiv.style.display = 'none';
    codeInput.classList.remove('error');

    if (!code) {
        showError('enter a referral code');
        codeInput.classList.add('error');
        return;
    }

    // Disable button during submission
    submitBtn.disabled = true;
    btnText.textContent = 'verifying...';

    try {
        const response = await fetch(`${API_BASE}/api/auth/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.success && data.token) {
            // Store token in localStorage
            localStorage.setItem('userToken', data.token);

            // Show success message
            showSuccess();

            // Clear input
            codeInput.value = '';

            // Redirect to events page after animation
            setTimeout(() => {
                window.location.href = '/events';
            }, 1000);
        } else {
            showError(data.error || 'invalid code');
            codeInput.value = '';
            codeInput.classList.add('error');
            codeInput.focus();
            submitBtn.disabled = false;
            btnText.textContent = 'enter';
        }
    } catch (error) {
        console.error('Validation error:', error);
        showError('connection error. try again');
        codeInput.classList.add('error');
        submitBtn.disabled = false;
        btnText.textContent = 'enter';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.classList.add('show');

    // Auto-hide after 4 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 300);
    }, 4000);
}

// Show success message
function showSuccess() {
    const successDiv = document.getElementById('success-message');
    successDiv.style.display = 'flex';
    successDiv.classList.add('show');
}
