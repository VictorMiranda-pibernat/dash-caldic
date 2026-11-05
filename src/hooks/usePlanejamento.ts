
import type {
  Unidade,
  PlanejamentoPorUnidade,
} from "../components/types/planejamento";

import mockPlanningRepository from "../components/repositories/MockPlanningRepository";

export async function usePlanejamento(
  unidade: Unidade
): Promise<PlanejamentoPorUnidade> {
  const atividades = await mockPlanningRepository.getAtividades(unidade);

  return {
    unidade,
    atividades,
  };
}
