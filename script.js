/**
 * BugTrack – Smart Bug Tracking System
 * Modern Client-Side Web Application
 * Vanilla JavaScript (ES6+)
 */

(() => {
  'use strict';

  // =========================================================================
  // STORAGE KEYS & CONSTANTS
  // =========================================================================
  const STORAGE_KEY = 'bugtrack_bugs_v1';
  const THEME_KEY = 'bugtrack_theme_v1';

  const SEVERITY_ORDER = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
  const PRIORITY_ORDER = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

  // =========================================================================
  // SAMPLE DEMO DATA (Realistic Software Engineering Issues)
  // =========================================================================
  const DEFAULT_DEMO_BUGS = [
    {
      id: 'BUG-1001',
      title: 'OAuth 2.0 PKCE exchange failure on Safari 17 iOS',
      description: 'Users on iOS 17.2 Safari encounter a silent token exchange failure when completing Google OAuth SSO redirection. The authorization code verifier is dropped from session storage due to strict cookie partition policies.',
      steps: '1. Open Safari on iOS 17.2.\n2. Navigate to /login and click "Sign in with Google".\n3. Complete external consent screen.\n4. Observe redirect to callback URL fails with code 400 Invalid PKCE Verifier.',
      expected: 'OAuth session completes successfully, stores JWT tokens in encrypted state, and redirects to user dashboard.',
      actual: 'Page hangs on callback URL with empty query params; console reports sessionStorage undefined key.',
      severity: 'Critical',
      priority: 'Urgent',
      status: 'Open',
      environment: 'Production',
      reporter: 'Sarah Jenkins (Security QA)',
      assignedTo: 'Marcus Vance (Lead Auth)',
      createdAt: '2026-10-24T09:15:00.000Z',
      updatedAt: '2026-10-25T14:30:00.000Z'
    },
    {
      id: 'BUG-1002',
      title: 'Memory leak in real-time WebSocket dashboard stream',
      description: 'Leaving the telemetry stream open for more than 45 minutes causes client memory footprint to exceed 1.2 GB, eventually triggering browser tab crash in Chromium.',
      steps: '1. Navigate to Live Monitoring tab.\n2. Start high-frequency telemetry event listener (100 events/sec).\n3. Inspect Chrome DevTools Memory tab over 30 minutes.',
      expected: 'Data buffer maintains a rolling window of 1,000 events with garbage collection keeping memory under 80 MB.',
      actual: 'DOM nodes and un-detached event handlers retain stale event objects continuously until heap crashes.',
      severity: 'High',
      priority: 'High',
      status: 'In Progress',
      environment: 'Staging',
      reporter: 'Devon Lee (Performance QA)',
      assignedTo: 'Elena Rostova (Frontend)',
      createdAt: '2026-10-25T11:00:00.000Z',
      updatedAt: '2026-10-26T16:45:00.000Z'
    },
    {
      id: 'BUG-1003',
      title: 'Checkout cart total floating-point rounding discrepancy',
      description: 'When applying an 8.5% state sales tax along with a $15 discount coupon on multi-item orders, the subtotal calculates $49.99999994 instead of rounding to $50.00.',
      steps: '1. Add 3 items priced $19.99 each to cart.\n2. Apply promo code "FALL15".\n3. Proceed to payment review stage.',
      expected: 'Total calculation strictly uses integer cents arithmetic to display $48.72.',
      actual: 'Total shows floating point precision error ($48.720000000000006) which causes Stripe API validation rejection.',
      severity: 'Critical',
      priority: 'Urgent',
      status: 'In Progress',
      environment: 'Production',
      reporter: 'Carlos Mendez (Billing QA)',
      assignedTo: 'Liam Thorne (Backend)',
      createdAt: '2026-10-25T13:20:00.000Z',
      updatedAt: '2026-10-27T08:15:00.000Z'
    },
    {
      id: 'BUG-1004',
      title: 'CSS z-index collision on mobile modal navigation menu',
      description: 'On viewport widths below 768px, opening the filter drawer overlaps the fixed header bar but remains behind toast notification backdrops.',
      steps: '1. Resize browser to 390px (mobile portrait).\n2. Open Filter dropdown drawer.\n3. Trigger any toast message notification.',
      expected: 'Modal drawers have clear stacking context hierarchy (header: z-50, drawer: z-100, toast: z-2000).',
      actual: 'Drawer element renders partially underneath header icons and becomes unclickable.',
      severity: 'Low',
      priority: 'Low',
      status: 'Resolved',
      environment: 'Frontend',
      reporter: 'Maya Patel (UI Designer)',
      assignedTo: 'Alex Chen (Frontend)',
      createdAt: '2026-10-22T10:00:00.000Z',
      updatedAt: '2026-10-24T12:00:00.000Z'
    },
    {
      id: 'BUG-1005',
      title: 'PostgreSQL connection pool exhaustion during batch user export',
      description: 'Triggering CSV export for workspaces with > 50,000 audit logs spawns synchronous unpooled DB connections, causing HTTP 504 Gateway Timeouts.',
      steps: '1. Log into workspace with 75k audit logs.\n2. Click "Export All Audit Logs as CSV".\n3. Observe database connection count spike to max pool limit (100).',
      expected: 'Export query executes via async streaming cursor with max 2 connections leased.',
      actual: 'Pool exhausts instantly, starving concurrent API requests for 45 seconds.',
      severity: 'High',
      priority: 'High',
      status: 'Open',
      environment: 'Backend',
      reporter: 'Liam Thorne (DevOps/SRE)',
      assignedTo: 'Unassigned',
      createdAt: '2026-10-26T14:10:00.000Z',
      updatedAt: '2026-10-26T14:10:00.000Z'
    },
    {
      id: 'BUG-1006',
      title: 'Keyboard accessibility focus trap missing in confirmation dialog',
      description: 'Users navigating via Tab key can cycle outside the open deletion confirmation modal into underlying inert background buttons.',
      steps: '1. Tab to delete button on any ticket and press Enter.\n2. When modal opens, press Tab repeatedly.\n3. Observe focus escapes to the sidebar.',
      expected: 'Focus should be constrained strictly within modal actionable elements until closed or submitted.',
      actual: 'Focus moves freely behind the modal overlay, violating WCAG 2.1 Level AA guidelines.',
      severity: 'Medium',
      priority: 'Medium',
      status: 'Resolved',
      environment: 'Frontend',
      reporter: 'Jordan Reed (A11y Lead)',
      assignedTo: 'Alex Chen (Frontend)',
      createdAt: '2026-10-21T08:30:00.000Z',
      updatedAt: '2026-10-23T11:45:00.000Z'
    },
    {
      id: 'BUG-1007',
      title: 'Dark mode flash of unstyled content (FOUC) on cold start',
      description: 'When dark mode is active and user hard-refreshes the page, the screen briefly flickers white for 120ms before theme stylesheet applies.',
      steps: '1. Ensure dark mode is toggled on.\n2. Clear browser cache and perform hard reload (Ctrl + Shift + R).\n3. Notice white screen flicker.',
      expected: 'Theme attribute is evaluated synchronously in head tag to prevent white flicker.',
      actual: 'White flash occurs during CSS download parse phase.',
      severity: 'Low',
      priority: 'Medium',
      status: 'Resolved',
      environment: 'Frontend',
      reporter: 'Alex Chen (Frontend)',
      assignedTo: 'Alex Chen (Frontend)',
      createdAt: '2026-10-20T17:00:00.000Z',
      updatedAt: '2026-10-22T09:10:00.000Z'
    }
  ];

  // =========================================================================
  // APPLICATION STATE
  // =========================================================================
  const state = {
    bugs: [],
    currentView: 'dashboard',
    viewMode: 'table', // 'table' | 'grid'
    activeBugDetailId: null,
    pendingDeleteId: null,
    filters: {
      search: '',
      status: 'all',
      severity: 'all',
      priority: 'all',
      sort: 'newest'
    }
  };

  // =========================================================================
  // DOM ELEMENT REFERENCES
  // =========================================================================
  const dom = {
    // Layout & Navigation
    html: document.documentElement,
    sidebar: document.getElementById('sidebar'),
    sidebarOpenBtn: document.getElementById('sidebarOpenBtn'),
    sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
    navLinks: document.querySelectorAll('.nav-link'),
    viewPanels: document.querySelectorAll('.view-panel'),
    pageHeaderTitle: document.getElementById('pageHeaderTitle'),
    pageHeaderSubtitle: document.getElementById('pageHeaderSubtitle'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    navTotalBugsBadge: document.getElementById('navTotalBugsBadge'),
    globalQuickSearch: document.getElementById('globalQuickSearch'),
    storageProgressBar: document.getElementById('storageProgressBar'),
    storagePercentLabel: document.getElementById('storagePercentLabel'),
    storageFootprintText: document.getElementById('storageFootprintText'),

    // Dashboard View Elements
    statTotalBugs: document.getElementById('statTotalBugs'),
    statOpenBugs: document.getElementById('statOpenBugs'),
    statOpenPercent: document.getElementById('statOpenPercent'),
    statInProgressBugs: document.getElementById('statInProgressBugs'),
    statInProgressPercent: document.getElementById('statInProgressPercent'),
    statResolvedBugs: document.getElementById('statResolvedBugs'),
    statResolvedPercent: document.getElementById('statResolvedPercent'),
    viewAllBugsFromStat: document.getElementById('viewAllBugsFromStat'),
    dashboardViewAllBtn: document.getElementById('dashboardViewAllBtn'),
    severityBarsContainer: document.getElementById('severityBarsContainer'),
    resolutionPillTag: document.getElementById('resolutionPillTag'),
    donutCenterTotal: document.getElementById('donutCenterTotal'),
    donutOpenSeg: document.getElementById('donutOpenSeg'),
    donutProgressSeg: document.getElementById('donutProgressSeg'),
    donutResolvedSeg: document.getElementById('donutResolvedSeg'),
    legendOpenVal: document.getElementById('legendOpenVal'),
    legendProgressVal: document.getElementById('legendProgressVal'),
    legendResolvedVal: document.getElementById('legendResolvedVal'),
    criticalWatchlistContainer: document.getElementById('criticalWatchlistContainer'),
    criticalCountBadge: document.getElementById('criticalCountBadge'),
    recentBugsTableBody: document.getElementById('recentBugsTableBody'),

    // All Bugs View Elements
    bugSearchInput: document.getElementById('bugSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    filterStatus: document.getElementById('filterStatus'),
    filterSeverity: document.getElementById('filterSeverity'),
    filterPriority: document.getElementById('filterPriority'),
    filterSort: document.getElementById('filterSort'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    bugsResultCounter: document.getElementById('bugsResultCounter'),
    viewModeTableBtn: document.getElementById('viewModeTableBtn'),
    viewModeGridBtn: document.getElementById('viewModeGridBtn'),
    bugsTableViewWrap: document.getElementById('bugsTableViewWrap'),
    bugsGridViewWrap: document.getElementById('bugsGridViewWrap'),
    allBugsTableBody: document.getElementById('allBugsTableBody'),
    bugsEmptyState: document.getElementById('bugsEmptyState'),
    emptyStateTitle: document.getElementById('emptyStateTitle'),
    emptyStateDesc: document.getElementById('emptyStateDesc'),
    emptyResetFilterBtn: document.getElementById('emptyResetFilterBtn'),
    emptyCreateBugBtn: document.getElementById('emptyCreateBugBtn'),
    tableCreateBugBtn: document.getElementById('tableCreateBugBtn'),
    openCreateBugBtn: document.getElementById('openCreateBugBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),

    // Analytics Elements
    analyticsResolutionRate: document.getElementById('analyticsResolutionRate'),
    analyticsResolutionBar: document.getElementById('analyticsResolutionBar'),
    analyticsResolutionNote: document.getElementById('analyticsResolutionNote'),
    analyticsSeverityList: document.getElementById('analyticsSeverityList'),
    analyticsPriorityList: document.getElementById('analyticsPriorityList'),
    analyticsEnvironmentList: document.getElementById('analyticsEnvironmentList'),
    analyticsExportCsvBtn: document.getElementById('analyticsExportCsvBtn'),

    // Settings View Elements
    settingsExportCsvBtn: document.getElementById('settingsExportCsvBtn'),
    settingsExportJsonBtn: document.getElementById('settingsExportJsonBtn'),
    settingsImportJsonBtn: document.getElementById('settingsImportJsonBtn'),
    importJsonFileInput: document.getElementById('importJsonFileInput'),
    settingsReloadDemoBtn: document.getElementById('settingsReloadDemoBtn'),
    settingsClearAllBtn: document.getElementById('settingsClearAllBtn'),
    footerDataLink: document.getElementById('footerDataLink'),

    // Modal Elements: Form (Create/Edit)
    bugFormModal: document.getElementById('bugFormModal'),
    bugReportForm: document.getElementById('bugReportForm'),
    modalFormTitle: document.getElementById('modalFormTitle'),
    modalFormSubtitle: document.getElementById('modalFormSubtitle'),
    closeFormModalBtn: document.getElementById('closeFormModalBtn'),
    cancelFormModalBtn: document.getElementById('cancelFormModalBtn'),
    saveBugBtnText: document.getElementById('saveBugBtnText'),
    formAlertBanner: document.getElementById('formAlertBanner'),
    formBugId: document.getElementById('formBugId'),
    formTitle: document.getElementById('formTitle'),
    formSeverity: document.getElementById('formSeverity'),
    formPriority: document.getElementById('formPriority'),
    formStatus: document.getElementById('formStatus'),
    formEnvironment: document.getElementById('formEnvironment'),
    formReporter: document.getElementById('formReporter'),
    formAssignedTo: document.getElementById('formAssignedTo'),
    formDescription: document.getElementById('formDescription'),
    formSteps: document.getElementById('formSteps'),
    formExpected: document.getElementById('formExpected'),
    formActual: document.getElementById('formActual'),
    titleCharCount: document.getElementById('titleCharCount'),

    // Modal Elements: Details
    bugDetailModal: document.getElementById('bugDetailModal'),
    closeDetailModalBtn: document.getElementById('closeDetailModalBtn'),
    detailCloseBtn: document.getElementById('detailCloseBtn'),
    detailEditBtn: document.getElementById('detailEditBtn'),
    detailDeleteBtn: document.getElementById('detailDeleteBtn'),
    detailCopyIdBtn: document.getElementById('detailCopyIdBtn'),
    detailBugId: document.getElementById('detailBugId'),
    detailBadges: document.getElementById('detailBadges'),
    detailBugTitle: document.getElementById('detailBugTitle'),
    detailStatusSwitch: document.getElementById('detailStatusSwitch'),
    detailEnvironment: document.getElementById('detailEnvironment'),
    detailReporter: document.getElementById('detailReporter'),
    detailAssignedTo: document.getElementById('detailAssignedTo'),
    detailCreatedAt: document.getElementById('detailCreatedAt'),
    detailUpdatedAt: document.getElementById('detailUpdatedAt'),
    detailDescription: document.getElementById('detailDescription'),
    detailSteps: document.getElementById('detailSteps'),
    detailExpected: document.getElementById('detailExpected'),
    detailActual: document.getElementById('detailActual'),

    // Modal Elements: Delete Confirmation
    deleteConfirmModal: document.getElementById('deleteConfirmModal'),
    deleteBugTargetId: document.getElementById('deleteBugTargetId'),
    deleteBugTargetTitle: document.getElementById('deleteBugTargetTitle'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // UTILITY & SECURITY HELPERS
  // =========================================================================

  /**
   * Escape HTML to strictly prevent Cross-Site Scripting (XSS)
   */
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Format ISO date string into readable concise date
   */
  function formatDate(isoStr) {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  }

  /**
   * Generate next sequential Bug ID (e.g. BUG-1008)
   */
  function generateBugId() {
    let maxNum = 1000;
    state.bugs.forEach(bug => {
      const match = bug.id && bug.id.match(/^BUG-(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `BUG-${maxNum + 1}`;
  }

  // =========================================================================
  // TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="icon toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="icon toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="8" y2="12"/>
        <line x1="12" x2="12.01" y1="16" y2="16"/>
      </svg>`;
    } else {
      iconSvg = `<svg class="icon toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="16" y2="12"/>
        <line x1="12" x2="12.01" y1="8" y2="8"/>
      </svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${escapeHTML(message)}</span>
      <button class="toast-close" aria-label="Dismiss notification">&times;</button>
    `;

    dom.toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 200);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 3500);
  }

  // =========================================================================
  // STORAGE & PERSISTENCE
  // =========================================================================
  function loadBugsFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        state.bugs = JSON.parse(JSON.stringify(DEFAULT_DEMO_BUGS));
        saveBugsToStorage(false);
      } else {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          state.bugs = parsed;
        } else {
          state.bugs = JSON.parse(JSON.stringify(DEFAULT_DEMO_BUGS));
          saveBugsToStorage(false);
        }
      }
    } catch (err) {
      console.error('Failed to load bugs from LocalStorage:', err);
      state.bugs = JSON.parse(JSON.stringify(DEFAULT_DEMO_BUGS));
    }
  }

  function saveBugsToStorage(notify = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bugs));
      updateStorageMeter();
      if (notify) {
        refreshAllViews();
      }
    } catch (err) {
      console.error('Failed to save bugs to LocalStorage:', err);
      showToast('Error saving data to browser LocalStorage!', 'error');
    }
  }

  function updateStorageMeter() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY) || '';
      // Approximate bytes in UTF-16
      const bytes = new Blob([dataStr]).size;
      const kb = (bytes / 1024).toFixed(1);
      // Standard browser limit is 5MB (5120 KB)
      const percent = Math.min(Math.max((bytes / (5 * 1024 * 1024)) * 100, 1), 100).toFixed(1);

      if (dom.storageProgressBar) dom.storageProgressBar.style.width = `${percent}%`;
      if (dom.storagePercentLabel) dom.storagePercentLabel.textContent = `${state.bugs.length} Bugs`;
      if (dom.storageFootprintText) dom.storageFootprintText.textContent = `${kb} KB used in LocalStorage`;
    } catch (e) {
      if (dom.storageFootprintText) dom.storageFootprintText.textContent = 'Storage active';
    }
  }

  // =========================================================================
  // THEME MANAGEMENT (Dark / Light)
  // =========================================================================
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const theme = saved || 'dark';
    dom.html.setAttribute('data-theme', theme);

    dom.themeToggleBtn.addEventListener('click', () => {
      const current = dom.html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      dom.html.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      showToast(`Switched to ${next === 'dark' ? 'Dark Navy' : 'Light Slate'} theme`, 'info');
    });
  }

  // =========================================================================
  // VIEW NAVIGATION & ROUTING
  // =========================================================================
  function switchView(viewName) {
    state.currentView = viewName;

    // Update Nav Link Active states
    dom.navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Panels
    dom.viewPanels.forEach(panel => {
      if (panel.id === `view-${viewName}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Header Titles
    const titleMap = {
      dashboard: {
        title: 'Dashboard Overview',
        sub: 'Real-time software quality metrics & telemetry'
      },
      bugs: {
        title: 'Bug Report Repository',
        sub: 'Filter, triage, inspect, and update defect tickets'
      },
      analytics: {
        title: 'Quality Analytics & Telemetry',
        sub: 'Distribution charts, pipeline breakdown & technical notes'
      },
      settings: {
        title: 'Data Storage & Settings',
        sub: 'Manage LocalStorage client database, import, and export'
      }
    };

    if (titleMap[viewName]) {
      dom.pageHeaderTitle.textContent = titleMap[viewName].title;
      dom.pageHeaderSubtitle.textContent = titleMap[viewName].sub;
    }

    // Close mobile sidebar if open
    dom.sidebar.classList.remove('mobile-open');

    // Trigger render for the active view
    if (viewName === 'dashboard') renderDashboard();
    else if (viewName === 'bugs') renderBugsView();
    else if (viewName === 'analytics') renderAnalytics();
    else if (viewName === 'settings') updateStorageMeter();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // BADGE HTML GENERATION HELPERS
  // =========================================================================
  function getSeverityBadge(severity) {
    const s = escapeHTML(severity || 'Low');
    const lower = s.toLowerCase();
    return `<span class="badge badge-${lower}">${s}</span>`;
  }

  function getStatusBadge(status) {
    const st = escapeHTML(status || 'Open');
    let cls = 'badge-status-open';
    if (st === 'In Progress') cls = 'badge-status-progress';
    else if (st === 'Resolved') cls = 'badge-status-resolved';
    return `<span class="badge ${cls}">${st}</span>`;
  }

  function getPriorityBadge(priority) {
    const p = escapeHTML(priority || 'Medium');
    let cls = 'tag-badge';
    if (p === 'Urgent') cls = 'badge badge-urgent';
    return `<span class="${cls}">${p}</span>`;
  }

  // =========================================================================
  // VIEW 1: DASHBOARD RENDERING
  // =========================================================================
  function renderDashboard() {
    const bugs = state.bugs;
    const total = bugs.length;
    const open = bugs.filter(b => b.status === 'Open').length;
    const inProgress = bugs.filter(b => b.status === 'In Progress').length;
    const resolved = bugs.filter(b => b.status === 'Resolved').length;

    // KPI Values
    dom.statTotalBugs.textContent = total;
    dom.statOpenBugs.textContent = open;
    dom.statInProgressBugs.textContent = inProgress;
    dom.statResolvedBugs.textContent = resolved;

    // KPI Percentages
    const openPct = total ? Math.round((open / total) * 100) : 0;
    const progPct = total ? Math.round((inProgress / total) * 100) : 0;
    const resPct = total ? Math.round((resolved / total) * 100) : 0;

    dom.statOpenPercent.textContent = `${openPct}% active`;
    dom.statInProgressPercent.textContent = `${progPct}% WIP`;
    dom.statResolvedPercent.textContent = `${resPct}% rate`;
    dom.resolutionPillTag.textContent = `${resPct}% Resolved`;

    // 1. Severity Breakdown Horizontal Bars
    const severityCounts = {
      Critical: bugs.filter(b => b.severity === 'Critical').length,
      High: bugs.filter(b => b.severity === 'High').length,
      Medium: bugs.filter(b => b.severity === 'Medium').length,
      Low: bugs.filter(b => b.severity === 'Low').length
    };

    dom.severityBarsContainer.innerHTML = [
      { key: 'Critical', label: 'Critical', dot: 'dot-critical', fill: 'bg-critical' },
      { key: 'High', label: 'High', dot: 'dot-high', fill: 'bg-amber' },
      { key: 'Medium', label: 'Medium', dot: 'dot-medium', fill: 'bg-cyan' },
      { key: 'Low', label: 'Low', dot: 'dot-low', fill: 'bg-emerald' }
    ].map(item => {
      const count = severityCounts[item.key] || 0;
      const pct = total ? Math.round((count / total) * 100) : 0;
      return `
        <div class="severity-bar-item">
          <div class="severity-bar-label-row">
            <span class="severity-name">
              <span class="severity-dot ${item.dot}"></span>
              ${item.label}
            </span>
            <span class="severity-stats">${count} <span style="font-weight: 400; color: var(--text-muted); font-size: 0.75rem;">(${pct}%)</span></span>
          </div>
          <div class="severity-track">
            <div class="severity-fill ${item.fill}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    // 2. Status Donut SVG Visualization
    // Circumference for r=45 is 2 * PI * 45 ≈ 282.743
    const circumference = 2 * Math.PI * 45;
    dom.donutCenterTotal.textContent = total;
    dom.legendOpenVal.textContent = open;
    dom.legendProgressVal.textContent = inProgress;
    dom.legendResolvedVal.textContent = resolved;

    if (total === 0) {
      dom.donutResolvedSeg.style.strokeDasharray = `0 ${circumference}`;
      dom.donutProgressSeg.style.strokeDasharray = `0 ${circumference}`;
      dom.donutOpenSeg.style.strokeDasharray = `0 ${circumference}`;
    } else {
      const resLen = (resolved / total) * circumference;
      const progLen = (inProgress / total) * circumference;
      const openLen = (open / total) * circumference;

      // Segment 1: Resolved starts at 0
      dom.donutResolvedSeg.style.strokeDasharray = `${resLen} ${circumference - resLen}`;
      dom.donutResolvedSeg.style.strokeDashoffset = '0';

      // Segment 2: In Progress starts after Resolved
      dom.donutProgressSeg.style.strokeDasharray = `${progLen} ${circumference - progLen}`;
      dom.donutProgressSeg.style.strokeDashoffset = `${-resLen}`;

      // Segment 3: Open starts after Resolved + In Progress
      dom.donutOpenSeg.style.strokeDasharray = `${openLen} ${circumference - openLen}`;
      dom.donutOpenSeg.style.strokeDashoffset = `${-(resLen + progLen)}`;
    }

    // 3. Critical Watchlist
    const criticalWatchlist = bugs
      .filter(b => (b.severity === 'Critical' || (b.severity === 'High' && b.priority === 'Urgent')) && b.status !== 'Resolved')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4);

    dom.criticalCountBadge.textContent = `${criticalWatchlist.length} Critical Alert${criticalWatchlist.length === 1 ? '' : 's'}`;

    if (criticalWatchlist.length === 0) {
      dom.criticalWatchlistContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.85rem;">
          <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🎉</div>
          <strong>No critical unaddressed bugs!</strong>
          <p style="font-size: 0.78rem; margin-top: 0.25rem;">All high-impact blockers have been resolved or mitigated.</p>
        </div>
      `;
    } else {
      dom.criticalWatchlistContainer.innerHTML = criticalWatchlist.map(bug => `
        <div class="critical-item" data-id="${escapeHTML(bug.id)}">
          <div class="critical-info">
            <div class="critical-header-line">
              <span class="bug-id-tag">${escapeHTML(bug.id)}</span>
              ${getSeverityBadge(bug.severity)}
              ${getStatusBadge(bug.status)}
            </div>
            <div class="critical-title">${escapeHTML(bug.title)}</div>
            <div class="critical-date">Reported: ${formatDate(bug.createdAt)} &bull; ${escapeHTML(bug.environment || 'Production')}</div>
          </div>
          <button class="btn btn-secondary btn-sm" data-action="view" data-id="${escapeHTML(bug.id)}">Inspect</button>
        </div>
      `).join('');

      // Add click listeners to critical items
      dom.criticalWatchlistContainer.querySelectorAll('.critical-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const bugId = item.getAttribute('data-id');
          openDetailModal(bugId);
        });
      });
    }

    // 4. Recent Reports Table
    const recentBugs = [...bugs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    if (recentBugs.length === 0) {
      dom.recentBugsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-subtle); padding: 2rem;">
            No bugs recorded yet. Click "+ Report Bug" to create one.
          </td>
        </tr>
      `;
    } else {
      dom.recentBugsTableBody.innerHTML = recentBugs.map(bug => `
        <tr>
          <td><span class="bug-id-tag">${escapeHTML(bug.id)}</span></td>
          <td>
            <div class="table-bug-title-wrap">
              <span class="table-bug-title" data-action="view" data-id="${escapeHTML(bug.id)}">${escapeHTML(bug.title)}</span>
              <span class="table-bug-meta">${escapeHTML(bug.environment || 'General')} &bull; By ${escapeHTML(bug.reporter || 'QA')}</span>
            </div>
          </td>
          <td>${getSeverityBadge(bug.severity)}</td>
          <td>${getStatusBadge(bug.status)}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-action="view" data-id="${escapeHTML(bug.id)}">
              View &rarr;
            </button>
          </td>
        </tr>
      `).join('');

      dom.recentBugsTableBody.querySelectorAll('[data-action="view"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          openDetailModal(id);
        });
      });
    }
  }

  // =========================================================================
  // VIEW 2: ALL BUGS REPOSITORY RENDERING & FILTERING
  // =========================================================================
  function getFilteredBugs() {
    let list = [...state.bugs];
    const { search, status, severity, priority, sort } = state.filters;

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(b => {
        return (
          (b.id && b.id.toLowerCase().includes(q)) ||
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.reporter && b.reporter.toLowerCase().includes(q)) ||
          (b.assignedTo && b.assignedTo.toLowerCase().includes(q)) ||
          (b.environment && b.environment.toLowerCase().includes(q)) ||
          (b.description && b.description.toLowerCase().includes(q))
        );
      });
    }

    // Status filter
    if (status !== 'all') {
      list = list.filter(b => b.status === status);
    }

    // Severity filter
    if (severity !== 'all') {
      list = list.filter(b => b.severity === severity);
    }

    // Priority filter
    if (priority !== 'all') {
      list = list.filter(b => b.priority === priority);
    }

    // Sort order
    list.sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sort === 'severity-desc') {
        const orderA = SEVERITY_ORDER[a.severity] || 0;
        const orderB = SEVERITY_ORDER[b.severity] || 0;
        return orderB - orderA;
      } else if (sort === 'priority-desc') {
        const orderA = PRIORITY_ORDER[a.priority] || 0;
        const orderB = PRIORITY_ORDER[b.priority] || 0;
        return orderB - orderA;
      } else if (sort === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }

  function renderBugsView() {
    const filtered = getFilteredBugs();
    const total = state.bugs.length;

    // Update Counter
    dom.bugsResultCounter.textContent = `Showing ${filtered.length} of ${total} bugs`;
    dom.navTotalBugsBadge.textContent = total;

    // Show / Hide Clear button on search input
    if (state.filters.search.trim()) {
      dom.clearSearchBtn.classList.remove('hidden');
    } else {
      dom.clearSearchBtn.classList.add('hidden');
    }

    // Handle Empty State
    if (filtered.length === 0) {
      dom.bugsTableViewWrap.classList.add('hidden');
      dom.bugsGridViewWrap.classList.add('hidden');
      dom.bugsEmptyState.classList.remove('hidden');

      if (total === 0) {
        dom.emptyStateTitle.textContent = 'No bug reports recorded yet';
        dom.emptyStateDesc.textContent = 'Get started by reporting your first defect or loading sample demo data.';
        dom.emptyResetFilterBtn.textContent = 'Load Demo Data';
        dom.emptyResetFilterBtn.onclick = () => {
          resetDemoData();
        };
      } else {
        dom.emptyStateTitle.textContent = 'No bug reports match your filter criteria';
        dom.emptyStateDesc.textContent = 'Try adjusting your search terms or clearing one or more active filters.';
        dom.emptyResetFilterBtn.textContent = 'Reset All Filters';
        dom.emptyResetFilterBtn.onclick = () => {
          resetFilters();
        };
      }
      return;
    }

    // When there are results
    dom.bugsEmptyState.classList.add('hidden');

    if (state.viewMode === 'table') {
      dom.bugsTableViewWrap.classList.remove('hidden');
      dom.bugsGridViewWrap.classList.add('hidden');
      renderBugsTable(filtered);
    } else {
      dom.bugsTableViewWrap.classList.add('hidden');
      dom.bugsGridViewWrap.classList.remove('hidden');
      renderBugsGrid(filtered);
    }
  }

  function renderBugsTable(bugs) {
    dom.allBugsTableBody.innerHTML = bugs.map(bug => `
      <tr data-id="${escapeHTML(bug.id)}">
        <td>
          <span class="bug-id-tag">${escapeHTML(bug.id)}</span>
        </td>
        <td>
          <div class="table-bug-title-wrap">
            <span class="table-bug-title" data-action="view" data-id="${escapeHTML(bug.id)}">${escapeHTML(bug.title)}</span>
            <div class="table-bug-meta">
              <span class="tag-badge">${escapeHTML(bug.environment || 'Production')}</span>
              <span>Created ${formatDate(bug.createdAt)}</span>
            </div>
          </div>
        </td>
        <td>${getSeverityBadge(bug.severity)}</td>
        <td>${getPriorityBadge(bug.priority)}</td>
        <td>
          <select class="form-select filter-select table-status-select" data-id="${escapeHTML(bug.id)}" style="padding: 0.25rem 0.5rem; font-size: 0.78rem;">
            <option value="Open" ${bug.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="In Progress" ${bug.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Resolved" ${bug.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </td>
        <td style="font-size: 0.82rem; color: var(--text-muted);">${escapeHTML(bug.reporter || '-')}</td>
        <td style="font-size: 0.78rem; color: var(--text-subtle);">${formatDate(bug.updatedAt)}</td>
        <td>
          <div class="table-actions-cell">
            <button class="icon-btn btn-sm" title="View details" data-action="view" data-id="${escapeHTML(bug.id)}">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="icon-btn btn-sm" title="Edit bug" data-action="edit" data-id="${escapeHTML(bug.id)}">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </button>
            <button class="icon-btn btn-sm" title="Delete bug" data-action="delete" data-id="${escapeHTML(bug.id)}" style="color: var(--critical);">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    attachTableEventListeners();
  }

  function renderBugsGrid(bugs) {
    dom.bugsGridViewWrap.innerHTML = bugs.map(bug => {
      let accentClass = 'bg-cyan';
      if (bug.severity === 'Critical') accentClass = 'bg-critical';
      else if (bug.severity === 'High') accentClass = 'bg-amber';
      else if (bug.severity === 'Low') accentClass = 'bg-emerald';

      return `
        <div class="bug-card-item" data-id="${escapeHTML(bug.id)}">
          <div class="bug-card-accent-bar ${accentClass}"></div>
          <div class="card-top-meta">
            <span class="bug-id-tag">${escapeHTML(bug.id)}</span>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              ${getSeverityBadge(bug.severity)}
              ${getStatusBadge(bug.status)}
            </div>
          </div>
          
          <h4 class="card-bug-title" data-action="view" data-id="${escapeHTML(bug.id)}">${escapeHTML(bug.title)}</h4>
          <p class="card-bug-desc-snippet">${escapeHTML(bug.description)}</p>
          
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="tag-badge">Env: ${escapeHTML(bug.environment || 'Prod')}</span>
            ${getPriorityBadge(bug.priority)}
          </div>

          <div class="card-footer-meta">
            <div>
              <span>By ${escapeHTML(bug.reporter || 'QA')}</span> &bull; 
              <span>${formatDate(bug.updatedAt)}</span>
            </div>
            <div class="card-actions-row">
              <button class="icon-btn btn-sm" title="View details" data-action="view" data-id="${escapeHTML(bug.id)}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button class="icon-btn btn-sm" title="Edit bug" data-action="edit" data-id="${escapeHTML(bug.id)}">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                </svg>
              </button>
              <button class="icon-btn btn-sm" title="Delete bug" data-action="delete" data-id="${escapeHTML(bug.id)}" style="color: var(--critical);">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    attachTableEventListeners();
  }

  function attachTableEventListeners() {
    // Action Buttons (View, Edit, Delete)
    document.querySelectorAll('[data-action="view"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailModal(el.getAttribute('data-id'));
      });
    });

    document.querySelectorAll('[data-action="edit"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(el.getAttribute('data-id'));
      });
    });

    document.querySelectorAll('[data-action="delete"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteModal(el.getAttribute('data-id'));
      });
    });

    // Quick Status Dropdown in Table
    document.querySelectorAll('.table-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-id');
        const newStatus = sel.value;
        updateBugStatus(id, newStatus);
      });
    });

    // Click whole row/card to view
    document.querySelectorAll('.data-table tbody tr, .bug-card-item').forEach(el => {
      el.addEventListener('click', (e) => {
        // Only trigger if not clicking buttons or selects
        if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return;
        const id = el.getAttribute('data-id');
        if (id) openDetailModal(id);
      });
    });
  }

  function resetFilters() {
    state.filters.search = '';
    state.filters.status = 'all';
    state.filters.severity = 'all';
    state.filters.priority = 'all';
    state.filters.sort = 'newest';

    dom.bugSearchInput.value = '';
    dom.filterStatus.value = 'all';
    dom.filterSeverity.value = 'all';
    dom.filterPriority.value = 'all';
    dom.filterSort.value = 'newest';

    renderBugsView();
    showToast('Filters cleared to default', 'info');
  }

  // =========================================================================
  // VIEW 3: ANALYTICS & CHARTS RENDERING
  // =========================================================================
  function renderAnalytics() {
    const bugs = state.bugs;
    const total = bugs.length;
    const resolved = bugs.filter(b => b.status === 'Resolved').length;
    const resRate = total ? Math.round((resolved / total) * 100) : 0;

    dom.analyticsResolutionRate.textContent = `${resRate}%`;
    dom.analyticsResolutionBar.style.width = `${resRate}%`;
    dom.analyticsResolutionNote.textContent = `${resolved} of ${total} recorded bug tickets have reached verified resolution state.`;

    // 1. Severity Distribution
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    const sevColors = { Critical: 'bg-critical', High: 'bg-amber', Medium: 'bg-cyan', Low: 'bg-emerald' };
    dom.analyticsSeverityList.innerHTML = severities.map(sev => {
      const count = bugs.filter(b => b.severity === sev).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      return `
        <div class="breakdown-item">
          <div class="breakdown-row">
            <span class="breakdown-label">${sev} Severity</span>
            <span class="breakdown-count">${count} tickets (${pct}%)</span>
          </div>
          <div class="breakdown-track">
            <div class="breakdown-fill ${sevColors[sev]}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    // 2. Priority Distribution
    const priorities = ['Urgent', 'High', 'Medium', 'Low'];
    dom.analyticsPriorityList.innerHTML = priorities.map(pri => {
      const count = bugs.filter(b => b.priority === pri).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      return `
        <div class="breakdown-item">
          <div class="breakdown-row">
            <span class="breakdown-label">${pri} Priority</span>
            <span class="breakdown-count">${count} tickets (${pct}%)</span>
          </div>
          <div class="breakdown-track">
            <div class="breakdown-fill bg-cyan" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    // 3. Environment Breakdown
    const envMap = {};
    bugs.forEach(b => {
      const env = b.environment || 'Production';
      envMap[env] = (envMap[env] || 0) + 1;
    });

    const envKeys = Object.keys(envMap).sort((a, b) => envMap[b] - envMap[a]);
    dom.analyticsEnvironmentList.innerHTML = envKeys.map(env => {
      const count = envMap[env];
      const pct = total ? Math.round((count / total) * 100) : 0;
      return `
        <div class="breakdown-item">
          <div class="breakdown-row">
            <span class="breakdown-label">${escapeHTML(env)}</span>
            <span class="breakdown-count">${count} (${pct}%)</span>
          </div>
          <div class="breakdown-track">
            <div class="breakdown-fill bg-emerald" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // REFRESH ALL ACTIVE VIEWS & COUNTERS
  // =========================================================================
  function refreshAllViews() {
    dom.navTotalBugsBadge.textContent = state.bugs.length;
    updateStorageMeter();

    if (state.currentView === 'dashboard') {
      renderDashboard();
    } else if (state.currentView === 'bugs') {
      renderBugsView();
    } else if (state.currentView === 'analytics') {
      renderAnalytics();
    }
  }

  // =========================================================================
  // CRUD OPERATIONS: CREATE, UPDATE, DELETE, STATUS CHANGE
  // =========================================================================
  function handleFormSubmit(e) {
    e.preventDefault();
    clearFormErrors();

    const isEdit = Boolean(dom.formBugId.value.trim());
    const title = dom.formTitle.value.trim();
    const severity = dom.formSeverity.value;
    const priority = dom.formPriority.value;
    const status = dom.formStatus.value;
    const environment = dom.formEnvironment.value;
    const reporter = dom.formReporter.value.trim();
    const assignedTo = dom.formAssignedTo.value.trim() || 'Unassigned';
    const description = dom.formDescription.value.trim();
    const steps = dom.formSteps.value.trim();
    const expected = dom.formExpected.value.trim();
    const actual = dom.formActual.value.trim();

    // Validation
    let hasError = false;

    if (!title) {
      showFieldError('titleError', 'formTitle', 'Bug summary title is required.');
      hasError = true;
    } else if (title.length < 5) {
      showFieldError('titleError', 'formTitle', 'Title must be at least 5 characters long.');
      hasError = true;
    }

    if (!reporter) {
      showFieldError('reporterError', 'formReporter', 'Reporter name is required.');
      hasError = true;
    }

    if (!description) {
      showFieldError('descError', 'formDescription', 'Please provide a clear description of the defect.');
      hasError = true;
    }

    if (!steps) {
      showFieldError('stepsError', 'formSteps', 'Please provide numbered steps to reproduce this bug.');
      hasError = true;
    }

    if (!expected) {
      showFieldError('expectedError', 'formExpected', 'Expected behavior is required.');
      hasError = true;
    }

    if (!actual) {
      showFieldError('actualError', 'formActual', 'Observed actual behavior is required.');
      hasError = true;
    }

    if (hasError) {
      dom.formAlertBanner.classList.remove('hidden');
      return;
    }

    const now = new Date().toISOString();

    if (isEdit) {
      // Edit existing bug
      const id = dom.formBugId.value.trim();
      const idx = state.bugs.findIndex(b => b.id === id);
      if (idx !== -1) {
        state.bugs[idx] = {
          ...state.bugs[idx],
          title,
          severity,
          priority,
          status,
          environment,
          reporter,
          assignedTo,
          description,
          steps,
          expected,
          actual,
          updatedAt: now
        };
        saveBugsToStorage();
        closeModal(dom.bugFormModal);
        showToast(`Bug ${id} updated successfully!`, 'success');
        
        // If detail modal is open for this bug, re-render it
        if (state.activeBugDetailId === id) {
          openDetailModal(id);
        }
      }
    } else {
      // Create new bug
      const newId = generateBugId();
      const newBug = {
        id: newId,
        title,
        severity,
        priority,
        status,
        environment,
        reporter,
        assignedTo,
        description,
        steps,
        expected,
        actual,
        createdAt: now,
        updatedAt: now
      };

      state.bugs.unshift(newBug);
      saveBugsToStorage();
      closeModal(dom.bugFormModal);
      showToast(`Bug ${newId} logged successfully!`, 'success');

      // Auto route to All Bugs view if created from another view
      if (state.currentView !== 'bugs' && state.currentView !== 'dashboard') {
        switchView('bugs');
      }
    }
  }

  function updateBugStatus(bugId, newStatus) {
    const bug = state.bugs.find(b => b.id === bugId);
    if (!bug) return;

    bug.status = newStatus;
    bug.updatedAt = new Date().toISOString();
    saveBugsToStorage();
    showToast(`${bugId} status set to "${newStatus}"`, 'info');

    // Re-render detail modal if open
    if (state.activeBugDetailId === bugId) {
      openDetailModal(bugId);
    }
  }

  function deleteBug(bugId) {
    const idx = state.bugs.findIndex(b => b.id === bugId);
    if (idx === -1) return;

    state.bugs.splice(idx, 1);
    saveBugsToStorage();
    closeModal(dom.deleteConfirmModal);
    
    // If detail modal is open for this bug, close it too
    if (state.activeBugDetailId === bugId) {
      closeModal(dom.bugDetailModal);
    }

    showToast(`Bug ${bugId} permanently deleted.`, 'error');
  }

  function resetDemoData() {
    state.bugs = JSON.parse(JSON.stringify(DEFAULT_DEMO_BUGS));
    saveBugsToStorage();
    showToast('Reset to default demo bugs successfully!', 'success');
  }

  function clearAllData() {
    if (confirm('Are you sure you want to permanently delete ALL bug reports? This cannot be undone.')) {
      state.bugs = [];
      saveBugsToStorage();
      showToast('All bug data cleared.', 'error');
    }
  }

  // =========================================================================
  // MODAL CONTROLLERS & FORM VALIDATION
  // =========================================================================
  function openCreateModal() {
    clearFormErrors();
    dom.bugReportForm.reset();
    dom.formBugId.value = '';
    dom.modalFormTitle.textContent = 'Report New Bug';
    dom.modalFormSubtitle.textContent = 'Fill in the defect report details for developer triage.';
    dom.saveBugBtnText.textContent = 'Save Bug Report';
    dom.titleCharCount.textContent = '0 / 120';
    dom.formSeverity.value = 'Medium';
    dom.formPriority.value = 'Medium';
    dom.formStatus.value = 'Open';
    dom.formEnvironment.value = 'Frontend';

    openModal(dom.bugFormModal);
    setTimeout(() => dom.formTitle.focus(), 100);
  }

  function openEditModal(bugId) {
    const bug = state.bugs.find(b => b.id === bugId);
    if (!bug) return;

    clearFormErrors();
    dom.formBugId.value = bug.id;
    dom.modalFormTitle.textContent = `Edit Bug ${bug.id}`;
    dom.modalFormSubtitle.textContent = 'Update defect status, priority, or reproduction notes.';
    dom.saveBugBtnText.textContent = 'Update Bug Report';

    dom.formTitle.value = bug.title || '';
    dom.formSeverity.value = bug.severity || 'Medium';
    dom.formPriority.value = bug.priority || 'Medium';
    dom.formStatus.value = bug.status || 'Open';
    dom.formEnvironment.value = bug.environment || 'Frontend';
    dom.formReporter.value = bug.reporter || '';
    dom.formAssignedTo.value = bug.assignedTo || '';
    dom.formDescription.value = bug.description || '';
    dom.formSteps.value = bug.steps || '';
    dom.formExpected.value = bug.expected || '';
    dom.formActual.value = bug.actual || '';
    dom.titleCharCount.textContent = `${dom.formTitle.value.length} / 120`;

    openModal(dom.bugFormModal);
    setTimeout(() => dom.formTitle.focus(), 100);
  }

  function openDetailModal(bugId) {
    const bug = state.bugs.find(b => b.id === bugId);
    if (!bug) return;

    state.activeBugDetailId = bug.id;
    dom.detailBugId.textContent = bug.id;
    dom.detailBugTitle.textContent = bug.title;

    // Badges Cluster
    dom.detailBadges.innerHTML = `
      ${getSeverityBadge(bug.severity)}
      ${getPriorityBadge(bug.priority)}
      ${getStatusBadge(bug.status)}
    `;

    // Quick status toggle active pill
    dom.detailStatusSwitch.querySelectorAll('.status-toggle-pill').forEach(pill => {
      if (pill.getAttribute('data-status') === bug.status) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Metadata
    dom.detailEnvironment.textContent = bug.environment || 'General';
    dom.detailReporter.textContent = bug.reporter || 'QA Team';
    dom.detailAssignedTo.textContent = bug.assignedTo || 'Unassigned';
    dom.detailCreatedAt.textContent = formatDate(bug.createdAt);
    dom.detailUpdatedAt.textContent = formatDate(bug.updatedAt);

    // Text content
    dom.detailDescription.textContent = bug.description || 'No description provided.';
    dom.detailSteps.textContent = bug.steps || 'No reproduction steps provided.';
    dom.detailExpected.textContent = bug.expected || '-';
    dom.detailActual.textContent = bug.actual || '-';

    openModal(dom.bugDetailModal);
  }

  function openDeleteModal(bugId) {
    const bug = state.bugs.find(b => b.id === bugId);
    if (!bug) return;

    state.pendingDeleteId = bug.id;
    dom.deleteBugTargetId.textContent = bug.id;
    dom.deleteBugTargetTitle.textContent = `"${bug.title}"`;

    openModal(dom.deleteConfirmModal);
  }

  function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    closeModal(dom.bugFormModal);
    closeModal(dom.bugDetailModal);
    closeModal(dom.deleteConfirmModal);
  }

  function showFieldError(errorSpanId, inputId, msg) {
    const errSpan = document.getElementById(errorSpanId);
    const inputEl = document.getElementById(inputId);
    if (errSpan) errSpan.textContent = msg;
    if (inputEl) inputEl.classList.add('is-invalid');
  }

  function clearFormErrors() {
    dom.formAlertBanner.classList.add('hidden');
    dom.bugReportForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    dom.bugReportForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  }

  // =========================================================================
  // EXPORT & IMPORT FUNCTIONALITY
  // =========================================================================
  function exportToCSV() {
    if (state.bugs.length === 0) {
      showToast('No bugs to export.', 'info');
      return;
    }

    const headers = [
      'Bug ID',
      'Title',
      'Environment',
      'Severity',
      'Priority',
      'Status',
      'Reporter',
      'Assigned To',
      'Description',
      'Steps to Reproduce',
      'Expected Result',
      'Actual Result',
      'Created At',
      'Updated At'
    ];

    const escapeCsvField = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = state.bugs.map(b => [
      escapeCsvField(b.id),
      escapeCsvField(b.title),
      escapeCsvField(b.environment),
      escapeCsvField(b.severity),
      escapeCsvField(b.priority),
      escapeCsvField(b.status),
      escapeCsvField(b.reporter),
      escapeCsvField(b.assignedTo),
      escapeCsvField(b.description),
      escapeCsvField(b.steps),
      escapeCsvField(b.expected),
      escapeCsvField(b.actual),
      escapeCsvField(b.createdAt),
      escapeCsvField(b.updatedAt)
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bugtrack-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${state.bugs.length} bugs to CSV file!`, 'success');
  }

  function exportToJSON() {
    if (state.bugs.length === 0) {
      showToast('No bugs to export.', 'info');
      return;
    }

    const jsonContent = JSON.stringify(state.bugs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bugtrack-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Exported JSON backup successfully!', 'success');
  }

  function handleImportJSON(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) {
          throw new Error('Imported JSON must be an array of bug objects.');
        }

        // Validate basic properties
        let validCount = 0;
        parsed.forEach(item => {
          if (item.title && item.severity && item.status) {
            if (!item.id) item.id = generateBugId();
            if (!item.createdAt) item.createdAt = new Date().toISOString();
            if (!item.updatedAt) item.updatedAt = item.createdAt;
            validCount++;
          }
        });

        if (validCount === 0) {
          throw new Error('No valid bug tickets detected in JSON file.');
        }

        state.bugs = parsed;
        saveBugsToStorage();
        showToast(`Successfully imported ${validCount} bugs!`, 'success');
        switchView('bugs');
      } catch (err) {
        showToast(`Import failed: ${err.message}`, 'error');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // EVENT LISTENERS INITIALIZATION
  // =========================================================================
  function initEventListeners() {
    // 1. Navigation Links
    dom.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const view = link.getAttribute('data-view');
        switchView(view);
      });
    });

    // 2. Mobile Sidebar toggle
    dom.sidebarOpenBtn.addEventListener('click', () => {
      dom.sidebar.classList.add('mobile-open');
    });
    dom.sidebarCloseBtn.addEventListener('click', () => {
      dom.sidebar.classList.remove('mobile-open');
    });

    // 3. Quick Action Buttons
    dom.openCreateBugBtn.addEventListener('click', openCreateModal);
    dom.tableCreateBugBtn.addEventListener('click', openCreateModal);
    dom.emptyCreateBugBtn.addEventListener('click', openCreateModal);

    // 4. Dashboard card action links
    dom.viewAllBugsFromStat.addEventListener('click', () => switchView('bugs'));
    dom.dashboardViewAllBtn.addEventListener('click', () => switchView('bugs'));

    // Clicking KPI Cards filters All Bugs
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const filterVal = card.getAttribute('data-filter-trigger');
        if (filterVal) {
          state.filters.status = filterVal;
          dom.filterStatus.value = filterVal;
          switchView('bugs');
        }
      });
    });

    // 5. Global Search & In-View Search
    dom.globalQuickSearch.addEventListener('input', (e) => {
      const q = e.target.value;
      state.filters.search = q;
      dom.bugSearchInput.value = q;
      if (state.currentView !== 'bugs') {
        switchView('bugs');
      } else {
        renderBugsView();
      }
    });

    dom.bugSearchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      dom.globalQuickSearch.value = e.target.value;
      renderBugsView();
    });

    dom.clearSearchBtn.addEventListener('click', () => {
      state.filters.search = '';
      dom.bugSearchInput.value = '';
      dom.globalQuickSearch.value = '';
      renderBugsView();
    });

    // 6. Filter dropdowns
    dom.filterStatus.addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      renderBugsView();
    });

    dom.filterSeverity.addEventListener('change', (e) => {
      state.filters.severity = e.target.value;
      renderBugsView();
    });

    dom.filterPriority.addEventListener('change', (e) => {
      state.filters.priority = e.target.value;
      renderBugsView();
    });

    dom.filterSort.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      renderBugsView();
    });

    dom.resetFiltersBtn.addEventListener('click', resetFilters);

    // 7. Table vs Card Toggle
    dom.viewModeTableBtn.addEventListener('click', () => {
      state.viewMode = 'table';
      dom.viewModeTableBtn.classList.add('active');
      dom.viewModeGridBtn.classList.remove('active');
      renderBugsView();
    });

    dom.viewModeGridBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      dom.viewModeGridBtn.classList.add('active');
      dom.viewModeTableBtn.classList.remove('active');
      renderBugsView();
    });

    // 8. Form Modal events
    dom.bugReportForm.addEventListener('submit', handleFormSubmit);
    dom.closeFormModalBtn.addEventListener('click', () => closeModal(dom.bugFormModal));
    dom.cancelFormModalBtn.addEventListener('click', () => closeModal(dom.bugFormModal));

    dom.formTitle.addEventListener('input', (e) => {
      const len = e.target.value.length;
      dom.titleCharCount.textContent = `${len} / 120`;
      if (len >= 5) {
        document.getElementById('titleError').textContent = '';
        dom.formTitle.classList.remove('is-invalid');
      }
    });

    // 9. Bug Detail Modal events
    dom.closeDetailModalBtn.addEventListener('click', () => closeModal(dom.bugDetailModal));
    dom.detailCloseBtn.addEventListener('click', () => closeModal(dom.bugDetailModal));

    dom.detailEditBtn.addEventListener('click', () => {
      const id = state.activeBugDetailId;
      closeModal(dom.bugDetailModal);
      openEditModal(id);
    });

    dom.detailDeleteBtn.addEventListener('click', () => {
      const id = state.activeBugDetailId;
      openDeleteModal(id);
    });

    dom.detailCopyIdBtn.addEventListener('click', () => {
      if (!state.activeBugDetailId) return;
      navigator.clipboard.writeText(state.activeBugDetailId).then(() => {
        showToast(`Copied ${state.activeBugDetailId} to clipboard!`, 'info');
      }).catch(() => {
        showToast(state.activeBugDetailId, 'info');
      });
    });

    // Detail Modal quick status toggle buttons
    dom.detailStatusSwitch.querySelectorAll('.status-toggle-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const newStatus = pill.getAttribute('data-status');
        if (state.activeBugDetailId && newStatus) {
          updateBugStatus(state.activeBugDetailId, newStatus);
        }
      });
    });

    // 10. Delete Confirm Modal
    dom.cancelDeleteBtn.addEventListener('click', () => closeModal(dom.deleteConfirmModal));
    dom.confirmDeleteBtn.addEventListener('click', () => {
      if (state.pendingDeleteId) {
        deleteBug(state.pendingDeleteId);
      }
    });

    // 11. Settings & Data actions
    dom.exportCsvBtn.addEventListener('click', exportToCSV);
    dom.analyticsExportCsvBtn.addEventListener('click', exportToCSV);
    dom.settingsExportCsvBtn.addEventListener('click', exportToCSV);
    dom.settingsExportJsonBtn.addEventListener('click', exportToJSON);
    dom.settingsImportJsonBtn.addEventListener('click', () => dom.importJsonFileInput.click());
    dom.importJsonFileInput.addEventListener('change', handleImportJSON);
    dom.settingsReloadDemoBtn.addEventListener('click', resetDemoData);
    dom.settingsClearAllBtn.addEventListener('click', clearAllData);
    dom.footerDataLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('settings');
    });

    // 12. Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape closes modals
      if (e.key === 'Escape') {
        closeAllModals();
      }

      // Ctrl + K or '/' focuses global search
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        dom.globalQuickSearch.focus();
      }
    });

    // Backdrop click on modals
    [dom.bugFormModal, dom.bugDetailModal, dom.deleteConfirmModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });
  }

  // =========================================================================
  // BOOTSTRAP INITIALIZATION
  // =========================================================================
  function init() {
    initTheme();
    loadBugsFromStorage();
    initEventListeners();
    switchView('dashboard');
  }

  // Launch app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
