const axios = require('axios');
const { getAuthToken } = require('./services/kheironAPI');
require('dotenv').config();

const URL = process.env.KHEIRON_API_URL;
const CONTRACT_ID = process.env.KHEIRON_CONTRACT_ID;

async function discoverTags() {
    try {
        console.log('🔐 Authentification...');
        const token = await getAuthToken();

        console.log('\n📡 Récupération des données du device 16 (ARCSOM blue)...');
        console.log('Sans filtrer les tags pour voir TOUS les tags disponibles\n');

        const response = await axios.get(
            `${URL}/v1/devices/realtimes`,
            {
                params: {
                    contractId: CONTRACT_ID,
                    deviceId: '16'  // Un seul device
                    // PAS de tagReferences = récupère TOUT
                },
                headers: {
                    'Authorization': `bearer ${token}`
                }
            }
        );

        const logs = response.data.logs;
        console.log(`✅ ${logs.length} logs reçus\n`);

        // Extraire les noms de tags uniques
        const tagNames = [...new Set(logs.map(log => log.tagReference))];

        console.log('🏷️  TAGS DISPONIBLES:');
        tagNames.forEach(tag => {
            const example = logs.find(l => l.tagReference === tag);
            console.log(`  - ${tag} (exemple: ${example.value})`);
        });

        console.log('\n💡 Copie ces noms de tags dans pollingConfig.js !');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        console.error('Data:', error.response?.data);
    }
}

discoverTags();