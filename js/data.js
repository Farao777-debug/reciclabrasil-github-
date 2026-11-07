/**
 * ============================================================================
 * ReciclaBrasil v2.0 — data.js
 * Base de Dados Estática: Pontos de Coleta, Dados de Auditoria,
 * Indicadores Globais de Lixo Eletrônico (E-waste) e Iniciativas Oficiais.
 * ============================================================================
 */

/**
 * Categorias de materiais recicláveis aceitos pela plataforma.
 * Cada categoria possui identificador, rótulo amigável, ícone visual e cor de referência.
 */
const CATEGORIAS = [
  { id: "papel",      nome: "Papel e Papelão", icone: "📄", cor: "#3B82F6" },
  { id: "plastico",   nome: "Plásticos",       icone: "🧴", cor: "#EF4444" },
  { id: "metal",      nome: "Metais",          icone: "🥫", cor: "#F59E0B" },
  { id: "vidro",      nome: "Vidros",          icone: "🍾", cor: "#10B981" },
  { id: "eletronico", nome: "Lixo Eletrônico", icone: "💻", cor: "#6366F1" },
  { id: "organico",   nome: "Orgânicos",       icone: "🌿", cor: "#84CC16" },
  { id: "oleo",       nome: "Óleo de Cozinha", icone: "🛢️", cor: "#F97316" },
  { id: "pilhas",     nome: "Pilhas e Baterias", icone: "🔋", cor: "#DC2626" },
];

/**
 * Pontos de Coleta Aprovados (Oficiais / Verificados).
 * Estes pontos são exibidos publicamente no mapa e na lista de ecopontos.
 */
