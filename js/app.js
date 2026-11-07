/**
 * ============================================================================
 * ReciclaBrasil v2.0 — app.js
 * Lógica Principal da Aplicação:
 *  - Gerenciamento de Estado e Persistência LocalStorage.
 *  - Fila de Auditoria e Moderação de Novos Pontos (Aprovar / Editar / Rejeitar).
 *  - Observatório / Painel Comparativo de Lixo Eletrônico (Brasil & Mundo).
 *  - Vitrine de Iniciativas Nacionais e Globais com Links Oficiais.
 *  - Mapa Interativo (Leaflet.js) e Filtragem Reativa em Tempo Real.
 *  - Calculadora de Benefício Ecológico Expandida.
 * ============================================================================
 */

/* ==========================================================================
   Estado Central da Aplicação (AppState)
   ========================================================================== */
const AppState = {
  // Lista de pontos aprovados e visíveis publicamente
  pontosAprovados: [],
  // Fila de submissões pendentes que aguardam auditoria
  pontosPendentes: [],
  // Instância do mapa Leaflet
  mapa: null,
  // Grupo de marcadores no mapa
  grupoMarcadores: null,
  // Filtros ativos de busca
  categoriaAtiva: 'todos',
  cidadeAtiva: 'todas',
  termoBusca: '',
  modoVisualizacao: 'split',
  filtroIniciativa: 'todos',
  // ID do ponto atualmente em edição no modal
  pontoEmEdicaoId: null
};

/* ==========================================================================
   Ciclo de Inicialização do DOM
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  inicializarAplicacao();
});

/**
 * Função mestra de inicialização.
 * Executa o carregamento dos dados, renderização dos módulos e configuração de eventos.
 */
function inicializarAplicacao() {
  carregarDadosStorage();
  renderizarEstatisticasHero();
  renderizarChipsCategorias();
  renderizarSelectCidades();
  renderizarEwasteDashboard();
  renderizarIniciativas();
  atualizarBadgeAuditoria();
  inicializarMapa();
  filtrarERenderizarPontos();
  configurarEventosGlobais();
  configurarCalculadora();
}

/* ==========================================================================
   Persistência de Dados (LocalStorage)
   ========================================================================== */

/**
 * Carrega os pontos aprovados e a fila de auditoria do LocalStorage.
 * Caso não existam dados salvos, inicializa com a base de dados padrão de `data.js`.
 */
function carregarDadosStorage() {
  const dados = window.ReciclaBrasilV2Data;
  if (!dados) {
    console.error('Erro: ReciclaBrasilV2Data não foi carregado corretamente.');
    return;
  }

  // 1. Carrega pontos aprovados (públicos)
  try {
    const aprovadosStorage = localStorage.getItem('reciclabrasil_v2_aprovados');
    if (aprovadosStorage) {
      AppState.pontosAprovados = JSON.parse(aprovadosStorage);
    } else {
      AppState.pontosAprovados = [...dados.PONTOS_INICIAIS];
      salvarAprovadosStorage();
    }
  } catch (e) {
    console.warn('Falha ao ler aprovados do localStorage:', e);
    AppState.pontosAprovados = [...dados.PONTOS_INICIAIS];
  }

  // 2. Carrega fila de auditoria (pendentes)
  try {
    const pendentesStorage = localStorage.getItem('reciclabrasil_v2_pendentes');
    if (pendentesStorage) {
      AppState.pontosPendentes = JSON.parse(pendentesStorage);
    } else {
      AppState.pontosPendentes = [...dados.PONTOS_PENDENTES_INICIAIS];
      salvarPendentesStorage();
    }
  } catch (e) {
    console.warn('Falha ao ler pendentes do localStorage:', e);
    AppState.pontosPendentes = [...dados.PONTOS_PENDENTES_INICIAIS];
  }
}

/**
 * Persiste a lista de pontos aprovados no LocalStorage.
 */
function salvarAprovadosStorage() {
  try {
    localStorage.setItem('reciclabrasil_v2_aprovados', JSON.stringify(AppState.pontosAprovados));
  } catch (e) {
    console.error('Erro ao salvar pontos aprovados:', e);
  }
}

/**
 * Persiste a fila de auditoria no LocalStorage.
 */
function salvarPendentesStorage() {
  try {
    localStorage.setItem('reciclabrasil_v2_pendentes', JSON.stringify(AppState.pontosPendentes));
  } catch (e) {
    console.error('Erro ao salvar pontos pendentes:', e);
  }
}

/* ==========================================================================
   Estatísticas da Seção Hero
   ========================================================================== */

/**
 * Atualiza os contadores no topo da página.
 */
