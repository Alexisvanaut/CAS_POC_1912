  /**
   * Configuration du polling uniforme pour tous les devices
   */

  // Configuration du polling (10 minutes pour tous)
  const POLLING_CONFIG = {
    interval: 10 * 60 * 1000,           // 10 minutes
    name: 'Tous les capteurs',
    color: '🟢'
};

// Configuration des batches
const BATCH_CONFIG = {
    size: 100,                          // Nombre de devices par batch
    delayBetweenBatches: 500,           // Délai entre batches (ms)
    maxRetries: 3,                      // Nombre de tentatives en cas d'erreur
    retryDelay: 1000                    // Délai entre les tentatives (ms)
};

// Liste de tous les device IDs à monitorer
// Tu peux facilement ajouter/retirer des devices ici
const TAG_REFERENCES = [
    'p_temperature',  // Température en °C
    'p_humidity',     // Humidité en %
    'p_CO2'          // CO2 en ppm
];

const ALL_DEVICE_IDS = [
    '2',    // T0007838 B0 2241J1356
    '15',   // Test wizard refacto
    '16',   // ARCSOM - blue workspace
    '17',   // ARCSOM - green workspace
    '18'    // T0007806 B2 2251J1137
];

module.exports = {
    POLLING_CONFIG,
    BATCH_CONFIG,
    ALL_DEVICE_IDS,
    TAG_REFERENCES
};
