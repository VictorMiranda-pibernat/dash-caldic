
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type {
  Unidade,
  AtividadePlanejamento,
} from "../types/planejamento";

import { usePlanejamento } from "../../hooks/usePlanejamento";
import PlanningTable from "../layout/planning/PlanningTable";

const unidadesValidas: Unidade[] = [
  "guarulhos",
  "santa-catarina",
];

export default function Planejamento() {
  const { local } = useParams<{ local: string }>();

  const unidade = unidadesValidas.includes(local as Unidade)
    ? (local as Unidade)
    : "guarulhos";

  const [atividades, setAtividades] = useState<
    AtividadePlanejamento[]
  >([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        setCarregando(true);
        setErro(null);

        const planejamento = await usePlanejamento(unidade);

        if (ativo) {
          setAtividades(planejamento.atividades);
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar o planejamento.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [unidade]);

  const nomeUnidade =
    unidade === "guarulhos" ? "Guarulhos" : "Santa Catarina";

  return (
    <main className="space-y-6 p-6 md:p-8">
      <div>
        <p className="mb-2 text-sm text-gray-500">
          Planejamento / {nomeUnidade}
        </p>

        <h1 className="text-2xl font-semibold text-white">
          Planejamento - {nomeUnidade}
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Acompanhamento das atividades, etapas e prazos operacionais.
        </p>
      </div>

      {carregando ? (
        <div className="rounded-xl border border-[#292B34] bg-[#181920] p-10 text-center text-sm text-gray-400">
          Carregando planejamento...
        </div>
      ) : erro ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-400">
          {erro}
        </div>
      ) : (
        <PlanningTable atividades={atividades} />
      )}
    </main>
  );
}
