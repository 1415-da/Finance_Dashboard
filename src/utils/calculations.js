export const calculateDashboardStats = (transactions) => {
  const stats = transactions.reduce((acc, curr) => {
    const amount = parseFloat(curr.amount);
    if (curr.type === 'income') {
      acc.totalIncome += amount;
      acc.balance += amount;
    } else {
      acc.totalExpense += amount;
      acc.balance -= amount;
    }
    return acc;
  }, { balance: 0, totalIncome: 0, totalExpense: 0 });

  // Timeline Data
  const grouped = transactions.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) acc[date] = 0;
    acc[date] += curr.type === 'income' ? parseFloat(curr.amount) : -parseFloat(curr.amount);
    return acc;
  }, {});
  
  let currentBalance = 0;
  const timelineData = Object.entries(grouped)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, net]) => {
      currentBalance += net;
      return { date, balance: currentBalance };
    });

  // Category Data
  const expenses = transactions.filter(t => t.type === 'expense');
  const catGrouped = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});
  const categoryData = Object.entries(catGrouped).map(([name, value]) => ({ name, value }));

  return { ...stats, timelineData, categoryData };
};

export const calculateInsightsData = (transactions) => {
  if (transactions.length === 0) return null;

  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
    return acc;
  }, {});
  
  const topCategory = Object.keys(categoryTotals).length > 0 
    ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] 
    : ['None', 0];

  const largestExpense = expenses.length > 0 
    ? [...expenses].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))[0] 
    : { description: 'None', amount: 0 };

  const totalInc = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExp = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc * 100).toFixed(1) : 0;

  const monthlyDataMap = transactions.reduce((acc, curr) => {
    const month = curr.date.substring(0, 7);
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (curr.type === 'income') acc[month].income += parseFloat(curr.amount);
    else acc[month].expense += parseFloat(curr.amount);
    return acc;
  }, {});
  const monthlyFlowData = Object.values(monthlyDataMap).sort((a, b) => a.month.localeCompare(b.month));

  const averageDailySpend = (totalExp / 30).toFixed(2);
  const essentialCategories = ['Housing', 'Utilities', 'Groceries', 'Transportation'];
  
  let essentialExp = 0;
  expenses.forEach(t => {
    if (essentialCategories.includes(t.category)) {
      essentialExp += parseFloat(t.amount);
    }
  });
  const essentialPercentage = totalExp > 0 ? ((essentialExp / totalExp) * 100).toFixed(0) : 0;

  const heavyHitter = expenses.find(t => essentialCategories.includes(t.category) && parseFloat(t.amount) > 500);
  const upcomingInsight = heavyHitter 
    ? `Ensure you reserve at least $${parseFloat(heavyHitter.amount).toLocaleString()} for your expected ${heavyHitter.category} payment early next month.`
    : `Forecast looks stable! Set aside your daily average of $${averageDailySpend} per day moving forward.`;

  return { 
    topCategory, largestExpense, savingsRate, monthlyFlowData,
    averageDailySpend, essentialPercentage, upcomingInsight
  };
};
