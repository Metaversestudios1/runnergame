const history = require("../../Models/Aviator/AviatorHistory");
const bcrypt = require("bcrypt");

const getAllaviatorhistory = async (req, res) => {
  try {
    //console.log("getAllaviatorhistory endpoint was hit");
    const pageSize = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const search = req.query.search;

    const query = {
      deleted_at: null,
    };
    // if (search) {
    //   query.totalBet = { $regex: search, $options: "i" };
    // }

    // If search is provided, handle it as a numeric range or exact match
    if (search) {
      const searchValue = parseFloat(search);
      if (!isNaN(searchValue)) {
        query.totalBet = searchValue;
      }
    }
    //console.log("query", query);
    const result = await history
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await history.find(query).countDocuments();
    res.status(200).json({ success: true, result, count });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error geting aviation history" });
  }
};

module.exports = {
  getAllaviatorhistory,
};
