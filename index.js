const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Load properties data
const propertiesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'properties.json'), 'utf8')
);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Australian Property Listings API',
    version: '1.0.0',
    endpoints: {
      'GET /api/properties': 'Get all properties (supports filtering)',
      'GET /api/properties/:id': 'Get a specific property by ID',
      'GET /api/properties/city/:city': 'Get properties by city',
      'GET /api/properties/state/:state': 'Get properties by state',
      'GET /api/properties/type/:type': 'Get properties by type'
    }
  });
});

// GET all properties with optional filtering
app.get('/api/properties', (req, res) => {
  let filteredProperties = [...propertiesData];
  
  // Filter by price range
  if (req.query.minPrice) {
    const minPrice = parseFloat(req.query.minPrice);
    if (!isNaN(minPrice)) {
      filteredProperties = filteredProperties.filter(p => p.price >= minPrice);
    }
  }
  
  if (req.query.maxPrice) {
    const maxPrice = parseFloat(req.query.maxPrice);
    if (!isNaN(maxPrice)) {
      filteredProperties = filteredProperties.filter(p => p.price <= maxPrice);
    }
  }
  
  // Filter by bedrooms
  if (req.query.bedrooms) {
    const bedrooms = parseInt(req.query.bedrooms);
    if (!isNaN(bedrooms) && bedrooms > 0) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= bedrooms);
    }
  }
  
  // Filter by type
  if (req.query.type) {
    const type = req.query.type.toLowerCase();
    filteredProperties = filteredProperties.filter(p => p.type.toLowerCase() === type);
  }
  
  // Filter by state
  if (req.query.state) {
    const state = req.query.state.toUpperCase();
    filteredProperties = filteredProperties.filter(p => p.address.state === state);
  }
  
  // Filter by city
  if (req.query.city) {
    const city = req.query.city.toLowerCase();
    filteredProperties = filteredProperties.filter(
      p => p.address.city.toLowerCase() === city
    );
  }
  
  res.json({
    count: filteredProperties.length,
    properties: filteredProperties
  });
});

// GET property by ID
app.get('/api/properties/:id', (req, res) => {
  const propertyId = parseInt(req.params.id);
  const property = propertiesData.find(p => p.id === propertyId);
  
  if (!property) {
    return res.status(404).json({
      error: 'Property not found',
      message: `No property found with ID ${propertyId}`
    });
  }
  
  res.json(property);
});

// GET properties by city
app.get('/api/properties/city/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  const properties = propertiesData.filter(
    p => p.address.city.toLowerCase() === city
  );
  
  if (properties.length === 0) {
    return res.status(404).json({
      error: 'No properties found',
      message: `No properties found in ${req.params.city}`
    });
  }
  
  res.json({
    city: req.params.city,
    count: properties.length,
    properties: properties
  });
});

// GET properties by state
app.get('/api/properties/state/:state', (req, res) => {
  const state = req.params.state.toUpperCase();
  const properties = propertiesData.filter(p => p.address.state === state);
  
  if (properties.length === 0) {
    return res.status(404).json({
      error: 'No properties found',
      message: `No properties found in state ${state}`
    });
  }
  
  res.json({
    state: state,
    count: properties.length,
    properties: properties
  });
});

// GET properties by type
app.get('/api/properties/type/:type', (req, res) => {
  const type = req.params.type.toLowerCase();
  const properties = propertiesData.filter(p => p.type.toLowerCase() === type);
  
  if (properties.length === 0) {
    return res.status(404).json({
      error: 'No properties found',
      message: `No properties found of type ${req.params.type}`
    });
  }
  
  res.json({
    type: req.params.type,
    count: properties.length,
    properties: properties
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Property Listings API running on port ${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT} for API information`);
});

module.exports = app;
