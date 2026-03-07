import cron from "node-cron";
import User from "../model/User.js";
import transaction from "../model/transaction.js";

export const budgetreset = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const users = await User.find({});
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const user of users) {
                const todaytransactions = await transaction.find({
                    userId: user._id,
                    date: { $gte: today }
                });

                const totalspenttoday = todaytransactions.reduce((acc, t) => acc + t.amount, 0);
                const dailylimit = (user.dailybudget.food || 0) + (user.dailybudget.travelling || 0) + (user.dailybudget.others || 0);
                const savings = dailylimit - totalspenttoday;

                if (savings > 0) {
                    user.wallet = (user.wallet || 0) + savings;
                    user.savingsToday = savings;
                    user.lastAnimTime = new Date().getTime().toString();
                }

                user.budgetOver = { food: 0, travelling: 0, others: 0 };
                await user.save();
            }
        } catch (err) {
            console.error(err.message);
        }
    });
};