import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./Component/Home";
import Main from "./Component/Main";
import Register from "./pages/Register";
import Protectedroute from "./Component/Protectedroute";
import OpenRoutes from "./Component/OpenRoutes";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/"
            element={
              // required access token to get this page
              <Protectedroute>
                <Home />
              </Protectedroute>
            }
          />
          <Route
            path="/register"
            element={
              <OpenRoutes>
                <Register />
              </OpenRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <OpenRoutes>
                <Login />
              </OpenRoutes>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
