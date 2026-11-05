import type { ExecucaoAtividade } from "../../types/planejamento";

/** Dados fictícios usados exclusivamente para validar os cálculos dos KPIs. */
export const execucoesTeste: ExecucaoAtividade[] = [
  {
    id: "exec-1",
    atividadeId: 1,
    atividadeKey: "guarulhos-1",
    unidade: "guarulhos",
    dataInicio: "2026-11-02T08:00:00",
    dataConclusao: "2026-11-03T04:00:00",
  },
  {
    id: "exec-2",
    atividadeId: 1,
    atividadeKey: "guarulhos-1",
    unidade: "guarulhos",
    dataInicio: "2026-11-03T08:00:00",
    dataConclusao: "2026-11-04T06:00:00",
  },
  {
    id: "exec-3",
    atividadeId: 1,
    atividadeKey: "guarulhos-1",
    unidade: "guarulhos",
    dataInicio: "2026-11-04T08:00:00",
    dataConclusao: "2026-11-05T10:00:00",
  },
  {
    id: "exec-4",
    atividadeId: 1,
    atividadeKey: "guarulhos-1",
    unidade: "guarulhos",
    dataInicio: "2026-11-05T08:00:00",
    dataConclusao: "2026-11-06T02:00:00",
  },
  {
    id: "exec-5",
    atividadeId: 1,
    atividadeKey: "guarulhos-1",
    unidade: "guarulhos",
    dataInicio: "2026-11-06T08:00:00",
    dataConclusao: "2026-11-07T08:00:00",
  },
];
