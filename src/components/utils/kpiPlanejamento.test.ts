
import { describe, it, expect } from "vitest";
import { calcularKPIsMensais } from "./kpiPlanejamento";
import { execucoesTeste } from "../data/mock/execucoesTeste";
import * as guarulhosModule from "../data/mock/planejamentoGuarulhos";

const planejamentoGuarulhos = guarulhosModule.planejamentoGuarulhos;

describe("KPIs mensais de planejamento", () => {
  it("deve calcular corretamente os indicadores da atividade", () => {
    const resultados = calcularKPIsMensais(
      planejamentoGuarulhos,
      execucoesTeste,
      2026,
      11
    );

    const resultado = resultados.find(
      (item) => item.atividadeId === 1 && item.modal === null
    );

    expect(resultado).toBeDefined();
    expect(resultado?.slaHoras).toBe(24);
    expect(resultado?.totalExecucoes).toBe(5);
    expect(resultado?.dentroPrazo).toBe(4);
    expect(resultado?.foraPrazo).toBe(1);
    expect(resultado?.tempoMedioHoras).toBe(22);
    expect(resultado?.aderenciaPercentual).toBe(80);
  });
});
