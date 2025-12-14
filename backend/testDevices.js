const { getAuthToken, getDevices } = require('./services/kheironAPI');
  require('dotenv').config();

  const CONTRACT_ID = process.env.KHEIRON_CONTRACT_ID;

  async function testDevices() {
      try {
          console.log('🔐 Authentification...');
          const token = await getAuthToken();
          console.log('✅ Token reçu\n');

          console.log('📡 Récupération des devices pour le contract:', CONTRACT_ID);
          const devices = await getDevices(token, CONTRACT_ID);

          console.log('✅ Devices reçus:', devices.length, 'device(s)\n');
          console.log('📋 Liste des devices:\n');

          devices.forEach((device, index) => {
              console.log(`Device ${index + 1}:`);
              console.log(`  - ID: ${device.id}`);
              console.log(`  - Nom: ${device.name}`);
              console.log(`  - Détails: ${device.details}`);
              console.log(`  - Status: ${device.status} (0=actif, 1=inactif, 2=suspendu)`);
              console.log(`  - Timezone: ${device.timezone}\n`);
          });

      } catch (error) {
          console.error('❌ Erreur:', error.message);
      }
  }

  testDevices();