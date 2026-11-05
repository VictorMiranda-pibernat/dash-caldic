
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Planejamento from "./components/pages/Planejamento";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/planejamento"
            element={
              <Navigate
                to="/planejamento/guarulhos"
                replace
              />
            }
          />

          <Route
            path="/planejamento/:local"
            element={<Planejamento />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
