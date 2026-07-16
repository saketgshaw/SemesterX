
const CONFIG = {
    departments: ["CSE", "IT", "ECE", "EE", "ME", "CE"],
    subjects: {
        sem1: ["Mathematics", "Physics", "Chemistry", "Electrical Engineering"],
        sem2: ["Mathematics", "Chemistry", "Physics", "PPS", "English"]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initEventListeners();
    checkPersistentAuthStatus();

    setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            loader.classList.add("hidden");
            document.querySelectorAll(".shape").forEach(shape => {
                shape.classList.add("show");
            });
        }, 500);
    }, 600);
});
    
    setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.5s ease";
        
        setTimeout(() => {
            loader.classList.add("hidden");
            
            document.querySelectorAll(".shape").forEach(shape => {
                shape.classList.add("show");
            });
        }, 500);
    }, 600);
});
let appState = {
    currentDept: "",
    currentSem: "",
    activeResourceCategory: "" // 'notes', 'pyqs', 'organizers'
};


document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initEventListeners();
    checkPersistentAuthStatus();
    

    setTimeout(() => {
        document.getElementById("loader").classList.add("hidden");
    }, 600);
});


function navigateTo(viewId) {

    document.querySelectorAll(".view").forEach(view => {
        view.classList.remove("active");
    });
    

    window.scrollTo({ top: 0, behavior: 'smooth' });


    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add("active");
    }

    if (viewId === 'dashboard-view') {
        document.getElementById("dash-dept-lbl").textContent = appState.currentDept;
        document.getElementById("dash-sem-lbl").textContent = appState.currentSem;
    }
    if (viewId === 'mentorship-view') {
        renderMentorshipPricingCard();
    }


    document.getElementById("nav-links").classList.remove("open");
}


function initEventListeners() {

    document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("nav-links").classList.toggle("open");
    });


    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);


    document.querySelectorAll("#dept-grid .select-card").forEach(card => {
    card.addEventListener("click", (e) => {

        appState.currentDept = card.getAttribute("data-dept") || card.closest(".select-card").getAttribute("data-dept");
        showToast(`Department set to ${appState.currentDept}`, "info");
        navigateTo("sem-view");
    });
});


    document.querySelectorAll(".sem-card").forEach(card => {
        card.addEventListener("click", () => {
            appState.currentSem = card.getAttribute("data-sem");
            showToast(`Semester ${appState.currentSem} Activated`, "info");
            navigateTo("dashboard-view");
        });
    });


    document.getElementById("resource-search").addEventListener("input", (e) => {
        filterSubjectCards(e.target.value.trim());
    });


