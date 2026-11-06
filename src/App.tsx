
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Planejamento from "./components/pages/Planejamento";
import GestaoPreEmbarque from "./components/pages/GestaoPreEmbarque";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />

                    {/* PLANEJAMENTO */}
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

                    {/* GESTÃO PRÉ-EMBARQUE */}
                    <Route
                        path="/gestao-pre-embarque"
                        element={
                            <Navigate
                                to="/gestao-pre-embarque/guarulhos"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/gestao-pre-embarque/:local"
                        element={<GestaoPreEmbarque />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
