
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Planejamento from "./components/pages/Planejamento";
import GestaoPreEmbarque from "./components/pages/GestaoPreEmbarque";
import EmbarqueInternacional from "./components/pages/EmbarqueInternacional";
import PosEmbarque from "./components/pages/PosEmbarque";
import ChegadaBrasil from "./components/pages/ChegadaBrasil";
import Desembaraco from "./components/pages/Desembaraco";
import TransporteNacional from "./components/pages/TransporteNacional";
import PosProcesso from "./components/pages/PosProcesso";
import PanoramaInternacional from "./components/pages/PanoramaInternacional";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/panorama-internacional"
                        element={<PanoramaInternacional />}
                    />

                    <Route path="/planejamento" element={<Navigate to="/planejamento/guarulhos" replace />} />
                    <Route path="/planejamento/:local" element={<Planejamento />} />

                    <Route path="/gestao-pre-embarque" element={<Navigate to="/gestao-pre-embarque/guarulhos" replace />} />
                    <Route path="/gestao-pre-embarque/:local" element={<GestaoPreEmbarque />} />

                    <Route path="/embarque-internacional" element={<Navigate to="/embarque-internacional/guarulhos" replace />} />
                    <Route path="/embarque-internacional/:local" element={<EmbarqueInternacional />} />

                    <Route path="/pos-embarque" element={<Navigate to="/pos-embarque/guarulhos" replace />} />
                    <Route path="/pos-embarque/:local" element={<PosEmbarque />} />

                    <Route path="/chegada-brasil" element={<Navigate to="/chegada-brasil/guarulhos" replace />} />
                    <Route path="/chegada-brasil/:local" element={<ChegadaBrasil />} />

                    <Route path="/desembaraco" element={<Navigate to="/desembaraco/guarulhos" replace />} />
                    <Route path="/desembaraco/:local" element={<Desembaraco />} />

                    <Route path="/transporte-nacional" element={<Navigate to="/transporte-nacional/guarulhos" replace />} />
                    <Route path="/transporte-nacional/:local" element={<TransporteNacional />} />

                    <Route path="/pos-processo" element={<Navigate to="/pos-processo/guarulhos" replace />} />
                    <Route path="/pos-processo/:local" element={<PosProcesso />} />
                </Route>

                <Route path="*" element={<div className="p-8 text-white">Rota não encontrada.</div>} />
            </Routes>
        </BrowserRouter>
    );
}
