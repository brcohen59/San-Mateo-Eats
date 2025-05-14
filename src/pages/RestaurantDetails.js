// src/pages/RestaurantDetails.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function RestaurantDetails({ restaurants }) {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const restaurant = restaurants.find((r) => r["Name"] === decodedName);

  const [visited, setVisited] = useState(false);
  const [myRating, setMyRating] = useState("");
  const [log, setLog] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(decodedName));
    if (saved) {
      setVisited(saved.visited ?? false);
      setMyRating(saved.myRating ?? "");
      setLog(saved.log ?? "");
    }
    setHasLoaded(true);
  }, [decodedName]);

  useEffect(() => {
    if (!hasLoaded) return;
    const saveData = {
      visited,
      myRating,
      log,
    };
    localStorage.setItem(decodedName, JSON.stringify(saveData));
  }, [visited, myRating, log, decodedName, hasLoaded]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurant Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find the restaurant you're looking for.</p>
          <Link to="/" className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">{restaurant["Name"]}</h1>
          <p className="text-sm opacity-80">{restaurant["Cuisine / Type"]}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-orange-500 hover:text-orange-700 transition">
            <span className="mr-1">←</span> Back to All Restaurants
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={restaurant["ImageURL"] || "https://via.placeholder.com/500x300?text=" + encodeURIComponent(restaurant["Name"])}
                alt={restaurant["Name"]}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {restaurant["Cuisine / Type"]}
                  </span>
                </div>
                <div className="flex items-center text-yellow-500">
                  <span className="mr-1">⭐</span>
                  <span className="font-medium">{restaurant["Google Rating"]}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Visit</h2>
                
                <div className="mb-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visited}
                      onChange={(e) => setVisited(e.target.checked)}
                      className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">I've visited this restaurant</span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">My Rating</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={myRating}
                      onChange={(e) => setMyRating(e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                    />
                    <span className="ml-2 text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-500">(0-5)</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">My Notes</label>
                  <textarea
                    value={log}
                    onChange={(e) => setLog(e.target.value)}
                    placeholder="What did you eat? How was your experience? Any recommendations?"
                    className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <a 
                  href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant["Name"] + " San Mateo")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  📍 Map
                </a>
                
                <a 
                  href={`https://www.yelp.com/search?find_desc=${encodeURIComponent(restaurant["Name"])}&find_loc=San+Mateo%2C+CA`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  🍽️ Yelp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-12 bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} San Mateo Eats • Made with React & Tailwind</p>
        </div>
      </footer>
    </div>
  );
}

export default RestaurantDetails;