const faqQuestions = document.querySelectorAll(".faq-question");
if (faqQuestions.length > 0) {
    faqQuestions.forEach(item => {
        item.addEventListener("click", (e) => {
            // Stop any parent event bubbles
            e.stopPropagation();
            
            const parent = item.parentElement;
            
            // Optional: Close other open FAQs when a new one is clicked
            document.querySelectorAll(".faq-item").forEach(el => {
                if (el !== parent) el.classList.remove("open");
            });

            // Toggle the current one
            parent.classList.toggle("open");
        });
    });
}

    window.addEventListener("scroll", () => {
        const btt = document.getElementById("back-to-top");
        if (window.scrollY > 400) {
            btt.classList.add("show");
        } else {
            btt.classList.remove("show");
        }
    });
    document.getElementById("back-to-top").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    let newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`, "info");
}

function updateThemeIcon(theme) {
    const icon = document.querySelector("#theme-toggle i");
    if(theme === "dark") {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}


function checkIsUserAuthenticated() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function checkPersistentAuthStatus() {
    const authBtn = document.getElementById("auth-nav-btn");
    if (checkIsUserAuthenticated()) {
        authBtn.textContent = "Logout";
        authBtn.className = "btn btn-secondary";
    } else {
        authBtn.textContent = "Login";
        authBtn.className = "btn btn-outline";
    }
}

function handleNavbarAuthClick() {
    if (checkIsUserAuthenticated()) {
        localStorage.removeItem("isLoggedIn");
        showToast("Logged out successfully", "info");
        checkPersistentAuthStatus();
        navigateTo("landing-view");
    } else {
        openAuthModal();
    }
}


let postAuthRedirectActionCallback = null;

function handleDashboardResource(category) {
    appState.activeResourceCategory = category;
    
    if (category === 'mentorship') {
        navigateTo("mentorship-view");
        return;
    }

    if (!checkIsUserAuthenticated()) {
        postAuthRedirectActionCallback = () => { loadResourceViewLayout(category); };
        openAuthModal();
    } else {
        loadResourceViewLayout(category);
    }
}


function openAuthModal() { document.getElementById("auth-modal").classList.add("open"); }
function closeAuthModal() { document.getElementById("auth-modal").classList.remove("open"); }
function openPaymentModal() { document.getElementById("payment-modal").classList.add("open"); }
function closePaymentModal() { document.getElementById("payment-modal").classList.remove("open"); }

function simulateGoogleLogin() {
 
    const loginBtn = document.querySelector(".google-login-btn");
    loginBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Connecting...`;
    
    setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        checkPersistentAuthStatus();
        closeAuthModal();
        showToast("Authenticated via Google Successfully", "success");
        

        loginBtn.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo"> <span>Continue with Google</span>`;
        
        if (postAuthRedirectActionCallback) {
            postAuthRedirectActionCallback();
            postAuthRedirectActionCallback = null;
        }
    }, 1200);
}

// --- DYNAMIC RENDERING COMPONENT ENGINES ---
function loadResourceViewLayout(category) {
    const titleMap = {
        notes: "📚 Verified Lecture Notes",
        pyqs: "📝 Previous Year Questions (PYQs)",
        organizers: "📂 Core Syllabus Organizers"
    };
    
    const descMap = {
        notes: "Highly organized academic course blueprints designed for deep exam preparation scaling.",
        pyqs: "Meticulously aggregated question bank sequences targeting strict structural curriculum benchmarks.",
        organizers: "Aggregated layout outlines, immediate structural reference maps, and formula guides."
    };

    document.getElementById("resource-view-title").textContent = titleMap[category];
    document.getElementById("resource-view-desc").textContent = descMap[category];
    document.getElementById("resource-search").value = ""; // clear previous filter states

    renderSubjectResourceCards();
    navigateTo("resource-view");
}

function renderSubjectResourceCards() {
    const container = document.getElementById("resources-cards-grid");
    container.innerHTML = ""; // clear frame buffers
    
    const semesterKey = `sem${appState.currentSem}`;
    const trackingSubjects = CONFIG.subjects[semesterKey] || [];
    const cat = appState.activeResourceCategory;

    trackingSubjects.forEach(subject => {
        const card = document.createElement("div");
        card.className = "subject-resource-card";
        card.setAttribute("data-subject-name", subject.toLowerCase());

        let internalActionUI = "";
        
        if (cat === 'notes') {
            internalActionUI = `
                <div class="resource-action-list">
                    <button class="btn btn-primary btn-sm btn-full" onclick="showToast('Opening ${subject} notes viewer...','info')"><i class="fa-solid fa-eye"></i> View Notes</button>
                    <button class="btn btn-secondary btn-sm btn-full" onclick="showToast('Downloading ${subject} documentation PDF...','success')"><i class="fa-solid fa-download"></i> Download PDF</button>
                </div>`;
        } else if (cat === 'pyqs') {
            internalActionUI = `
                <div class="resource-action-list">
                    <button class="btn btn-primary btn-sm btn-full" onclick="showToast('Opening ${subject} parsed questions track...','info')"><i class="fa-solid fa-folder-open"></i> View PYQ Files</button>
                    <button class="btn btn-secondary btn-sm btn-full" onclick="showToast('Downloading verified answers schema...','success')"><i class="fa-solid fa-cloud-arrow-down"></i> Download Solution</button>
                </div>`;
        } else if (cat === 'organizers') {
            internalActionUI = `
                <div class="resource-action-list">
                    <button class="btn btn-outline btn-sm btn-full" onclick="showToast('Opening ${subject} revision guide...','info')"><i class="fa-solid fa-bolt"></i> Quick Revision Notes</button>
                    <button class="btn btn-outline btn-sm btn-full" onclick="showToast('Opening ${subject} formulas blueprint...','info')"><i class="fa-solid fa-calculator"></i> Formula Sheets</button>
                    <button class="btn btn-primary btn-sm btn-full" onclick="showToast('Launching Interactive Core Mindmap...','info')"><i class="fa-solid fa-diagram-project"></i> Open Organizer</button>
                </div>`;
        }

        card.innerHTML = `
            <h3><i class="fa-solid fa-graduation-cap"></i> ${subject}</h3>
            ${internalActionUI}
        `;
        container.appendChild(card);
    });
}

