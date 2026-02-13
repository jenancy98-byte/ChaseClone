/* js/auth.js */

// Helper to switch forms
function showTab(tab) {
    if(tab === 'login') {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('signup-form').style.display = 'none';
    } else {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
    }
}

// Login Handler
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === 'admin@chase.com' && password === 'admin123') {
        sessionStorage.setItem('user', JSON.stringify({ role: 'admin' }));
        window.location.href = 'admin.html';
        return;
    }

    try {
        const user = db.login(email, password);
        
        // OTP Simulation
        const otp = prompt("Enter OTP sent to your phone (Enter '1234'):");
        if(otp !== '1234') return alert("Invalid OTP");

        sessionStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } catch (err) {
        alert(err.message);
    }
});

// Signup Handler
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const pass = e.target.password.value;
    const type = e.target.type.value;

    try {
        db.createUser(name, email, pass, type);
        alert('Account created successfully! Please login.');
        showTab('login');
    } catch (err) {
        alert(err.message);
    }
});
