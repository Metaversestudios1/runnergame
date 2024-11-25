const LeaderBoard = require("../Models/LeaderBoard");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

const global = async (req, res) => {
    try {
        console.log('Fetching global leaderboard...');
        
        // Fetch the top 10 players sorted by highScore
        const leaderboard = await LeaderBoard.find()
            .sort({ highScore: -1 }) // Sort by highScore in descending order
            .limit(10) // Limit to the top 10 players
            .populate('userId', 'username') // Fetch the username from the related user document
        
        // Map to include ranks
        const leaderboardWithRanks = leaderboard.map((player, index) => ({
            rank: index + 1,
            username: player.userId.username,
            highScore: player.highScore
        }));

        res.status(200).json({
            success: true,
            message: "Top players fetched successfully",
            leaderboard: leaderboardWithRanks
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching global leaderboard",
            error: err.message
        });
    }
};
const friend = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Headers: ", req.headers.authorization);
        // Validate Authorization header
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing or improperly formatted",
            });
        }

        // 1. Verify the user's token (to get the authenticated user)
        const token =authHeader.split(' ')[1]; // Assuming the token is passed as "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret key
       
        const userId = decoded.userId; // Get the userId from the token
        console.log(decoded)
        // 2. Fetch the user's friends from the User model
        const user = await User.findById(userId); // Populate friend data
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 3. Get the friends' leaderboard data from the Leaderboard collection
        const friendsLeaderboard = await LeaderBoard.find({
            userId: { $in: user.friends.map(friend => friend._id) } // Match friends' userIds
        })
            .sort({ highScore: -1 }) // Sort by high score
            .limit(10) // Limit to top 10 friends
            .populate('userId', 'username'); // Populate usernames from the User model

        // 4. Format the leaderboard response with ranks
        const leaderboardWithRanks = friendsLeaderboard.map((player, index) => ({
            rank: index + 1,
            username: player.userId.username,
            highScore: player.highScore
        }));

        // 5. Send the response with leaderboard data
        res.status(200).json({
            success: true,
            message: 'Top friends leaderboard fetched successfully',
            leaderboard: leaderboardWithRanks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error fetching friends leaderboard',
            error: err.message
        });
    }
};

const updateLeaderboard = async(req, res) => {
    const { userId, highScore } = req.body;
    try {
        // Use updateOne with upsert option
        await LeaderBoard.updateOne(
            { userId }, // filter by userId
            { $set: { highScore } }, // update the highScore
            { upsert: true } // if the document doesn't exist, create it
        );
        res.status(200).json({ success: true, message: "Leaderboard updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update leaderboard", error: err.message });
    }
}


module.exports = {
  friend,
  global,
  updateLeaderboard
};
