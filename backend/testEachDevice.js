const { getAuthToken } = require('./services/kheironAPI');
const axios = require('axios');
require('dotenv').config();

const URL = process.env.KHEIRON_API_URL;
const CONTRACT_ID = process.env.KHEIRON_CONTRACT_ID;
const DEVICE_IDS = ['2', '15', '16', '17', '18'];

async function testEach() {
    const token = await getAuthToken();

    for (const deviceId of DEVICE_IDS) {
        console.log(`\n📡 Test device ${deviceId}...`);

        try {
            const params = new URLSearchParams();
            params.append('contractId', CONTRACT_ID);
            params.append('deviceIdentifiers', deviceId);
            params.append('tagReferences', 'p_CO2');

            const response = await axios.get(
                `${URL}/v1/devices/realtimes?${params.toString()}`,
                { headers: { 'Authorization': `bearer ${token}` }}
            );

            console.log(`  ✅ ${response.data.logs?.length || 0} logs`);

        } catch (error) {
            console.log(`  ❌ Erreur: ${error.message}`);
        }
    }
}

testEach();