const PONTOS_INICIAIS = [
  /* --- São Paulo / SP --- */
  {
    id: 101,
    nome: "Ecoponto Pinheiros",
    endereco: "Rua dos Pinheiros, 100 – Pinheiros, São Paulo/SP",
    lat: -23.5666, lng: -46.6868,
    categorias: ["papel", "plastico", "metal", "vidro", "eletronico"],
    horario: "Seg–Sáb 8h–18h",
    telefone: "(11) 3000-1234",
    avaliacao: 4.8,
    status: "aprovado",
    dataAprovacao: "2026-08-01"
  },
  {
    id: 102,
    nome: "PEV Paulista Recicla",
    endereco: "Av. Paulista, 900 – Bela Vista, São Paulo/SP",
    lat: -23.5629, lng: -46.6544,
    categorias: ["papel", "plastico", "eletronico", "pilhas"],
    horario: "Seg–Dom 7h–20h",
    telefone: "(11) 3000-5678",
    avaliacao: 4.9,
    status: "aprovado",
    dataAprovacao: "2026-08-05"
  },
  {
    id: 103,
    nome: "Ecocentro Vila Madalena",
    endereco: "Rua Girassol, 50 – Vila Madalena, São Paulo/SP",
    lat: -23.5566, lng: -46.6925,
    categorias: ["papel", "plastico", "metal", "vidro", "organico", "oleo"],
    horario: "Seg–Sex 8h–17h",
    telefone: "(11) 3000-9012",
    avaliacao: 4.6,
    status: "aprovado",
    dataAprovacao: "2026-08-10"
  },
  {
    id: 104,
    nome: "Coopermiti E-Lixo SP",
    endereco: "Rua João Rudge, 366 – Casa Verde, São Paulo/SP",
    lat: -23.5132, lng: -46.6569,
    categorias: ["eletronico", "pilhas", "metal"],
    horario: "Seg–Sex 8h30–17h30",
    telefone: "(11) 3666-0849",
    avaliacao: 5.0,
    status: "aprovado",
    dataAprovacao: "2026-08-12"
  },

  /* --- Rio de Janeiro / RJ --- */
  {
    id: 105,
    nome: "Ecoponto Ipanema",
    endereco: "Av. Vieira Souto, 200 – Ipanema, Rio de Janeiro/RJ",
    lat: -22.9868, lng: -43.2043,
    categorias: ["papel", "plastico", "vidro", "metal"],
    horario: "Seg–Dom 7h–19h",
    telefone: "(21) 3900-1111",
    avaliacao: 4.7,
    status: "aprovado",
    dataAprovacao: "2026-08-15"
  },
  {
    id: 106,
    nome: "PEV Botafogo Sustentável",
    endereco: "Praia de Botafogo, 400 – Botafogo, Rio de Janeiro/RJ",
    lat: -22.9461, lng: -43.1859,
    categorias: ["eletronico", "pilhas", "metal", "plastico"],
    horario: "Ter–Dom 8h–17h",
    telefone: "(21) 3900-2222",
    avaliacao: 4.5,
    status: "aprovado",
    dataAprovacao: "2026-08-18"
  },

  /* --- Belo Horizonte / MG --- */
  {
    id: 107,
    nome: "Ecoponto Savassi",
    endereco: "Praça Diogo de Vasconcelos – Savassi, Belo Horizonte/MG",
    lat: -19.9370, lng: -43.9378,
    categorias: ["papel", "plastico", "metal", "vidro", "eletronico"],
    horario: "Seg–Sex 7h–18h",
    telefone: "(31) 3200-4444",
    avaliacao: 4.6,
    status: "aprovado",
    dataAprovacao: "2026-08-20"
  },
  {
    id: 108,
    nome: "PEV Pampulha Verde",
    endereco: "Av. Otacílio Negrão de Lima, 1200 – Pampulha, Belo Horizonte/MG",
    lat: -19.8606, lng: -43.9727,
    categorias: ["eletronico", "pilhas", "oleo"],
    horario: "Ter–Dom 8h–17h",
    telefone: "(31) 3200-5555",
    avaliacao: 4.4,
    status: "aprovado",
    dataAprovacao: "2026-08-22"
  },

  /* --- Brasília / DF --- */
  {
    id: 109,
    nome: "Ecoponto Asa Norte",
    endereco: "SQN 315 – Asa Norte, Brasília/DF",
    lat: -15.7622, lng: -47.8784,
    categorias: ["papel", "plastico", "metal", "vidro", "pilhas", "eletronico"],
    horario: "Seg–Sáb 8h–18h",
    telefone: "(61) 3200-6666",
    avaliacao: 4.7,
    status: "aprovado",
    dataAprovacao: "2026-08-24"
  },
  {
    id: 110,
    nome: "Ponto Verde Asa Sul",
    endereco: "SQS 210 – Asa Sul, Brasília/DF",
    lat: -15.8057, lng: -47.8934,
    categorias: ["papel", "plastico", "organico", "oleo"],
    horario: "Seg–Sex 7h–17h",
    telefone: "(61) 3200-7777",
    avaliacao: 4.3,
    status: "aprovado",
    dataAprovacao: "2026-08-25"
  },

  /* --- Curitiba / PR --- */
  {
    id: 111,
    nome: "Ecoponto Batel Sustentável",
    endereco: "Rua Bispo Dom José, 1000 – Batel, Curitiba/PR",
    lat: -25.4428, lng: -49.2892,
    categorias: ["papel", "plastico", "metal", "vidro", "eletronico"],
    horario: "Seg–Sáb 7h–19h",
    telefone: "(41) 3300-5555",
    avaliacao: 4.9,
    status: "aprovado",
    dataAprovacao: "2026-08-26"
  },
  {
    id: 112,
    nome: "PEV Parque Barigui",
    endereco: "Parque Barigui – Cascatinha, Curitiba/PR",
    lat: -25.4298, lng: -49.3259,
    categorias: ["papel", "plastico", "oleo", "vidro", "pilhas"],
    horario: "Seg–Dom 8h–18h",
    telefone: "(41) 3300-6666",
    avaliacao: 4.8,
    status: "aprovado",
    dataAprovacao: "2026-08-27"
  },

  /* --- Porto Alegre / RS --- */
  {
    id: 113,
    nome: "Ecoponto Moinhos de Vento",
    endereco: "Rua 24 de Outubro, 300 – Moinhos de Vento, Porto Alegre/RS",
    lat: -30.0195, lng: -51.1934,
    categorias: ["papel", "plastico", "vidro", "metal", "eletronico"],
    horario: "Seg–Dom 6h–20h",
    telefone: "(51) 3200-8888",
    avaliacao: 4.9,
    status: "aprovado",
    dataAprovacao: "2026-08-28"
  },

  /* --- Salvador / BA --- */
  {
    id: 114,
    nome: "Ecoponto Orla da Barra",
    endereco: "Av. Oceânica, 100 – Barra, Salvador/BA",
    lat: -13.0094, lng: -38.5322,
    categorias: ["papel", "plastico", "vidro", "oleo", "eletronico"],
    horario: "Seg–Sáb 8h–17h",
    telefone: "(71) 3300-1111",
    avaliacao: 4.5,
    status: "aprovado",
    dataAprovacao: "2026-08-29"
  },

  /* --- Manaus / AM --- */
  {
    id: 115,
    nome: "Ecoponto Floresta Viva",
    endereco: "Av. Eduardo Ribeiro, 520 – Centro, Manaus/AM",
    lat: -3.1310, lng: -60.0212,
    categorias: ["papel", "plastico", "eletronico", "pilhas"],
    horario: "Seg–Sex 8h–17h",
    telefone: "(92) 3200-4444",
    avaliacao: 4.4,
    status: "aprovado",
    dataAprovacao: "2026-08-30"
  },

  /* --- Recife / PE --- */
  {
    id: 116,
    nome: "Ecoponto Boa Viagem",
    endereco: "Av. Boa Viagem, 200 – Boa Viagem, Recife/PE",
    lat: -8.1199, lng: -34.9009,
    categorias: ["papel", "plastico", "vidro", "metal", "eletronico"],
    horario: "Seg–Dom 7h–18h",
    telefone: "(81) 3300-7777",
    avaliacao: 4.6,
    status: "aprovado",
    dataAprovacao: "2026-08-31"
  }
];

