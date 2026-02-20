// test/js-rhino/unit/test_ApartmentSource_Apartment.js
describe('test_ApartmentSource_Apartment', function () {
    it('should complete the transformation successfully', function () {
        const source = ApartmentSource.make({
            id: 'APT001',
            building: 'BLDG001'
        });
        const output = ApartmentSource.transformSource([source]).objs[0];
        expect(output.building.id).toEqual('BLDG001');
        expect(output.fixtures.length).toEqual(1);
        expect(output.fixtures[0].id).toEqual('APT001');
    });

    it('should handle multiple fixtures correctly', function () {
        const source = ApartmentSource.make({
            id: 'APT002',
            building: 'BLDG001'
        });
        const output = ApartmentSource.transformSource([source]).objs[0];
        expect(output.fixtures.length).toEqual(1);
        expect(output.fixtures[0].id).toEqual('APT002');
        expect(output.building.id).toEqual('BLDG001');
    });
});
