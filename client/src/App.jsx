import { useEffect, useState } from "react";
import { getControllers } from "./services/controllerService.js";

function App() {
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getControllers()
      .then((data) => setControllers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <h1>Game Controller Shop</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {controllers.length === 0 ? (
            <p>No controllers yet.</p>
          ) : (
            controllers.map((c) => (
              <li key={c._id}>
                {c.name} — {c.brand} — ${c.price}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;