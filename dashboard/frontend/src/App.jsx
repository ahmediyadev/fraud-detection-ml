import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BankingFraudDashboard from "./pages/BankingFraudDashboard";

function App() {

  return (

   <BrowserRouter>

      <div className="bg-gray-950 min-h-screen">

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/banking-fraud-dashboard" element={<BankingFraudDashboard />} />

        </Routes>

      </div>

    </BrowserRouter> 

  );
}

export default App;