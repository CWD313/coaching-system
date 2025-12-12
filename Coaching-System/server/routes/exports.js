const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const XLSX = require('xlsx');

const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
router.get('/students', auth, async (req, res) => {
  try {
    const adminId = req.admin._id;

    const students = await Student.find({ admin: adminId }).lean();

    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    return res.send(buffer);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get('/attendance', auth, async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM
    if (!month) return res.status(400).json({ success: false, message: "Month is required" });

    const [year, mon] = month.split("-").map(Number);

    const adminId = req.admin._id;

    const attendance = await Attendance.find({
      admin: adminId,
      date: {
        $gte: new Date(year, mon - 1, 1),
        $lte: new Date(year, mon, 0),
      }
    }).lean();

    const worksheet = XLSX.utils.json_to_sheet(attendance);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", `attachment; filename=attendance-${month}.xlsx`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    return res.send(buffer);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
