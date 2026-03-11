import cron from "node-cron";
import User from "../model/User.js";
import transaction from "../model/transaction.js";

export const budgetreset = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const users = await User.find({});
            const now = new Date();
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);

            for (const user of users) {
                if (!user.monthlyincome || user.monthlyincome <= 0) continue;

                const todayTransactions = await transaction.find({
                    userId: user._id,
                    date: { $gte: todayStart }
                });

                const totalSpent = todayTransactions.reduce((acc, t) => acc + t.amount, 0);
                const dailyLimit = user.monthlyincome / 30;
                const savings = dailyLimit - totalSpent;

                if (savings > 0) {
                    const roundedSavings = Math.round(savings);
                    user.wallet = (user.wallet || 0) + roundedSavings;
                    user.savingsToday = roundedSavings;
                    user.lastAnimTime = now.getTime().toString(); 
                } else {
                    user.savingsToday = 0;
                }

                user.todayexpenses = 0; 
                const limitPerCategory = Math.round(dailyLimit / 3); 
                
                user.remainingbudget = {
                    food: limitPerCategory,
                    travelling: limitPerCategory,
                    others: limitPerCategory
                };

                user.budgetOver = { food: 0, travelling: 0, others: 0 };

                user.markModified('remainingbudget');
                user.markModified('budgetOver');
                user.markModified('wallet'); 

                await user.save();
            }
        } catch (err) {
            console.error("Cron Error:", err.message);
        }
    });
};