data = {
  name: 'SmartBulbSource-LEDBulb',
  target: 'LEDBulb',
  source: 'SmartBulbSource',
  condition : startsWith(BULBTYPE, 'LED'),
  projection: {
    id: ID,

    bulbType: BULBTYPE,

    wattage: WATTAGE,

    manufacturer: MANUFACTURER,

    startDate: STARTDATE
    }
};