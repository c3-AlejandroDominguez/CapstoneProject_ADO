// test/js-rhino/unit/test_SmartBulbMeasurementSource_SmartBulbMeasurement.js
describe('test_SmartBulbMeasurementSource_SmartBulbMeasurement', function () {
    
    it('should split 1 hourly record into 2 half-hour records', function () {
        const source = SmartBulbMeasurementSource.make({
            SN: 'SMBLB1',
            start: '01/01/20 00:00',
            end: '01/01/20 01:00',
            Watts: 60,
            Lumens: 800,
            Temp: 70,
            Voltage: 120,
            Status: 1
        });
        
        const outputs = SmartBulbMeasurementSource.transformSource([source]).objs;
        
        // Should create 2 records from 1 source
        expect(outputs.length).toEqual(2);
    });
    
    it('should correctly divide power and lumens by 2', function () {
        const source = SmartBulbMeasurementSource.make({
            SN: 'SMBLB1',
            start: '01/01/20 00:00',
            end: '01/01/20 01:00',
            Watts: 60,
            Lumens: 800,
            Temp: 70,
            Voltage: 120,
            Status: 1
        });
        
        const outputs = SmartBulbMeasurementSource.transformSource([source]).objs;
        
        // Both records should have divided values
        expect(outputs[0].power).toEqual(30);
        expect(outputs[0].lumens).toEqual(400);
        expect(outputs[1].power).toEqual(30);
        expect(outputs[1].lumens).toEqual(400);
    });
    
    it('should keep temperature, voltage, and status unchanged', function () {
        const source = SmartBulbMeasurementSource.make({
            SN: 'SMBLB1',
            start: '01/01/20 00:00',
            end: '01/01/20 01:00',
            Watts: 60,
            Lumens: 800,
            Temp: 70,
            Voltage: 120,
            Status: 1
        });
        
        const outputs = SmartBulbMeasurementSource.transformSource([source]).objs;
        
        // Both records should keep instantaneous values
        expect(outputs[0].temperature).toEqual(70);
        expect(outputs[0].voltage).toEqual(120);
        expect(outputs[0].status).toEqual(1);
        expect(outputs[1].temperature).toEqual(70);
        expect(outputs[1].voltage).toEqual(120);
        expect(outputs[1].status).toEqual(1);
    });
    
    it('should correctly split time intervals into half-hour periods', function () {
        const source = SmartBulbMeasurementSource.make({
            SN: 'SMBLB1',
            start: '01/01/20 00:00',
            end: '01/01/20 01:00',
            Watts: 60,
            Lumens: 800,
            Temp: 70,
            Voltage: 120,
            Status: 1
        });
        
        const outputs = SmartBulbMeasurementSource.transformSource([source]).objs;
        
        // First record: start to midpoint (00:00 to 00:30)
        // 01/01/20 shifted to 02/01/26 (February 2026)
        expect(outputs[0].start.toString()).toEqual('2026-02-01T00:00:00.000');
        expect(outputs[0].end.toString()).toEqual('2026-02-01T00:30:00Z');
        
        // Second record: midpoint to end (00:30 to 01:00)
        expect(outputs[1].start.toString()).toEqual('2026-02-01T00:30:00Z');
        expect(outputs[1].end.toString()).toEqual('2026-02-01T01:00:00.000');
    });
    
    it('should complete the transformation successfully', function () {
        const source = SmartBulbMeasurementSource.make({
            SN: 'SN123456',
            start: '01/01/20 00:00',
            end: '01/01/20 01:00',
            Watts: 60.5,
            Lumens: 800.0,
            Temp: 45.2,
            Voltage: 120.0,
            Status: 1
        });
        const outputs = SmartBulbMeasurementSource.transformSource([source]).objs;
        
        // Now returns 2 records instead of 1
        expect(outputs.length).toEqual(2);
        expect(outputs[0].parent).toBeDefined();
        expect(outputs[0].power).toEqual(30.25);  // 60.5 / 2
        expect(outputs[0].lumens).toEqual(400.0);  // 800 / 2
        expect(outputs[0].temperature).toEqual(45.2);
        expect(outputs[0].voltage).toEqual(120.0);
        expect(outputs[0].status).toEqual(1);
    });

    it('should handle multiple measurements with correct parent references', function () {
        const source1 = SmartBulbMeasurementSource.make({
            SN: 'SN123456',
            start: '01/01/20 00:00',
            end: '01/01/20 01:00',
            Watts: 60.5,
            Lumens: 800.0,
            Temp: 45.2,
            Voltage: 120.0,
            Status: 1
        });
        const source2 = SmartBulbMeasurementSource.make({
            SN: 'SN123456',
            start: '01/01/20 01:00',
            end: '01/01/20 02:00',
            Watts: 62.0,
            Lumens: 810.0,
            Temp: 46.0,
            Voltage: 120.5,
            Status: 1
        });
        const outputs = SmartBulbMeasurementSource.transformSource([source1, source2]).objs;
        
        // Each source creates 2 records, so 2 sources = 4 records
        expect(outputs.length).toEqual(4);
        
        // Verify all measurements have parent
        outputs.forEach(function(output) {
            expect(output.parent).toBeDefined();
        });
        
        // Verify first source split correctly (outputs[0] and outputs[1])
        expect(outputs[0].power).toEqual(30.25);  // 60.5 / 2
        expect(outputs[0].lumens).toEqual(400.0);  // 800 / 2
        expect(outputs[1].power).toEqual(30.25);
        expect(outputs[1].lumens).toEqual(400.0);
        
        // Verify second source split correctly (outputs[2] and outputs[3])
        expect(outputs[2].power).toEqual(31.0);   // 62.0 / 2
        expect(outputs[2].lumens).toEqual(405.0); // 810 / 2
        expect(outputs[3].power).toEqual(31.0);
        expect(outputs[3].lumens).toEqual(405.0);
    });

    it('should handle different status values correctly', function () {
        const sourceOn = SmartBulbMeasurementSource.make({
            SN: 'SN123456',
            start: '01/01/20 00:00',
            end: '01/01/20 01:00',
            Watts: 60.5,
            Lumens: 800.0,
            Temp: 45.2,
            Voltage: 120.0,
            Status: 1
        });
        const sourceOff = SmartBulbMeasurementSource.make({
            SN: 'SN123456',
            start: '01/01/20 01:00',
            end: '01/01/20 02:00',
            Watts: 0.0,
            Lumens: 0.0,
            Temp: 25.0,
            Voltage: 0.0,
            Status: 0
        });
        const outputs = SmartBulbMeasurementSource.transformSource([sourceOn, sourceOff]).objs;
        
        // 2 sources = 4 output records
        expect(outputs.length).toEqual(4);
        
        // First source (Status: 1) creates outputs[0] and outputs[1]
        expect(outputs[0].status).toEqual(1);
        expect(outputs[1].status).toEqual(1);
        
        // Second source (Status: 0) creates outputs[2] and outputs[3]
        expect(outputs[2].status).toEqual(0);
        expect(outputs[3].status).toEqual(0);
    });

    it('should handle decimal values correctly', function () {
        const source = SmartBulbMeasurementSource.make({
            SN: 'SN789012',
            start: '01/01/20 12:30',
            end: '01/01/20 13:30',
            Watts: 55.5,
            Lumens: 777.7,
            Temp: 68.3,
            Voltage: 119.8,
            Status: 1
        });
        const outputs = SmartBulbMeasurementSource.transformSource([source]).objs;
        
        expect(outputs.length).toEqual(2);
        
        // Divided values should be precise
        expect(outputs[0].power).toEqual(27.75);    // 55.5 / 2
        expect(outputs[0].lumens).toEqual(388.85);  // 777.7 / 2
        expect(outputs[1].power).toEqual(27.75);
        expect(outputs[1].lumens).toEqual(388.85);
        
        // Instantaneous values unchanged
        expect(outputs[0].temperature).toEqual(68.3);
        expect(outputs[0].voltage).toEqual(119.8);
        expect(outputs[1].temperature).toEqual(68.3);
        expect(outputs[1].voltage).toEqual(119.8);
    });
});
