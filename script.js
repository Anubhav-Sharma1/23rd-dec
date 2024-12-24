// Retrieves and parses 'transactions' from localStorage, defaults to empty array.
let transactions = JSON.parse(localStorage.getItem('transactions')) || []; 

// DOM elements for interacting with the transaction form and displaying data
const transactionForm = document.getElementById("transaction-form"); 
const transactionTable = document.getElementById("transaction-table").getElementsByTagName('tbody')[0];  
const filterCategory = document.getElementById("filter-category");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");

/**
 * Update the table with the current list of transactions.
 * It adds the row in the table and updates the value of income,
 * expense, and net balance.
 */
function update() {
    transactionTable.innerHTML = '';  // Clear existing rows
    let totalIncomeValue = 0;  // Renamed to avoid conflict
    let totalExpenseValue = 0;  // Renamed to avoid conflict

    // Now iterating over the transactions and creating rows for the table
    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>₹${transaction.amount.toFixed(2)}</td>
            <td>${transaction.category}</td>
            <td>${transaction.type}</td>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        transactionTable.appendChild(row);

        // Update the total income and expense
        if (transaction.type === "Income") {
            totalIncomeValue += transaction.amount;
        } else {
            totalExpenseValue += transaction.amount;
        }
    });

    // Display the total income, total expense, and net balance
    totalIncome.textContent = `₹${totalIncomeValue.toFixed(2)}`;
    totalExpense.textContent = `₹${totalExpenseValue.toFixed(2)}`;
    netBalance.textContent = `₹${(totalIncomeValue - totalExpenseValue).toFixed(2)}`;
}

/**
 * Handles the form Submission
 * This function collects the form input and adds it to the
 * transactions array and saves this to localStorage.
 * @param {Event} e -> This event is triggered when the form is submitted.
 */
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Creating an object from form input
    const newTrans = {
        description: transactionForm.description.value,
        amount: parseFloat(transactionForm.amount.value), // Corrected here
        category: transactionForm.category.value,
        type: transactionForm.type.value,
        date: new Date() // Set the current date as the transaction date
    };

    // Add the new transaction to the transactions array and save it to localStorage
    transactions.push(newTrans);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Reset the form and update table
    transactionForm.reset();
    update();
});

/**
 * It will filter the transactions based on selected category.
 */
filterCategory.addEventListener('change', () => {
    const category = filterCategory.value;

    // Filter transactions based on category, or show all if 'All' is selected
    const filteredTransactions = category === 'All' ? transactions : transactions.filter(transaction => transaction.category === category);

    // Clear the table body before re-rendering filtered transactions
    transactionTable.innerHTML = '';

    filteredTransactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>₹${transaction.amount.toFixed(2)}</td>
            <td>${transaction.category}</td>
            <td>${transaction.type}</td>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        transactionTable.appendChild(row);
    });

});

/**
 * This will handle the deletion of transactions.
 * It will delete that transaction and update in localStorage.
 * @param {Event} e -> This will trigger the deletion
 */
transactionTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');

        // Remove the transaction from the array and update localStorage
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Update the UI to reflect the changes
        update();
    }
});


// Initial call to update the UI with existing data on page load
update();
