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
    } else {
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
    return <p>Restaurant not found.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <Link to="/">← Back to List</Link>
      <h1>{restaurant["Name"]}</h1>
      <p><strong>Cuisine:</strong> {restaurant["Cuisine / Type"]}</p>
      <p><strong>Rating:</strong> ⭐ {restaurant["Google Rating"]}</p>

      <img
        src={restaurant["ImageURL"] || "https://via.placeholder.com/500x300?text=" + encodeURIComponent(restaurant["Name"])}
        alt={restaurant["Name"]}
        style={{ marginTop: "1rem", borderRadius: "8px", width: "100%" }}
      />

      <div style={{ marginTop: "2rem" }}>
        <label>
          <input
            type="checkbox"
            checked={visited}
            onChange={(e) => setVisited(e.target.checked)}
          />{" "}
          I’ve been here
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          My Rating (0–5):{" "}
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={myRating}
            onChange={(e) => setMyRating(e.target.value)}
            style={{ width: "60px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          My Log:
          <textarea
            value={log}
            onChange={(e) => setLog(e.target.value)}
            placeholder="Thoughts, favorite dishes, etc."
            style={{ width: "100%", height: "100px", marginTop: "0.5rem" }}
          />
        </label>
      </div>
    </div>
  );
}

export default RestaurantDetails;