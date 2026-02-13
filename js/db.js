/* js/db.js */

const DB_KEY = 'jp_bank_users';
const APP_KEY = 'jp_bank_applications';

class BankSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
        this.applications = JSON.parse(localStorage.getItem(APP_KEY)) || [];
    }

    save() {
        localStorage.setItem(DB_KEY, JSON.stringify(this.users));
        localStorage.setItem(APP_KEY, JSON.stringify(this.applications));
    }

    // Generate realistic history for 2 years
    generateHistory(startDate) {
        const transactions = [];
        const vendors = ['Amazon', 'Walmart', 'Starbucks', 'Shell Gas', 'Netflix', 'Uber', 'Target', 'Apple Store'];
        const types = ['Debit', 'Credit'];
        let currentDate = new Date();
        
        // Loop back 730 days
        for (let i = 0; i < 50; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 730));
            
            const isDeposit = Math.random() > 0.8; // 20% chance of deposit
            const amount = isDeposit ? (Math.random() * 2000 + 500).toFixed(2) : (Math.random() * 100 + 5).toFixed(2);
            
            transactions.push({
                id: 'TXN' + Math.floor(Math.random() * 1000000),
                date: date.toISOString(),
                description: isDeposit ? 'Payroll Deposit' : vendors[Math.floor(Math.random() * vendors.length)],
                type: isDeposit ? 'Credit' : 'Debit',
                amount: parseFloat(amount),
                status: 'Completed'
            });
        }
        return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    createUser(name, email, password, type) {
        if (this.users.find(u => u.email === email)) throw new Error('User already exists');
        
        const history = this.generateHistory();
        const initialBalance = 5000.00;
        
        // Adjust balance based on history (Simulation only, resetting to fixed start for usability)
        // In this demo, we give them 5000 + history impact, or just flat 5000 for simplicity
        
        const newUser = {
            id: 'USR' + Date.now(),
            accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
            name,
            email,
            password, // In real app, hash this!
            type, // 'Personal' or 'Business'
            balance: initialBalance,
            transactions: history,
            isFrozen: false,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.save();
        return newUser;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid credentials');
        if (user.isFrozen) throw new Error('Account is frozen. Contact support.');
        return user;
    }

    getUser(id) {
        return this.users.find(u => u.id === id);
    }

    transfer(senderId, recipientEmail, amount) {
        const sender = this.getUser(senderId);
        const recipient = this.users.find(u => u.email === recipientEmail);

        if (!recipient) throw new Error('Recipient not found');
        if (sender.balance < amount) throw new Error('Insufficient funds');

        sender.balance -= amount;
        recipient.balance += parseFloat(amount);

        const date = new Date().toISOString();

        // Sender Record
        sender.transactions.unshift({
            id: 'TXN' + Date.now(), date, description: `Transfer to ${recipient.name}`, type: 'Debit', amount, status: 'Completed'
        });

        // Recipient Record
        recipient.transactions.unshift({
            id: 'TXN' + (Date.now()+1), date, description: `Transfer from ${sender.name}`, type: 'Credit', amount, status: 'Completed'
        });

        this.save();
    }

    applyForCard(userId, income) {
        this.applications.push({
            id: 'APP' + Date.now(),
            userId,
            income,
            status: 'Pending',
            date: new Date().toISOString()
        });
        this.save();
    }
}

const db = new BankSystem();
