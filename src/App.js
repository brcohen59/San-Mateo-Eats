import React, { useEffect, useState } from "react";
import Papa from "papaparse";

function App() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    Papa.parse("/data/restaurants.csv", {
      header: true,
      download: true,
      complete: (results) => {
        setRestaurants(results.data);
      },
    });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>San Mateo Eats</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {restaurants.map((r, i) => (
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