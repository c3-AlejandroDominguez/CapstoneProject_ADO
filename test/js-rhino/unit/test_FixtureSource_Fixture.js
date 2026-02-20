// test/js-rhino/unit/test_FixtureSource_Fixture.js
describe('test_FixtureSource_Fixture', function () {
    it('should complete the transformation successfully', function () {
        const source = FixtureSource.make({
            id: 'FIX001',
            apartment: 'APT001'
        });
        const output = FixtureSource.transformSource([source]).objs[0];
        expect(output.id).toEqual('FIX001');
        expect(output.apartment.id).toEqual('APT001');
    });

    it('should handle different fixtures correctly', function () {
        const source = FixtureSource.make({
            id: 'FIX002',
            apartment: 'APT002'
        });
        const output = FixtureSource.transformSource([source]).objs[0];
        expect(output.id).toEqual('FIX002');
        expect(output.apartment.id).toEqual('APT002');
    });
});
