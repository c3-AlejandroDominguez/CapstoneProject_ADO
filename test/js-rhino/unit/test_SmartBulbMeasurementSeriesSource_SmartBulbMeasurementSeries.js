// test/js-rhino/unit/test_SmartBulbMeasurementSeriesSource_SmartBulbMeasurementSeries.js
describe('test_SmartBulbMeasurementSeriesSource_SmartBulbMeasurementSeries', function () {
    it('should complete the transformation successfully', function () {
        const source = SmartBulbMeasurementSeriesSource.make({
            id: 'SBMS_serialNo_SMBLB1',
            smartBulb: 'SMBLB1'
        });
        const output = SmartBulbMeasurementSeriesSource.transformSource([source]).objs[0];
        expect(output.id).toEqual('SBMS_serialNo_SMBLB1');
        expect(output.smartBulb.id).toEqual('SMBLB1');
    });

    it('should handle multiple series correctly', function () {
        const source1 = SmartBulbMeasurementSeriesSource.make({
            id: 'SBMS_serialNo_SMBLB1',
            smartBulb: 'SMBLB1'
        });
        const source2 = SmartBulbMeasurementSeriesSource.make({
            id: 'SBMS_serialNo_SMBLB2',
            smartBulb: 'SMBLB2'
        });
        const outputs = SmartBulbMeasurementSeriesSource.transformSource([source1, source2]).objs;
        expect(outputs.length).toEqual(2);
        expect(outputs[0].id).toEqual('SBMS_serialNo_SMBLB1');
        expect(outputs[0].smartBulb.id).toEqual('SMBLB1');
        expect(outputs[1].id).toEqual('SBMS_serialNo_SMBLB2');
        expect(outputs[1].smartBulb.id).toEqual('SMBLB2');
    });
});
