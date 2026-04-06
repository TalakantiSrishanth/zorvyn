import Record from '../models/Record.js';

export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({error:'Amount, type, and category are required.'});
    }

    if (amount <= 0) {
      return res.status(400).json({error:'Amount must be greater than zero.'});
    }

    const doc = new Record({
      amount,
      type,
      category,
      date: date || new Date(),
      notes,
      createdBy: req.user._id
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error('Error creating record:', err);
    res.status(500).json({error:'Failed to create record'});
  }
};

export const fetchRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page, limit, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;

    if (search) {
      query.notes = { $regex: search, $options: 'i' };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const rows = await Record.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Record.countDocuments(query);

    res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: rows
    });
  } catch (err) {
    console.error('Error fetching records:', err);
    res.status(500).json({error:'Failed to fetch records'});
  }
};

export async function loadRecordById(req, res) {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({error:'Record not found'});
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({error:'Failed to fetch record'});
  }
}

export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Record.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({error:'Record not found'});
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).json({error:'Failed to update record'});
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const gone = await Record.findByIdAndDelete(id);

    if (!gone) {
      return res.status(404).json({error:'Record not found'});
    }

    res.json({message:'Record deleted successfully'});
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({error:'Invalid record ID format'});
    }
    res.status(500).json({error:'Failed to delete record'});
  }
};
