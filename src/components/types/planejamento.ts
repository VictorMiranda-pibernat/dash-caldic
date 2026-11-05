
export type Unidade = "guarulhos" | "santa-catarina";

export type ModalTransporte =
  | "aereo"
  | "maritimo"
  | "rodoviario";

export type StatusAtividade =
  | "pendente"
  | "em_andamento"
  | "concluido"
  | "atrasado"
  | "nao_informado";

export interface AtividadePlanejamento {
  id: number;
  atividadeKey: string;

  etapa: string;
  atividade: string;

  sla: string;
  objetivoMetrica: string;
  prazoHoras: number;
  prazoDias: number;

  targetsPorModal?: {
    aereo: {
      horas: number;
      dias: number;
    };
    maritimo: {
      horas: number;
      dias: number;
    };
    rodoviario: {
      horas: number;
      dias: number;
    };
  };

  inicioFarol: string;
  finalFarol: string;

  responsavel: string | null;
  status: StatusAtividade;
  dataInicio: string | null;
  dataConclusao: string | null;
}

export interface PlanejamentoPorUnidade {
  unidade: Unidade;
  atividades: AtividadePlanejamento[];
}

export interface ExecucaoAtividade {
  id: string;
  atividadeId: number;
  atividadeKey: string;
  unidade: Unidade;
  modal?: ModalTransporte;
  dataInicio: string;
  dataConclusao: string;
}
