
import type { PlanningRepository } from "./PlanningRepository";
import type { Unidade } from "../types/planejamento";

import { planejamentoGuarulhos } from "../data/mock/planejamentoGuarulhos";
import { planejamentoSantaCatarina } from "../data/mock/planejamentoSantaCatarina";

const mockPlanningRepository: PlanningRepository = {
  async getAtividades(unidade: Unidade) {
    switch (unidade) {
      case "guarulhos":
        return planejamentoGuarulhos;

      case "santa-catarina":
        return planejamentoSantaCatarina;
    }
  },
};

export default mockPlanningRepository;
