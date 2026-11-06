import type { AtividadePlanejamento } from "../../types/planejamento";

/**
 * Catálogo de atividades e SLAs da unidade Active - Santa Catarina.
 * Fonte: Brief Active Santa Catarina fornecido no projeto.
 *
 * Os campos operacionais (responsável, status e datas) estão sem informação
 * no brief e permanecem neutros até recebermos dados reais.
 */
const atividadesSantaCatarina: Omit<AtividadePlanejamento, "atividadeKey">[] = [
  {
    "id": 1,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Conferência Purchase Order (PO)",
    "sla": "Até 1 dia após recebimento do pedido de compras",
    "objetivoMetrica": "RECEBIMENTO DO PEDIDO DE COMPRAS X CONFERÊNCIA DA PO",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DO PEDIDO DE COMPRAS foi registrado e o evento CONFERÊNCIA DA PO ainda não.",
    "finalFarol": "O evento CONFERÊNCIA DA PO foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 2,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Comex Caldic abre o processo na planilha de Follow Up (Atividade Caldic)",
    "sla": "Até 1 dia após recebimento do pedido de compras",
    "objetivoMetrica": "RECEBIMENTO DO PEDIDO DE COMPRAS X ABERTURA DO PROCESSO NO FOLLOW UP",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DO PEDIDO DE COMPRAS foi registrado e o evento ABERTURA DO PROCESSO NO FOLLOW UP ainda não.",
    "finalFarol": "O evento ABERTURA DO PROCESSO NO FOLLOW UP foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 3,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Despachante inicia tratativas com fornecedor, faz análise de NCM, verifica classificação fiscal e validação de tratamento administrativo , confere decreto para confirmação de redução de PIS e COFINS, cobra documentos para análise",
    "sla": "Até 1 dia após Procurment Caldic aprovar COA",
    "objetivoMetrica": "APROVAÇÃO DA COA PELA CALDIC X INÍCIO DAS TRATATIVAS E ANÁLISE FISCAL",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento APROVAÇÃO DA COA PELA CALDIC foi registrado e o evento INÍCIO DAS TRATATIVAS E ANÁLISE FISCAL ainda não.",
    "finalFarol": "O evento INÍCIO DAS TRATATIVAS E ANÁLISE FISCAL foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 4,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Conferencia a aprovação documentos ( Proforma Invoice para confirmar canal bancário, Comercial invoice, Packing list, Label)",
    "sla": "Até 1 dia após recebimento de drafts e correção (caso necessário)",
    "objetivoMetrica": "RECEBIMENTO DOS DRAFTS E CORREÇÕES X CONFERÊNCIA DA APROVAÇÃO DE DOCUMENTOS",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DOS DRAFTS E CORREÇÕES foi registrado e o evento CONFERÊNCIA DA APROVAÇÃO DE DOCUMENTOS ainda não.",
    "finalFarol": "O evento CONFERÊNCIA DA APROVAÇÃO DE DOCUMENTOS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 5,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Sinalizar Caldic quando se tratar de pedido com condição de pagamento antecipado afim de que o pagamento ao fornecedor seja providenciado",
    "sla": "Até 1 dia após recebimento do PO",
    "objetivoMetrica": "RECEBIMENTO DO PO X SINALIZAÇÃO DE PAGAMENTO ANTECIPADO À CALDIC",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DO PO foi registrado e o evento SINALIZAÇÃO DE PAGAMENTO ANTECIPADO À CALDIC ainda não.",
    "finalFarol": "O evento SINALIZAÇÃO DE PAGAMENTO ANTECIPADO À CALDIC foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 6,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Sinalizar Caldic quando documentos estiverem aprovados para solicitar cotação de frete junto agentes de cargas",
    "sla": "D0 da aprovação de documentos",
    "objetivoMetrica": "APROVAÇÃO DE DOCUMENTOS X SINALIZAÇÃO DE COTAÇÃO DE FRETE À CALDIC",
    "prazoHoras": 8,
    "prazoDias": 0,
    "targetsPorModal": {
      "aereo": {
        "horas": 8,
        "dias": 0
      },
      "maritimo": {
        "horas": 8,
        "dias": 0
      },
      "rodoviario": {
        "horas": 8,
        "dias": 0
      }
    },
    "inicioFarol": "O evento APROVAÇÃO DE DOCUMENTOS foi registrado e o evento SINALIZAÇÃO DE COTAÇÃO DE FRETE À CALDIC ainda não.",
    "finalFarol": "O evento SINALIZAÇÃO DE COTAÇÃO DE FRETE À CALDIC foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 7,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Comex Caldic aprova frete (collect) e inclui despachante no fluxo para trataivas de embarque junto ao agente de cargas ( atividade Caldic)",
    "sla": "No ato da aprovação de cotação",
    "objetivoMetrica": "APROVAÇÃO DA COTAÇÃO X INCLUSÃO DO DESPACHANTE NO FLUXO",
    "prazoHoras": 8,
    "prazoDias": 0,
    "targetsPorModal": {
      "aereo": {
        "horas": 8,
        "dias": 0
      },
      "maritimo": {
        "horas": 8,
        "dias": 0
      },
      "rodoviario": {
        "horas": 8,
        "dias": 0
      }
    },
    "inicioFarol": "O evento APROVAÇÃO DA COTAÇÃO foi registrado e o evento INCLUSÃO DO DESPACHANTE NO FLUXO ainda não.",
    "finalFarol": "O evento INCLUSÃO DO DESPACHANTE NO FLUXO foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 8,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Despachante envia ao agente de cargas dados de fornecedor e segue follow up junto ao mesmo para coleta de carga e reserva de embarque",
    "sla": "Até 1 dia após Caldic o incluir na cotação aprovada",
    "objetivoMetrica": "INCLUSÃO DO DESPACHANTE NA COTAÇÃO APROVADA X ENVIO DE DADOS AO AGENTE DE CARGAS",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento INCLUSÃO DO DESPACHANTE NA COTAÇÃO APROVADA foi registrado e o evento ENVIO DE DADOS AO AGENTE DE CARGAS ainda não.",
    "finalFarol": "O evento ENVIO DE DADOS AO AGENTE DE CARGAS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 9,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Caso se faça necessário LI pré, validar dados para LI / LPCO e emitir LI ( sinalizar agente de cargas / fornecedor quando estiver deferida LI)",
    "sla": "Emissão de LI até 1 dia após recebimento da proforma/ comercial invoice",
    "objetivoMetrica": "RECEBIMENTO DA PROFORMA/COMERCIAL INVOICE X EMISSÃO DA LI PRÉ",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DA PROFORMA/COMERCIAL INVOICE foi registrado e o evento EMISSÃO DA LI PRÉ ainda não.",
    "finalFarol": "O evento EMISSÃO DA LI PRÉ foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 10,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Verificar com a Caldic se o item está cadastrado no catálogo de produtos DUIMP",
    "sla": "Até 3 dias após recebimento do pedido de compras",
    "objetivoMetrica": "RECEBIMENTO DO PEDIDO DE COMPRAS X VERIFICAÇÃO DE CADASTRO DUIMP",
    "prazoHoras": 72,
    "prazoDias": 3,
    "targetsPorModal": {
      "aereo": {
        "horas": 72,
        "dias": 3
      },
      "maritimo": {
        "horas": 72,
        "dias": 3
      },
      "rodoviario": {
        "horas": 72,
        "dias": 3
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DO PEDIDO DE COMPRAS foi registrado e o evento VERIFICAÇÃO DE CADASTRO DUIMP ainda não.",
    "finalFarol": "O evento VERIFICAÇÃO DE CADASTRO DUIMP foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 11,
    "etapa": "1. Planejamento da Importação (Após recebimento de pedido)",
    "atividade": "Solicitar cadastro Anvisa para Caldic ( quando necessário)",
    "sla": "Até 1 dia após aprovação de documentos",
    "objetivoMetrica": "APROVAÇÃO DE DOCUMENTOS X SOLICITAÇÃO DE CADASTRO ANVISA",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento APROVAÇÃO DE DOCUMENTOS foi registrado e o evento SOLICITAÇÃO DE CADASTRO ANVISA ainda não.",
    "finalFarol": "O evento SOLICITAÇÃO DE CADASTRO ANVISA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 12,
    "etapa": "2. Gestão Pré-embarque",
    "atividade": "Solicitação de documentos finais assinados ao fornecedor",
    "sla": "Até 2 dias da aprovação dos drafts",
    "objetivoMetrica": "APROVAÇÃO DOS DRAFTS X SOLICITAÇÃO DE DOCUMENTOS FINAIS ASSINADOS",
    "prazoHoras": 48,
    "prazoDias": 2,
    "targetsPorModal": {
      "aereo": {
        "horas": 48,
        "dias": 2
      },
      "maritimo": {
        "horas": 48,
        "dias": 2
      },
      "rodoviario": {
        "horas": 48,
        "dias": 2
      }
    },
    "inicioFarol": "O evento APROVAÇÃO DOS DRAFTS foi registrado e o evento SOLICITAÇÃO DE DOCUMENTOS FINAIS ASSINADOS ainda não.",
    "finalFarol": "O evento SOLICITAÇÃO DE DOCUMENTOS FINAIS ASSINADOS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 13,
    "etapa": "2. Gestão Pré-embarque",
    "atividade": "Validação documentos finais assinados para garantir que são os mesmos aprovados",
    "sla": "até 1 dia da data de recebimento",
    "objetivoMetrica": "RECEBIMENTO DOS DOCUMENTOS FINAIS X VALIDAÇÃO DOS DOCUMENTOS FINAIS ASSINADOS",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DOS DOCUMENTOS FINAIS foi registrado e o evento VALIDAÇÃO DOS DOCUMENTOS FINAIS ASSINADOS ainda não.",
    "finalFarol": "O evento VALIDAÇÃO DOS DOCUMENTOS FINAIS ASSINADOS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 14,
    "etapa": "2. Gestão Pré-embarque",
    "atividade": "Registro de LI ou LPCO quando aplicável",
    "sla": "Emitir LI sub até 1 dia após recebimento dos documentos finais",
    "objetivoMetrica": "RECEBIMENTO DOS DOCUMENTOS FINAIS X EMISSÃO DA LI SUB",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DOS DOCUMENTOS FINAIS foi registrado e o evento EMISSÃO DA LI SUB ainda não.",
    "finalFarol": "O evento EMISSÃO DA LI SUB foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 15,
    "etapa": "2. Gestão Pré-embarque",
    "atividade": "Follow UP com freight forwarder / fornecedor para cobrar booking do embarque",
    "sla": "Contactar agente de cargas para atualização até 1 dia após receber informação Caldic",
    "objetivoMetrica": "INFORMAÇÃO DA CALDIC X CONTATO COM AGENTE DE CARGAS PARA COBRANÇA DE BOOKING",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento INFORMAÇÃO DA CALDIC foi registrado e o evento CONTATO COM AGENTE DE CARGAS PARA COBRANÇA DE BOOKING ainda não.",
    "finalFarol": "O evento CONTATO COM AGENTE DE CARGAS PARA COBRANÇA DE BOOKING foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 16,
    "etapa": "2. Gestão Pré-embarque",
    "atividade": "Sinalizar para Caldic quando o produto for controlado Portaria SVS/MS nº 344/1998.",
    "sla": "Até 1 dia antes do embarque",
    "objetivoMetrica": "EMBARQUE X SINALIZAÇÃO DE PRODUTO CONTROLADO À CALDIC",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento EMBARQUE foi registrado e o evento SINALIZAÇÃO DE PRODUTO CONTROLADO À CALDIC ainda não.",
    "finalFarol": "O evento SINALIZAÇÃO DE PRODUTO CONTROLADO À CALDIC foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 17,
    "etapa": "3. Embarque Internacional",
    "atividade": "Garantir que houve toda conferência do BL / AWB e validação de documentos finais",
    "sla": "Até 1 dia após receber documentos",
    "objetivoMetrica": "RECEBIMENTO DOS DOCUMENTOS X CONFERÊNCIA DO BL/AWB E VALIDAÇÃO",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DOS DOCUMENTOS foi registrado e o evento CONFERÊNCIA DO BL/AWB E VALIDAÇÃO ainda não.",
    "finalFarol": "O evento CONFERÊNCIA DO BL/AWB E VALIDAÇÃO foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 18,
    "etapa": "3. Embarque Internacional",
    "atividade": "Monitoramento do embarque",
    "sla": "Confirmar embarque até 2 dias após ETD informando no booking",
    "objetivoMetrica": "ETD INFORMADO NO BOOKING X CONFIRMAÇÃO DO EMBARQUE",
    "prazoHoras": 48,
    "prazoDias": 2,
    "targetsPorModal": {
      "aereo": {
        "horas": 48,
        "dias": 2
      },
      "maritimo": {
        "horas": 48,
        "dias": 2
      },
      "rodoviario": {
        "horas": 48,
        "dias": 2
      }
    },
    "inicioFarol": "O evento ETD INFORMADO NO BOOKING foi registrado e o evento CONFIRMAÇÃO DO EMBARQUE ainda não.",
    "finalFarol": "O evento CONFIRMAÇÃO DO EMBARQUE foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 19,
    "etapa": "3. Embarque Internacional",
    "atividade": "Atualização de ETA",
    "sla": "Até 1 dia após confirmação do embarque",
    "objetivoMetrica": "CONFIRMAÇÃO DO EMBARQUE X ATUALIZAÇÃO DO ETA",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento CONFIRMAÇÃO DO EMBARQUE foi registrado e o evento ATUALIZAÇÃO DO ETA ainda não.",
    "finalFarol": "O evento ATUALIZAÇÃO DO ETA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 20,
    "etapa": "3. Embarque Internacional",
    "atividade": "Gestão de eventuais rollovers ou atrasos",
    "sla": "Atualizar sistema em até 1 dia após recebimento da confirmação de alteração de booking",
    "objetivoMetrica": "CONFIRMAÇÃO DE ALTERAÇÃO DE BOOKING X ATUALIZAÇÃO DO SISTEMA",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento CONFIRMAÇÃO DE ALTERAÇÃO DE BOOKING foi registrado e o evento ATUALIZAÇÃO DO SISTEMA ainda não.",
    "finalFarol": "O evento ATUALIZAÇÃO DO SISTEMA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 21,
    "etapa": "3. Embarque Internacional",
    "atividade": "Cobrar free time do processo",
    "sla": "Até 1 dia após recebimento do BL/AWB final",
    "objetivoMetrica": "RECEBIMENTO DO BL/AWB FINAL X COBRANÇA DE FREE TIME",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DO BL/AWB FINAL foi registrado e o evento COBRANÇA DE FREE TIME ainda não.",
    "finalFarol": "O evento COBRANÇA DE FREE TIME foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 22,
    "etapa": "3. Embarque Internacional",
    "atividade": "Ao aprovar documentos, cobrar tracking de envio de originais e garantir que o conhecimento de embarque será enviado em tempo hábil da chegada do processo para liberação ou será liberado no destino antes da chegada da carga",
    "sla": "Até 3 dias após aprovação da versão final dos documentos",
    "objetivoMetrica": "APROVAÇÃO DA VERSÃO FINAL DOS DOCUMENTOS X COBRANÇA DE TRACKING DE ORIGINAIS",
    "prazoHoras": 72,
    "prazoDias": 3,
    "targetsPorModal": {
      "aereo": {
        "horas": 72,
        "dias": 3
      },
      "maritimo": {
        "horas": 72,
        "dias": 3
      },
      "rodoviario": {
        "horas": 72,
        "dias": 3
      }
    },
    "inicioFarol": "O evento APROVAÇÃO DA VERSÃO FINAL DOS DOCUMENTOS foi registrado e o evento COBRANÇA DE TRACKING DE ORIGINAIS ainda não.",
    "finalFarol": "O evento COBRANÇA DE TRACKING DE ORIGINAIS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 23,
    "etapa": "3. Embarque Internacional",
    "atividade": "Monitorar DTA de produtos controlados Portaria SVS/MS nº 344/1998.",
    "sla": "Em até 1 dia após embarque, enviar documentos de embarque para agente efetuar vinculação DTA",
    "objetivoMetrica": "EMBARQUE X ENVIO DE DOCUMENTOS PARA VINCULAÇÃO DTA",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento EMBARQUE foi registrado e o evento ENVIO DE DOCUMENTOS PARA VINCULAÇÃO DTA ainda não.",
    "finalFarol": "O evento ENVIO DE DOCUMENTOS PARA VINCULAÇÃO DTA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 24,
    "etapa": "4. Pós-embarque",
    "atividade": "Garantir que a LI pós-embarque esteja emitida logo que houver confirmação do embarque",
    "sla": "Até 1 dia após recebimento de documentos em versão final",
    "objetivoMetrica": "RECEBIMENTO DOS DOCUMENTOS EM VERSÃO FINAL X EMISSÃO DA LI PÓS-EMBARQUE",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DOS DOCUMENTOS EM VERSÃO FINAL foi registrado e o evento EMISSÃO DA LI PÓS-EMBARQUE ainda não.",
    "finalFarol": "O evento EMISSÃO DA LI PÓS-EMBARQUE foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 25,
    "etapa": "4. Pós-embarque",
    "atividade": "Conferência CE mercante",
    "sla": "Até 72 horas antes da chegada do embarque",
    "objetivoMetrica": "CHEGADA DO EMBARQUE X CONFERÊNCIA DA CE MERCANTE",
    "prazoHoras": 72,
    "prazoDias": 3,
    "targetsPorModal": {
      "aereo": {
        "horas": 72,
        "dias": 3
      },
      "maritimo": {
        "horas": 72,
        "dias": 3
      },
      "rodoviario": {
        "horas": 72,
        "dias": 3
      }
    },
    "inicioFarol": "O evento CHEGADA DO EMBARQUE foi registrado e o evento CONFERÊNCIA DA CE MERCANTE ainda não.",
    "finalFarol": "O evento CONFERÊNCIA DA CE MERCANTE foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 26,
    "etapa": "4. Pós-embarque",
    "atividade": "Confirmação do recebimento de documentos originais",
    "sla": "Até 4 dias antes da chegada do embarque",
    "objetivoMetrica": "CHEGADA DO EMBARQUE X CONFIRMAÇÃO DO RECEBIMENTO DE DOCUMENTOS ORIGINAIS",
    "prazoHoras": 96,
    "prazoDias": 4,
    "targetsPorModal": {
      "aereo": {
        "horas": 96,
        "dias": 4
      },
      "maritimo": {
        "horas": 96,
        "dias": 4
      },
      "rodoviario": {
        "horas": 96,
        "dias": 4
      }
    },
    "inicioFarol": "O evento CHEGADA DO EMBARQUE foi registrado e o evento CONFIRMAÇÃO DO RECEBIMENTO DE DOCUMENTOS ORIGINAIS ainda não.",
    "finalFarol": "O evento CONFIRMAÇÃO DO RECEBIMENTO DE DOCUMENTOS ORIGINAIS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 27,
    "etapa": "4. Pós-embarque",
    "atividade": "Tratativas Anvisa relacionada a exigências, indeferimentos, manifestações e recursos",
    "sla": "Até 1 dia de qualquer solicitação imposta pelo órgão anuente",
    "objetivoMetrica": "SOLICITAÇÃO IMPOSTA PELO ÓRGÃO ANUENTE X TRATATIVA ANVISA",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento SOLICITAÇÃO IMPOSTA PELO ÓRGÃO ANUENTE foi registrado e o evento TRATATIVA ANVISA ainda não.",
    "finalFarol": "O evento TRATATIVA ANVISA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 28,
    "etapa": "4. Pós-embarque",
    "atividade": "Emitir solicitação de numérario para Caldic depositar os valores de impostos e taxas a serem debitados na conta do despachante",
    "sla": "Até 1 dias antes da chegada do embarque",
    "objetivoMetrica": "CHEGADA DO EMBARQUE X EMISSÃO DE SOLICITAÇÃO DE NUMERÁRIO",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento CHEGADA DO EMBARQUE foi registrado e o evento EMISSÃO DE SOLICITAÇÃO DE NUMERÁRIO ainda não.",
    "finalFarol": "O evento EMISSÃO DE SOLICITAÇÃO DE NUMERÁRIO foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 29,
    "etapa": "5. Chegada da Carga no Brasil",
    "atividade": "Envio de numerário para Caldic com os valores a serem debitados para serem transferidos para a conta do despachante",
    "sla": "Até 1 dia antes da data da chegada do embarque",
    "objetivoMetrica": "CHEGADA DO EMBARQUE X ENVIO DE NUMERÁRIO À CALDIC",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento CHEGADA DO EMBARQUE foi registrado e o evento ENVIO DE NUMERÁRIO À CALDIC ainda não.",
    "finalFarol": "O evento ENVIO DE NUMERÁRIO À CALDIC foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 30,
    "etapa": "5. Chegada da Carga no Brasil",
    "atividade": "Monitoramento da atracação e da presença de carga",
    "sla": "D0 da data de ETA informando no booking",
    "objetivoMetrica": "DATA DE ETA INFORMADA NO BOOKING X MONITORAMENTO DA ATRACAÇÃO E PRESENÇA DE CARGA",
    "prazoHoras": 8,
    "prazoDias": 0,
    "targetsPorModal": {
      "aereo": {
        "horas": 8,
        "dias": 0
      },
      "maritimo": {
        "horas": 8,
        "dias": 0
      },
      "rodoviario": {
        "horas": 8,
        "dias": 0
      }
    },
    "inicioFarol": "O evento DATA DE ETA INFORMADA NO BOOKING foi registrado e o evento MONITORAMENTO DA ATRACAÇÃO E PRESENÇA DE CARGA ainda não.",
    "finalFarol": "O evento MONITORAMENTO DA ATRACAÇÃO E PRESENÇA DE CARGA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 31,
    "etapa": "5. Chegada da Carga no Brasil",
    "atividade": "Conferência de manifestação no sistema",
    "sla": "D0 de sistema data de ETA informando no booking",
    "objetivoMetrica": "DATA DE ETA INFORMADA NO BOOKING X CONFERÊNCIA DE MANIFESTAÇÃO NO SISTEMA",
    "prazoHoras": 8,
    "prazoDias": 0,
    "targetsPorModal": {
      "aereo": {
        "horas": 8,
        "dias": 0
      },
      "maritimo": {
        "horas": 8,
        "dias": 0
      },
      "rodoviario": {
        "horas": 8,
        "dias": 0
      }
    },
    "inicioFarol": "O evento DATA DE ETA INFORMADA NO BOOKING foi registrado e o evento CONFERÊNCIA DE MANIFESTAÇÃO NO SISTEMA ainda não.",
    "finalFarol": "O evento CONFERÊNCIA DE MANIFESTAÇÃO NO SISTEMA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 32,
    "etapa": "5. Chegada da Carga no Brasil",
    "atividade": "Registro da DI ou DUIMP",
    "sla": "D0 da presença de cargas;",
    "objetivoMetrica": "PRESENÇA DE CARGA X REGISTRO DA DI OU DUIMP",
    "prazoHoras": 8,
    "prazoDias": 0,
    "targetsPorModal": {
      "aereo": {
        "horas": 8,
        "dias": 0
      },
      "maritimo": {
        "horas": 8,
        "dias": 0
      },
      "rodoviario": {
        "horas": 8,
        "dias": 0
      }
    },
    "inicioFarol": "O evento PRESENÇA DE CARGA foi registrado e o evento REGISTRO DA DI OU DUIMP ainda não.",
    "finalFarol": "O evento REGISTRO DA DI OU DUIMP foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 33,
    "etapa": "5. Chegada da Carga no Brasil",
    "atividade": "Pagamento de tributos",
    "sla": "D0 do registro DI",
    "objetivoMetrica": "REGISTRO DA DI X PAGAMENTO DE TRIBUTOS",
    "prazoHoras": 8,
    "prazoDias": 0,
    "targetsPorModal": {
      "aereo": {
        "horas": 8,
        "dias": 0
      },
      "maritimo": {
        "horas": 8,
        "dias": 0
      },
      "rodoviario": {
        "horas": 8,
        "dias": 0
      }
    },
    "inicioFarol": "O evento REGISTRO DA DI foi registrado e o evento PAGAMENTO DE TRIBUTOS ainda não.",
    "finalFarol": "O evento PAGAMENTO DE TRIBUTOS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 34,
    "etapa": "5. Chegada da Carga no Brasil",
    "atividade": "Acompanhamento de parametrização",
    "sla": "Até 1 dia após registro DI",
    "objetivoMetrica": "REGISTRO DA DI X ACOMPANHAMENTO DE PARAMETRIZAÇÃO",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento REGISTRO DA DI foi registrado e o evento ACOMPANHAMENTO DE PARAMETRIZAÇÃO ainda não.",
    "finalFarol": "O evento ACOMPANHAMENTO DE PARAMETRIZAÇÃO foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 35,
    "etapa": "6.Desembaraço Aduaneiro",
    "atividade": "Gestão de exigências da RFB",
    "sla": "Até 1 dia de qualquer exigência imposta",
    "objetivoMetrica": "EXIGÊNCIA IMPOSTA PELA RFB X GESTÃO DA EXIGÊNCIA",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento EXIGÊNCIA IMPOSTA PELA RFB foi registrado e o evento GESTÃO DA EXIGÊNCIA ainda não.",
    "finalFarol": "O evento GESTÃO DA EXIGÊNCIA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 36,
    "etapa": "6.Desembaraço Aduaneiro",
    "atividade": "Interface com órgãos anuentes",
    "sla": "Até 1 dia de qualquer exigência imposta",
    "objetivoMetrica": "EXIGÊNCIA IMPOSTA PELO ÓRGÃO ANUENTE X INTERFACE COM ÓRGÃOS ANUENTES",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento EXIGÊNCIA IMPOSTA PELO ÓRGÃO ANUENTE foi registrado e o evento INTERFACE COM ÓRGÃOS ANUENTES ainda não.",
    "finalFarol": "O evento INTERFACE COM ÓRGÃOS ANUENTES foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 37,
    "etapa": "6.Desembaraço Aduaneiro",
    "atividade": "Acompanhamento de canal verde / amarelo / vermelho",
    "sla": "Até 1 dia após registro DI",
    "objetivoMetrica": "REGISTRO DA DI X ACOMPANHAMENTO DE CANAL",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento REGISTRO DA DI foi registrado e o evento ACOMPANHAMENTO DE CANAL ainda não.",
    "finalFarol": "O evento ACOMPANHAMENTO DE CANAL foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 38,
    "etapa": "6.Desembaraço Aduaneiro",
    "atividade": "Liberação da carga no porto / aeroporto",
    "sla": "Até 1 dia após emissão nota de entrada, se houver bloqueio Siscarga, até 1 dia após desbloqueio Siscarga;",
    "objetivoMetrica": "EMISSÃO DA NOTA DE ENTRADA X LIBERAÇÃO DA CARGA",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento EMISSÃO DA NOTA DE ENTRADA foi registrado e o evento LIBERAÇÃO DA CARGA ainda não.",
    "finalFarol": "O evento LIBERAÇÃO DA CARGA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 39,
    "etapa": "7. Pós-desembaraço",
    "atividade": "Pagamento de armazenagem",
    "sla": "D0 da data de recebimento",
    "objetivoMetrica": "RECEBIMENTO DOS VALORES X PAGAMENTO DE ARMAZENAGEM",
    "prazoHoras": 8,
    "prazoDias": 0,
    "targetsPorModal": {
      "aereo": {
        "horas": 8,
        "dias": 0
      },
      "maritimo": {
        "horas": 8,
        "dias": 0
      },
      "rodoviario": {
        "horas": 8,
        "dias": 0
      }
    },
    "inicioFarol": "O evento RECEBIMENTO DOS VALORES foi registrado e o evento PAGAMENTO DE ARMAZENAGEM ainda não.",
    "finalFarol": "O evento PAGAMENTO DE ARMAZENAGEM foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 40,
    "etapa": "7. Pós-desembaraço",
    "atividade": "Liberação de documentos ao transportador e time Caldic de agendamento de retirada de entrega de caga na planta (Caroline Steinbach)",
    "sla": "Até 1 dia após emissão de NF e ou desbloqueio Siscarga quando houver",
    "objetivoMetrica": "EMISSÃO DA NF OU DESBLOQUEIO SISCARGA X LIBERAÇÃO DE DOCUMENTOS",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento EMISSÃO DA NF OU DESBLOQUEIO SISCARGA foi registrado e o evento LIBERAÇÃO DE DOCUMENTOS ainda não.",
    "finalFarol": "O evento LIBERAÇÃO DE DOCUMENTOS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 41,
    "etapa": "8. Transporte Nacional e Entrega",
    "atividade": "Cobrar minuta de devolução de vazio ao transportador quando for casos FCL",
    "sla": "Até 1 dias após entrega",
    "objetivoMetrica": "ENTREGA DA CARGA X COBRANÇA DE MINUTA DE DEVOLUÇÃO DE VAZIO",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento ENTREGA DA CARGA foi registrado e o evento COBRANÇA DE MINUTA DE DEVOLUÇÃO DE VAZIO ainda não.",
    "finalFarol": "O evento COBRANÇA DE MINUTA DE DEVOLUÇÃO DE VAZIO foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 42,
    "etapa": "8. Transporte Nacional e Entrega",
    "atividade": "Emitir fichas de recebimento de carga na planta Active",
    "sla": "Até 2 dia antes da entrega na planta",
    "objetivoMetrica": "ENTREGA NA PLANTA X EMISSÃO DE FICHAS DE RECEBIMENTO DE CARGA",
    "prazoHoras": 48,
    "prazoDias": 2,
    "targetsPorModal": {
      "aereo": {
        "horas": 48,
        "dias": 2
      },
      "maritimo": {
        "horas": 48,
        "dias": 2
      },
      "rodoviario": {
        "horas": 48,
        "dias": 2
      }
    },
    "inicioFarol": "O evento ENTREGA NA PLANTA foi registrado e o evento EMISSÃO DE FICHAS DE RECEBIMENTO DE CARGA ainda não.",
    "finalFarol": "O evento EMISSÃO DE FICHAS DE RECEBIMENTO DE CARGA foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 43,
    "etapa": "9. Pós-processo / Controle",
    "atividade": "Conferência de custos logísticos",
    "sla": "1 dia antes do faturamento",
    "objetivoMetrica": "FATURAMENTO X CONFERÊNCIA DE CUSTOS LOGÍSTICOS",
    "prazoHoras": 24,
    "prazoDias": 1,
    "targetsPorModal": {
      "aereo": {
        "horas": 24,
        "dias": 1
      },
      "maritimo": {
        "horas": 24,
        "dias": 1
      },
      "rodoviario": {
        "horas": 24,
        "dias": 1
      }
    },
    "inicioFarol": "O evento FATURAMENTO foi registrado e o evento CONFERÊNCIA DE CUSTOS LOGÍSTICOS ainda não.",
    "finalFarol": "O evento CONFERÊNCIA DE CUSTOS LOGÍSTICOS foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 44,
    "etapa": "9. Pós-processo / Controle",
    "atividade": "Faturamento para Caldic - (OBS: NF de serviço ao ser emitidas, devem ser enviadas dentro do mês de competência para registro fiscal)",
    "sla": "Até 2 dias após entrega da carga na planta Caldic",
    "objetivoMetrica": "ENTREGA DA CARGA NA PLANTA X FATURAMENTO PARA CALDIC",
    "prazoHoras": 48,
    "prazoDias": 2,
    "targetsPorModal": {
      "aereo": {
        "horas": 48,
        "dias": 2
      },
      "maritimo": {
        "horas": 48,
        "dias": 2
      },
      "rodoviario": {
        "horas": 48,
        "dias": 2
      }
    },
    "inicioFarol": "O evento ENTREGA DA CARGA NA PLANTA foi registrado e o evento FATURAMENTO PARA CALDIC ainda não.",
    "finalFarol": "O evento FATURAMENTO PARA CALDIC foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  },
  {
    "id": 45,
    "etapa": "9. Pós-processo / Controle",
    "atividade": "Garantir que os documentos gerados nos processos estejam anexados no sistema Easy Trade",
    "sla": "Até 2 dias após faturamento",
    "objetivoMetrica": "FATURAMENTO X ANEXAÇÃO DOS DOCUMENTOS NO EASY TRADE",
    "prazoHoras": 48,
    "prazoDias": 2,
    "targetsPorModal": {
      "aereo": {
        "horas": 48,
        "dias": 2
      },
      "maritimo": {
        "horas": 48,
        "dias": 2
      },
      "rodoviario": {
        "horas": 48,
        "dias": 2
      }
    },
    "inicioFarol": "O evento FATURAMENTO foi registrado e o evento ANEXAÇÃO DOS DOCUMENTOS NO EASY TRADE ainda não.",
    "finalFarol": "O evento ANEXAÇÃO DOS DOCUMENTOS NO EASY TRADE foi registrado.",
    "responsavel": null,
    "status": "nao_informado",
    "dataInicio": null,
    "dataConclusao": null
  }
];

export const planejamentoSantaCatarina: AtividadePlanejamento[] =
    atividadesSantaCatarina.map((atividade, index) => ({
        ...atividade,
        atividadeKey: `santa-catarina-${index + 1}`,
    }));