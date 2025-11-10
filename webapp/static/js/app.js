/**
 * Dashboard Bexio → Power BI - Frontend Application
 */

// État global
let syncInterval = null;

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard Bexio → Power BI - Web App loaded');
    checkStatus();
    loadConfig();

    // Vérifier le statut toutes les 2 secondes pendant une sync
    setInterval(checkStatus, 2000);
});

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
 * Charger la configuration
 */
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();

        if (data.configured) {
            document.getElementById('apiKey').value = data.api_key_preview || '';
            showSyncCard();
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

    const btn = document.getElementById('saveConfigBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Vérification...';

    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ api_key: apiKey })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('Configuration enregistrée avec succès !');
            showSyncCard();
        } else {
            showError(data.error || 'Erreur lors de la configuration');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
        console.error('Error saving config:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = '💾 Enregistrer la configuration';
    }
}

/**
 * Démarrer la synchronisation
 */
async function startSync() {
    const btn = document.getElementById('syncBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Synchronisation en cours...';

    // Afficher la barre de progression
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('statsGrid').style.display = 'grid';

    try {
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // La synchronisation a démarré, on continue à vérifier le statut
            console.log('Synchronization started');
        } else {
            const data = await response.json();
            showError(data.error || 'Erreur lors de la synchronisation');
            btn.disabled = false;
            btn.textContent = '🔄 Synchroniser les données';
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
        console.error('Error starting sync:', error);
        btn.disabled = false;
        btn.textContent = '🔄 Synchroniser les données';
    }
}

/**
 * Télécharger le fichier Power BI
 */
async function downloadFile() {
    window.location.href = '/api/download';
}

/**
 * Mettre à jour l'interface
 */
function updateUI(state) {
    // Mettre à jour le statut
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    statusDot.className = 'status-dot ' + state.status;

    switch (state.status) {
        case 'idle':
            statusText.textContent = 'Non configuré';
            break;
        case 'configured':
            statusText.textContent = 'Configuré';
            break;
        case 'syncing':
            statusText.textContent = 'Synchronisation en cours...';
            break;
        case 'success':
            statusText.textContent = 'Synchronisation réussie';
            break;
        case 'error':
            statusText.textContent = 'Erreur';
            break;
    }

    // Mettre à jour la progression
    if (state.status === 'syncing') {
        document.getElementById('progressContainer').style.display = 'block';
        document.getElementById('progressBarFill').style.width = state.progress + '%';
        document.getElementById('progressText').textContent = state.progress + '%';
        document.getElementById('progressMessage').textContent = state.message;
    }

    // Mettre à jour les stats
    if (state.stats) {
        document.getElementById('statContacts').textContent = state.stats.contacts.toLocaleString();
        document.getElementById('statInvoices').textContent = state.stats.invoices.toLocaleString();
        document.getElementById('statProjects').textContent = state.stats.projects.toLocaleString();
        document.getElementById('statRevenue').textContent =
            'CHF ' + state.stats.total_revenue.toLocaleString('fr-CH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    }

    // Afficher la dernière sync
    if (state.last_sync) {
        const lastSyncDate = new Date(state.last_sync);
        document.getElementById('lastSyncTime').textContent = lastSyncDate.toLocaleString('fr-CH');
        document.getElementById('lastSyncInfo').style.display = 'block';
    }

    // Gérer l'état du bouton de sync
    const syncBtn = document.getElementById('syncBtn');
    if (state.status === 'syncing') {
        syncBtn.disabled = true;
        syncBtn.textContent = '⏳ Synchronisation en cours...';
    } else {
        syncBtn.disabled = false;
        syncBtn.textContent = '🔄 Synchroniser les données';
    }

    // Afficher le bouton de téléchargement si succès
    if (state.status === 'success') {
        document.getElementById('downloadBtn').style.display = 'inline-flex';
        showSuccess(state.message);

        // Masquer la barre de progression après 2 secondes
        setTimeout(() => {
            document.getElementById('progressContainer').style.display = 'none';
        }, 2000);
    }

    // Afficher l'erreur si nécessaire
    if (state.status === 'error') {
        showError(state.message);
        document.getElementById('progressContainer').style.display = 'none';
    }
}

/**
 * Afficher la carte de synchronisation
 */
function showSyncCard() {
    document.getElementById('configCard').style.display = 'none';
    document.getElementById('syncCard').style.display = 'block';
}

/**
 * Afficher un message de succès
 */
function showSuccess(message) {
    const alert = document.getElementById('successAlert');
    document.getElementById('successMessage').textContent = message;
    alert.style.display = 'block';

    // Masquer l'alerte d'erreur
    document.getElementById('errorAlert').style.display = 'none';

    // Masquer après 5 secondes
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

    // Masquer l'alerte de succès
    document.getElementById('successAlert').style.display = 'none';

    // Masquer après 5 secondes
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

/**
 * Afficher la fenêtre À propos
 */
function showAbout() {
    alert(`Dashboard Bexio → Power BI
Version 1.0

Application web pour synchroniser vos données Bexio vers Power BI.

Développé par BSCO Solutions
© 2024

GitHub: https://github.com/csigno1204/BSCO-Dashboard-PowerBI`);
}
