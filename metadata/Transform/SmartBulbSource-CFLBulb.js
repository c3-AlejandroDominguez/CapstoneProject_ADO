data = {
  name: 'SmartBulbSource-CFLBulb',
  target: 'CFLBulb',
  source: 'SmartBulbSource',
  condition : startsWith(BULBTYPE, 'CFL'),
  projection: {
    id: ID,

    bulbType: BULBTYPE,

    wattage: WATTAGE,

    manufacturer: MANUFACTURER,

    startDate: STARTDATE
    }
};