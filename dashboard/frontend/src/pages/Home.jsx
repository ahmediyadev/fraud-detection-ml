import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    API.get("/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (

    <div className="bg-gray-950 min-h-screen text-white p-10">

      <h1 className="text-5xl font-bold text-blue-500">
        Banking Fraud AI
      </h1>

      <p className="mt-10 text-xl text-green-400">
        {message}
      </p>

    </div>
  );
}

export default Home;