// यह फ़ंक्शन router.get के बाहर (फाइल के अंदर कहीं भी) डिफाइन किया जाएगा
async function getMonthlyAttendanceSummary() {
    // 3 महीने पीछे तक का डेटा
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    try {
        const result = await Attendance.aggregate([
            {
                // सिर्फ़ हालिया डेटा फ़िल्टर करें
                $match: { date: { $gte: threeMonthsAgo } }
            },
            {
                // Month और Year के हिसाब से ग्रुप करें
                $group: {
                    _id: { 
                        month: { $month: "$date" }, 
                        year: { $year: "$date" } 
                    },
                    totalPresent: { $sum: "$presentCount" }, // मान लीजिए आपके मॉडल में presentCount है
                    totalAbsent: { $sum: "$absentCount" }
                }
            },
            {
                // Month और Year के आधार पर सॉर्ट करें
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        
        return result;

    } catch (error) {
        console.error("Attendance Aggregation Error:", error);
        return [];
    }
}