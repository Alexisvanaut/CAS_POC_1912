const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const USERNAME = process.env.KHEIRON_USERNAME;
const PASSWORD = process.env.KHEIRON_PASSWORD;
const URL = process.env.KHEIRON_API_URL;

async function getAuthToken() {
    try {
        const credentials = `grant_type=password&username=${USERNAME}&password=${PASSWORD}`;

        const response = await axios.post(
            `${URL}/token`,
            credentials,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Erreur authentification: ', error.message);
        throw error;
    }
}

async function getContracts(token) {
    try {
        const response = await axios.get(
            `${URL}/v1/contracts`, 
            {
                headers: {
                    'Authorization': `bearer ${token}`
                }
            }
        );

        return response.data.contracts;

    } catch (error) {
        console.error('Erreur récupération contracts:', error.message);
        throw error;
    }
}

async function getDevices(token, contractId) {
    try {
        const response = await axios.get(
            `${URL}/v1/devices`,
            {
                params: {
                    contractId: contractId
                },
                headers: {
                   'Authorization': `bearer ${token}`
                }
            }
        );
        return response.data.devices;

    } catch (error) {
        console.error('Erreur récupération devices', error.message);
        throw error;
    }
}
async function getMultipleDevicesRealtime(token, contractId, deviceIds, tagReferences = []) {
    try {
        // Construire l'URL manuellement avec les bons query params
        const params = new URLSearchParams();
        params.append('contractId', contractId);

        // Ajouter chaque deviceId séparément
        deviceIds.forEach(id => {
            params.append('deviceIdentifiers', id);
        });

        // Ajouter chaque tag séparément
        if (tagReferences.length > 0) {
            tagReferences.forEach(tag => {
                params.append('tagReferences', tag);
            });
        }

        const url = `${URL}/v1/devices/realtimes?${params.toString()}`;

        console.log('\n🐛 URL complète:', url);

        const response = await axios.get(url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        });

        console.log('✅ Logs reçus:', response.data.logs?.length || 0);

        return response.data.logs;

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        console.error('URL:', error.config?.url);
        throw error;
    }
}


async function getAllDevicesRealtimeWithBatching(token, contractId, allDeviceIds, tagReferences = [], batchSize = 100) {
    try {
        const allResults = [];
        const totalBatches = Math.ceil(allDeviceIds.length / batchSize);

        console.log(`📊 Récupération de ${allDeviceIds.length} devices en ${totalBatches} batch(es) de ${batchSize}`);

        // Découper en lots et traiter chaque lot
        for (let i = 0; i < allDeviceIds.length; i += batchSize) {
            const batchNumber = Math.floor(i / batchSize) + 1;
            const batch = allDeviceIds.slice(i, i + batchSize);

            console.log(`Traitement batch ${batchNumber}/${totalBatches} (${batch.length} devices)...`);

            try {
                const batchResults = await getMultipleDevicesRealtime(token, contractId, batch, tagReferences);
                allResults.push(...batchResults);

                if (i + batchSize < allDeviceIds.length) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

            } catch (error) {
                console.error(`Erreur batch ${batchNumber}:`, error.message);
            }
        }

        console.log(`Total récupéré: ${allResults.length} logs`);
        return allResults;

    } catch (error) {
        console.error('Erreur batching:', error.message);
        throw error;
    }
}

module.exports = {
    getAuthToken,
    getContracts,
    getDevices,
    getMultipleDevicesRealtime,
    getAllDevicesRealtimeWithBatching
};

