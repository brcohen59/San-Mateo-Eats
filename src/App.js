import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RestaurantDetails from "./pages/RestaurantDetails";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [sortKey, setSortKey] = useState("Name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [visitedMap, setVisitedMap] = useState({});

  useEffect(() => {
    Papa.parse("/data/restaurants.csv", {
      header: true,
      download: true,
      complete: (results) => {
        setRestaurants(results.data);
      },
    });
  }, []);

  // Populate visited map from localStorage
  useEffect(() => {
    const map = {};
    restaurants.forEach((r) => {
      const saved = JSON.parse(localStorage.getItem(r["Name"]));
      if (saved && saved.visited) {
        map[r["Name"]] = true;
      }
    });
    setVisitedMap(map);
  }, [restaurants]);

  const toggleVisited = (name) => {
    const saved = JSON.parse(localStorage.getItem(name)) || {};
    const newVisited = !saved.visited;
    localStorage.setItem(name, JSON.stringify({ ...saved, visited: newVisited }));

    setVisitedMap((prev) => ({
      ...prev,
      [name]: newVisited,
    }));
  };


  useEffect(() => {
    const sorted = [...restaurants].sort((a, b) => {
      const valA = a[sortKey] || "";
      const valB = b[sortKey] || "";

      if (sortKey === "Google Rating") {
        const numA = parseFloat(valA) || 0;
        const numB = parseFloat(valB) || 0;
        return sortOrder === "asc" ? numA - numB : numB - numA;
      } else {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
    });

    setSortedRestaurants(sorted);
  }, [restaurants, sortKey, sortOrder]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "2rem" }}>
              <h1>San Mateo Eats</h1>

              {/* Sort Controls */}
              <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <label>
                  Sort by:
                  <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={{ marginLeft: "0.5rem" }}>
                    <option value="Name">Name</option>
                    <option value="Cuisine / Type">Cuisine</option>
                    <option value="Google Rating">Google Rating</option>
                  </select>
                </label>

                <label>
                  Order:
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: "0.5rem" }}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </label>
              </div>

              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                {sortedRestaurants.map((r, i) => {
                  const visited = visitedMap[r["Name"]];
                  return (
                    <div key={i} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", position: "relative" }}>
                      <Link to={`/restaurant/${encodeURIComponent(r["Name"])}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <img
                          src={"https://via.placeholder.com/300x200?text=" + encodeURIComponent(r["Name"])}
                          alt={r["Name"]}
                          style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }}
                        />
                        <h2 style={{ margin: "0.5rem 0 0" }}>{r["Name"]}</h2>
                        <p style={{ margin: "0.25rem 0" }}>{r["Cuisine / Type"]}</p>
                        <p style={{ margin: "0.25rem 0" }}>⭐ {r["Google Rating"]}</p>
                      </Link>

                      <button
                        onClick={() => toggleVisited(r["Name"])}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "none",
                          border: "none",
                          fontSize: "1.5rem",
                          cursor: "pointer",
                        }}
                        title={visited ? "Mark as unvisited" : "Mark as visited"}
                      >
                        {visited ? "✅" : "⬜"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          }
        />
        <Route path="/restaurant/:name" element={<RestaurantDetails restaurants={restaurants} />} />
      </Routes>
    </Router>
  );
}

export default App;