function renderizarEstatisticasHero() {
  const elPontos = document.getElementById('stat-pontos');
  const elCidades = document.getElementById('stat-cidades');
  const elPendentes = document.getElementById('stat-pendentes');

  if (elPontos) elPontos.textContent = AppState.pontosAprovados.length;

  if (elCidades) {
    const cidades = new Set(AppState.pontosAprovados.map(p => extrairCidade(p.endereco)));
    elCidades.textContent = cidades.size;
  }

  if (elPendentes) {
    elPendentes.textContent = AppState.pontosPendentes.length;
  }
}

/**
 * Atualiza o indicador numérico (badge vermelho) no botão de Auditoria no Cabeçalho.
 */
function atualizarBadgeAuditoria() {
  const badge = document.getElementById('badge-pendentes');
  if (!badge) return;

  const total = AppState.pontosPendentes.length;
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

/**
 * Extrai o nome da cidade a partir de um endereço completo formatado.
 * @param {string} endereco 
 * @returns {string} Cidade e Estado
 */
function extrairCidade(endereco) {
  if (!endereco) return '';
  const partes = endereco.split('–');
  const ultimaParte = partes[partes.length - 1] || endereco;
  const subpartes = ultimaParte.split(',');
  return (subpartes[subpartes.length - 1] || ultimaParte).trim();
}

/* ==========================================================================
   Mapa Interativo (Leaflet.js)
   ========================================================================== */

/**
 * Inicializa a instância do mapa georreferenciado via Leaflet.
 */
function inicializarMapa() {
  const mapElement = document.getElementById('map');
  const fallbackBanner = document.getElementById('map-fallback');

  if (!mapElement) return;

  if (typeof L === 'undefined') {
    if (fallbackBanner) fallbackBanner.style.display = 'block';
    console.info('Leaflet offline. Exibição via lista disponível.');
    return;
  }

  try {
    // Centraliza com vista geral do território brasileiro
    AppState.mapa = L.map('map', {
      center: [-15.7801, -47.9292],
      zoom: 4,
      zoomControl: true
    });

    // Camada de mapas públicos OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(AppState.mapa);

    AppState.grupoMarcadores = L.featureGroup().addTo(AppState.mapa);
  } catch (erro) {
    console.error('Falha ao inicializar Leaflet:', erro);
    if (fallbackBanner) fallbackBanner.style.display = 'block';
  }
}

/**
 * Atualiza os marcadores no mapa com base nos pontos aprovados filtrados.
 * @param {Array<Object>} pontosFiltrados Lista filtrada de pontos
 */
function atualizarMarcadoresMapa(pontosFiltrados) {
  if (!AppState.mapa || !AppState.grupoMarcadores || typeof L === 'undefined') return;

  AppState.grupoMarcadores.clearLayers();

  pontosFiltrados.forEach(ponto => {
    // Destaque visual caso aceite lixo eletrônico
    const aceitaEletronico = ponto.categorias.includes('eletronico');
    const corMarcador = aceitaEletronico ? '#4f46e5' : '#059669';
    const iconeMarcador = aceitaEletronico ? '💻' : '♻️';

    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          background: ${corMarcador};
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s;
        " title="${ponto.nome}">
          ${iconeMarcador}
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marcador = L.marker([ponto.lat, ponto.lng], { icon: customIcon });

    // Gera badges de categorias
    const tagsHtml = ponto.categorias.map(catId => {
      const cat = window.ReciclaBrasilV2Data.CATEGORIAS.find(c => c.id === catId);
      return `<span style="display:inline-block;background:#ecfdf5;color:#047857;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;margin:2px;">${cat ? cat.icone + ' ' + cat.nome : catId}</span>`;
    }).join(' ');

    const popupHtml = `
      <div style="font-family: inherit; min-width: 220px; padding: 4px;">
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
          <span style="background: #d1fae5; color: #065f46; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 9999px;">✔ APROVADO</span>
        </div>
        <h4 style="margin: 0 0 6px; font-size: 14px; font-weight: 800; color: #0f172a;">${ponto.nome}</h4>
        <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">📍 ${ponto.endereco}</p>
        <p style="margin: 0 0 8px; font-size: 12px; color: #059669; font-weight: 600;">⏰ ${ponto.horario || 'Horário comercial'}</p>
        <div style="margin-bottom: 10px;">${tagsHtml}</div>
        <div style="display: flex; gap: 6px;">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${ponto.lat},${ponto.lng}" 
             target="_blank" 
             rel="noopener"
             style="background: #059669; color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none; text-align: center; flex: 1;">
             Como Chegar ↗
          </a>
        </div>
      </div>
    `;

    marcador.bindPopup(popupHtml);
    marcador.on('click', () => destacarCardNaLista(ponto.id));

    AppState.grupoMarcadores.addLayer(marcador);
  });

  // Ajusta o enquadramento do mapa
  if (pontosFiltrados.length > 0) {
    try {
      AppState.mapa.fitBounds(AppState.grupoMarcadores.getBounds(), {
        padding: [40, 40],
        maxZoom: 13
      });
    } catch (e) {
      if (pontosFiltrados[0]) {
        AppState.mapa.setView([pontosFiltrados[0].lat, pontosFiltrados[0].lng], 13);
      }
    }
  }
}

/**
 * Move suavemente o mapa até um ponto de coleta e abre seu popup informativo.
 * @param {number} pontoId Identificador do ponto
 */
function focarPontoNoMapa(pontoId) {
  const ponto = AppState.pontosAprovados.find(p => p.id === pontoId);
  if (!ponto || !AppState.mapa) return;

  AppState.mapa.flyTo([ponto.lat, ponto.lng], 15, { duration: 1.2 });

  if (AppState.grupoMarcadores) {
    AppState.grupoMarcadores.eachLayer(layer => {
      const latlng = layer.getLatLng();
      if (Math.abs(latlng.lat - ponto.lat) < 0.0001 && Math.abs(latlng.lng - ponto.lng) < 0.0001) {
        layer.openPopup();
      }
    });
  }

  // Em dispositivos móveis rola até o mapa
  if (window.innerWidth < 1024) {
    const mapaElemento = document.getElementById('map');
    if (mapaElemento) mapaElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ==========================================================================
   Filtros e Renderização de Pontos Aprovados
   ========================================================================== */

/**
 * Renderiza os chips clicáveis de seleção de materiais.
 */
function renderizarChipsCategorias() {
  const container = document.getElementById('category-chips');
  if (!container || !window.ReciclaBrasilV2Data) return;

  container.innerHTML = `
    <button class="chip active" data-category="todos">
      <span>🌐</span> Todos os Materiais
    </button>
  `;

  window.ReciclaBrasilV2Data.CATEGORIAS.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    if (cat.id === 'eletronico') btn.style.borderColor = 'var(--tech-500)';
    btn.dataset.category = cat.id;
    btn.innerHTML = `<span>${cat.icone}</span> ${cat.nome}`;
    container.appendChild(btn);
  });
}

/**
 * Preenche o seletor de cidades dinamicamente.
 */
function renderizarSelectCidades() {
  const select = document.getElementById('city-select');
  if (!select) return;

  const cidades = [...new Set(AppState.pontosAprovados.map(p => extrairCidade(p.endereco)))].filter(Boolean).sort();

  select.innerHTML = '<option value="todas">Todas as Cidades</option>';
  cidades.forEach(cidade => {
    const option = document.createElement('option');
    option.value = cidade;
    option.textContent = cidade;
    select.appendChild(option);
  });
}

/**
 * Filtra a lista de pontos aprovados segundo critérios de categoria, cidade e busca textual.
 */
function filtrarERenderizarPontos() {
  const termo = AppState.termoBusca.toLowerCase().trim();

  const pontosFiltrados = AppState.pontosAprovados.filter(ponto => {
    // Filtro por material/categoria
    const matchCat = AppState.categoriaAtiva === 'todos' || 
      (ponto.categorias && ponto.categorias.includes(AppState.categoriaAtiva));

    // Filtro por cidade
    const cid = extrairCidade(ponto.endereco).toLowerCase();
    const matchCid = AppState.cidadeAtiva === 'todas' || cid.includes(AppState.cidadeAtiva.toLowerCase());

    // Filtro textual
    const matchBusca = !termo || 
      ponto.nome.toLowerCase().includes(termo) || 
      ponto.endereco.toLowerCase().includes(termo);

    return matchCat && matchCid && matchBusca;
  });

  renderizarListaPontos(pontosFiltrados);
  atualizarMarcadoresMapa(pontosFiltrados);

  const contador = document.getElementById('points-count');
  if (contador) contador.textContent = pontosFiltrados.length;
}

/**
 * Constrói os cards dos pontos aprovados no painel lateral.
 * @param {Array<Object>} pontos 
 */
function renderizarListaPontos(pontos) {
  const container = document.getElementById('points-list');
  if (!container) return;

  if (pontos.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #64748b;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <h4 style="font-weight: 700; margin-bottom: 0.25rem;">Nenhum ponto encontrado</h4>
        <p style="font-size: 0.9rem;">Tente ajustar os filtros ou sugerir um novo local para validação.</p>
        <button class="btn btn-primary btn-sm" onclick="abrirModalCadastro()" style="margin-top: 1rem;">
          + Sugerir Novo Ponto
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = pontos.map(ponto => {
    const tagsHtml = ponto.categorias.map(catId => {
      const cat = window.ReciclaBrasilV2Data.CATEGORIAS.find(c => c.id === catId);
      const isEwaste = catId === 'eletronico';
      return `
        <span class="material-tag ${isEwaste ? 'highlight-ewaste' : ''}" title="${cat ? cat.nome : catId}">
          ${cat ? cat.icone : '♻️'} ${cat ? cat.nome : catId}
        </span>
      `;
    }).join('');

    return `
      <article class="point-card" id="point-card-${ponto.id}">
        <div class="point-card-top">
          <div>
            <h3 class="point-name">${ponto.nome}</h3>
            <span class="point-badge-validated">✔ Auditado e Oficial</span>
          </div>
          <div class="point-rating" title="Avaliação">
            ⭐ ${ponto.avaliacao ? ponto.avaliacao.toFixed(1) : '5.0'}
          </div>
        </div>

        <p class="point-address">
          <span>📍</span> ${ponto.endereco}
        </p>

        <div class="point-meta">
          <span class="point-meta-item">
            <span>⏰</span> ${ponto.horario || 'Seg–Sáb'}
          </span>
          ${ponto.telefone ? `
            <span class="point-meta-item">
              <span>📞</span> ${ponto.telefone}
            </span>
          ` : ''}
        </div>

        <div class="point-tags">
          ${tagsHtml}
        </div>

        <div class="point-actions">
          <button class="btn btn-primary btn-sm" onclick="focarPontoNoMapa(${ponto.id})">
            <span>🗺️</span> Ver no Mapa
          </button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${ponto.lat},${ponto.lng}" 
             target="_blank" 
             rel="noopener"
             class="btn btn-outline btn-sm">
            <span>↗</span> Como Chegar
          </a>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Destaca visualmente o card selecionado.
 * @param {number} pontoId 
 */
function destacarCardNaLista(pontoId) {
  document.querySelectorAll('.point-card').forEach(c => c.classList.remove('highlighted'));
  const card = document.getElementById(`point-card-${pontoId}`);
  if (card) {
    card.classList.add('highlighted');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   NOVO: Sistema de Auditoria e Moderação de Novos Pontos
   ========================================================================== */

/**
 * Abre a janela modal do Painel de Auditoria / Moderação.
 */
function abrirPainelAuditoria() {
  const modal = document.getElementById('modal-auditoria');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderizarFilaAuditoria();
  }
}

/**
 * Fecha a janela modal do Painel de Auditoria.
 */
function fecharPainelAuditoria() {
  const modal = document.getElementById('modal-auditoria');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Renderiza os itens pendentes dentro do modal de auditoria.
 */
function renderizarFilaAuditoria() {
  const container = document.getElementById('audit-queue-list');
  const countSpan = document.getElementById('audit-queue-count');
  if (!container) return;

  const fila = AppState.pontosPendentes;
  if (countSpan) countSpan.textContent = fila.length;

  if (fila.length === 0) {
    container.innerHTML = `
      <div class="audit-empty-state">
        <div class="audit-empty-icon">🎉</div>
        <h4 style="font-weight: 800; font-size: 1.2rem; color: #0f172a; margin-bottom: 0.35rem;">
          Tudo em dia! Fila de Auditoria Zerada
        </h4>
        <p style="font-size: 0.95rem;">Todos os pontos sugeridos foram validados e estão ativos no mapa.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = fila.map(item => {
    const tagsHtml = item.categorias.map(catId => {
      const cat = window.ReciclaBrasilV2Data.CATEGORIAS.find(c => c.id === catId);
      return `<span class="material-tag">${cat ? cat.icone + ' ' + cat.nome : catId}</span>`;
    }).join(' ');

    return `
      <div class="audit-item-card" id="audit-item-${item.id}">
        <div class="audit-item-top">
          <div>
            <h4 class="audit-item-name">${item.nome}</h4>
            <div style="font-size: 0.85rem; color: #64748b; margin-top: 2px;">
              Submetido por: <strong>${item.submetidoPor || 'Cidadão'}</strong> em ${item.dataSubmissao || 'Recente'}
            </div>
          </div>
          <span class="audit-badge-pending">⏳ Aguardando Validação</span>
        </div>

        <div class="audit-item-info-grid">
          <div class="audit-info-cell">
            <span class="lbl">📍 Endereço:</span> ${item.endereco}
          </div>
          <div class="audit-info-cell">
            <span class="lbl">🌐 Coordenadas:</span> Lat: ${item.lat}, Lng: ${item.lng}
          </div>
          <div class="audit-info-cell">
            <span class="lbl">⏰ Horário:</span> ${item.horario || 'Não informado'}
          </div>
          <div class="audit-info-cell">
            <span class="lbl">📞 Contato:</span> ${item.telefone || 'Não informado'}
          </div>
        </div>

        <div>
          <span style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">
            Materiais Selecionados:
          </span>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${tagsHtml}
          </div>
        </div>

        ${item.observacoes ? `
          <div style="font-size: 0.85rem; background: #fff; padding: 0.6rem 0.85rem; border-radius: 6px; border: 1px dashed #cbd5e1; color: #475569;">
            💬 <em>"${item.observacoes}"</em>
          </div>
        ` : ''}

        <div class="audit-item-actions">
          <button class="btn btn-danger btn-sm" onclick="rejeitarPontoAuditoria(${item.id})">
            ✖ Rejeitar Submissão
          </button>
          <button class="btn btn-outline btn-sm" onclick="abrirEdicaoPonto(${item.id})">
            ✏️ Editar Dados
          </button>
          <button class="btn btn-primary btn-sm" onclick="aprovarPontoAuditoria(${item.id})">
            ✔ Validar e Publicar no Mapa
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Aprova um ponto de coleta da fila de auditoria e o publica no mapa público.
 * @param {number} pontoId Identificador do ponto
 */
function aprovarPontoAuditoria(pontoId) {
  const index = AppState.pontosPendentes.findIndex(p => p.id === pontoId);
  if (index === -1) return;

  const [pontoAprovado] = AppState.pontosPendentes.splice(index, 1);
  pontoAprovado.status = 'aprovado';
  pontoAprovado.dataAprovacao = new Date().toISOString();
  pontoAprovado.avaliacao = pontoAprovado.avaliacao || 5.0;

  // Insere no topo da lista pública
  AppState.pontosAprovados.unshift(pontoAprovado);

  // Persiste alterações no LocalStorage
  salvarAprovadosStorage();
  salvarPendentesStorage();

  // Atualiza interfaces
  atualizarBadgeAuditoria();
  renderizarEstatisticasHero();
  renderizarSelectCidades();
  filtrarERenderizarPontos();
  renderizarFilaAuditoria();

  mostrarToast(`"${pontoAprovado.nome}" foi aprovado e agora está público no mapa! 🎉`, 'success');
}

/**
 * Rejeita um ponto da fila de auditoria com confirmação.
 * @param {number} pontoId Identificador do ponto
 */
function rejeitarPontoAuditoria(pontoId) {
  const ponto = AppState.pontosPendentes.find(p => p.id === pontoId);
  if (!ponto) return;

  const confirmar = confirm(`Tem certeza que deseja rejeitar a submissão de "${ponto.nome}"?`);
  if (!confirmar) return;

  AppState.pontosPendentes = AppState.pontosPendentes.filter(p => p.id !== pontoId);
  salvarPendentesStorage();
  atualizarBadgeAuditoria();
  renderizarEstatisticasHero();
  renderizarFilaAuditoria();

  mostrarToast(`Submissão de "${ponto.nome}" rejeitada e removida.`, 'error');
}

/**
 * Trata o envio do formulário público de cadastro de ponto.
 * O ponto é submetido como 'pendente' para avaliação pela moderação.
 * @param {Event} e 
 */
function processarSubmissaoPublica(e) {
  e.preventDefault();

  const form = e.target;
  const nome = form.nome.value.trim();
  const endereco = form.endereco.value.trim();
  const lat = parseFloat(form.lat.value);
  const lng = parseFloat(form.lng.value);
  const horario = form.horario.value.trim();
  const telefone = form.telefone.value.trim();
  const responsavel = form.responsavel ? form.responsavel.value.trim() : 'Cidadão';
  const observacoes = form.observacoes ? form.observacoes.value.trim() : '';

  const checkboxes = form.querySelectorAll('input[name="categorias"]:checked');
  const categorias = Array.from(checkboxes).map(cb => cb.value);

  if (!nome || !endereco || isNaN(lat) || isNaN(lng)) {
    mostrarToast('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }

  if (categorias.length === 0) {
    mostrarToast('Selecione ao menos um tipo de resíduo aceito.', 'error');
    return;
  }

  const novoPontoPendente = {
    id: Date.now(),
    nome,
    endereco,
    lat,
    lng,
    categorias,
    horario: horario || 'Seg–Sáb 8h–18h',
    telefone: telefone || '',
    submetidoPor: responsavel || 'Cidadão Colaborador',
    dataSubmissao: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    observacoes: observacoes,
    status: 'pendente'
  };

  AppState.pontosPendentes.unshift(novoPontoPendente);
  salvarPendentesStorage();
  atualizarBadgeAuditoria();
  renderizarEstatisticasHero();

  fecharModalCadastro();
  form.reset();

  mostrarToast('Ponto enviado para auditoria! Ele será analisado antes de ir ao ar. 🛡️', 'success');
}

/**
 * Abre o modal de edição de um ponto pendente para que o auditor possa ajustar dados antes de aprovar.
 * @param {number} pontoId 
 */
function abrirEdicaoPonto(pontoId) {
  const ponto = AppState.pontosPendentes.find(p => p.id === pontoId);
  if (!ponto) return;

  AppState.pontoEmEdicaoId = pontoId;
  const modal = document.getElementById('modal-edicao');
  const form = document.getElementById('form-editar-ponto');

  if (modal && form) {
    form.nome.value = ponto.nome;
    form.endereco.value = ponto.endereco;
    form.lat.value = ponto.lat;
    form.lng.value = ponto.lng;
    form.horario.value = ponto.horario || '';
    form.telefone.value = ponto.telefone || '';

    // Ajusta checkboxes
    form.querySelectorAll('input[name="categorias"]').forEach(cb => {
      cb.checked = ponto.categorias.includes(cb.value);
    });

    modal.classList.add('open');
  }
}

/**
 * Fecha o modal de edição de ponto.
 */
function fecharModalEdicao() {
  const modal = document.getElementById('modal-edicao');
  if (modal) modal.classList.remove('open');
  AppState.pontoEmEdicaoId = null;
}

/**
 * Salva as alterações feitas no ponto pendente pelo auditor.
 * @param {Event} e 
 */
function processarSalvarEdicao(e) {
  e.preventDefault();
  const pontoId = AppState.pontoEmEdicaoId;
  const ponto = AppState.pontosPendentes.find(p => p.id === pontoId);
  if (!ponto) return;

  const form = e.target;
  ponto.nome = form.nome.value.trim();
  ponto.endereco = form.endereco.value.trim();
  ponto.lat = parseFloat(form.lat.value);
  ponto.lng = parseFloat(form.lng.value);
  ponto.horario = form.horario.value.trim();
  ponto.telefone = form.telefone.value.trim();

  const checkboxes = form.querySelectorAll('input[name="categorias"]:checked');
  ponto.categorias = Array.from(checkboxes).map(cb => cb.value);

  salvarPendentesStorage();
  fecharModalEdicao();
  renderizarFilaAuditoria();

  mostrarToast('Dados do ponto atualizados com sucesso!', 'success');
}

/* ==========================================================================
   NOVO: Observatório do Lixo Eletrônico (Brasil vs Mundo)
   ========================================================================== */

/**
 * Renderiza o painel completo de indicadores sobre lixo eletrônico.
 */
function renderizarEwasteDashboard() {
  const dados = window.ReciclaBrasilV2Data?.EWASTE_DADOS;
  if (!dados) return;

  // 1. Métricas Brasil
  const brTon = document.getElementById('ewaste-br-ton');
  const brCapita = document.getElementById('ewaste-br-capita');
  const brTaxa = document.getElementById('ewaste-br-taxa');
  const brTaxaBar = document.getElementById('ewaste-br-taxa-bar');
  const brRanking = document.getElementById('ewaste-br-ranking');
  const brValor = document.getElementById('ewaste-br-valor');

  if (brTon) brTon.textContent = dados.brasil.geracaoTotalTon;
  if (brCapita) brCapita.textContent = dados.brasil.geracaoPorHabitanteKg;
  if (brTaxa) brTaxa.textContent = dados.brasil.taxaReciclagemFormal;
  if (brTaxaBar) brTaxaBar.style.width = dados.brasil.taxaReciclagemFormal;
  if (brRanking) brRanking.textContent = dados.brasil.rankingGlobal;
  if (brValor) brValor.textContent = dados.brasil.valorDesperdicadoEstimado;

  // 2. Métricas Mundo
  const muTon = document.getElementById('ewaste-mu-ton');
  const muCapita = document.getElementById('ewaste-mu-capita');
  const muTaxa = document.getElementById('ewaste-mu-taxa');
  const muTaxaBar = document.getElementById('ewaste-mu-taxa-bar');
  const muCresc = document.getElementById('ewaste-mu-cresc');
  const muValor = document.getElementById('ewaste-mu-valor');

  if (muTon) muTon.textContent = dados.mundo.geracaoTotalTon;
  if (muCapita) muCapita.textContent = dados.mundo.geracaoPorHabitanteKg;
  if (muTaxa) muTaxa.textContent = dados.mundo.taxaReciclagemFormal;
  if (muTaxaBar) muTaxaBar.style.width = dados.mundo.taxaReciclagemFormal;
  if (muCresc) muCresc.textContent = dados.mundo.crescimentoAnual;
  if (muValor) muValor.textContent = dados.mundo.valorEconomicoPerdido;

  // 3. Metais Perigosos
  const containerPerigosos = document.getElementById('ewaste-perigosos-list');
  if (containerPerigosos) {
    containerPerigosos.innerHTML = dados.metaisPerigosos.map(m => `
      <div class="metal-item danger">
        <div class="metal-item-name">
          <span>⚠️ ${m.elemento}</span>
          <span style="font-size: 0.75rem; color: #b91c1c; font-weight: 800;">ALTO RISCO</span>
        </div>
        <p class="metal-item-desc"><strong>Onde está:</strong> ${m.onde}</p>
        <p class="metal-item-desc" style="margin-top: 4px;"><strong>Impacto:</strong> ${m.riscos}</p>
      </div>
    `).join('');
  }

  // 4. Minerais Preciosos
  const containerPreciosos = document.getElementById('ewaste-preciosos-list');
  if (containerPreciosos) {
    containerPreciosos.innerHTML = dados.metaisPreciosos.map(m => `
      <div class="metal-item value">
        <div class="metal-item-name">
          <span>💎 ${m.material}</span>
          <span style="font-size: 0.75rem; color: #b45309; font-weight: 800;">ALTO VALOR</span>
        </div>
        <p class="metal-item-desc"><strong>Rendimento:</strong> ${m.rendimento}</p>
        <p class="metal-item-desc" style="margin-top: 4px;"><strong>Vantagem:</strong> ${m.comparacao}</p>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   NOVO: Cards de Principais Iniciativas de E-waste com Links Diretos
   ========================================================================== */

/**
 * Renderiza a vitrine de iniciativas nacionais e globais.
 */
function renderizarIniciativas() {
  const container = document.getElementById('initiatives-grid');
  if (!container || !window.ReciclaBrasilV2Data) return;

  const lista = window.ReciclaBrasilV2Data.INICIATIVAS.filter(item => {
    if (AppState.filtroIniciativa === 'todos') return true;
    return item.escopo.toLowerCase() === AppState.filtroIniciativa.toLowerCase();
  });

  container.innerHTML = lista.map(item => `
    <article class="initiative-card">
      <div>
        <div class="initiative-card-top">
          <div class="initiative-icon">${item.icone}</div>
          <div class="initiative-info">
            <h3 class="initiative-title">${item.nome}</h3>
            <span class="initiative-scope-badge ${item.escopo.toLowerCase()}">
              ${item.escopo === 'Brasil' ? '🇧🇷 Brasil' : '🌐 Internacional'}
            </span>
          </div>
        </div>

        <p class="initiative-desc">${item.descricao}</p>

        <div class="initiative-tags">
          ${item.tags.map(t => `<span class="init-tag">#${t}</span>`).join('')}
        </div>
      </div>

      <a href="${item.website}" target="_blank" rel="noopener noreferrer" class="initiative-btn" aria-label="Acessar site oficial da ${item.nome}">
        <span>Visitar Site Oficial</span>
        <span>↗</span>
      </a>
    </article>
  `).join('');
}

/* ==========================================================================
   Calculadora de Impacto Ecológico Expandida
   ========================================================================== */

/**
 * Registra ouvintes em tempo real para os campos da calculadora de impacto.
 */
function configurarCalculadora() {
  const inputs = document.querySelectorAll('.calc-input');
  inputs.forEach(input => {
    input.addEventListener('input', calcularImpactoAmbiental);
  });
  calcularImpactoAmbiental();
}

/**
 * Calcula o benefício gerado pela reciclagem incluindo eletrônicos.
 */
function calcularImpactoAmbiental() {
  const papelKg = parseFloat(document.getElementById('calc-papel')?.value || 0) || 0;
  const plasticoKg = parseFloat(document.getElementById('calc-plastico')?.value || 0) || 0;
  const vidroKg = parseFloat(document.getElementById('calc-vidro')?.value || 0) || 0;
  const metalKg = parseFloat(document.getElementById('calc-metal')?.value || 0) || 0;
  const ewasteKg = parseFloat(document.getElementById('calc-ewaste')?.value || 0) || 0;

  // Água economizada (litros)
  const agua = (papelKg * 26) + (plasticoKg * 15) + (metalKg * 10) + (ewasteKg * 45);
  // Árvores preservadas
  const arvores = (papelKg * 0.02);
  // CO2 evitado (kg)
  const co2 = (papelKg * 1.5) + (plasticoKg * 2.0) + (vidroKg * 0.3) + (metalKg * 4.5) + (ewasteKg * 12.0);
  // Energia elétrica poupada (kWh)
  const energia = (plasticoKg * 5.7) + (metalKg * 14.0) + (papelKg * 4.0) + (vidroKg * 1.2) + (ewasteKg * 28.0);

  const resAgua = document.getElementById('res-agua');
  const resCo2 = document.getElementById('res-co2');
  const resArvores = document.getElementById('res-arvores');
  const resEnergia = document.getElementById('res-energia');

  if (resAgua) resAgua.textContent = Math.round(agua).toLocaleString('pt-BR') + ' L';
  if (resCo2) resCo2.textContent = Math.round(co2).toLocaleString('pt-BR') + ' kg';
  if (resArvores) resArvores.textContent = arvores.toFixed(1) + ' unid.';
  if (resEnergia) resEnergia.textContent = Math.round(energia).toLocaleString('pt-BR') + ' kWh';
}

/* ==========================================================================
   Modais de Cadastro Público
   ========================================================================== */

function abrirModalCadastro() {
  const modal = document.getElementById('modal-cadastro');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function fecharModalCadastro() {
  const modal = document.getElementById('modal-cadastro');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   Sistema de Notificações Toast
   ========================================================================== */

/**
 * Exibe um alerta toast no canto inferior direito da tela.
 * @param {string} mensagem Texto da notificação
 * @param {'success' | 'error' | 'info'} tipo Tipo do toast
 */
function mostrarToast(mensagem, tipo = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `
    <span>${tipo === 'success' ? '✔' : tipo === 'error' ? '✖' : 'ℹ'}</span>
    <span>${mensagem}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   Eventos Globais e Interatividade
   ========================================================================== */

function configurarEventosGlobais() {
  // 1. Busca textual com debounce
  const inputBusca = document.getElementById('search-input');
  if (inputBusca) {
    let timer;
    inputBusca.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        AppState.termoBusca = e.target.value;
        filtrarERenderizarPontos();
      }, 250);
    });
  }

  // 2. Filtro de Cidade
  const selectCidade = document.getElementById('city-select');
  if (selectCidade) {
    selectCidade.addEventListener('change', (e) => {
      AppState.cidadeAtiva = e.target.value;
      filtrarERenderizarPontos();
    });
  }

  // 3. Chips de Categoria
  const chipsContainer = document.getElementById('category-chips');
  if (chipsContainer) {
    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      chipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.categoriaAtiva = chip.dataset.category;
      filtrarERenderizarPontos();
    });
  }

  // 4. Alternador de Visualização (Dividido / Mapa / Lista)
  const viewBtns = document.querySelectorAll('.view-btn');
  const appGrid = document.querySelector('.app-grid');
  const mapCard = document.querySelector('.map-card');
  const listPane = document.querySelector('.points-list-pane');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      AppState.modoVisualizacao = mode;

      if (!appGrid || !mapCard || !listPane) return;

      if (mode === 'map') {
        appGrid.style.gridTemplateColumns = '1fr';
        mapCard.style.display = 'block';
        listPane.style.display = 'none';
      } else if (mode === 'list') {
        appGrid.style.gridTemplateColumns = '1fr';
        mapCard.style.display = 'none';
        listPane.style.display = 'flex';
      } else {
        appGrid.style.gridTemplateColumns = window.innerWidth > 1024 ? '1.15fr 0.85fr' : '1fr';
        mapCard.style.display = 'block';
        listPane.style.display = 'flex';
      }

      if (AppState.mapa) {
        setTimeout(() => AppState.mapa.invalidateSize(), 200);
      }
    });
  });

  // 5. Filtros da Seção de Iniciativas
  const initFilterBtns = document.querySelectorAll('.init-filter-btn');
  initFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      initFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.filtroIniciativa = btn.dataset.scope;
      renderizarIniciativas();
    });
  });

  // 6. Formulário de Submissão Pública
  const formSubmissao = document.getElementById('form-cadastro-ponto');
  if (formSubmissao) {
    formSubmissao.addEventListener('submit', processarSubmissaoPublica);
  }

  // 7. Formulário de Edição de Ponto (Auditor)
  const formEdicao = document.getElementById('form-editar-ponto');
  if (formEdicao) {
    formEdicao.addEventListener('submit', processarSalvarEdicao);
  }

  // 8. Fechamento de Modais clicando fora
  window.addEventListener('click', (e) => {
    const modalCadastro = document.getElementById('modal-cadastro');
    const modalAuditoria = document.getElementById('modal-auditoria');
    const modalEdicao = document.getElementById('modal-edicao');

    if (e.target === modalCadastro) fecharModalCadastro();
    if (e.target === modalAuditoria) fecharPainelAuditoria();
    if (e.target === modalEdicao) fecharModalEdicao();
  });

  // 9. Menu Mobile
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(l => {
      l.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
}
