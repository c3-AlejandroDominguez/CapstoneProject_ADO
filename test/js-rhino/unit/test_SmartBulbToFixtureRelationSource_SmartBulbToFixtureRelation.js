// test/js-rhino/unit/test_SmartBulbToFixtureRelationSource_SmartBulbToFixtureRelation.js
describe('test_SmartBulbToFixtureRelationSource_SmartBulbToFixtureRelation', function () {
    
    it('should transform relation with all fields correctly', function () {
        const source = SmartBulbToFixtureRelationSource.make({
            ID: 'REL001',
            FROM: 'SMBLB1',
            TO: 'fix100',
            START: DateTime.parse('01/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('31/12/20 23:59', 'dd/MM/yy HH:mm')
        });
        
        const output = SmartBulbToFixtureRelationSource.transformSource([source]).objs[0];
        
        expect(output.id).toEqual('REL001');
        expect(output.fromTarget.id).toEqual('SMBLB1');
        expect(output.to.id).toEqual('fix100');
    });
    
    it('should shift dates from 2020 to February 2026', function () {
        const source = SmartBulbToFixtureRelationSource.make({
            ID: 'REL001',
            FROM: 'SMBLB1',
            TO: 'fix100',
            START: DateTime.parse('01/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('31/01/20 23:59', 'dd/MM/yy HH:mm')
        });
        
        const output = SmartBulbToFixtureRelationSource.transformSource([source]).objs[0];
        
        // 01/01/20 shifted to 02/01/26 (February 2026)
        expect(output.start.toString()).toEqual('2026-02-01T00:00:00.000');
        // 31/01/20 shifted to 02/28/26 (last day shifts to Feb 28)
        expect(output.end.toString()).toEqual('2026-02-28T23:59:00.000');
    });
    
    it('should handle multiple relations correctly', function () {
        const source1 = SmartBulbToFixtureRelationSource.make({
            ID: 'REL001',
            FROM: 'SMBLB1',
            TO: 'fix100',
            START: DateTime.parse('01/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('15/01/20 23:59', 'dd/MM/yy HH:mm')
        });
        
        const source2 = SmartBulbToFixtureRelationSource.make({
            ID: 'REL002',
            FROM: 'SMBLB2',
            TO: 'fix200',
            START: DateTime.parse('16/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('31/01/20 23:59', 'dd/MM/yy HH:mm')
        });
        
        const outputs = SmartBulbToFixtureRelationSource.transformSource([source1, source2]).objs;
        
        expect(outputs.length).toEqual(2);
        
        // First relation
        expect(outputs[0].id).toEqual('REL001');
        expect(outputs[0].fromTarget.id).toEqual('SMBLB1');
        expect(outputs[0].to.id).toEqual('fix100');
        expect(outputs[0].start.toString()).toEqual('2026-02-01T00:00:00.000');
        
        // Second relation
        expect(outputs[1].id).toEqual('REL002');
        expect(outputs[1].fromTarget.id).toEqual('SMBLB2');
        expect(outputs[1].to.id).toEqual('fix200');
        expect(outputs[1].start.toString()).toEqual('2026-02-16T00:00:00.000');
    });
    
    it('should handle different date formats', function () {
        const source = SmartBulbToFixtureRelationSource.make({
            ID: 'REL003',
            FROM: 'SMBLB3',
            TO: 'fix300',
            START: DateTime.parse('2020-01-15 10:30:00', 'yyyy-MM-dd HH:mm:ss'),
            END: DateTime.parse('2020-01-15 18:45:00', 'yyyy-MM-dd HH:mm:ss')
        });
        
        const output = SmartBulbToFixtureRelationSource.transformSource([source]).objs[0];
        
        expect(output.id).toEqual('REL003');
        // 2020-01-15 shifted to 2026-02-15
        expect(output.start.toString()).toEqual('2026-02-15T10:30:00.000');
        expect(output.end.toString()).toEqual('2026-02-15T18:45:00.000');
    });
    
    it('should preserve relation references correctly', function () {
        const source = SmartBulbToFixtureRelationSource.make({
            ID: 'REL_SMBLB100_FIX500',
            FROM: 'SMBLB100',
            TO: 'fix500',
            START: DateTime.parse('05/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('10/01/20 00:00', 'dd/MM/yy HH:mm')
        });
        
        const output = SmartBulbToFixtureRelationSource.transformSource([source]).objs[0];
        
        // Verify the relation keeps the correct references
        expect(output.id).toBeDefined();
        expect(output.fromTarget.id).toEqual('SMBLB100');
        expect(output.to.id).toEqual('fix500');
        expect(output.start).toBeDefined();
        expect(output.end).toBeDefined();
    });
    
    it('should handle full month data correctly', function () {
        const source = SmartBulbToFixtureRelationSource.make({
            ID: 'REL_MONTH',
            FROM: 'SMBLB50',
            TO: 'fix250',
            START: DateTime.parse('01/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('31/01/20 23:59', 'dd/MM/yy HH:mm')
        });
        
        const output = SmartBulbToFixtureRelationSource.transformSource([source]).objs[0];
        
        // January 2020 becomes February 2026
        expect(output.start.toString()).toEqual('2026-02-01T00:00:00.000');
        expect(output.end.toString()).toEqual('2026-02-28T23:59:00.000');
        
        // Verify start is before end
        expect(output.start.millis).toBeLessThan(output.end.millis);
    });
    
    it('should handle same-day relations', function () {
        const source = SmartBulbToFixtureRelationSource.make({
            ID: 'REL_SAME_DAY',
            FROM: 'SMBLB25',
            TO: 'fix125',
            START: DateTime.parse('15/01/20 08:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('15/01/20 17:00', 'dd/MM/yy HH:mm')
        });
        
        const output = SmartBulbToFixtureRelationSource.transformSource([source]).objs[0];
        
        // Both dates should be on the same day (Feb 15, 2026)
        expect(output.start.toString()).toEqual('2026-02-15T08:00:00.000');
        expect(output.end.toString()).toEqual('2026-02-15T17:00:00.000');
    });
    
    it('should maintain chronological order', function () {
        const source1 = SmartBulbToFixtureRelationSource.make({
            ID: 'REL_EARLY',
            FROM: 'SMBLB10',
            TO: 'fix50',
            START: DateTime.parse('01/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('05/01/20 00:00', 'dd/MM/yy HH:mm')
        });
        
        const source2 = SmartBulbToFixtureRelationSource.make({
            ID: 'REL_LATE',
            FROM: 'SMBLB10',
            TO: 'fix50',
            START: DateTime.parse('20/01/20 00:00', 'dd/MM/yy HH:mm'),
            END: DateTime.parse('25/01/20 00:00', 'dd/MM/yy HH:mm')
        });
        
        const outputs = SmartBulbToFixtureRelationSource.transformSource([source1, source2]).objs;
        
        // Early relation should still be before late relation after transformation
        expect(outputs[0].start.millis).toBeLessThan(outputs[1].start.millis);
        expect(outputs[0].end.millis).toBeLessThan(outputs[1].start.millis);
    });
});
