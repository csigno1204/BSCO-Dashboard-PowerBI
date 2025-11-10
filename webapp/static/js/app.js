/**
 * Dashboard Bexio → Power BI - Application Web
 */

// État global
let currentPage = 'dashboard';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard Bexio → Power BI loaded');

    // Initialiser la navigation
    initNavigation();

    // Charger la configuration
    loadConfig();

    // Vérifier le statut périodiquement
    setInterval(checkStatus, 2000);

    // Premier check du statut
    checkStatus();
});

/**
 * Initialiser la navigation du menu
 */
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
}

/**
 * Naviguer vers une page
 */
function navigateTo(pageName) {
    // Désactiver tous les items du menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Activer l'item correspondant
    const activeItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Afficher la page demandée
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
    }
}

/**
 * Charger la configuration
 */
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();

        if (data.configured) {
            document.getElementById('apiKey').value = data.api_key_preview || '';
            updateAPIStatus(true);
            // Activer le bouton de sync rapide
            document.getElementById('quickSyncBtn').disabled = false;
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

/**
 * Sauvegarder la configuration
 */
async function saveConfig() {
    const apiKey = document.getElementById('apiKey').value.trim();

    if (!apiKey) {
        showError('Veuillez entrer une clé API');
        return;
    }

    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: apiKey })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('Configuration enregistrée avec succès !');
            updateAPIStatus(true);
            document.getElementById('configStatus').style.display = 'flex';
            document.getElementById('quickSyncBtn').disabled = false;
        } else {
            showError(data.error || 'Erreur lors de la configuration');
            updateAPIStatus(false);
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
        console.error('Error saving config:', error);
    }
}

/**
 * Mettre à jour le statut API dans la sidebar
 */
function updateAPIStatus(configured) {
    const statusBadge = document.getElementById('apiStatus');
    if (configured) {
        statusBadge.classList.add('configured');
        statusBadge.querySelector('.status-text').textContent = 'Configuré';
    } else {
        statusBadge.classList.remove('configured');
        statusBadge.querySelector('.status-text').textContent = 'Non configuré';
    }
}

/**
 * Vérifier le statut de l'application
 */
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        updateUI(data);
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

/**
 * Mettre à jour l'interface avec les données
 */
function updateUI(state) {
    // Mettre à jour les stats de synchronisation
    if (state.stats) {
        const contacts = state.stats.contacts || 0;
        const invoices = state.stats.invoices || 0;
        const projects = state.stats.projects || 0;
        const revenue = state.stats.total_revenue || 0;

        // Page Sync
        document.getElementById('syncContacts').textContent = contacts.toLocaleString();
        document.getElementById('syncInvoices').textContent = invoices.toLocaleString();
        document.getElementById('syncProjects').textContent = projects.toLocaleString();
        document.getElementById('syncRevenue').textContent = 'CHF ' + revenue.toLocaleString('fr-CH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Dashboard
        document.getElementById('totalContacts').textContent = contacts > 0 ? contacts.toLocaleString() : '-';
        document.getElementById('totalInvoices').textContent = invoices > 0 ? invoices.toLocaleString() : '-';
        document.getElementById('totalProjects').textContent = projects > 0 ? projects.toLocaleString() : '-';
        document.getElementById('totalRevenue').textContent = revenue > 0 ? 'CHF ' + revenue.toLocaleString('fr-CH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) : '-';

        // Page Stats
        document.getElementById('statsContacts').textContent = contacts.toLocaleString();
        document.getElementById('statsInvoices').textContent = invoices.toLocaleString();
        document.getElementById('statsProjects').textContent = projects.toLocaleString();
        document.getElementById('statsRevenue').textContent = 'CHF ' + revenue.toLocaleString('fr-CH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Gérer la progression
    if (state.status === 'syncing') {
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('progressFill').style.width = state.progress + '%';
        document.getElementById('progressPercent').textContent = state.progress + '%';
        document.getElementById('progressMessage').textContent = state.message;

        // Désactiver le bouton de sync
        const syncBtn = document.getElementById('syncBtn');
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<span>⏳</span> Synchronisation en cours...';
    } else {
        // Réactiver le bouton de sync
        const syncBtn = document.getElementById('syncBtn');
        syncBtn.disabled = false;
        syncBtn.innerHTML = '<span>🔄</span> Lancer la synchronisation';
    }

    // Gérer le succès
    if (state.status === 'success') {
        document.getElementById('downloadBtn').style.display = 'inline-flex';

        // Afficher l'heure de la dernière sync
        if (state.last_sync) {
            const lastSyncDate = new Date(state.last_sync);
            document.getElementById('lastSyncTime').textContent = lastSyncDate.toLocaleString('fr-CH');
            document.getElementById('lastSyncInfo').style.display = 'block';
        }

        // Masquer la progression après 2 secondes
        setTimeout(() => {
            document.getElementById('progressSection').style.display = 'none';
        }, 2000);
    }

    // Gérer les erreurs
    if (state.status === 'error') {
        showError(state.message);
        document.getElementById('progressSection').style.display = 'none';
    }
}

/**
 * Démarrer la synchronisation
 */
async function startSync() {
    try {
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            console.log('Synchronization started');
            document.getElementById('progressSection').style.display = 'block';
        } else {
            const data = await response.json();
            showError(data.error || 'Erreur lors de la synchronisation');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
        console.error('Error starting sync:', error);
    }
}

/**
 * Télécharger le fichier Excel
 */
function downloadFile() {
    window.location.href = '/api/download';
}

/**
 * Afficher un message de succès
 */
function showSuccess(message) {
    const alert = document.getElementById('successAlert');
    document.getElementById('successMessage').textContent = message;
    alert.style.display = 'block';

    document.getElementById('errorAlert').style.display = 'none';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

/**
 * Afficher un message d'erreur
 */
function showError(message) {
    const alert = document.getElementById('errorAlert');
    document.getElementById('errorMessage').textContent = message;
    alert.style.display = 'block';

    document.getElementById('successAlert').style.display = 'none';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}
