const Record = require('../models/Record');

const getJobRecords = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, search } = req.query;

    const query = { sourceJob: jobId };

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const records = await Record.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 }); 

    const total = await Record.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalRecords: total
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobRecords };