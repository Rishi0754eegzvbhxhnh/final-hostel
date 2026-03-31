const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');

const hostelSeedData = [
  { name: 'Campus Comfort PG', city: 'Delhi', area: 'Connaught Place', price: 4500, type: 'co-ed', rating: 4.5, foodIncluded: true, foodType: 'both', washrooms: 'shared', ac: false, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: false, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 0.5, description: 'Premium PG in heart of Delhi with all modern amenities' },
  { name: 'Student Haven Boys', city: 'Delhi', area: 'Nehru Place', price: 5200, type: 'boys', rating: 4.3, foodIncluded: true, foodType: 'nonveg', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: false, studyRoom: true, laundry: true, gym: true, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 1.2, description: 'AC rooms with attached bathrooms and gym' },
  { name: 'Girls Paradise PG', city: 'Delhi', area: 'Saket', price: 5800, type: 'girls', rating: 4.7, foodIncluded: true, foodType: 'veg', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: false, powerBackup: true, cleaning: true, distanceToCollege: 0.8, description: 'Safe and secure girls hostel with premium facilities' },
  { name: 'Tech Hub Residency', city: 'Bangalore', area: 'Whitefield', price: 6500, type: 'co-ed', rating: 4.6, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 2.0, description: 'Tech-friendly accommodation near IT hubs' },
  { name: 'Silicon Valley Boys', city: 'Bangalore', area: 'Koramangala', price: 7000, type: 'boys', rating: 4.4, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 1.5, description: 'Premium accommodation for tech students' },
  { name: 'Eco Stay Girls Hostel', city: 'Bangalore', area: 'HSR Layout', price: 4800, type: 'girls', rating: 4.2, foodIncluded: true, foodType: 'veg', washrooms: 'shared', ac: false, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: false, parking: false, powerBackup: true, cleaning: true, distanceToCollege: 1.0, description: 'Eco-friendly hostel with organic food options' },
  { name: 'Mumbai Youth PG', city: 'Mumbai', area: 'Andheri West', price: 5500, type: 'boys', rating: 4.3, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: false, studyRoom: true, laundry: true, gym: true, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 1.8, description: 'Premium boys PG near metro station' },
  { name: 'Coastal Comfort Girls', city: 'Mumbai', area: 'Juhu', price: 6200, type: 'girls', rating: 4.8, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: false, powerBackup: true, cleaning: true, distanceToCollege: 2.5, description: 'Beach-facing premium girls hostel' },
  { name: 'Heritage Stay PG', city: 'Jaipur', area: 'MI Road', price: 3800, type: 'co-ed', rating: 4.1, foodIncluded: true, foodType: 'veg', washrooms: 'shared', ac: false, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: false, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 0.5, description: 'Budget-friendly accommodation in Pink City' },
  { name: 'Royal Residency', city: 'Jaipur', area: 'C-Scheme', price: 4500, type: 'boys', rating: 4.4, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 1.0, description: 'Royal treatment with AC rooms' },
  { name: 'Lake View Girls PG', city: 'Hyderabad', area: 'Jubilee Hills', price: 5200, type: 'girls', rating: 4.6, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: false, powerBackup: true, cleaning: true, distanceToCollege: 1.5, description: 'Scenic location with premium facilities' },
  { name: 'Cyber Towers Boys', city: 'Hyderabad', area: 'Madhapur', price: 5800, type: 'boys', rating: 4.5, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 0.8, description: 'Perfect for tech students in Cyberabad' },
  { name: 'Budget Stay Chennai', city: 'Chennai', area: 'Anna Nagar', price: 4000, type: 'boys', rating: 4.0, foodIncluded: true, foodType: 'veg', washrooms: 'shared', ac: false, wifi: true, security: true, lateGate: false, studyRoom: true, laundry: true, gym: false, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 0.5, description: 'Affordable accommodation with pure veg food' },
  { name: 'Marina View Girls', city: 'Chennai', area: 'Adyar', price: 5500, type: 'girls', rating: 4.7, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: false, powerBackup: true, cleaning: true, distanceToCollege: 2.0, description: 'Premium girls hostel with beach proximity' },
  { name: 'Pune Tech Hub', city: 'Pune', area: 'Hinjewadi', price: 4800, type: 'co-ed', rating: 4.3, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: true, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 1.0, description: 'Perfect for IT professionals' },
  { name: 'Goa Beach PG', city: 'Goa', area: 'Anjuna', price: 6000, type: 'co-ed', rating: 4.5, foodIncluded: true, foodType: 'both', washrooms: 'attached', ac: true, wifi: true, security: true, lateGate: true, studyRoom: true, laundry: true, gym: false, parking: true, powerBackup: true, cleaning: true, distanceToCollege: 5.0, description: 'Beach-style accommodation with Goa vibes' }
];

