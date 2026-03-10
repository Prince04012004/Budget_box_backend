import cron from "node-cron";
import User from "../model/User.js";
import transaction from "../model/transaction.js";

export const budgetreset = () => {
    // Testing: Runs every 1 minute
    cron.schedule("* * * * *", async () => {
        try {
            const users = await User.find({});
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            for (const user of users) {
                // 1. Get transactions for the current period
                const todayTransactions = await transaction.find({
                    userId: user._id,
                    date: { $gte: todayStart }
                });

                const totalSpent = todayTransactions.reduce((acc, t) => acc + t.amount, 0);
                
                // 2. Calculate daily limit and savings
                const dailyLimit = (user.monthlyincome || 0) / 30;
                const savings = dailyLimit - totalSpent;

                // 3. Update savings and animation flag if user saved money
                if (savings > 0) {
                    user.savingsToday = Math.round(savings);
                    user.lastAnimTime = new Date().getTime().toString(); 
                    // Note: We don't add to wallet here because frontend handleCollect does it
                } else {
                    user.savingsToday = 0;
                }

                // 4. RESET for the next "cycle" (Refilling the budget)
                user.todayexpenses = 0; // Reset progress bar
                
                const limitPerCategory = dailyLimit / 3; 
                user.remainingbudget = {
                    food: limitPerCategory,
                    travelling: limitPerCategory,
                    others: limitPerCategory
                };

                user.budgetOver = { food: 0, travelling: 0, others: 0 };

                await user.save();
                console.log(`User ${user.email} budget refilled!`);
            }
        } catch (err) {
            console.error("Test Cron Error:", err.message);
        }
    });
};