/**
 * Fila Inicial de Auditoria (Pontos Pendentes para Moderação).
 * Estes pontos representam submissões de cidadãos que aguardam aprovação
 * do administrador/auditor para irem a público no mapa e na lista.
 */
const PONTOS_PENDENTES_INICIAIS = [
  {
    id: 201,
    nome: "Ecoponto Comunitário Parque Ibirapuera",
    endereco: "Av. Pedro Álvares Cabral, Portão 3 – Moema, São Paulo/SP",
    lat: -23.5874, lng: -46.6576,
    categorias: ["eletronico", "pilhas", "plastico"],
    horario: "Seg–Dom 6h–20h",
    telefone: "(11) 98765-4321",
    submetidoPor: "Mariana Silva (Cidadã)",
    dataSubmissao: "2026-09-08 14:30",
    observacoes: "Ponto instalado próximo ao portão 3 para descarte rápido de baterias e celulares velhos.",
    status: "pendente"
  },
  {
    id: 202,
    nome: "Cooperativa Recicla Brasília - Lago Sul",
    endereco: "SHIS QI 15, Bloco C – Lago Sul, Brasília/DF",
    lat: -15.8398, lng: -47.8765,
    categorias: ["papel", "plastico", "vidro", "eletronico"],
    horario: "Seg–Sex 8h–17h",
    telefone: "(61) 99888-1122",
    submetidoPor: "Carlos Eduardo (Associação de Moradores)",
    dataSubmissao: "2026-09-09 09:15",
    observacoes: "Cooperativa formalizada em processo de inclusão no catálogo municipal.",
    status: "pendente"
  },
  {
    id: 203,
    nome: "Ponto Verde E-Lixo Campinas",
    endereco: "Rua Barão de Jaguara, 700 – Centro, Campinas/SP",
    lat: -22.9056, lng: -47.0608,
    categorias: ["eletronico", "pilhas", "metal"],
    horario: "Seg–Sáb 9h–18h",
    telefone: "(19) 3234-5678",
    submetidoPor: "Lucas Ferreira (Voluntário Ambiental)",
    dataSubmissao: "2026-09-09 16:40",
    observacoes: "Posto em frente à galeria comercial com coletor seguro para pilhas e cabos.",
    status: "pendente"
  }
];

/**
 * Indicadores e Estatísticas Oficiais sobre o Cenário do Lixo Eletrônico (E-waste).
 * Fontes consolidadas: The Global E-waste Monitor (ONU / UNITAR / ITU), ABREE e Green Eletron.
 */
