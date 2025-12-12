router.post('/logo', auth, upload.single('logo'), async (req, res) => {
  try {
    const file = req.file;

    const key = `logos/${req.admin._id}-${Date.now()}.jpg`;

    const result = await uploadToS3(file.buffer, key, file.mimetype);

    req.admin.coaching.logoUrl = result.Location;
    await req.admin.save();

    res.json({ success: true, url: result.Location });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
