import React, { useState, useEffect } from 'react';
import './SampleData.css';

const HostelList = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedHostel, setSelectedHostel] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/sample/hostels')
      .then(res => res.json())
      .then(data => {
        setHostels(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const cities = ['all', ...new Set(hostels.map(h => h.city))];
  const filteredHostels = selectedCity === 'all' 
    ? hostels 
    : hostels.filter(h => h.city.toLowerCase() === selectedCity.toLowerCase());

  if (loading) return <div className="loading">Loading hostels...</div>;

  return (
    <div className="facilities-page">
      <h1>🏠 Find Your Perfect Hostel</h1>
      
      <div className="city-filters">
        {cities.map(city => (
          <button 
            key={city} 
            className={`city-btn ${selectedCity === city ? 'active' : ''}`}
            onClick={() => setSelectedCity(city)}
          >
            {city === 'all' ? '🌍 All Cities' : `📍 ${city}`}
          </button>
        ))}
      </div>

      <div className="hostel-grid">
        {filteredHostels.map(hostel => (
          <div key={hostel.id} className="hostel-card" onClick={() => setSelectedHostel(hostel)}>
            <div className="hostel-image">
              <img src={hostel.images.cover} alt={hostel.name} />
              <span className={`badge-gender ${hostel.forGender.toLowerCase()}`}>
                {hostel.forGender}
              </span>
              <span className="badge-price">₹{hostel.price}/mo</span>
            </div>
            <div className="hostel-info">
              <div className="hostel-header">
                <h3>{hostel.name}</h3>
                <div className="rating">
                  <span className="star">⭐</span>
                  {hostel.rating}
                </div>
              </div>
              <p className="hostel-location">📍 {hostel.city} • {hostel.distance}</p>
              <div className="facility-tags">
                {hostel.facilities.slice(0, 4).map((f, i) => (
                  <span key={i} className="facility-tag">{f}</span>
                ))}
              </div>
              <div className="hostel-footer">
                <span className="ac-badge">{hostel.acSupport ? '❄️ AC' : '🌡️ Non-AC'}</span>
                <span className="food-badge">{hostel.foodIncluded ? '🍽️ Food' : '🚫 Self'}</span>
                <span className="security-badge">🔒 {hostel.securityLevel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHostel && (
        <div className="modal-overlay" onClick={() => setSelectedHostel(null)}>
          <div className="modal-content hostel-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedHostel(null)}>×</button>
            <div className="modal-hero">
              <img src={selectedHostel.images.cover} alt={selectedHostel.name} />
            </div>
            <div className="hostel-modal-content">
              <div className="modal-header">
                <h2>{selectedHostel.name}</h2>
                <div className="modal-rating">
                  <span className="star">⭐</span> {selectedHostel.rating}
                </div>
              </div>
              <p className="modal-address">📍 {selectedHostel.address}</p>
              
              <div className="modal-price">
                <h3>₹{selectedHostel.price}</h3>
                <span>per month</span>
              </div>

              <div className="modal-section">
                <h4>🏠 Room Amenities</h4>
                <div className="amenities-grid">
                  {selectedHostel.amenities.bathrooms && <div className="amenity-item">🚿 {selectedHostel.amenities.bathrooms} Bathrooms</div>}
                  {selectedHostel.amenities.washingMachines && <div className="amenity-item">🧺 {selectedHostel.amenities.washingMachines} Washing Machines</div>}
                  {selectedHostel.amenities.dryingArea && <div className="amenity-item">☀️ Drying Area</div>}
                  {selectedHostel.amenities.terrace && <div className="amenity-item">🏠 Terrace</div>}
                  {selectedHostel.amenities.lift && <div className="amenity-item">🛗 Lift Access</div>}
                </div>
              </div>

              <div className="modal-section">
                <h4>✨ Facilities</h4>
                <div className="facility-tags-modal">
                  {selectedHostel.facilities.map((f, i) => (
                    <span key={i} className="facility-tag">{f}</span>
                  ))}
                </div>
              </div>

              <div className="modal-gallery">
                {selectedHostel.images.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`View ${i + 1}`} />
                ))}
              </div>

              <button className="book-now-btn">Book Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelList;
