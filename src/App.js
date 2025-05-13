import React, { useEffect, useState } from "react";
import Papa from "papaparse";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [sortKey, setSortKey] = useState("Name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    Papa.parse("/data/restaurants.csv", {
      header: true,
      download: true,
      complete: (results) => {
        setRestaurants(results.data);
      },
    });
  }, []);

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
        {sortedRestaurants.map((r, i) => (
          <div key={i} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}>
            <img
              src={"https://via.placeholder.com/300x200?text=" + encodeURIComponent(r["Name"])}
              alt={r["Name"]}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }}
            />
            <h2 style={{ margin: "0.5rem 0 0" }}>{r["Name"]}</h2>
            <p style={{ margin: "0.25rem 0" }}>{r["Cuisine / Type"]}</p>
            <p style={{ margin: "0.25rem 0" }}>⭐ {r["Google Rating"]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;