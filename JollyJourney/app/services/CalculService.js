export const calculateTotalExpenses = (expenses, setTotalExpenses) => {
  const total = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  
  const formattedTotal = total.toFixed(2);
  
  setTotalExpenses(formattedTotal);
};

export const calculateDebts = (expenses, setDebts) => {
  const debts = {};

  expenses.forEach(expense => {
    const { amount, paidById, participants } = expense;
    const splitAmount = amount / participants.length;

    participants.forEach(participant => {
      if (participant !== paidById) {
        if (!debts[participant]) {
          debts[participant] = {};
        }
        if (!debts[participant][paidById]) {
          debts[participant][paidById] = 0;
        }
        debts[participant][paidById] += splitAmount;
      }
    });
  });

  const balancedDebts = {};

  Object.keys(debts).forEach(debtor => {
    Object.keys(debts[debtor]).forEach(creditor => {
      const debtorAmount = debts[debtor][creditor];
      const creditorAmount = (debts[creditor] && debts[creditor][debtor]) || 0;

      if (debtorAmount > creditorAmount) {
        if (!balancedDebts[debtor]) {
          balancedDebts[debtor] = {};
        }
        balancedDebts[debtor][creditor] = parseFloat((debtorAmount - creditorAmount).toFixed(2));
      } else if (creditorAmount > debtorAmount) {
        if (!balancedDebts[creditor]) {
          balancedDebts[creditor] = {};
        }
        balancedDebts[creditor][debtor] = parseFloat((creditorAmount - debtorAmount).toFixed(2));
      }
    });
  });

  setDebts(balancedDebts);
};
