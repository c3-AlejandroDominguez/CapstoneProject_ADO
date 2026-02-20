data = {
  name: 'SmartBulbSource-INCANBulb',
  target: 'INCANBulb',
  source: 'SmartBulbSource',
  condition : startsWith(BULBTYPE, 'INCAN'),
  projection: {
    id: ID,

    bulbType: BULBTYPE,

    wattage: WATTAGE,

    manufacturer: MANUFACTURER,

    startDate: STARTDATE
    }
};