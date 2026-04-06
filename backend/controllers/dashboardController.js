import Record from '../models/Record.js';

export const loadDashboardSummary = async (req, res) => {
  try {
    const totals = await Record.aggregate([
      { $group: { _id: '$type', totalAmount: { $sum: '$amount' } } }
    ]);

    let income = 0;
    let expenses = 0;
    totals.forEach((row) => {
      if (row._id === 'income') income = row.totalAmount;
      if (row._id === 'expense') expenses = row.totalAmount;
    });

    const netBalance = income - expenses;

    const categoryTotals = await Record.aggregate([
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const recentActivity = await Record.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    const year = new Date().getFullYear();
    const monthlyTrends = await Record.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    res.json({
      summary: { income, expenses, netBalance },
      categoryTotals: categoryTotals.map((c) => ({
        type: c._id.type,
        category: c._id.category,
        total: c.total
      })),
      monthlyTrends: monthlyTrends.map((t) => ({
        month: t._id.month,
        type: t._id.type,
        total: t.total
      })),
      recentActivity
    });
  } catch (err) {
    console.error('Dashboard aggregation error:', err);
    res.status(500).json({error:'Failed to generate dashboard summary'});
  }
};
