import React, { Suspense } from "react";
import "./App.css";
// import LandingPage from "./components/LandingPage";
// import ChatBot from "./components/ChatBot";
import Signup from "./components/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const LandingPage = React.lazy(() => import("./components/LandingPage"));

function App() {
  return (
    <div>
      <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/landing" element={<LandingPage />} />
          {/* <Route path="/chatbot" element={<ChatBot />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
