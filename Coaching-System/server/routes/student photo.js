router.post('/student-photo/:studentId', auth, upload.single('photo'), async (req, res) => {
  try {
    const file = req.file;
    const { studentId } = req.params;

    const student = await Student.findOne({ _id: studentId, admin: req.admin._id });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const key = `students/${studentId}-${Date.now()}.jpg`;

    const result = await uploadToS3(file.buffer, key, file.mimetype);

    student.photoUrl = result.Location;
    await student.save();

    res.json({ success: true, url: result.Location });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
