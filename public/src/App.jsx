import React from "react";
import Home from "./home/Home_1";
import Contact from "./components/Contact";
import About from "./components/About";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Upload from "./upload/Upload";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/upload"
            element={authUser ? <Upload /> : <Navigate to="/signup" />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
