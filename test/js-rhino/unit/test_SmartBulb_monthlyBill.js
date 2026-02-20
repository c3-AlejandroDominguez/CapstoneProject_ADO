// test/js-rhino/unit/test_SmartBulb_monthlyBill.js
describe('SmartBulb monthlyBill function', function () {
    
    beforeEach(function () {
        // Clean up only test data (IDs starting with TEST_)
        SmartBulbMeasurement.removeAll({filter: "id.startsWith('TEST_')"}, true);
        SmartBulbMeasurementSeries.removeAll({filter: "id.startsWith('TEST_')"}, true);
        SmartBulb.removeAll({filter: "id.startsWith('TEST_')"}, true);
        Fixture.removeAll({filter: "id.startsWith('TEST_')"}, true);
        Apartment.removeAll({filter: "id.startsWith('TEST_')"}, true);
        Building.removeAll({filter: "id.startsWith('TEST_')"}, true);
        City.removeAll({filter: "id.startsWith('TEST_')"}, true);
    });
    
    it('should calculate monthly bill correctly with electricity rate', function () {
        // Create a city with electricity rate
        const city = City.make({
            id: 'TEST_CITY',
            name: 'Test City',
            latitude: 37.4848,
            longitude: -122.2281,
            electricityRate: 0.15
        });
        city.create();
        
        // Create building in the city
        const building = Building.make({
            id: 'TEST_BLDG',
            latitude: 37.4848,
            longitude: -122.2281,
            city: city.id
        });
        building.create();
        
        // Create apartment in the building
        const apartment = Apartment.make({
            id: 'TEST_APT',
            building: building
        });
        apartment.create();
        
        // Create fixture in the apartment
        const fixture = Fixture.make({
            id: 'TEST_FIX',
            apartment: apartment
        });
        fixture.create();
        
        // Create LED smart bulb with efficiency factor 0.75
        const smartBulb = LEDBulb.make({
            id: 'TEST_BULB',
            bulbType: 'LED',
            wattage: 60,
            manufacturer: 'TestCorp',
            startDate: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            currentFixture: fixture
        });
        smartBulb.create();
        
        // Create measurement series
        const series = SmartBulbMeasurementSeries.make({
            id: 'TEST_SERIES',
            smartBulb: smartBulb
        });
        series.create();
        
        // Create measurements for February 2026
        // Two half-hour measurements: 30W for 0.5 hours each = 15Wh each = 0.015kWh each
        // Total: 0.03 kWh * $0.15/kWh = $0.0045 ≈ $0.00
        const measurement1 = SmartBulbMeasurement.make({
            id: 'TEST_SERIES#TEST_MEAS_1',
            parent: series,
            start: DateTime.parse('2026-02-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            end: DateTime.parse('2026-02-01T00:30:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            power: 30,
            lumens: 400,
            temperature: 3000,
            voltage: 120,
            status: 1
        });
        measurement1.create();
        
        const measurement2 = SmartBulbMeasurement.make({
            id: 'TEST_SERIES#TEST_MEAS_2',
            parent: series,
            start: DateTime.parse('2026-02-01T00:30:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            end: DateTime.parse('2026-02-01T01:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            power: 30,
            lumens: 400,
            temperature: 3000,
            voltage: 120,
            status: 1
        });
        measurement2.create();
        
        // Calculate bill for February 2026
        const bill = smartBulb.monthlyBill(2, 2026);
        
        // Expected: (30W × 0.5h + 30W × 0.5h) / 1000 × 0.75 (efficiency) × $0.15/kWh
        // = 0.03 kWh × 0.75 × $0.15 = $0.003375 ≈ $0.00 (rounded to 2 decimals)
        expect(bill).toEqual(0.00);
    });
    
    it('should calculate monthly bill for full day of usage', function () {
        // Create a city with electricity rate
        const city = City.make({
            id: 'TEST_CITY2',
            name: 'Test City 2',
            latitude: 37.4848,
            longitude: -122.2281,
            electricityRate: 0.20
        });
        city.create();
        
        // Create building in the city
        const building = Building.make({
            id: 'TEST_BLDG2',
            latitude: 37.4848,
            longitude: -122.2281,
            city: city.id
        });
        building.create();
        
        // Create apartment in the building
        const apartment = Apartment.make({
            id: 'TEST_APT2',
            building: building
        });
        apartment.create();
        
        // Create fixture in the apartment
        const fixture = Fixture.make({
            id: 'TEST_FIX2',
            apartment: apartment
        });
        fixture.create();
        
        // Create CFL smart bulb with efficiency factor 0.25
        const smartBulb = CFLBulb.make({
            id: 'TEST_BULB2',
            bulbType: 'CFL',
            wattage: 60,
            manufacturer: 'TestCorp',
            startDate: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            currentFixture: fixture
        });
        smartBulb.create();
        
        // Create measurement series
        const series = SmartBulbMeasurementSeries.make({
            id: 'TEST_SERIES2',
            smartBulb: smartBulb
        });
        series.create();
        
        // Create 48 half-hour measurements for a full day (24 hours)
        // 50W for 0.5 hours = 25Wh per measurement = 0.025kWh per measurement
        // 48 measurements * 0.025kWh = 1.2 kWh
        // 1.2 kWh * $0.20/kWh = $0.24
        for (var i = 0; i < 48; i++) {
            const hour = Math.floor(i / 2);
            const minute = (i % 2) * 30;
            const nextHour = Math.floor((i + 1) / 2);
            const nextMinute = ((i + 1) % 2) * 30;
            
            const measurement = SmartBulbMeasurement.make({
                id: 'TEST_SERIES2#TEST_MEAS2_' + i,
                parent: series,
                start: DateTime.fromMillis(2026, 2, 15, hour, minute, 0, 0),
                end: DateTime.fromMillis(2026, 2, 15, nextHour, nextMinute, 0, 0),
                power: 50,
                lumens: 600,
                temperature: 3000,
                voltage: 120,
                status: 1
            });
            measurement.create();
        }
        
        // Calculate bill for February 2026
        const bill = smartBulb.monthlyBill(2, 2026);
        
        // Expected: 48 measurements × 50W × 0.5h / 1000 × 0.25 (efficiency) × $0.20/kWh
        // = 1.2 kWh × 0.25 × $0.20 = $0.06
        expect(bill).toEqual(0.06);
    });
    
    it('should return 0 when smart bulb has no current fixture', function () {
        // Create incandescent smart bulb without a fixture
        const smartBulb = INCANBulb.make({
            id: 'TEST_BULB_NO_FIX',
            bulbType: 'INCAN',
            wattage: 60,
            manufacturer: 'TestCorp',
            startDate: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
        smartBulb.create();
        
        // Calculate bill - should return 0
        const bill = smartBulb.monthlyBill(2, 2026);
        expect(bill).toEqual(0.0);
    });
    
    it('should return 0 when there are no measurements for the month', function () {
        // Create a city with electricity rate
        const city = City.make({
            id: 'TEST_CITY3',
            name: 'Test City 3',
            latitude: 37.4848,
            longitude: -122.2281,
            electricityRate: 0.15
        });
        city.create();
        
        // Create building in the city
        const building = Building.make({
            id: 'TEST_BLDG3',
            latitude: 37.4848,
            longitude: -122.2281,
            city: city.id
        });
        building.create();
        
        // Create apartment in the building
        const apartment = Apartment.make({
            id: 'TEST_APT3',
            building: building
        });
        apartment.create();
        
        // Create fixture in the apartment
        const fixture = Fixture.make({
            id: 'TEST_FIX3',
            apartment: apartment
        });
        fixture.create();
        
        // Create LED smart bulb
        const smartBulb = LEDBulb.make({
            id: 'TEST_BULB3',
            bulbType: 'LED',
            wattage: 60,
            manufacturer: 'TestCorp',
            startDate: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            currentFixture: fixture
        });
        smartBulb.create();
        
        // Create measurement series (but no measurements)
        const series = SmartBulbMeasurementSeries.make({
            id: 'TEST_SERIES3',
            smartBulb: smartBulb
        });
        series.create();
        
        // Calculate bill for February 2026 - should return 0
        const bill = smartBulb.monthlyBill(2, 2026);
        expect(bill).toEqual(0.0);
    });
    
    it('should only include measurements within the specified month', function () {
        // Create a city with electricity rate
        const city = City.make({
            id: 'TEST_CITY4',
            name: 'Test City 4',
            latitude: 37.4848,
            longitude: -122.2281,
            electricityRate: 0.10
        });
        city.create();
        
        // Create building in the city
        const building = Building.make({
            id: 'TEST_BLDG4',
            latitude: 37.4848,
            longitude: -122.2281,
            city: city.id
        });
        building.create();
        
        // Create apartment in the building
        const apartment = Apartment.make({
            id: 'TEST_APT4',
            building: building
        });
        apartment.create();
        
        // Create fixture in the apartment
        const fixture = Fixture.make({
            id: 'TEST_FIX4',
            apartment: apartment
        });
        fixture.create();
        
        // Create incandescent smart bulb with efficiency factor 0.45
        const smartBulb = INCANBulb.make({
            id: 'TEST_BULB4',
            bulbType: 'INCAN',
            wattage: 60,
            manufacturer: 'TestCorp',
            startDate: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            currentFixture: fixture
        });
        smartBulb.create();
        
        // Create measurement series
        const series = SmartBulbMeasurementSeries.make({
            id: 'TEST_SERIES4',
            smartBulb: smartBulb
        });
        series.create();
        
        // Create measurement in January 2026 (should not be included)
        const measurement1 = SmartBulbMeasurement.make({
            id: 'TEST_SERIES4#TEST_MEAS4_1',
            parent: series,
            start: DateTime.parse('2026-01-31T23:30:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            end: DateTime.parse('2026-02-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            power: 100,
            lumens: 800,
            temperature: 3000,
            voltage: 120,
            status: 1
        });
        measurement1.create();
        
        // Create measurement in February 2026 (should be included)
        // 40W for 0.5 hours = 20Wh = 0.02kWh
        // 0.02 kWh * $0.10/kWh = $0.002 ≈ $0.00
        const measurement2 = SmartBulbMeasurement.make({
            id: 'TEST_SERIES4#TEST_MEAS4_2',
            parent: series,
            start: DateTime.parse('2026-02-15T12:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            end: DateTime.parse('2026-02-15T12:30:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            power: 40,
            lumens: 500,
            temperature: 3000,
            voltage: 120,
            status: 1
        });
        measurement2.create();
        
        // Create measurement in March 2026 (should not be included)
        const measurement3 = SmartBulbMeasurement.make({
            id: 'TEST_SERIES4#TEST_MEAS4_3',
            parent: series,
            start: DateTime.parse('2026-03-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            end: DateTime.parse('2026-03-01T00:30:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            power: 100,
            lumens: 800,
            temperature: 3000,
            voltage: 120,
            status: 1
        });
        measurement3.create();
        
        // Calculate bill for February 2026
        const bill = smartBulb.monthlyBill(2, 2026);
        
        // Expected: 40W × 0.5h / 1000 × 0.45 (efficiency) × $0.10/kWh
        // = 0.02 kWh × 0.45 × $0.10 = $0.0009 ≈ $0.00
        expect(bill).toEqual(0.00);
    });
    
    it('should handle December correctly (year rollover)', function () {
        // Create a city with electricity rate
        const city = City.make({
            id: 'TEST_CITY5',
            name: 'Test City 5',
            latitude: 37.4848,
            longitude: -122.2281,
            electricityRate: 0.12
        });
        city.create();
        
        // Create building in the city
        const building = Building.make({
            id: 'TEST_BLDG5',
            latitude: 37.4848,
            longitude: -122.2281,
            city: city.id
        });
        building.create();
        
        // Create apartment in the building
        const apartment = Apartment.make({
            id: 'TEST_APT5',
            building: building
        });
        apartment.create();
        
        // Create fixture in the apartment
        const fixture = Fixture.make({
            id: 'TEST_FIX5',
            apartment: apartment
        });
        fixture.create();
        
        // Create LED smart bulb with efficiency factor 0.75
        const smartBulb = LEDBulb.make({
            id: 'TEST_BULB5',
            bulbType: 'LED',
            wattage: 60,
            manufacturer: 'TestCorp',
            startDate: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            currentFixture: fixture
        });
        smartBulb.create();
        
        // Create measurement series
        const series = SmartBulbMeasurementSeries.make({
            id: 'TEST_SERIES5',
            smartBulb: smartBulb
        });
        series.create();
        
        // Create measurement in December 2025
        // 60W for 1 hour = 60Wh = 0.06kWh
        // 0.06 kWh * $0.12/kWh = $0.0072 ≈ $0.01
        const measurement = SmartBulbMeasurement.make({
            id: 'TEST_SERIES5#TEST_MEAS5_1',
            parent: series,
            start: DateTime.parse('2025-12-31T23:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            end: DateTime.parse('2026-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss'),
            power: 60,
            lumens: 700,
            temperature: 3000,
            voltage: 120,
            status: 1
        });
        measurement.create();
        
        // Calculate bill for December 2025
        const bill = smartBulb.monthlyBill(12, 2025);
        
        // Expected: 60W × 1h / 1000 × 0.75 (efficiency) × $0.12/kWh
        // = 0.06 kWh × 0.75 × $0.12 = $0.0054 ≈ $0.01 (rounded)
        expect(bill).toEqual(0.01);
    });
});
