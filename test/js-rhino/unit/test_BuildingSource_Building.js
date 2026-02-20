// test/js-rhino/unit/test_BuildingSource_Building.js
describe('test_BuildingSource_Building', function () {
    it('should complete the transformation successfully', function () {
        const source = BuildingSource.make({
            id: 'BLDG001',
            latitude: 40.7128,
            longitude: -74.0060,
            city: 'New York'
        });
        const output = BuildingSource.transformSource([source]).objs[0];
        expect(output.id).toEqual('BLDG001');
        expect(output.latitude).toEqual(40.7128);
        expect(output.longitude).toEqual(-74.0060);
        expect(output.city).toEqual('New York');
    });

    it('should handle different coordinates correctly', function () {
        const source = BuildingSource.make({
            id: 'BLDG002',
            latitude: 34.0522,
            longitude: -118.2437,
            city: 'Los Angeles'
        });
        const output = BuildingSource.transformSource([source]).objs[0];
        expect(output.id).toEqual('BLDG002');
        expect(output.latitude).toEqual(34.0522);
        expect(output.longitude).toEqual(-118.2437);
        expect(output.city).toEqual('Los Angeles');
    });
});
