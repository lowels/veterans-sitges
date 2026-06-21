/* ============================================================
   torneig-2026.js — Veterans Bàsquet Sitges
   Classificació, resultats i la gran final (1r Grup A vs 1r Grup B)
   del 4t Torneig Solidari Vila de Sitges (20 juny 2026).

   FONT DE DADES — Google Sheet (només lectura):
   La web LLEGEIX els resultats d'un Google Sheet i és NOMÉS LECTURA
   per a tothom. Els resultats s'editen directament al Google Sheet
   (només les persones amb permís d'edició poden fer-ho).

   · No hi ha cap credencial al codi: el full es comparteix com a
     "qualsevol amb l'enllaç: lector" i la web el llegeix amb l'endpoint
     CSV de Google (gviz o "publica a la web"). Editar el full el
     controla Google amb els permisos d'edició normals.
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     0. CONFIGURACIÓ  ←  AQUÍ ho controles tot
  ────────────────────────────────────────── */
  const CONFIG = {
    // ▸ URL CSV del Google Sheet. Dues maneres d'obtenir-la (qualsevol va):
    //
    //   OPCIÓ A (permisos — recomanada):
    //     Comparteix el full com "Qualsevol amb l'enllaç: Lector"
    //     (i dona edició només a qui vulguis). Després fes servir:
    //     https://docs.google.com/spreadsheets/d/EL_TEU_ID/gviz/tq?tqx=out:csv&sheet=Resultats
    //
    //   OPCIÓ B (publica a la web):
    //     Fitxer → Comparteix → Publica a la web → CSV. Copia la URL
    //     (acaba en output=csv).
    //
    //   Deixa-ho en '' (buit) fins que el tinguis: la web mostrarà la
    //   graella buida (sense resultats) i no fallarà.
    sheetCsvUrl: 'https://docs.google.com/spreadsheets/d/1ARQQU8Uy_SUhNMZcGNujIB5W0D7prarzcsoI13POr3A/gviz/tq?tqx=out:csv&gid=0',

    // Cada quants segons es tornen a llegir els resultats del Sheet.
    refreshSeconds: 30,
  };

  /* ──────────────────────────────────────────
     1. DADES DEL TORNEIG
  ────────────────────────────────────────── */
  const TEAMS = {
    sitges:   { name: 'Bàsquet Sitges',        logo: 'cb-sitges' },
    valencia: { name: 'Valencia Basket',       logo: 'valencia-basket' },
    tehran:   { name: 'Tehran',                logo: 'tehran' },
    girona:   { name: 'Veterans Girona',       logo: 'veterans-girona' },
    sedis:    { name: 'Veterans del Sedis',    logo: 'veterans-sedis' },
    espanyol: { name: 'S.D. Espanyol',         logo: 'espanyol' },
    towers:   { name: 'No Surrender Towers',   logo: 'no-surrender-towers' },
    mvps:     { name: 'MVPs',                  logo: 'mvps' },
    barca:    { name: 'Veterans FC Barcelona', logo: 'fcbarcelona-veterans' },
    french:   { name: 'French Connection',     logo: 'french-connection' },
  };

  const GROUPS = {
    A: ['sitges', 'valencia', 'towers', 'girona', 'sedis'],
    B: ['espanyol', 'mvps', 'tehran', 'barca', 'french'],
  };

  // Calendari oficial (round-robin). court = pista, group = grup.
  const MATCHES = [
    { id: 'g1',  time: '13:00', court: 1, group: 'A', home: 'sitges',   away: 'girona' },
    { id: 'g2',  time: '13:00', court: 2, group: 'B', home: 'espanyol', away: 'tehran' },
    { id: 'g3',  time: '13:30', court: 1, group: 'A', home: 'valencia', away: 'sedis' },
    { id: 'g4',  time: '13:30', court: 2, group: 'B', home: 'mvps',     away: 'barca' },
    { id: 'g5',  time: '14:00', court: 1, group: 'A', home: 'sitges',   away: 'towers' },
    { id: 'g6',  time: '14:00', court: 2, group: 'B', home: 'espanyol', away: 'french' },
    { id: 'g7',  time: '14:30', court: 1, group: 'A', home: 'sedis',    away: 'girona' },
    { id: 'g8',  time: '14:30', court: 2, group: 'B', home: 'tehran',   away: 'mvps' },
    { id: 'g9',  time: '15:00', court: 1, group: 'A', home: 'towers',   away: 'valencia' },
    { id: 'g10', time: '15:00', court: 2, group: 'B', home: 'barca',    away: 'french' },
    { id: 'g11', time: '15:30', court: 1, group: 'A', home: 'sitges',   away: 'sedis' },
    { id: 'g12', time: '15:30', court: 2, group: 'B', home: 'espanyol', away: 'mvps' },
    { id: 'g13', time: '16:00', court: 1, group: 'A', home: 'girona',   away: 'towers' },
    { id: 'g14', time: '16:00', court: 2, group: 'B', home: 'tehran',   away: 'french' },
    { id: 'g15', time: '16:30', court: 1, group: 'A', home: 'valencia', away: 'sitges' },
    { id: 'g16', time: '16:30', court: 2, group: 'B', home: 'barca',    away: 'espanyol' },
    { id: 'g17', time: '17:00', court: 1, group: 'A', home: 'sedis',    away: 'towers' },
    { id: 'g18', time: '17:00', court: 2, group: 'B', home: 'mvps',     away: 'french' },
    { id: 'g19', time: '17:30', court: 1, group: 'A', home: 'girona',   away: 'valencia' },
    { id: 'g20', time: '17:30', court: 2, group: 'B', home: 'barca',    away: 'tehran' },
  ];

  const BRACKET_IDS = ['final'];
  const LOGO_PATH = 'assets/img/equips/';

  /* ──────────────────────────────────────────
     2. TEXTOS (4 idiomes) per al contingut dinàmic
  ────────────────────────────────────────── */
  const L = {
    ca: {
      groupA: 'Grup A', groupB: 'Grup B', court: 'Pista',
      pos: '#', team: 'Equip', pj: 'PJ', pg: 'G', pp: 'P',
      pf: 'PF', pc: 'PC', dif: '+/–', pts: 'Punts',
      pjFull: 'Partits jugats', pgFull: 'Guanyats', ppFull: 'Perduts',
      pfFull: 'Punts a favor', pcFull: 'Punts en contra', ptsFull: 'Punts de classificació',
      legend: 'PJ: jugats · G: guanyats · P: perduts · PF: punts a favor · PC: punts en contra · +/–: diferència · 3 punts per victòria, 1 per derrota',
      qualify: 'Es classifica per a la gran final',
      vs: 'vs', tlBadge: 'TL',
      semi1: 'Semifinal 1', semi2: 'Semifinal 2', finalT: 'Final', grandFinalT: 'La gran final', champion: 'Guanyador',
      seed1A: '1r Grup A', seed2A: '2n Grup A', seed1B: '1r Grup B', seed2B: '2n Grup B',
      tbd: 'Per definir', winnerSemis: 'Guanyador',
      live: 'Resultats en directe', updated: 'Actualitzat', refresh: 'Actualitzar',
      loading: 'Carregant resultats…', loadError: 'No s\'han pogut carregar els resultats',
    },
    es: {
      groupA: 'Grupo A', groupB: 'Grupo B', court: 'Pista',
      pos: '#', team: 'Equipo', pj: 'PJ', pg: 'G', pp: 'P',
      pf: 'PF', pc: 'PC', dif: '+/–', pts: 'Puntos',
      pjFull: 'Partidos jugados', pgFull: 'Ganados', ppFull: 'Perdidos',
      pfFull: 'Puntos a favor', pcFull: 'Puntos en contra', ptsFull: 'Puntos de clasificación',
      legend: 'PJ: jugados · G: ganados · P: perdidos · PF: puntos a favor · PC: puntos en contra · +/–: diferencia · 3 puntos por victoria, 1 por derrota',
      qualify: 'Se clasifica para la gran final',
      vs: 'vs', tlBadge: 'TL',
      semi1: 'Semifinal 1', semi2: 'Semifinal 2', finalT: 'Final', grandFinalT: 'La gran final', champion: 'Ganador',
      seed1A: '1º Grupo A', seed2A: '2º Grupo A', seed1B: '1º Grupo B', seed2B: '2º Grupo B',
      tbd: 'Por definir', winnerSemis: 'Ganador',
      live: 'Resultados en directo', updated: 'Actualizado', refresh: 'Actualizar',
      loading: 'Cargando resultados…', loadError: 'No se han podido cargar los resultados',
    },
    en: {
      groupA: 'Group A', groupB: 'Group B', court: 'Court',
      pos: '#', team: 'Team', pj: 'P', pg: 'W', pp: 'L',
      pf: 'PF', pc: 'PA', dif: '+/–', pts: 'Points',
      pjFull: 'Played', pgFull: 'Won', ppFull: 'Lost',
      pfFull: 'Points for', pcFull: 'Points against', ptsFull: 'Standings points',
      legend: 'P: played · W: won · L: lost · PF: points for · PA: points against · +/–: difference · 3 points per win, 1 per loss',
      qualify: 'Qualifies for the grand final',
      vs: 'vs', tlBadge: 'FT',
      semi1: 'Semifinal 1', semi2: 'Semifinal 2', finalT: 'Final', grandFinalT: 'The grand final', champion: 'Winner',
      seed1A: '1st Group A', seed2A: '2nd Group A', seed1B: '1st Group B', seed2B: '2nd Group B',
      tbd: 'To be decided', winnerSemis: 'Winner',
      live: 'Live results', updated: 'Updated', refresh: 'Refresh',
      loading: 'Loading results…', loadError: 'Could not load results',
    },
    fr: {
      groupA: 'Groupe A', groupB: 'Groupe B', court: 'Terrain',
      pos: '#', team: 'Équipe', pj: 'J', pg: 'G', pp: 'P',
      pf: 'PP', pc: 'PC', dif: '+/–', pts: 'Points',
      pjFull: 'Joués', pgFull: 'Gagnés', ppFull: 'Perdus',
      pfFull: 'Points pour', pcFull: 'Points contre', ptsFull: 'Points de classement',
      legend: 'J: joués · G: gagnés · P: perdus · PP: points pour · PC: points contre · +/–: différence · 3 points par victoire, 1 par défaite',
      qualify: 'Se qualifie pour la grande finale',
      vs: 'vs', tlBadge: 'LF',
      semi1: 'Demi-finale 1', semi2: 'Demi-finale 2', finalT: 'Finale', grandFinalT: 'La grande finale', champion: 'Vainqueur',
      seed1A: '1er Groupe A', seed2A: '2e Groupe A', seed1B: '1er Groupe B', seed2B: '2e Groupe B',
      tbd: 'À définir', winnerSemis: 'Vainqueur',
      live: 'Résultats en direct', updated: 'Mis à jour', refresh: 'Actualiser',
      loading: 'Chargement des résultats…', loadError: 'Impossible de charger les résultats',
    },
  };

  function lang() {
    const supported = ['ca', 'es', 'en', 'fr'];
    const l = window.currentLang || localStorage.getItem('lang') || 'ca';
    return supported.includes(l) ? l : 'ca';
  }
  function t(key) { return L[lang()][key]; }

  /* ──────────────────────────────────────────
     3. ESTAT (només lectura, en memòria)
  ────────────────────────────────────────── */
  const HAS_SHEET = !!CONFIG.sheetCsvUrl;
  let results = {};   // { matchId: {home, away, so} }
  let bracket = {};   // { sf1:{home,away,so}, sf2:{...}, final:{...} }

  /* ──────────────────────────────────────────
     4. CARREGA DES DEL GOOGLE SHEET (CSV)
  ────────────────────────────────────────── */
  function parseCSV(text) {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
        else if (c === '\r') { /* ignora */ }
        else field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  function normSo(val) {
    const v = String(val || '').trim().toLowerCase();
    if (['local', 'l', 'home', 'casa'].includes(v)) return 'home';
    if (['visitant', 'visitante', 'v', 'away', 'fora'].includes(v)) return 'away';
    return null;
  }
  function numOrEmpty(val) {
    const v = String(val == null ? '' : val).trim();
    if (v === '') return '';
    const n = parseInt(v, 10);
    return isNaN(n) ? '' : Math.max(0, n);
  }

  function applySheetRows(rows) {
    if (!rows.length) return;
    const header = rows[0].map(h => h.trim().toLowerCase());
    const idx = name => header.indexOf(name);
    const iId = idx('id');
    const iL = idx('punts_local') !== -1 ? idx('punts_local') : idx('local');
    const iV = idx('punts_visitant') !== -1 ? idx('punts_visitant') : idx('visitant');
    const iTl = idx('tl') !== -1 ? idx('tl') : idx('tirs_lliures');
    if (iId === -1 || iL === -1 || iV === -1) {
      throw new Error('Capçaleres del CSV no vàlides (cal id, punts_local, punts_visitant).');
    }
    const nextResults = {}, nextBracket = {};
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r];
      const id = (cells[iId] || '').trim();
      if (!id) continue;
      const rec = {
        home: numOrEmpty(cells[iL]),
        away: numOrEmpty(cells[iV]),
        so: iTl !== -1 ? normSo(cells[iTl]) : null,
      };
      if (BRACKET_IDS.includes(id)) nextBracket[id] = rec;
      else nextResults[id] = rec;
    }
    results = nextResults;
    bracket = nextBracket;
  }

  function loadFromSheet() {
    if (!HAS_SHEET) return;
    const url = CONFIG.sheetCsvUrl + (CONFIG.sheetCsvUrl.includes('?') ? '&' : '?') + '_=' + Date.now();
    fetch(url, { cache: 'no-store' })
      .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
      .then(text => {
        applySheetRows(parseCSV(text));
        renderAll();
      })
      .catch(err => { console.error('[torneig] Error carregant el Sheet:', err); });
  }

  /* ──────────────────────────────────────────
     5. LÒGICA DE RESULTATS I CLASSIFICACIÓ
  ────────────────────────────────────────── */
  function winnerOf(r) {
    if (!r) return null;
    const h = r.home, a = r.away;
    if (h === '' || h === null || h === undefined) return null;
    if (a === '' || a === null || a === undefined) return null;
    const nh = Number(h), na = Number(a);
    if (nh > na) return 'home';
    if (na > nh) return 'away';
    return r.so || null; // empat → guanyador per tirs lliures
  }
  function isTie(r) {
    if (!r) return false;
    const h = r.home, a = r.away;
    if (h === '' || h === null || h === undefined) return false;
    if (a === '' || a === null || a === undefined) return false;
    return Number(h) === Number(a);
  }

  function groupComplete(groupKey) {
    return MATCHES.filter(m => m.group === groupKey)
      .every(m => winnerOf(results[m.id]) !== null);
  }

  function blankStat(team) {
    return { team, pj: 0, pg: 0, pp: 0, pf: 0, pc: 0, pts: 0 };
  }

  function computeStandings(groupKey) {
    const stats = {};
    GROUPS[groupKey].forEach(team => (stats[team] = blankStat(team)));

    MATCHES.filter(m => m.group === groupKey).forEach(m => {
      const r = results[m.id];
      const w = winnerOf(r);
      if (!w) return;
      const nh = Number(r.home), na = Number(r.away);
      const sh = stats[m.home], sa = stats[m.away];
      sh.pj++; sa.pj++;
      sh.pf += nh; sh.pc += na;
      sa.pf += na; sa.pc += nh;
      if (w === 'home') { sh.pg++; sa.pp++; sh.pts += 3; sa.pts += 1; }
      else { sa.pg++; sh.pp++; sa.pts += 3; sh.pts += 1; }
    });

    const arr = Object.values(stats);
    arr.sort((a, b) =>
      b.pts - a.pts ||
      (b.pf - b.pc) - (a.pf - a.pc) ||
      b.pf - a.pf ||
      TEAMS[a.team].name.localeCompare(TEAMS[b.team].name)
    );
    resolveHeadToHead(arr, groupKey);
    return arr;
  }

  function resolveHeadToHead(arr, groupKey) {
    let i = 0;
    while (i < arr.length) {
      let j = i;
      while (j + 1 < arr.length && arr[j + 1].pts === arr[i].pts) j++;
      if (j > i) {
        const tied = arr.slice(i, j + 1).map(s => s.team);
        const mini = miniLeague(tied, groupKey);
        arr.splice(i, j - i + 1, ...arr.slice(i, j + 1).sort((a, b) =>
          mini[b.team].pts - mini[a.team].pts ||
          (mini[b.team].pf - mini[b.team].pc) - (mini[a.team].pf - mini[a.team].pc) ||
          (b.pf - b.pc) - (a.pf - a.pc) ||
          b.pf - a.pf
        ));
      }
      i = j + 1;
    }
  }
  function miniLeague(teams, groupKey) {
    const s = {};
    teams.forEach(team => (s[team] = { pts: 0, pf: 0, pc: 0 }));
    MATCHES.filter(m => m.group === groupKey &&
      teams.includes(m.home) && teams.includes(m.away)).forEach(m => {
      const r = results[m.id]; const w = winnerOf(r);
      if (!w) return;
      const nh = Number(r.home), na = Number(r.away);
      s[m.home].pf += nh; s[m.home].pc += na;
      s[m.away].pf += na; s[m.away].pc += nh;
      if (w === 'home') { s[m.home].pts += 3; s[m.away].pts += 1; }
      else { s[m.away].pts += 3; s[m.home].pts += 1; }
    });
    return s;
  }

  /* ──────────────────────────────────────────
     6. HELPERS DE RENDER
  ────────────────────────────────────────── */
  function logoImg(teamKey, cls) {
    const team = TEAMS[teamKey];
    return `<img src="${LOGO_PATH}${team.logo}.webp" alt="${team.name}" class="${cls}" loading="lazy" />`;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function showVal(v) { return (v === '' || v === null || v === undefined) ? '–' : v; }

  /* ──────────────────────────────────────────
     7. RENDER — CLASSIFICACIONS + GRUPS
  ────────────────────────────────────────── */
  function renderGroups() {
    const wrap = document.getElementById('groups-standings');
    if (!wrap) return;
    wrap.innerHTML = ['A', 'B'].map(g => standingsCard(g)).join('');
  }

  function standingsCard(groupKey) {
    const rows = computeStandings(groupKey);
    const tr = rows.map((s, idx) => {
      const qual = idx < 1 ? ' standing-row--qualify' : '';
      const diff = s.pf - s.pc;
      const diffStr = (diff > 0 ? '+' : '') + diff;
      return `
        <tr class="standing-row${qual}">
          <td class="st-pos">${idx + 1}</td>
          <td class="st-team">
            ${logoImg(s.team, 'st-logo')}
            <span class="st-name">${esc(TEAMS[s.team].name)}</span>
          </td>
          <td>${s.pj}</td>
          <td class="st-hide-sm">${s.pg}</td>
          <td class="st-hide-sm">${s.pp}</td>
          <td>${s.pf}</td>
          <td>${s.pc}</td>
          <td class="st-hide-sm">${diffStr}</td>
          <td class="st-pts">${s.pts}</td>
        </tr>`;
    }).join('');

    return `
      <div class="standings-card animate-on-scroll">
        <div class="standings-card__head">
          <span class="group-pill group-pill--${groupKey.toLowerCase()}">${t('group' + groupKey)}</span>
          <span class="group-court">${t('court')} ${groupKey === 'A' ? '1' : '2'}</span>
        </div>
        <div class="standings-table-wrap">
          <table class="standings-table">
            <thead>
              <tr>
                <th class="st-pos">${t('pos')}</th>
                <th class="st-team">${t('team')}</th>
                <th title="${t('pjFull')}">${t('pj')}</th>
                <th class="st-hide-sm" title="${t('pgFull')}">${t('pg')}</th>
                <th class="st-hide-sm" title="${t('ppFull')}">${t('pp')}</th>
                <th title="${t('pfFull')}">${t('pf')}</th>
                <th title="${t('pcFull')}">${t('pc')}</th>
                <th class="st-hide-sm">${t('dif')}</th>
                <th class="st-pts" title="${t('ptsFull')}">${t('pts')}</th>
              </tr>
            </thead>
            <tbody>${tr}</tbody>
          </table>
        </div>
        <p class="standings-qualify"><span class="qualify-dot"></span>${t('qualify')}</p>
      </div>`;
  }

  /* ──────────────────────────────────────────
     8. RENDER — RESULTATS (només lectura)
  ────────────────────────────────────────── */
  function renderResults() {
    const wrap = document.getElementById('results-list');
    if (!wrap) return;

    const byTime = {};
    MATCHES.forEach(m => { (byTime[m.time] = byTime[m.time] || []).push(m); });

    wrap.innerHTML = Object.keys(byTime).sort().map(time => {
      const slot = byTime[time].sort((a, b) => a.court - b.court);
      return `
        <div class="slot">
          <div class="slot__time"><svg aria-hidden="true"><use href="#i-clock"/></svg>${time}</div>
          <div class="slot__matches">
            ${slot.map(matchRow).join('')}
          </div>
        </div>`;
    }).join('');
  }

  function matchRow(m) {
    const r = results[m.id] || {};
    const w = winnerOf(r);
    const tie = isTie(r);
    const hv = (r.home === undefined || r.home === null) ? '' : r.home;
    const av = (r.away === undefined || r.away === null) ? '' : r.away;

    const homeWin = w === 'home' ? ' match-side--win' : '';
    const awayWin = w === 'away' ? ' match-side--win' : '';

    let shootout = '';
    if (tie && r.so) {
      const wn = r.so === 'home' ? m.home : m.away;
      shootout = `<div class="shootout shootout--ro"><span class="tl-result">${t('tlBadge')} · ${esc(TEAMS[wn].name)}</span></div>`;
    }

    return `
      <div class="match" data-group="${m.group}">
        <span class="match__court group-pill--${m.group.toLowerCase()}">${t('court')} ${m.court}</span>
        <div class="match__teams">
          <div class="match-side match-side--home${homeWin}">
            <span class="match-side__name">${esc(TEAMS[m.home].name)}</span>
            ${logoImg(m.home, 'match-side__logo')}
          </div>
          <div class="match__score">
            <span class="score-static">${showVal(hv)}</span>
            <span class="match__vs">${t('vs')}</span>
            <span class="score-static">${showVal(av)}</span>
          </div>
          <div class="match-side match-side--away${awayWin}">
            ${logoImg(m.away, 'match-side__logo')}
            <span class="match-side__name">${esc(TEAMS[m.away].name)}</span>
          </div>
        </div>
        ${shootout}
      </div>`;
  }

  /* ──────────────────────────────────────────
     10. RENDER — LA GRAN FINAL (1r Grup A vs 1r Grup B)
  ────────────────────────────────────────── */
  function seeds() {
    const a = computeStandings('A'), b = computeStandings('B');
    return {
      A: groupComplete('A'), B: groupComplete('B'),
      a1: a[0] && a[0].team, a2: a[1] && a[1].team,
      b1: b[0] && b[0].team, b2: b[1] && b[1].team,
    };
  }

  function renderBracket() {
    const wrap = document.getElementById('bracket');
    if (!wrap) return;
    const s = seeds();

    // Sense semifinals: la gran final enfronta el primer de cada grup.
    const finHome = s.A ? s.a1 : null, finHomeLbl = t('seed1A');
    const finAway = s.B ? s.b1 : null, finAwayLbl = t('seed1B');
    const rf = bracket.final || {};
    const wf = winnerOf(rf);
    const champ = wf ? (wf === 'home' ? finHome : finAway) : null;

    wrap.innerHTML = `
      <div class="final-wrap final-wrap--solo">
        <div class="final-trophy" aria-hidden="true"><svg><use href="#i-trophy"/></svg></div>
        ${bracketCard('final', t('grandFinalT'),
          { team: finHome, label: finHomeLbl },
          { team: finAway, label: finAwayLbl }, rf, true)}
        <div class="champion ${champ ? 'is-set' : ''}">
          <span class="champion__label">${t('champion')}</span>
          <span class="champion__name">
            ${champ ? logoImg(champ, 'champion__logo') + '<span>' + esc(TEAMS[champ].name) + '</span>' : '<span class="tbd">' + t('tbd') + '</span>'}
          </span>
        </div>
      </div>`;
  }

  function bracketCard(id, title, hNode, aNode, r, isFinal) {
    r = r || {};
    const w = winnerOf(r); // té en compte el desempat per tirs lliures (r.so)
    const hv = (r.home === undefined || r.home === null) ? '' : r.home;
    const av = (r.away === undefined || r.away === null) ? '' : r.away;

    function side(node, who) {
      const win = w === who ? ' bteam--win' : '';
      const content = node.team
        ? logoImg(node.team, 'bteam__logo') + `<span class="bteam__name">${esc(TEAMS[node.team].name)}</span>`
        : `<span class="bteam__logo bteam__logo--ph" aria-hidden="true"></span><span class="bteam__name bteam__name--ph">${esc(node.label)}</span>`;
      const val = who === 'home' ? hv : av;
      // Mostra sempre el marcador del Sheet, encara que l'equip (nom/logo)
      // no es pugui determinar fins que la fase de grups estigui completa.
      return `<div class="bteam${win}">${content}<span class="bscore bscore--ro">${showVal(val)}</span></div>`;
    }

    // A la fase final no mostrem l'etiqueta de tirs lliures: en cas d'empat,
    // el guanyador (decidit per r.so) ja queda ressaltat amb la selecció daurada.
    return `
      <div class="bracket-card ${isFinal ? 'bracket-card--final' : ''} animate-on-scroll" data-bmatch="${id}">
        <div class="bracket-card__title">${title}</div>
        ${side(hNode, 'home')}
        ${side(aNode, 'away')}
      </div>`;
  }

  /* ──────────────────────────────────────────
     11. STATIC LABELS dependents d'idioma
  ────────────────────────────────────────── */
  function renderStaticLabels() {
    const legend = document.getElementById('standings-legend');
    if (legend) legend.textContent = t('legend');
  }

  /* ──────────────────────────────────────────
     12. RENDER GLOBAL
  ────────────────────────────────────────── */
  function renderAll() {
    renderGroups();
    renderResults();
    renderBracket();
    renderStaticLabels();
    document.querySelectorAll('#torneig-app .animate-on-scroll')
      .forEach(el => el.classList.add('is-visible'));
  }

  /* ──────────────────────────────────────────
     13. INIT
  ────────────────────────────────────────── */
  function init() {
    renderAll();

    // Re-render del contingut dinàmic en canviar d'idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setTimeout(renderAll, 0));
    });

    if (HAS_SHEET) {
      loadFromSheet();
      setInterval(loadFromSheet, Math.max(10, CONFIG.refreshSeconds) * 1000);
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) loadFromSheet();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
