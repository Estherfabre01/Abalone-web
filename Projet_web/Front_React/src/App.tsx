import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Front React + API REST</h1>
      <p>Message du back : {message}</p>
    </div>
  );
}

export default App;