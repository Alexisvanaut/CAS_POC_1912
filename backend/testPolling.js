const { pollDevicesData } = require('./services/pollingScheduler');

/**
 * Test unitaire du polling (1 seule exécution)
 */
async function testPolling() {
    console.log('🧪 TEST DU SYSTÈME DE POLLING\n');

    try {
        const data = await pollDevicesData();

        console.log('\n📈 RÉSUMÉ DU TEST:');
        console.log(`  ✅ Nombre total de logs: ${data.length}`);

        // Grouper par device
        const byDevice = {};
        data.forEach(log => {
            if (!byDevice[log.deviceIdentifier]) {
                byDevice[log.deviceIdentifier] = [];
            }
            byDevice[log.deviceIdentifier].push(log);
        });

        console.log(`  ✅ Nombre de devices avec données: ${Object.keys(byDevice).length}`);

        Object.entries(byDevice).forEach(([deviceId, logs]) => {
            console.log(`    📡 Device ${deviceId}: ${logs.length} logs`);
        });

        console.log('\n🎉 TEST RÉUSSI !\n');

    } catch (error) {
        console.error('\n❌ TEST ÉCHOUÉ:', error.message);
        process.exit(1);
    }
}

testPolling();