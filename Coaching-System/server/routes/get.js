router.get('/summary', auth, async (req, res) => {
    try {
        // Promise.all का उपयोग करें ताकि सभी queries एक साथ चलें
        const [
            totalStudents,
            monthlyAttendanceData,
            recentTests,
            adminUser
        ] = await Promise.all([
            // 1. कुल छात्रों की संख्या
            Student.countDocuments({ /* फ़िल्टर यहाँ जोड़ें */ }),

            // 2. मासिक उपस्थिति का सारांश (उदाहरण)
            getMonthlyAttendanceSummary(), 

            // 3. हालिया टेस्ट (उदाहरण: पिछले 5)
            Test.find({})
                .sort({ date: -1 })
                .limit(5)
                .select('name date scoreAverage'),
            
            // 4. प्लान की जानकारी (Auth से प्राप्त यूजर/एडमिन)
            User.findById(req.user._id)
                .select('subscriptionStatus currentPlanId coachingPlanName') 
        ]);

        // 5. सभी डेटा को एक सिंगल JSON ऑब्जेक्ट के रूप में वापस भेजें
        res.json({
            success: true,
            totalStudents: totalStudents,
            monthlyAttendanceSummary: monthlyAttendanceData,
            recentTests: recentTests,
            planInfo: {
                status: adminUser.subscriptionStatus,
                planId: adminUser.currentPlanId,
                planName: adminUser.coachingPlanName,
            }
        });

    } catch (error) {
        console.error('Dashboard Summary Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;