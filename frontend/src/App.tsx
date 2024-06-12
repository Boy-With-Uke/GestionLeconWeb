import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex flex-col">
        <button
          className="bg-blue-500"
          onClick={() => setCount((count) => count + 1)}
        >
          up
        </button>
        <button
          className="bg-red-500"
          onClick={() => setCount((count) => count - 1)}
        >
          down
        </button>
      </div>
      <p>{count}</p>
    </>
  );
}

export default App;