const EWASTE_DADOS = {
  brasil: {
    geracaoTotalTon: "2.500.000 ton",
    geracaoTotalNum: 2500000,
    geracaoPorHabitanteKg: "10,2 kg/hab",
    geracaoPorHabitanteNum: 10.2,
    taxaReciclagemFormal: "3,0%",
    taxaReciclagemNum: 3.0,
    rankingGlobal: "5º maior gerador mundial",
    rankingAmericas: "2º nas Américas (atrás apenas dos EUA)",
    valorDesperdicadoEstimado: "R$ 1,5 bilhão/ano em ouro, cobre e lítio",
    pontosColetaRegistrados: "Mais de 5.500 pontos formais (meta de expansão nacional)"
  },
  mundo: {
    geracaoTotalTon: "62.000.000 ton/ano",
    geracaoTotalNum: 62000000,
    geracaoPorHabitanteKg: "7,8 kg/hab",
    geracaoPorHabitanteNum: 7.8,
    taxaReciclagemFormal: "22,3%",
    taxaReciclagemNum: 22.3,
    crescimentoAnual: "+2,6 milhões de ton/ano",
    previsao2030: "82 milhões de toneladas até 2030",
    valorEconomicoPerdido: "US$ 91 bilhões/ano em matérias-primas críticas",
    emissoesEvitadasSeReciclado: "Até 93 milhões de toneladas de CO₂ equivalente"
  },
  metaisPerigosos: [
    {
      elemento: "Chumbo (Pb)",
      onde: "Tubos de monitores antigos (CRT), placas de circuito impresso e soldas.",
      riscos: "Neurotóxico grave, causa danos ao sistema nervoso central, rins e desenvolvimento cognitivo infantil."
    },
    {
      elemento: "Mercúrio (Hg)",
      onde: "Lâmpadas fluorescentes, termostatos e telas de cristal líquido (LCD).",
      riscos: "Altamente bioacumulativo na cadeia alimentar, contamina aquíferos e afeta o cérebro humano."
    },
    {
      elemento: "Cádmio (Cd)",
      onde: "Baterias recarregáveis Ni-Cd, chips semicondutores e revestimentos.",
      riscos: "Carcinogênico comprovado, acumula-se nos rins e fragiliza a estrutura óssea humana."
    },
    {
      elemento: "Retardantes de Chama (BFR)",
      onde: "Carcaças plásticas de notebooks, monitores, televisores e cabos.",
      riscos: "Disruptores hormonais persistentes no meio ambiente, poluem o solo por décadas."
    }
  ],
  metaisPreciosos: [
    {
      material: "Ouro (Au)",
      rendimento: "Até 300g por tonelada de smartphones",
      comparacao: "100x mais rico em ouro do que o minério bruto de extração primária em minas."
    },
    {
      material: "Cobre (Cu)",
      rendimento: "Cerca de 130 kg por tonelada de placas de circuito",
      comparacao: "Fundamental para transição energética e fios elétricos sem necessidade de novas mineradoras."
    },
    {
      material: "Lítio & Cobalto",
      rendimento: "Recuperação de até 95% em plantas especializadas",
      comparacao: "Reduz a dependência de mineração predatória para novas baterias de veículos elétricos e celulares."
    }
  ]
};

/**
 * Principais Iniciativas, Associações e Organizações Oficiais sobre E-waste (Brasil e Mundo).
 * Contém links diretos verificados para os portais oficiais.
 */
