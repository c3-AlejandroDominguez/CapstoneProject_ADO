data = {
  name: 'SmartBulbToFixtureRelationSource-SmartBulbToFixtureRelation',
  source: 'SmartBulbToFixtureRelationSource',
  target: 'SmartBulbToFixtureRelation',
  transformer: function (srcObj) {
    function transform(input) {
      // Input START and END are already DateTime objects
      var startTime = input.START;
      var endTime = input.END;
      
      // Shift from 2020 to 2026 and from January to February
      startTime = startTime.plusYears(6).plusMonths(1);
      endTime = endTime.plusYears(6).plusMonths(1);
      
      return SmartBulbToFixtureRelation.make(
        {
          id: input.ID,
          from: input.FROM,
          to: input.TO,
          start: startTime,
          end: endTime
        },
        true
      );
    }
    return transform(srcObj);
  },
};
