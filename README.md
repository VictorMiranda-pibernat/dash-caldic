# Dash CALDIC - KPI

Dashboard de Business Intelligence desenvolvido para acompanhamento e análise dos indicadores operacionais dos processos de importação da CALDIC.

A aplicação permite monitorar atividades, acompanhar prazos, avaliar o cumprimento dos SLAs e visualizar o desempenho operacional por meio de indicadores e gráficos interativos.

## Objetivo

Centralizar os indicadores dos processos de importação em uma única plataforma, proporcionando maior visibilidade operacional e apoiando a tomada de decisão.

## Unidades atendidas

- Guarulhos
- Santa Catarina

## Etapas do processo

O dashboard está organizado em nove etapas operacionais:

1. Planejamento
2. Gestão Pré-Embarque
3. Embarque Internacional
4. Pós-Embarque
5. Chegada Brasil
6. Desembaraço Aduaneiro
7. Pós-Desembaraço Aduaneiro
8. Transporte Nacional e Entrega
9. Pós-processo / Controle

Além das etapas, o sistema possui uma página inicial (Home).

## Funcionalidades

- Navegação entre as etapas do processo.
- Seleção da unidade operacional.
- Indicadores de desempenho (KPIs).
- Monitoramento de SLA.
- Comparação de execuções dentro e fora do prazo.
- Gráficos de evolução mensal.
- Análise de aderência por atividade.
- Filtros por período e modal de transporte.
- Dados demonstrativos para validação das funcionalidades.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React | Interface |
| Vite | Desenvolvimento e build |
| TypeScript | Tipagem |
| Tailwind CSS | Estilização |
| React Router DOM | Navegação |
| Lucide React | Ícones |
| Recharts | Gráficos |

## Estrutura do projeto

```text
dash-caldic/
├── public/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   ├── data/
│   │   │   └── mock/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── repositories/
│   │   ├── types/
│   │   └── utils/
│   ├── hooks/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

*Observação: a estrutura acima representa a organização principal da aplicação; arquivos adicionais de configuração podem existir no repositório.*

## Como executar localmente

### Pré-requisitos

- Node.js
- npm
- Git

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Entrar na pasta

```bash
cd dash-caldic
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Executar o projeto

```bash
npm run dev
```

### 5. Gerar build de produção

```bash
npm run build
```

Os arquivos compilados serão gerados na pasta `dist`.

## Dados e integração

Atualmente, o dashboard utiliza dados demonstrativos para validar a estrutura das páginas, os filtros, os gráficos e os cálculos dos indicadores.

A integração com Google BigQuery, por meio de uma API ou serviço de backend, está prevista como próxima etapa de desenvolvimento.

Os dados apresentados na versão demonstrativa não representam resultados reais da operação.

## Indicadores e SLA

Os indicadores são calculados a partir das regras de prazo definidas para cada atividade.

Principais métricas:

- Total de execuções;
- Execuções dentro do SLA;
- Execuções fora do SLA;
- Aderência percentual;
- Tempo médio por atividade;
- Evolução mensal do desempenho.

## Status do projeto

**Em desenvolvimento.**

- [x] Estrutura inicial do dashboard.
- [x] Navegação entre as etapas.
- [x] Separação das unidades operacionais.
- [x] Estrutura de dados demonstrativos.
- [x] Indicadores e gráficos.
- [x] Filtros de período e modal.
- [x] Consolidação de indicadores de Pós-processo.
- [ ] Integração com BigQuery.
- [ ] Integração definitiva com dados reais.
- [ ] Validação final dos indicadores com a operação.

## Documentação

A documentação técnica completa descreve a arquitetura, as funcionalidades, as regras de negócio, os indicadores e as próximas etapas do projeto.

---

**Projeto:** Dash CALDIC - KPI  
**Categoria:** Business Intelligence / Gestão Operacional  
**Desenvolvimento:** Novembro de 2026
