data = {
  name: 'SmartBulbMeasurementSource-SmartBulbMeasurement',
  source: 'SmartBulbMeasurementSource',
  target: 'SmartBulbMeasurement',
  transformer: function (srcObj) {
    function transform(input) {
      var transformedObjects = [];
      
      // Parse timestamps with format
      var startFormat = input.start.indexOf("-") >= 0 ? "yyyy-MM-dd HH:mm:ss" : "dd/MM/yy HH:mm";
      var endFormat = input.end.indexOf("-") >= 0 ? "yyyy-MM-dd HH:mm:ss" : "dd/MM/yy HH:mm";
      
      var startTime = DateTime.parse(input.start, startFormat);
      var endTime = DateTime.parse(input.end, endFormat);
      
      // Shift from 2020 to 2026 and from January to February
      startTime = startTime.plusYears(6).plusMonths(1);
      endTime = endTime.plusYears(6).plusMonths(1);
      
      // Calculate midpoint using millis() property
      var midMillis = (startTime.millis + endTime.millis) / 2;
      var midTime = DateTime.fromMillis(midMillis);
      
      // First half-hour record
      transformedObjects.push(
        SmartBulbMeasurement.make(
          {
            parent: "SBMS_serialNo_" + input.SN,
            start: startTime,
            end: midTime,
            status: input.Status,
            power: input.Watts / 2.0,        // Divide cumulative values
            lumens: input.Lumens / 2.0,      // Divide cumulative values
            temperature: input.Temp,         // Keep instantaneous values
            voltage: input.Voltage           // Keep instantaneous values
          },
          true
        )
      );
      
      // Second half-hour record
      transformedObjects.push(
        SmartBulbMeasurement.make(
          {
            parent: "SBMS_serialNo_" + input.SN,
            start: midTime,
            end: endTime,
            status: input.Status,
            power: input.Watts / 2.0,
            lumens: input.Lumens / 2.0,
            temperature: input.Temp,
            voltage: input.Voltage
          },
          true
        )
      );
      
      return transformedObjects;
    }

    return transform(srcObj);
  },
};

// data = {
//   name: 'SmartBulbMeasurementSource-SmartBulbMeasurement',
//   target: 'SmartBulbMeasurement',
//   source: 'SmartBulbMeasurementSource',
//   projection: {

//     parent : "SmartBulbMeasurementSeries",

//     start : dateTime(start, contains(start, "-") ? "yyyy-MM-dd HH:mm:ss" : "dd/MM/yy HH:mm"),

//     end : dateTime(end, contains(end, "-") ? "yyyy-MM-dd HH:mm:ss" : "dd/MM/yy HH:mm"),
    
//     power : Watts,

//     lumens : Lumens,

//     temperature : Temp,

//     voltage : Voltage,

//     status : Status
//   },
// };