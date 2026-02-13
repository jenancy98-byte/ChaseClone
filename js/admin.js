/* js/admin.js */

const session = JSON.parse(sessionStorage.getItem('user'));
if (!session || session.role !== 'admin') window.location.href = 'login.html';

function renderUsers() {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = '';
    
    db.users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.accountNumber}</td>
            <td>$${u.balance.toFixed(2)}</td>
            <td>${u.isFrozen ? 'Frozen' : 'Active'}</td>
            <td>
                <button onclick="toggleFreeze('${u.id}')" class="btn btn-sm">${u.isFrozen ? 'Unfreeze' : 'Freeze'}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleFreeze(id) {
    const user = db.getUser(id);
    user.isFrozen = !user.isFrozen;
    db.save();
    renderUsers();
}

renderUsers();