function filterSubjectCards(query) {
    const cleanerQuery = query.toLowerCase();
    document.querySelectorAll(".subject-resource-card").forEach(card => {
        const subjectName = card.getAttribute("data-subject-name");
        if (subjectName.includes(cleanerQuery)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function checkIsPremiumUnlocked() {
    return localStorage.getItem("isPremiumPaid") === "true";
}

function renderMentorshipPricingCard() {
    const container = document.getElementById("premium-pricing-box");
    
    if (checkIsPremiumUnlocked()) {
        container.innerHTML = `
            <div class="success-box-animated">
                <i class="fa-solid fa-circle-check text-success"></i>
                <h3 style="margin-bottom:10px;">Mentorship Unlocked</h3>
                <p style="margin-bottom:24px; color:var(--text-secondary);">Your elite workspace dashboard membership is active.</p>
                <button class="btn btn-primary btn-full" onclick="showToast('Connecting to your assigned personal advisor channel...','info')">
                    <i class="fa-solid fa-headset"></i> Enter Lounge Room
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <h4>Elite Track Tier</h4>
            <div class="price-pill">₹59 <span class="term">/ One-Time</span></div>
            <p>Accelerate structural target routines. Instant system processing setup deployment.</p>
            <button class="btn btn-primary btn-full" onclick="handlePremiumUnlockIntent()"><i class="fa-solid fa-crown"></i> Unlock Now</button>
        `;
    }
}

function handlePremiumUnlockIntent() {
    if (!checkIsUserAuthenticated()) {
        postAuthRedirectActionCallback = () => { openPaymentModal(); };
        openAuthModal();
    } else {
        openPaymentModal();
    }
}

function simulatePaymentProcessing() {
    const targetBody = document.getElementById("payment-gateway-body");

    targetBody.innerHTML = `
        <div style="text-align:center; padding: 20px 0;">
            <div class="spinner" style="margin: 0 auto 16px auto;"></div>
            <p style="font-size:13px; color:var(--text-secondary)">Contacting decentralized structural bank networks...</p>
        </div>
    `;

    setTimeout(() => {
        localStorage.setItem("isPremiumPaid", "true");
        showToast("Payment Processed Successfully", "success");
        
        targetBody.innerHTML = `
            <div class="success-box-animated">
                <i class="fa-solid fa-circle-check text-success"></i>
                <h4>✅ Payment Successful</h4>
                <p style="font-size:13px; color:var(--text-secondary); margin-top:6px;">Mentorship Unlocked</p>
            </div>
        `;


        setTimeout(() => {
            closePaymentModal();
            renderMentorshipPricingCard();

            targetBody.innerHTML = `
                <button class="btn btn-primary btn-full" id="payment-trigger-btn" onclick="simulatePaymentProcessing()">
                    <i class="fa-solid fa-credit-card"></i> Proceed to Payment
                </button>
            `;
        }, 1500);

    }, 2000);
}


function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let iconClass = "fa-solid fa-circle-info";
    if (type === "success") iconClass = "fa-solid fa-circle-check";
    
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        setTimeout(() => { toast.remove(); }, 300);
    }, 3500);
}
