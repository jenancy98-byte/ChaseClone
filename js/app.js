/* js/app.js */

const currentUser = JSON.parse(sessionStorage.getItem('user'));

if (!currentUser) window.location.href = 'login.html';

// Refresh user data from DB to get latest balance/txns
const user = db.getUser(currentUser.id);

function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function loadDashboard() {
    // Header Info
    document.getElementById('user-name').innerText = user.name;
    document.getElementById('acc-num').innerText = `Checking (...${user.accountNumber.slice(-4)})`;
    document.getElementById('avail-bal').innerText = formatCurrency(user.balance);
    document.getElementById('curr-bal').innerText = formatCurrency(user.balance);

    // Render Transactions
    const tbody = document.getElementById('txn-body');
    tbody.innerHTML = '';
    
    user.transactions.forEach(t => {
        const row = document.createElement('tr');
        const isNeg = t.type === 'Debit';
        row.innerHTML = `
            <td>${formatDate(t.date)}</td>
            <td>${t.description}</td>
            <td>${t.type}</td>
            <td><span class="${isNeg ? 'amount-neg' : 'amount-pos'}">
                ${isNeg ? '-' : '+'}${formatCurrency(t.amount)}
            </span></td>
            <td>${t.status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Sidebar Navigation
function switchView(viewId) {
    document.querySelectorAll('.main-content').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// Actions
function handleTransfer(e) {
    e.preventDefault();
    const email = e.target.recipient.value;
    const amount = parseFloat(e.target.amount.value);
    
    try {
        db.transfer(user.id, email, amount);
        alert('Transfer Successful');
        location.reload();
    } catch (err) {
        alert(err.message);
    }
}

function handleCardApp(e) {
    e.preventDefault();
    const income = e.target.income.value;
    db.applyForCard(user.id, income);
    alert('Application submitted. Check status in 24 hours.');
    e.target.reset();
}

// Initial Load
loadDashboard();
