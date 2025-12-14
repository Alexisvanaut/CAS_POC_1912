const { getAuthToken, getAllDevicesRealtimeWithBatching } = require('./kheironAPI');
const { POLLING_CONFIG, BATCH_CONFIG, ALL_DEVICE_IDS, TAG_REFERENCES } = require('./pollingConfig');
require('dotenv').config();

const CONTRACT_ID = process.env.KHEIRON_CONTRACT_ID;

// Variable pour stocker le token (réutilisé pendant 24h)
let cachedToken = null;
let tokenExpiry = null;

/**
 * Récupère un token (utilise le cache si encore valide)
 */
async function getValidToken() {
    const now = Date.now();

    // Si token existe et n'est pas expiré, le réutiliser
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        console.log('🔑 Utilisation du token en cache');
        return cachedToken;
    }

    // Sinon, obtenir un nouveau token
    console.log('🔐 Récupération d\'un nouveau token...');
    cachedToken = await getAuthToken();
    tokenExpiry = now + (23 * 60 * 60 * 1000);  // 23h (marge de sécurité)

    return cachedToken;
}

/**
 * Fonction principale de polling
 */
async function pollDevicesData() {
    const startTime = Date.now();
    console.log('\n' + '='.repeat(60));
    console.log(`${POLLING_CONFIG.color} POLLING DÉMARRÉ - ${new Date().toLocaleString('fr-FR')}`);
    console.log('='.repeat(60));

    try {
        // 1. Obtenir le token
        const token = await getValidToken();

        // 2. Récupérer les données de tous les devices
        console.log(`\n📡 Récupération des données de ${ALL_DEVICE_IDS.length} devices...`);

        const data = await getAllDevicesRealtimeWithBatching(
            token,
            CONTRACT_ID,
            ALL_DEVICE_IDS,
            TAG_REFERENCES,
            BATCH_CONFIG.size
        );

        // 3. Traiter/Stocker les données
        // TODO: Stocker dans la base de données
        console.log(`\n💾 Données récupérées: ${data.length} logs`);

        // Afficher un aperçu des données
        if (data.length > 0) {
            console.log('\n📊 Aperçu des données:');
            data.slice(0, 3).forEach(log => {
                console.log(`  - Device ${log.deviceIdentifier} | Tag: ${log.tagReference} | Valeur: ${log.value}`);
            });
            if (data.length > 3) {
                console.log(`  ... et ${data.length - 3} autres logs`);
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n✅ Polling terminé avec succès en ${duration}s`);
        console.log('='.repeat(60) + '\n');

        return data;

    } catch (error) {
        console.error('\n❌ Erreur lors du polling:', error.message);
        console.log('='.repeat(60) + '\n');
        throw error;
    }
}

/**
 * Démarre le polling automatique
 */
function startPolling() {
    console.log('\n🚀 DÉMARRAGE DU SYSTÈME DE POLLING');
    console.log(`⏱️  Intervalle: ${POLLING_CONFIG.interval / 60000} minutes`);
    console.log(`📊 Nombre de devices: ${ALL_DEVICE_IDS.length}`);
    console.log(`📦 Taille des batches: ${BATCH_CONFIG.size}`);
    console.log('\n');

    // Exécuter immédiatement au démarrage
    pollDevicesData();

    // Puis répéter toutes les X minutes
    const intervalId = setInterval(pollDevicesData, POLLING_CONFIG.interval);

    // Retourner l'ID pour pouvoir arrêter le polling si besoin
    return intervalId;
}

/**
 * Arrête le polling
 */
function stopPolling(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
        console.log('\n🛑 Polling arrêté\n');
    }
}

module.exports = {
    pollDevicesData,
    startPolling,
    stopPolling
};