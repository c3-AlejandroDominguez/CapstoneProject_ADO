// test/js-rhino/unit/test_SmartBulbSource_SmartBulb.js
describe('SmartBulbSource to SmartBulb type routing', function () {
    
    beforeEach(function () {
        // Clean up only test data
        LEDBulb.removeAll({filter: Filter.startsWith('id', 'TEST_')}, true);
        CFLBulb.removeAll({filter: Filter.startsWith('id', 'TEST_')}, true);
        INCANBulb.removeAll({filter: Filter.startsWith('id', 'TEST_')}, true);
        SmartBulb.removeAll({filter: Filter.startsWith('id', 'TEST_')}, true);
    });
    
    it('should create LEDBulb when BULBTYPE is LED', function () {
        // Create source data for LED bulb
        const source = SmartBulbSource.make({
            ID: 'TEST_LED_001',
            BULBTYPE: 'LED',
            WATTAGE: 60,
            MANUFACTURER: 'TestCorp',
            STARTDATE: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
        
        // Transform
        const output = SmartBulbSource.transformSource([source]).objs[0];
        
        // Verify it's an LEDBulb
        expect(output.type()).toEqual('LEDBulb');
        expect(output.id).toEqual('TEST_LED_001');
        expect(output.bulbType).toEqual('LED');
        expect(output.wattage).toEqual(60);
        expect(output.manufacturer).toEqual('TestCorp');
        
        // Verify LED-specific properties
        expect(output.efficiencyFactor).toEqual(0.75);
        expect(output.lifeSpanInHours).toEqual(10000);
    });
    
    it('should create CFLBulb when BULBTYPE is CFL', function () {
        // Create source data for CFL bulb
        const source = SmartBulbSource.make({
            ID: 'TEST_CFL_001',
            BULBTYPE: 'CFL',
            WATTAGE: 40,
            MANUFACTURER: 'CFLCorp',
            STARTDATE: DateTime.parse('2021-03-15T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
        
        // Transform
        const output = SmartBulbSource.transformSource([source]).objs[0];
        
        // Verify it's a CFLBulb
        expect(output.type()).toEqual('CFLBulb');
        expect(output.id).toEqual('TEST_CFL_001');
        expect(output.bulbType).toEqual('CFL');
        expect(output.wattage).toEqual(40);
        expect(output.manufacturer).toEqual('CFLCorp');
        
        // Verify CFL-specific properties
        expect(output.efficiencyFactor).toEqual(0.25);
        expect(output.lifeSpanInHours).toEqual(7500);
    });
    
    it('should create INCANBulb when BULBTYPE is INCAN', function () {
        // Create source data for incandescent bulb
        const source = SmartBulbSource.make({
            ID: 'TEST_INCAN_001',
            BULBTYPE: 'INCAN',
            WATTAGE: 100,
            MANUFACTURER: 'OldSchool',
            STARTDATE: DateTime.parse('2019-06-20T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
        
        // Transform
        const output = SmartBulbSource.transformSource([source]).objs[0];
        
        // Verify it's an INCANBulb
        expect(output.type()).toEqual('INCANBulb');
        expect(output.id).toEqual('TEST_INCAN_001');
        expect(output.bulbType).toEqual('INCAN');
        expect(output.wattage).toEqual(100);
        expect(output.manufacturer).toEqual('OldSchool');
        
        // Verify INCAN-specific properties
        expect(output.efficiencyFactor).toEqual(0.45);
        expect(output.lifeSpanInHours).toEqual(5000);
    });
    
    it('should handle case-insensitive bulb types', function () {
        // Test lowercase 'led'
        const sourceLower = SmartBulbSource.make({
            ID: 'TEST_LED_LOWER',
            BULBTYPE: 'led',
            WATTAGE: 60,
            MANUFACTURER: 'TestCorp',
            STARTDATE: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
        
        const outputLower = SmartBulbSource.transformSource([sourceLower]).objs[0];
        expect(outputLower.type()).toEqual('LEDBulb');
        
        // Test mixed case 'Led'
        const sourceMixed = SmartBulbSource.make({
            ID: 'TEST_LED_MIXED',
            BULBTYPE: 'Led',
            WATTAGE: 60,
            MANUFACTURER: 'TestCorp',
            STARTDATE: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
        
        const outputMixed = SmartBulbSource.transformSource([sourceMixed]).objs[0];
        expect(outputMixed.type()).toEqual('LEDBulb');
    });
    
    it('should create base SmartBulb for unknown type', function () {
        // Create source data with unknown type
        const source = SmartBulbSource.make({
            ID: 'TEST_UNKNOWN_001',
            BULBTYPE: 'HALOGEN',
            WATTAGE: 75,
            MANUFACTURER: 'UnknownCorp',
            STARTDATE: DateTime.parse('2022-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
        
        // Transform
        const output = SmartBulbSource.transformSource([source]).objs[0];
        
        // Verify it's a base SmartBulb
        expect(output.type()).toEqual('SmartBulb');
        expect(output.id).toEqual('TEST_UNKNOWN_001');
        expect(output.bulbType).toEqual('HALOGEN');
    });
    
    it('should transform multiple bulbs of different types', function () {
        // Create multiple source objects
        const sources = [
            SmartBulbSource.make({
                ID: 'TEST_MULTI_LED',
                BULBTYPE: 'LED',
                WATTAGE: 60,
                MANUFACTURER: 'TestCorp',
                STARTDATE: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
            }),
            SmartBulbSource.make({
                ID: 'TEST_MULTI_CFL',
                BULBTYPE: 'CFL',
                WATTAGE: 40,
                MANUFACTURER: 'TestCorp',
                STARTDATE: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
            }),
            SmartBulbSource.make({
                ID: 'TEST_MULTI_INCAN',
                BULBTYPE: 'INCAN',
                WATTAGE: 100,
                MANUFACTURER: 'TestCorp',
                STARTDATE: DateTime.parse('2020-01-01T00:00:00', 'yyyy-MM-dd\'T\'HH:mm:ss')
            })
        ];
        
        // Transform all
        const outputs = SmartBulbSource.transformSource(sources).objs;
        
        // Verify we got 3 bulbs
        expect(outputs.length).toEqual(3);
        
        // Verify each type
        expect(outputs[0].type()).toEqual('LEDBulb');
        expect(outputs[1].type()).toEqual('CFLBulb');
        expect(outputs[2].type()).toEqual('INCANBulb');
        
        // Verify they have correct efficiency factors
        expect(outputs[0].efficiencyFactor).toEqual(0.75);
        expect(outputs[1].efficiencyFactor).toEqual(0.25);
        expect(outputs[2].efficiencyFactor).toEqual(0.45);
    });
});
