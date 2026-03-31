const express = require('express');
const router = express.Router();

const sampleData = {
  hostels: [
    {
      id: 'H001',
      name: 'Green Valley PG',
      city: 'Bangalore',
      address: 'HSR Layout, Sector 2, Bangalore',
      rating: 4.5,
      price: 6500,
      forGender: 'Girls',
      images: {
        cover: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'
        ]
      },
      facilities: ['AC', 'WiFi', 'Meals Included', 'Laundry', 'Security', 'Power Backup'],
      amenities: { bathrooms: 4, washingMachines: 2, dryingArea: true, terrace: true, lift: true },
      acSupport: true,
      foodIncluded: true,
      securityLevel: 'High',
      distance: '2 km from college'
    },
    {
      id: 'H002',
      name: 'Sunrise Residency',
      city: 'Mumbai',
      address: 'Andheri East, Near Metro Station',
      rating: 4.2,
      price: 8000,
      forGender: 'Boys',
      images: {
        cover: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'
        ]
      },
      facilities: ['AC', 'WiFi', 'Meals Included', 'Gym', 'Parking', 'Security'],
      amenities: { bathrooms: 6, washingMachines: 3, dryingArea: true, terrace: true, lift: true },
      acSupport: true,
      foodIncluded: true,
      securityLevel: 'Very High',
      distance: '1.5 km from college'
    },
    {
      id: 'H003',
      name: 'Student Nest',
      city: 'Delhi',
      address: 'North Campus, Delhi University',
      rating: 4.7,
      price: 5500,
      forGender: 'Both',
      images: {
        cover: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
          'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600',
          'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600'
        ]
      },
      facilities: ['WiFi', 'Meals Included', 'Study Room', 'Library Access', 'Security'],
      amenities: { bathrooms: 5, washingMachines: 2, dryingArea: true, terrace: false, lift: false },
      acSupport: false,
      foodIncluded: true,
      securityLevel: 'Medium',
      distance: '500m from college'
    },
    {
      id: 'H004',
      name: 'Cozy Stay',
      city: 'Hyderabad',
      address: 'Gachibowli, Near IT Hub',
      rating: 4.3,
      price: 7000,
      forGender: 'Girls',
      images: {
        cover: 'https://images.unsplash.com/photo-1598928506311-c55ez331f9a0?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1598928506311-c55ez331f9a0?w=600',
          'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'
        ]
      },
      facilities: ['AC', 'WiFi', 'Meals Included', 'Hot Water', 'Housekeeping', 'Security'],
      amenities: { bathrooms: 4, washingMachines: 2, dryingArea: true, terrace: true, lift: true },
      acSupport: true,
      foodIncluded: true,
      securityLevel: 'High',
      distance: '3 km from college'
    },
    {
      id: 'H005',
      name: 'Urban Living',
      city: 'Pune',
      address: 'Kothrud, Near MIT Campus',
      rating: 4.6,
      price: 6000,
      forGender: 'Boys',
      images: {
        cover: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
          'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600'
        ]
      },
      facilities: ['WiFi', 'Meals Included', 'Sports Area', 'Garden', 'Security'],
      amenities: { bathrooms: 5, washingMachines: 3, dryingArea: true, terrace: true, lift: false },
      acSupport: false,
      foodIncluded: true,
      securityLevel: 'High',
      distance: '1 km from college'
    },
    {
      id: 'H006',
      name: 'Royal PG',
      city: 'Chennai',
      address: 'Anna Nagar, Near College',
      rating: 4.4,
      price: 5800,
      forGender: 'Girls',
      images: {
        cover: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=1200',
        gallery: [
          'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600'
        ]
      },
      facilities: ['AC', 'WiFi', 'Meals Included', 'Vegetarian', 'Security', 'Parking'],
      amenities: { bathrooms: 4, washingMachines: 2, dryingArea: true, terrace: true, lift: true },
      acSupport: true,
      foodIncluded: true,
      securityLevel: 'High',
      distance: '800m from college'
    }
  ],

  rooms: [
    {
      id: 'R001',
      roomNumber: '101',
      floor: 1,
      type: 'single',
      price: 5500,
      size: '12x14 sqft',
      capacity: 1,
      currentOccupancy: 1,
      ac: true,
      attachedBathroom: true,
      windowView: 'Garden View',
      amenities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'AC', 'WiFi', 'Curtains'],
      images: {
        main: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
          'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'
        ]
      },
      has360View: true,
      view360Url: '/360/room101.html'
    },
    {
      id: 'R002',
      roomNumber: '102',
      floor: 1,
      type: 'shared',
      price: 4000,
      size: '14x16 sqft',
      capacity: 2,
      currentOccupancy: 2,
      ac: false,
      attachedBathroom: false,
      windowView: 'Street View',
      amenities: ['Bed x2', 'Study Table x2', 'Wardrobe x2', 'Fan', 'WiFi', 'Dustbin'],
      images: {
        main: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
          'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'
        ]
      },
      has360View: false
    },
    {
      id: 'R003',
      roomNumber: '201',
      floor: 2,
      type: 'single',
      price: 6000,
      size: '12x14 sqft',
      capacity: 1,
      currentOccupancy: 0,
      ac: true,
      attachedBathroom: true,
      windowView: 'Pool View',
      amenities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'AC', 'WiFi', 'Mini Fridge', 'Balcony'],
      images: {
        main: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600',
          'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600'
        ]
      },
      has360View: true,
      view360Url: '/360/room201.html'
    },
    {
      id: 'R004',
      roomNumber: '202',
      floor: 2,
      type: 'double',
      price: 4500,
      size: '14x16 sqft',
      capacity: 2,
      currentOccupancy: 1,
      ac: true,
      attachedBathroom: true,
      windowView: 'City View',
      amenities: ['Bed x2', 'Study Table x2', 'Wardrobe x2', 'AC', 'WiFi', 'Fan'],
      images: {
        main: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
          'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600',
          'https://images.unsplash.com/photo-1598928506311-c55ez331f9a0?w=600'
        ]
      },
      has360View: false
    },
    {
      id: 'R005',
      roomNumber: '301',
      floor: 3,
      type: 'single',
      price: 5000,
      size: '10x12 sqft',
      capacity: 1,
      currentOccupancy: 1,
      ac: false,
      attachedBathroom: false,
      windowView: 'Backyard View',
      amenities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'WiFi'],
      images: {
        main: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600',
          'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600'
        ]
      },
      has360View: false
    },
    {
      id: 'R006',
      roomNumber: '302',
      floor: 3,
      type: 'premium',
      price: 7500,
      size: '16x18 sqft',
      capacity: 1,
      currentOccupancy: 0,
      ac: true,
      attachedBathroom: true,
      windowView: 'Terrace View',
      amenities: ['Bed', 'Study Table', 'Wardrobe', 'AC', 'WiFi', 'Mini Fridge', 'Balcony', 'TV', 'Sofa'],
      images: {
        main: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',
        gallery: [
          'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'
        ]
      },
      has360View: true,
      view360Url: '/360/room302.html'
    }
  ],
  
  facilities: {
    bathrooms: [
      { id: 'B001', floor: 1, type: 'attached', images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'], features: ['Western Toilet', 'Shower', 'Hot Water', 'Tiles'] },
      { id: 'B002', floor: 1, type: 'common', images: ['https://images.unsplash.com/photo-1620626011761-996317702508?w=600'], features: ['2 Western Toilets', '2 Showers', 'Hot Water'] },
      { id: 'B003', floor: 2, type: 'attached', images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600'], features: ['Western Toilet', 'Shower', 'Hot Water', 'Tiles', 'Mirror'] },
      { id: 'B004', floor: 2, type: 'common', images: ['https://images.unsplash.com/photo-1620626011761-996317702508?w=600'], features: ['2 Western Toilets', '2 Showers', 'Geyser'] },
      { id: 'B005', floor: 3, type: 'attached', images: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600'], features: ['Western Toilet', 'Shower', 'Hot Water'] }
    ],
    washingMachines: [
      { id: 'WM001', location: 'Ground Floor', type: 'automatic', capacity: '7kg', status: 'available', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', lastUsed: '2 hours ago' },
      { id: 'WM002', location: 'Ground Floor', type: 'automatic', capacity: '7kg', status: 'in_use', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', remainingTime: '25 mins' },
      { id: 'WM003', location: 'First Floor', type: 'automatic', capacity: '8kg', status: 'available', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', lastUsed: '30 mins ago' },
      { id: 'WM004', location: 'Second Floor', type: 'semi-automatic', capacity: '6kg', status: 'available', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', lastUsed: '5 hours ago' }
    ],
    dryingAreas: [
      { id: 'DA001', location: 'Terrace', floor: 4, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'], hasClothLines: true, hasHangers: true, hasRopes: true, capacity: '20 persons' },
      { id: 'DA002', location: 'Second Floor Balcony', floor: 2, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], hasClothLines: true, hasHangers: false, hasRopes: true, capacity: '5 persons' },
      { id: 'DA003', location: 'First Floor Back', floor: 1, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'], hasClothLines: true, hasHangers: true, hasRopes: false, capacity: '8 persons' }
    ],
    terraces: [
      { id: 'T001', floor: 4, size: '2000 sqft', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'], facilities: ['Sitting Area', 'Garden', 'Cloth Drying', 'Solar Panels'], openHours: '6 AM - 10 PM' },
      { id: 'T002', floor: 5, size: '1500 sqft', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], facilities: ['Yoga Area', 'Garden', 'Star Gazing'], openHours: '6 AM - 9 PM' }
    ],
    commonAreas: [
      { id: 'CA001', name: 'Washing Area', images: ['https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800'], location: 'Ground Floor', facilities: ['Washing Machines', 'Sink', 'Drying Racks'] },
      { id: 'CA002', name: 'Study Hall', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], location: 'Second Floor', capacity: 30, facilities: ['Tables', 'Chairs', 'WiFi', 'Fans', 'Emergency Lights'] },
      { id: 'CA003', name: 'Common TV Room', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'], location: 'First Floor', capacity: 15, facilities: ['55 inch TV', 'Sofa', 'AC'] },
      { id: 'CA004', name: 'Guest Room', images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'], location: 'Ground Floor', capacity: 4, facilities: ['Bed', 'AC', 'Attached Bath'] },
      { id: 'CA005', name: 'Recreation Room', images: ['https://images.unsplash.com/photo-1615873968403-89e068629265?w=800'], location: 'Ground Floor', facilities: ['Table Tennis', 'Carrom', 'Chess', 'Ludo'] }
    ],
    lifts: { available: true, floors: [1, 2, 3, 4, 5], capacity: '6 persons', lastServiced: '2026-01-15', type: 'Otis Elevator' },
    security: {
      cctv: true, cctvCount: 24,
      securityGuard: true, guardTiming: '24/7', guardCount: 3,
      biometricEntry: true,
      fireSafety: true, fireExtinguishers: 12, fireAlarms: 8,
      emergencyExit: 4, emergencyLights: true
    },
    sanitation: {
      cleaningSchedule: 'Daily',
      lastPestControl: '2026-03-01',
      nextPestControl: '2026-04-01',
      garbageCollection: 'Twice daily',
      waterSupply: '24/7 Borewell + Municipal',
      waterPurifier: true, roWater: true
    }
  },

  foodMenu: {
    monday: {
      breakfast: { time: '7:30 AM - 9:00 AM', items: ['Idli (4 pcs)', 'Vada (2 pcs)', 'Sambar', 'Chutney (Coconut + Tomato)', 'Coffee/Tea/Milk'], image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600' },
      lunch: { time: '12:00 PM - 2:00 PM', items: ['Steamed Rice', 'Dal Fry', 'Mix Vegetable Curry', 'Roti (4 pcs)', 'Salad', 'Rasam', 'Papad'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' },
      dinner: { time: '7:30 PM - 9:00 PM', items: ['Chapati (4 pcs)', 'Paneer Butter Masala', 'Jeera Rice', 'Curd', 'Sweet (Gulab Jamun 2 pcs)'], image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600' }
    },
    tuesday: {
      breakfast: { time: '7:30 AM - 9:00 AM', items: ['Puri (4 pcs)', 'Aloo Sabzi', 'Channa Dal', 'Tea/Milk'], image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600' },
      lunch: { time: '12:00 PM - 2:00 PM', items: ['Veg Biryani', 'Raita', 'Bonda', 'Papad', 'Salad'], image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600' },
      dinner: { time: '7:30 PM - 9:00 PM', items: ['Curd Rice', 'Kootu', 'Pickle', 'Banana', 'Salad'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600' }
    },
    wednesday: {
      breakfast: { time: '7:30 AM - 9:00 AM', items: ['Masala Dosa', 'Sambar', 'Chutney (Coconut)', 'Coffee/Tea'], image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600' },
      lunch: { time: '12:00 PM - 2:00 PM', items: ['Roti (4 pcs)', 'Rajma', 'Steamed Rice', 'Cucumber Raita', 'Onion', 'Salad'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' },
      dinner: { time: '7:30 PM - 9:00 PM', items: ['Fried Rice', 'Veg Manchurian', 'Curd', 'Ice Cream (1 scoop)'], image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600' }
    },
    thursday: {
      breakfast: { time: '7:30 AM - 9:00 AM', items: ['Upma', 'Kesari Bath', 'Coffee/Tea'], image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600' },
      lunch: { time: '12:00 PM - 2:00 PM', items: ['Steamed Rice', 'Sambar', 'Avial', 'Pappad', 'Buttermilk', 'Salad'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600' },
      dinner: { time: '7:30 PM - 9:00 PM', items: ['Naan (4 pcs)', 'Butter Chicken', 'Jeera Rice', 'Salad', 'Sweet (Rasmalai 1 pc)'], image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600' }
    },
    friday: {
      breakfast: { time: '7:30 AM - 9:00 AM', items: ['Poha', 'Sev', 'Banana', 'Tea/Milk'], image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600' },
      lunch: { time: '12:00 PM - 2:00 PM', items: ['Curd Rice', 'Thoran', 'Pickle', 'Banana', 'Salad'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600' },
      dinner: { time: '7:30 PM - 9:00 PM', items: ['Roti (4 pcs)', 'Dal Makhani', 'Steamed Rice', 'Gulab Jamun (2 pcs)'], image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600' }
    },
    saturday: {
      breakfast: { time: '8:00 AM - 10:00 AM', items: ['Masala Dosa', 'Sambar', 'Chutney', 'Coffee'], image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600' },
      lunch: { time: '1:00 PM - 3:00 PM', items: ['Veg Pulav', 'Curd', 'Pappad', 'Sweet (Jalebi 4 pcs)', 'Raita'], image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600' },
      dinner: { time: '8:00 PM - 10:00 PM', items: ['Roti (4 pcs)', 'Kadai Paneer', 'Steamed Rice', 'Custard'], image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600' }
    },
    sunday: {
      breakfast: { time: '8:00 AM - 10:30 AM', items: ['Bread Omelette (2 eggs)', 'Toast', 'Butter', 'Cereal', 'Juice', 'Coffee/Tea'], image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600' },
      lunch: { time: '1:00 PM - 3:00 PM', items: ['Special Chicken Biryani', 'Raita', 'Salan', 'Crispy Papad', 'Ice Cream (2 scoops)', 'Salad'], image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600' },
      dinner: { time: '8:00 PM - 10:00 PM', items: ['Pasta (White Sauce)', 'Garlic Bread', 'Garden Salad', 'Brownie'], image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600' }
    }
  },

  transactions: [
    { id: 'TX001', studentName: 'Rahul Kumar', studentId: 'STU001', room: '101', amount: 5500, type: 'rent', date: '2026-03-01', status: 'paid', method: 'UPI', transactionId: 'UPI123456789' },
    { id: 'TX002', studentName: 'Priya Sharma', studentId: 'STU002', room: '201', amount: 6000, type: 'rent', date: '2026-03-01', status: 'paid', method: 'Card', transactionId: 'CARD987654321' },
    { id: 'TX003', studentName: 'Amit Singh', studentId: 'STU003', room: '102', amount: 4000, type: 'rent', date: '2026-03-01', status: 'pending', method: null, transactionId: null },
    { id: 'TX004', studentName: 'Rahul Kumar', studentId: 'STU001', room: '101', amount: 450, type: 'electricity', date: '2026-02-28', status: 'paid', method: 'UPI', transactionId: 'UPI123456790' },
    { id: 'TX005', studentName: 'Priya Sharma', studentId: 'STU002', room: '201', amount: 2500, type: 'mess', date: '2026-03-05', status: 'paid', method: 'Wallet', transactionId: 'WALLET111222' },
    { id: 'TX006', studentName: 'Neha Patel', studentId: 'STU004', room: '302', amount: 7500, type: 'rent', date: '2026-03-10', status: 'paid', method: 'Net Banking', transactionId: 'NB333444555' },
    { id: 'TX007', studentName: 'Vikram Reddy', studentId: 'STU005', room: '301', amount: 6000, type: 'rent', date: '2026-03-01', status: 'pending', method: null, transactionId: null },
    { id: 'TX008', studentName: 'Sneha Gupta', studentId: 'STU006', room: '202', amount: 5500, type: 'rent', date: '2026-03-01', status: 'paid', method: 'UPI', transactionId: 'UPI666777888' },
    { id: 'TX009', studentName: 'Arjun Nair', studentId: 'STU007', room: '105', amount: 450, type: 'electricity', date: '2026-03-15', status: 'paid', method: 'Cash', transactionId: 'CASH999000' },
    { id: 'TX010', studentName: 'Priya Sharma', studentId: 'STU002', room: '201', amount: 600, type: 'maintenance', date: '2026-03-20', status: 'paid', method: 'UPI', transactionId: 'UPI111222333' }
  ],

  notifications: [
    { id: 'N001', studentName: 'Amit Singh', email: 'amit.singh@email.com', phone: '+919876543210', type: 'payment_reminder', message: 'Rent payment of ₹4000 is due for March 2026. Please pay within 3 days to avoid late fee.', sentVia: ['email', 'sms'], sentAt: '2026-03-25 10:00 AM', status: 'delivered' },
    { id: 'N002', studentName: 'Rahul Kumar', email: 'rahul.kumar@email.com', phone: '+919876543211', type: 'payment_reminder', message: 'Electricity bill of ₹450 is due. Please clear your dues.', sentVia: ['email'], sentAt: '2026-03-26 09:00 AM', status: 'delivered' },
    { id: 'N003', studentName: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+919876543212', type: 'maintenance', message: 'Water tank cleaning scheduled for March 30, 2026 from 10 AM to 12 PM. Water supply will be temporarily unavailable.', sentVia: ['sms'], sentAt: '2026-03-27 11:00 AM', status: 'pending' },
    { id: 'N004', studentName: 'Vikram Reddy', email: 'vikram.reddy@email.com', phone: '+919876543213', type: 'payment_reminder', message: 'Your rent of ₹6000 is overdue by 26 days. Please make immediate payment to avoid service disconnection.', sentVia: ['email', 'sms', 'whatsapp'], sentAt: '2026-03-27 08:00 AM', status: 'delivered' },
    { id: 'N005', studentName: 'All Students', email: 'broadcast@hostel.com', phone: '+919876543000', type: 'announcement', message: 'Mess will remain closed on April 1st (Wednesday) on account of Ugadi. Please make alternative arrangements.', sentVia: ['email', 'sms', 'whatsapp'], sentAt: '2026-03-28 06:00 PM', status: 'delivered' },
    { id: 'N006', studentName: 'Neha Patel', email: 'neha.patel@email.com', phone: '+919876543214', type: 'booking', message: 'Welcome to Green Valley PG! Your check-in is confirmed for April 1st. Please carry 2 photos and ID proof.', sentVia: ['email', 'sms'], sentAt: '2026-03-28 09:00 AM', status: 'delivered' },
    { id: 'N007', studentName: 'Sneha Gupta', email: 'sneha.gupta@email.com', phone: '+919876543215', type: 'payment_reminder', message: 'Your mess fee of ₹5500 is due on April 5th. Please maintain sufficient balance.', sentVia: ['email'], sentAt: '2026-03-29 10:00 AM', status: 'sent' }
  ],

  bookings: [
    { id: 'BK001', studentName: 'Rahul Kumar', email: 'rahul.kumar@email.com', phone: '+919876543211', studentId: 'STU001', room: '101', checkIn: '2026-01-15', checkOut: '2027-01-14', status: 'active', paymentStatus: 'paid', advancePaid: 55000 },
    { id: 'BK002', studentName: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+919876543212', studentId: 'STU002', room: '201', checkIn: '2026-02-01', checkOut: '2027-01-31', status: 'active', paymentStatus: 'paid', advancePaid: 60000 },
    { id: 'BK003', studentName: 'Amit Singh', email: 'amit.singh@email.com', phone: '+919876543210', studentId: 'STU003', room: '102', checkIn: '2026-01-20', checkOut: '2027-01-19', status: 'active', paymentStatus: 'pending', advancePaid: 40000 },
    { id: 'BK004', studentName: 'Neha Patel', email: 'neha.patel@email.com', phone: '+919876543214', studentId: 'STU004', room: '302', checkIn: '2026-04-01', checkOut: '2027-03-31', status: 'upcoming', paymentStatus: 'partial', advancePaid: 37500 },
    { id: 'BK005', studentName: 'Vikram Reddy', email: 'vikram.reddy@email.com', phone: '+919876543213', studentId: 'STU005', room: '301', checkIn: '2026-01-10', checkOut: '2027-01-09', status: 'active', paymentStatus: 'pending', advancePaid: 50000 },
    { id: 'BK006', studentName: 'Sneha Gupta', email: 'sneha.gupta@email.com', phone: '+919876543215', studentId: 'STU006', room: '202', checkIn: '2026-02-15', checkOut: '2027-02-14', status: 'active', paymentStatus: 'paid', advancePaid: 45000 },
    { id: 'BK007', studentName: 'Arjun Nair', email: 'arjun.nair@email.com', phone: '+919876543216', studentId: 'STU007', room: '105', checkIn: '2025-12-01', checkOut: '2026-11-30', status: 'active', paymentStatus: 'paid', advancePaid: 55000 },
    { id: 'BK008', studentName: 'Kavya Nair', email: 'kavya.nair@email.com', phone: '+919876543217', studentId: 'STU008', room: '103', checkIn: '2026-04-15', checkOut: '2027-04-14', status: 'upcoming', paymentStatus: 'pending', advancePaid: 0 }
  ],

  pendingFees: [
    { id: 'PF001', studentName: 'Amit Singh',   studentId: 'STU003', email: 'amit.singh@email.com',   phone: '+919876543210', room: '102', amount: 4000, dueDate: '2026-03-05', daysOverdue: 26, reminderCount: 3, lastReminder: '2026-03-29', lateFee: 200 },
    { id: 'PF002', studentName: 'Vikram Reddy', studentId: 'STU005', email: 'vikram.reddy@email.com', phone: '+919876543213', room: '301', amount: 6000, dueDate: '2026-03-05', daysOverdue: 26, reminderCount: 2, lastReminder: '2026-03-28', lateFee: 300 },
    { id: 'PF003', studentName: 'Sneha Gupta',  studentId: 'STU006', email: 'sneha.gupta@email.com',  phone: '+919876543215', room: '202', amount: 5500, dueDate: '2026-03-10', daysOverdue: 21, reminderCount: 1, lastReminder: '2026-03-28', lateFee: 0 },
    { id: 'PF004', studentName: 'Arjun Nair',   studentId: 'STU007', email: 'arjun.nair@email.com',   phone: '+919876543216', room: '105', amount: 450,  dueDate: '2026-03-15', daysOverdue: 16, reminderCount: 2, lastReminder: '2026-03-29', lateFee: 0 },
    { id: 'PF005', studentName: 'Kavya Nair',   studentId: 'STU008', email: 'kavya.nair@email.com',   phone: '+919876543217', room: '103', amount: 7500, dueDate: '2026-04-15', daysOverdue: 0,  reminderCount: 0, lastReminder: null, lateFee: 0 }
  ],

  studentProfiles: [
    { id: 'STU001', name: 'Rahul Kumar', email: 'rahul.kumar@email.com', phone: '+919876543211', college: 'RV College of Engineering', course: 'B.Tech', year: 3, aadharNo: 'XXXX-XXXX-1234', address: 'Bangalore, Karnataka', profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    { id: 'STU002', name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+919876543212', college: 'Christ University', course: 'MBA', year: 2, aadharNo: 'XXXX-XXXX-2345', address: 'Mysore, Karnataka', profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
    { id: 'STU003', name: 'Amit Singh', email: 'amit.singh@email.com', phone: '+919876543210', college: 'IIT Bangalore', course: 'M.Tech', year: 1, aadharNo: 'XXXX-XXXX-3456', address: 'Delhi', profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
    { id: 'STU004', name: 'Neha Patel', email: 'neha.patel@email.com', phone: '+919876543214', college: 'NIT Surathkal', course: 'B.Tech', year: 2, aadharNo: 'XXXX-XXXX-4567', address: 'Pune, Maharashtra', profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
    { id: 'STU005', name: 'Vikram Reddy', email: 'vikram.reddy@email.com', phone: '+919876543213', college: 'VIT Vellore', course: 'B.Tech', year: 4, aadharNo: 'XXXX-XXXX-5678', address: 'Hyderabad, Telangana', profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
    { id: 'STU006', name: 'Sneha Gupta', email: 'sneha.gupta@email.com', phone: '+919876543215', college: 'BMS College of Engineering', course: 'B.Arch', year: 3, aadharNo: 'XXXX-XXXX-6789', address: 'Chennai, Tamil Nadu', profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200' },
    { id: 'STU007', name: 'Arjun Nair', email: 'arjun.nair@email.com', phone: '+919876543216', college: 'SRM University', course: 'MBBS', year: 2, aadharNo: 'XXXX-XXXX-7890', address: 'Kochi, Kerala', profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' },
    { id: 'STU008', name: 'Kavya Nair', email: 'kavya.nair@email.com', phone: '+919876543217', college: 'Anna University', course: 'B.E', year: 1, aadharNo: 'XXXX-XXXX-8901', address: 'Coimbatore, Tamil Nadu', profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }
  ]
};

router.get('/rooms', (req, res) => {
  res.json({ success: true, data: sampleData.rooms });
});

router.get('/facilities', (req, res) => {
  res.json({ success: true, data: sampleData.facilities });
});

router.get('/hostels', (req, res) => {
  res.json({ success: true, data: sampleData.hostels });
});

router.get('/hostels/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  const hostels = sampleData.hostels.filter(h => h.city.toLowerCase() === city);
  res.json({ success: true, city, data: hostels });
});

router.get('/menu', (req, res) => {
  res.json({ success: true, data: sampleData.foodMenu });
});

router.get('/menu/:day', (req, res) => {
  const day = req.params.day.toLowerCase();
  const menu = sampleData.foodMenu[day];
  if (menu) {
    res.json({ success: true, day, data: menu });
  } else {
    res.status(404).json({ success: false, error: 'Menu not found for this day' });
  }
});

router.get('/transactions', (req, res) => {
  res.json({ success: true, data: sampleData.transactions });
});

router.get('/bookings', (req, res) => {
  res.json({ success: true, data: sampleData.bookings });
});

router.get('/notifications', (req, res) => {
  res.json({ success: true, data: sampleData.notifications });
});

router.get('/pending-fees', (req, res) => {
  res.json({ success: true, data: sampleData.pendingFees });
});

router.get('/students', (req, res) => {
  res.json({ success: true, data: sampleData.studentProfiles });
});

// ─── Auto-notify all overdue students (called when admin opens Pending Fees tab) ───
router.post('/auto-notify-overdue', async (req, res) => {
  const { channel = 'email' } = req.body;
  const { sendFeeReminderEmail, sendFeeReminderSMS } = require('../services/notificationService');

  const overdueFees = sampleData.pendingFees.filter(f => f.daysOverdue > 0);
  if (overdueFees.length === 0) {
    return res.json({ success: true, message: 'No overdue fees to notify', sent: 0 });
  }

  const results = [];
  for (const fee of overdueFees) {
    const emailResult = (channel === 'email' || channel === 'both') && fee.email
      ? await sendFeeReminderEmail({ studentName: fee.studentName, studentEmail: fee.email, roomNumber: fee.room, amount: fee.amount, daysOverdue: fee.daysOverdue, lateFee: fee.lateFee, studentId: fee.studentId })
      : null;
    const smsResult = (channel === 'sms' || channel === 'both') && fee.phone
      ? await sendFeeReminderSMS({ studentName: fee.studentName, phone: fee.phone, roomNumber: fee.room, amount: fee.amount, daysOverdue: fee.daysOverdue })
      : null;

    const ok = emailResult?.success !== false && smsResult?.success !== false;
    if (ok) {
      fee.reminderCount = (fee.reminderCount || 0) + 1;
      fee.lastReminder = new Date().toLocaleDateString('en-IN');
    }
    results.push({ studentId: fee.studentId, studentName: fee.studentName, room: fee.room, email: emailResult, sms: smsResult, ok });
    console.log(`[AUTO-NOTIFY] ${fee.studentName} (${fee.room}) - ${ok ? '✅ sent' : '❌ failed'}`);
  }

  res.json({
    success: true,
    message: `Auto-notifications sent to ${results.filter(r => r.ok).length}/${overdueFees.length} overdue students`,
    sent: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    results,
    updatedFees: sampleData.pendingFees,
  });
});

router.post('/send-notification', (req, res) => {
  const { studentName, email, phone, message, channels } = req.body;
  
  const notification = {
    id: 'N' + Date.now(),
    studentName,
    email,
    phone,
    type: 'custom',
    message,
    sentVia: channels || ['email'],
    sentAt: new Date().toISOString(),
    status: 'sent'
  };
  
  sampleData.notifications.push(notification);
  
  res.json({ success: true, notification });
});

router.get('/dashboard-stats', (req, res) => {
  const totalRooms = sampleData.rooms.length;
  const occupiedRooms = sampleData.rooms.filter(r => r.currentOccupancy > 0).length;
  const totalStudents = sampleData.studentProfiles.length;
  const activeBookings = sampleData.bookings.filter(b => b.status === 'active').length;
  const pendingAmount = sampleData.pendingFees.reduce((sum, f) => sum + f.amount + (f.lateFee || 0), 0);
  const totalRevenue = sampleData.transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
  
  res.json({
    success: true,
    stats: {
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      occupancyRate: Math.round((occupiedRooms / totalRooms) * 100),
      totalStudents,
      activeBookings,
      pendingAmount,
      pendingCount: sampleData.pendingFees.length,
      totalRevenue,
      hostelsCount: sampleData.hostels.length,
      citiesCount: [...new Set(sampleData.hostels.map(h => h.city))].length
    }
  });
});

module.exports = router;