const INICIATIVAS = [
  /* --- Iniciativas no Brasil --- */
  {
    id: "greeneletron",
    nome: "Green Eletron",
    escopo: "Brasil",
    tipo: "Logística Reversa",
    descricao: "Fundada pela Abinee, é a maior gestora sem fins lucrativos para a logística reversa de eletroeletrônicos e pilhas no Brasil, com milhares de PEVs em todos os estados.",
    website: "https://greeneletron.org.br",
    icone: "🌱",
    tags: ["Logística Reversa", "Nacional", "Ecopontos"],
    destaque: "Gestora líder nacional"
  },
  {
    id: "abree",
    nome: "ABREE",
    escopo: "Brasil",
    tipo: "Associação Setorial",
    descricao: "Associação Brasileira de Reciclagem de Eletroeletrônicos e Eletrodomésticos. Articula indústrias para implantar a logística reversa conforme o Decreto Federal 10.240/2020.",
    website: "https://abree.org.br",
    icone: "⚡",
    tags: ["Decreto 10.240", "Eletrodomésticos", "Indústria"],
    destaque: "Linha branca e marrom"
  },
  {
    id: "cedir-usp",
    nome: "CEDIR - USP",
    escopo: "Brasil",
    tipo: "Universidade / Pesquisa",
    descricao: "Centro pioneiro de Descarte e Reúso de Equipamentos de Informática da Universidade de São Paulo. Recupera equipamentos para fins sociais e desmonta materiais com segurança.",
    website: "https://cedir.usp.br",
    icone: "🎓",
    tags: ["Inclusão Digital", "USP", "Reúso"],
    destaque: "Pioneiro acadêmico"
  },
  {
    id: "coopermiti",
    nome: "Coopermiti",
    escopo: "Brasil",
    tipo: "Cooperativa Certificada",
    descricao: "Primeira cooperativa de São Paulo conveniada com a prefeitura e licenciada pelos órgãos ambientais, especializada exclusivamente na reciclagem e triagem de resíduos eletrônicos.",
    website: "https://coopermiti.com.br",
    icone: "🤝",
    tags: ["Cooperativismo", "Inclusão Social", "Certificada"],
    destaque: "Impacto social e ambiental"
  },
  {
    id: "descarte-certo",
    nome: "Descarte Certo",
    escopo: "Brasil",
    tipo: "Empresa de Economia Circular",
    descricao: "Empresa brasileira de gestão integral de resíduos de tecnologia, emissão de certificados de destinação ambiental e destruição segura de dados corporativos confidenciais.",
    website: "https://descartecerto.com.br",
    icone: "🛡️",
    tags: ["Segurança de Dados", "Certificação", "B2B / B2C"],
    destaque: "Destruição segura de dados"
  },

  /* --- Iniciativas Internacionais / Mundiais --- */
  {
    id: "weee-forum",
    nome: "WEEE Forum",
    escopo: "Mundo",
    tipo: "Rede Internacional",
    descricao: "Maior associação internacional e centro de excelência do mundo para gestão de resíduos de equipamentos elétricos e eletrônicos, integrando mais de 50 organizações de conformidade.",
    website: "https://weee-forum.org",
    icone: "🌍",
    tags: ["Internacional", "Dia Mundial do E-lixo", "Padrões WEEE"],
    destaque: "Criadores do International E-Waste Day"
  },
  {
    id: "step-initiative",
    nome: "StEP Initiative",
    escopo: "Mundo",
    tipo: "Parceria Global ONU / Indústria",
    descricao: "Iniciativa multi-setorial focada em soluções científicas e econômicas para o problema global do e-waste, envolvendo universidades, governos e líderes mundiais de tecnologia.",
    website: "https://step-initiative.org",
    icone: "🔬",
    tags: ["Pesquisa Global", "ONU", "Economia Circular"],
    destaque: "Soluções científicas globais"
  },
  {
    id: "basel-action-network",
    nome: "Basel Action Network (BAN)",
    escopo: "Mundo",
    tipo: "ONG Internacional",
    descricao: "Organização global sem fins lucrativos que combate o tráfico ilegal de resíduos eletrônicos tóxicos exportados de países ricos para nações em desenvolvimento (Convenção de Basileia).",
    website: "https://ban.org",
    icone: "⚖️",
    tags: ["Direitos Humanos", "Convenção de Basileia", "Auditoria"],
    destaque: "Combate ao lixo tóxico transfronteiriço"
  },
  {
    id: "global-ewaste-monitor",
    nome: "The Global E-waste Monitor",
    escopo: "Mundo",
    tipo: "Relatório Oficial UNITAR / ITU",
    descricao: "A publicação de referência global mantida pelo Instituto das Nações Unidas para Formação e Pesquisa (UNITAR) e pela UIT, fornecendo dados e estatísticas mundiais atualizadas sobre e-waste.",
    website: "https://ewastemonitor.info",
    icone: "📊",
    tags: ["Dados Globais", "ONU / ITU", "Estatísticas"],
    destaque: "Dados oficiais da ONU"
  },
  {
    id: "cei-circular",
    nome: "Circular Electronics Initiative",
    escopo: "Mundo",
    tipo: "Aliança Empresarial",
    descricao: "Coalizão internacional que reúne fabricantes de hardware para promover o design de produtos eletrônicos reparáveis, modulares e com máxima longevidade de vida útil.",
    website: "https://circularelectronicsinitiative.com",
    icone: "🔄",
    tags: ["Eco-Design", "Direito de Reparar", "Sustentabilidade"],
    destaque: "Design reparável e modular"
  }
];

// Exporta os dados para o escopo global do navegador
window.ReciclaBrasilV2Data = {
  CATEGORIAS,
  PONTOS_INICIAIS,
  PONTOS_PENDENTES_INICIAIS,
  EWASTE_DADOS,
  INICIATIVAS
};
