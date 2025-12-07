document.addEventListener("DOMContentLoaded", () => {
  const API = "http://localhost:5000/api";

  /* ================= ELEMENTS ================= */

  // Summary cards
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const balanceEl = document.getElementById("balance");

  // Forms
  const incomeForm = document.getElementById("incomeForm");
  const expenseForm = document.getElementById("expenseForm");

  // Income inputs
  const incomeAmount = document.getElementById("incomeAmount");
  const incomeSource = document.getElementById("incomeSource");

  // Expense inputs
  const expenseAmount = document.getElementById("expenseAmount");
  const expenseCategory = document.getElementById("expenseCategory");
  const expenseNote = document.getElementById("expenseNote");

  // Expense table
  const expenseTable = document.getElementById("expenseTable");

  // Monthly intent
  const goalInput = document.getElementById("goalInput");
  const saveGoalBtn = document.getElementById("saveGoalBtn");
  const goalText = document.getElementById("goalText");

  // Clear balance
  const clearBalanceBtn = document.getElementById("clearBalanceBtn");

  // Modal elements (ADDED ✅)
  const modal = document.getElementById("clearModal");
  const cancelClear = document.getElementById("cancelClear");
  const confirmClear = document.getElementById("confirmClear");

  /* ================= MONTHLY INTENT ================= */

  const savedGoal = localStorage.getItem("monthlyIntent");
  if (savedGoal && goalText) {
    goalText.textContent = `Intent ₹${savedGoal}`;
  }

  if (saveGoalBtn) {
    saveGoalBtn.addEventListener("click", () => {
      if (!goalInput.value) return;

      localStorage.setItem("monthlyIntent", goalInput.value);
      goalText.textContent = `Intent ₹${goalInput.value}`;
      goalInput.value = "";
    });
  }

  /* ================= LOAD SUMMARY ================= */

  async function loadSummary() {
    const res = await fetch(`${API}/summary`);
    const data = await res.json();

    incomeEl.textContent = `₹${data.totalIncome}`;
    expenseEl.textContent = `₹${data.totalExpense}`;
    balanceEl.textContent = `₹${data.balance}`;

    expenseTable.innerHTML = "";
    data.expenses.forEach(e => {
      expenseTable.innerHTML += `
        <tr>
          <td>₹${e.amount}</td>
          <td>${e.category}</td>
          <td>${e.note || "-"}</td>
        </tr>
      `;
    });
  }

  /* ================= ADD INCOME ================= */

  incomeForm.addEventListener("submit", async e => {
    e.preventDefault();

    await fetch(`${API}/income`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: incomeAmount.value,
        source: incomeSource.value
      })
    });

    incomeForm.reset();
    loadSummary();
  });

  /* ================= ADD EXPENSE ================= */

  expenseForm.addEventListener("submit", async e => {
    e.preventDefault();

    await fetch(`${API}/expense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: expenseAmount.value,
        category: expenseCategory.value,
        note: expenseNote.value
      })
    });

    expenseForm.reset();
    loadSummary();
  });

  /* ================= CLEAR BALANCE (BEAUTIFUL) ================= */

  // Open modal
  clearBalanceBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cancel
  cancelClear.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirm clear
  confirmClear.addEventListener("click", async () => {
    await fetch(`${API}/clear`, { method: "POST" });
    modal.style.display = "none";
    loadSummary();
  });

  /* ================= INIT ================= */

  loadSummary();
});
