# Property Listings API

An Express.js REST API for browsing Australian property listings with mock data.

## Features

- Get all properties with filtering options
- Get property by ID
- Filter by city, state, or property type
- Filter by price range and number of bedrooms
- Ready for Railway deployment

## Installation

```bash
npm install
```

## Running Locally

```bash
npm start
```

The API will run on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## API Endpoints

### Root
- **GET** `/`
  - Returns API information and available endpoints

### Properties

#### Get All Properties
- **GET** `/api/properties`
  - Returns all properties
  - **Query Parameters (optional):**
    - `minPrice` - Minimum price filter
    - `maxPrice` - Maximum price filter
    - `bedrooms` - Minimum number of bedrooms
    - `type` - Property type (apartment, house, townhouse, penthouse, studio)
    - `state` - Australian state (NSW, VIC, QLD, WA, SA)
    - `city` - City name (Sydney, Melbourne, Brisbane, Perth, Adelaide, etc.)
  
  **Example:**
  ```
  GET /api/properties?state=NSW&minPrice=400000&maxPrice=900000
  ```

#### Get Property by ID
- **GET** `/api/properties/:id`
  - Returns a single property by ID
  
  **Example:**
  ```
  GET /api/properties/1
  ```

#### Get Properties by City
- **GET** `/api/properties/city/:city`
  - Returns all properties in a specific city
  
  **Example:**
  ```
  GET /api/properties/city/Sydney
  ```

#### Get Properties by State
- **GET** `/api/properties/state/:state`
  - Returns all properties in a specific state
  
  **Example:**
  ```
  GET /api/properties/state/NSW
  ```

#### Get Properties by Type
- **GET** `/api/properties/type/:type`
  - Returns all properties of a specific type
  
  **Example:**
  ```
  GET /api/properties/type/apartment
  ```

## Property Data Structure

Each property contains:
- `id` - Unique identifier
- `title` - Property title
- `description` - Detailed description
- `price` - Property price in AUD
- `type` - Type of property (apartment, house, townhouse, penthouse, studio)
- `bedrooms` - Number of bedrooms
- `bathrooms` - Number of bathrooms
- `carSpaces` - Number of car parking spaces
- `landSize` - Land size in square meters (null for apartments)
- `address` - Full address object with street, suburb, city, state, postcode, country
- `features` - Array of property features
- `images` - Array of image URLs
- `listedDate` - Date the property was listed
- `agent` - Agent contact information

## Deployment to Railway

This API is configured for Railway deployment:

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Railway will automatically detect the Node.js application
4. The app will be deployed and accessible via the Railway-provided URL

The `PORT` environment variable is automatically set by Railway.

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JSON** - Data storage

## License

ISC
