
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Planejamento from "./components/pages/Planejamento";
import GestaoPreEmbarque from "./components/pages/GestaoPreEmbarque";
import EmbarqueInternacional from "./components/pages/EmbarqueInternacional";
import PosEmbarque from "./components/pages/PosEmbarque";
import ChegadaBrasil from "./components/pages/ChegadaBrasil";

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

                    {/* EMBARQUE INTERNACIONAL */}
                    <Route
                        path="/embarque-internacional"
                        element={
                            <Navigate
                                to="/embarque-internacional/guarulhos"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/embarque-internacional/:local"
                        element={<EmbarqueInternacional />}
                    />

                    <Route
                        path="/pos-embarque"
                        element={<Navigate to="/pos-embarque/guarulhos" replace />}
                    />

                    <Route
                        path="/pos-embarque/:local"
                        element={<PosEmbarque />}
                    />
                    {/* CHEGADA DA CARGA NO BRASIL */}
                    <Route
                        path="/chegada-brasil"
                        element={
                            <Navigate
                                to="/chegada-brasil/guarulhos"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/chegada-brasil/:local"
                        element={<ChegadaBrasil />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
