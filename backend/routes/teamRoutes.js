// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const {
  createTeam,
  getAllTeams,
  updateScore,
  useHelpAid,
  getLeaderboard
} = require('../controllers/teamController');

// ➕ إضافة فريق
router.post('/', createTeam);

// 📥 جلب كل الفرق
router.get('/', getAllTeams);

// 🔁 تحديث نقاط فريق (مع team_id في URL)
router.put('/score/:id', updateScore);

// 🎯 استخدام مساعدة
router.put('/help-aid/:id', useHelpAid);

// 🏆 جلب لوحة المتصدرين
router.get('/leaderboard', getLeaderboard);

module.exports = router;