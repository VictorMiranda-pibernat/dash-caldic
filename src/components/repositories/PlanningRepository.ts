// Esse arquivo define o que qualquer fonte de dados
//  precisa fornecer à página, independentemente de ser mock,
//  API ou BigQuery.
import type {
  Unidade,
  AtividadePlanejamento,
} from "../types/planejamento";

export interface PlanningRepository {
  getAtividades(
    unidade: Unidade
  ): Promise<AtividadePlanejamento[]>;
}