router.post('/seed', async (req, res) => {
  try {
    const count = await Hostel.countDocuments();
    if (count > 0) return res.json({ success: true, message: 'Already seeded', count });
    await Hostel.insertMany(hostelSeedData);
    res.json({ success: true, message: 'Seeded', count: hostelSeedData.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const count = await Hostel.countDocuments();
    if (count === 0) await Hostel.insertMany(hostelSeedData);
    const hostels = await Hostel.find();
    res.json({ success: true, count: hostels.length, hostels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/cities', async (req, res) => {
  try {
    const cities = await Hostel.distinct('city');
    const areas = await Hostel.distinct('area');
    res.json({ success: true, cities, areas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/city/:city', async (req, res) => {
  try {
    const hostels = await Hostel.find({ city: req.params.city, isAvailable: true });
    res.json({ success: true, count: hostels.length, hostels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/recommend', async (req, res) => {
  try {
    const { budget, city, area, foodType, washrooms, ac, wifi, security, lateGate, studyRoom, laundry, gym, hostelType } = req.body;

    let query = { isAvailable: true };
    if (city) query.city = city;
    if (area) query.area = area;
    if (budget) query.price = { $lte: parseInt(budget) };
    if (washrooms && washrooms !== 'any') query.washrooms = washrooms;
    if (ac) query.ac = true;
    if (security) query.security = true;
    if (lateGate) query.lateGate = true;
    if (studyRoom) query.studyRoom = true;
    if (laundry) query.laundry = true;
    if (gym) query.gym = true;
    if (hostelType) query.type = hostelType;

    let hostels = await Hostel.find(query);
    if (hostels.length === 0) hostels = await Hostel.find({ isAvailable: true });

    const scoredHostels = hostels.map(hostel => {
      let score = 0;
      const reasons = [];

      if (budget && hostel.price <= budget) {
        const savings = ((budget - hostel.price) / budget) * 100;
        score += Math.min(30, savings);
        reasons.push(`Save ₹${budget - hostel.price}`);
      }

      if (hostel.foodIncluded) { score += 15; reasons.push('Meals included'); }
      if (foodType === 'veg' && (hostel.foodType === 'veg' || hostel.foodType === 'both')) { score += 10; reasons.push('Veg food'); }
      if (washrooms === 'attached' && hostel.washrooms === 'attached') { score += 15; reasons.push('Attached bath'); }
      if (ac && hostel.ac) { score += 12; reasons.push('AC rooms'); }
      if (wifi && hostel.wifi) { score += 8; reasons.push('Free WiFi'); }
      if (security && hostel.security) { score += 10; reasons.push('24/7 Security'); }
      if (lateGate && hostel.lateGate) { score += 8; reasons.push('Late gate'); }
      if (studyRoom && hostel.studyRoom) { score += 10; reasons.push('Study room'); }
      if (laundry && hostel.laundry) { score += 5; reasons.push('Laundry'); }
      if (gym && hostel.gym) { score += 5; reasons.push('Gym'); }

      score += hostel.rating * 5;

      const facilities = [];
      if (hostel.ac) facilities.push('AC');
      if (hostel.wifi) facilities.push('WiFi');
      if (hostel.security) facilities.push('Security');
      if (hostel.laundry) facilities.push('Laundry');
      if (hostel.gym) facilities.push('Gym');
      if (hostel.parking) facilities.push('Parking');
      if (hostel.powerBackup) facilities.push('Power Backup');

      return {
        ...hostel.toObject(),
        matchScore: Math.round(score),
        matchReasons: reasons.slice(0, 4),
        facilities
      };
    });

    scoredHostels.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: scoredHostels.length,
      recommendations: scoredHostels.slice(0, 10),
      totalMatches: scoredHostels.length
    });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const hostels = await Hostel.find({
      isAvailable: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { area: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.json({ success: true, count: hostels.length, hostels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
