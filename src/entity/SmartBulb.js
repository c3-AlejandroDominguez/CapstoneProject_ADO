/**
 * Calculate the monthly electricity bill for this SmartBulb.
 * 
 * @param {number} month - The month to calculate the bill for (1-12)
 * @param {number} year - The year to calculate the bill for
 * @returns {number} The total electricity cost for the month
 */
function monthlyBill(month, year) {
    // Get the electricity rate directly from the Bulb entity
    var electricityRate = this.electricityRate;
    if (!electricityRate) {
        return 0.0;
    }
    
    // Get the efficiency factor from the bulb (LEDBulb, CFLBulb, or INCANBulb)
    var efficiencyFactor = this.efficiencyFactor || 1.0;
    
    // Create start and end of month DateTime objects
    var startOfMonth = DateTime.parse(year + "-" + (month < 10 ? "0" : "") + month + "-01T00:00:00Z", "yyyy-MM-dd'T'HH:mm:ss'Z'");
    
    // End of month is the first day of next month
    var endOfMonth;
    if (month === 12) {
        endOfMonth = DateTime.parse((year + 1) + "-01-01T00:00:00Z", "yyyy-MM-dd'T'HH:mm:ss'Z'");
    } else {
        var nextMonth = month + 1;
        endOfMonth = DateTime.parse(year + "-" + (nextMonth < 10 ? "0" : "") + nextMonth + "-01T00:00:00Z", "yyyy-MM-dd'T'HH:mm:ss'Z'");
    }
    
    // Get all measurement series for this bulb
    var seriesList = SmartBulbMeasurementSeries.fetch({
        filter: Filter.eq('smartBulb.id', this.id)
    });
    
    if (!seriesList || !seriesList.objs || seriesList.objs.length === 0) {
        return 0.0;
    }
    
    // Calculate total energy consumption
    // Each measurement is exactly 0.5 hours (30 minutes)
    var totalKwh = 0.0;
    
    for (var i = 0; i < seriesList.objs.length; i++) {
        var series = seriesList.objs[i];
        
        // Get measurements for this series where start is within the month
        var measurements = SmartBulbMeasurement.fetch({
            filter: Filter.eq('parent', series.id)
                .and(Filter.ge('start', startOfMonth))
                .and(Filter.lt('start', endOfMonth))
        });
        
        if (!measurements || !measurements.objs || measurements.objs.length === 0) {
            continue;
        }
        
        // Sum energy for all measurements
        for (var j = 0; j < measurements.objs.length; j++) {
            var measurement = measurements.objs[j];
            // Energy (kWh) = (power_watts × 0.5_hours) / 1000 × efficiency_factor
            var energyKwh = (measurement.power * 0.5 / 1000.0) * efficiencyFactor;
            totalKwh += energyKwh;
        }
    }
    
    // Calculate bill: total kWh × electricity rate
    var monthlyBill = totalKwh * electricityRate;
    
    return Math.round(monthlyBill * 100) / 100;
}


/**
 * Calculate the remaining lifespan of the bulb in hours.
 * 
 * @returns {number} Remaining lifespan in hours
 */
function remainingLifespanInHours() {
    // Get the original lifespan based on bulb type
    var originalLifespan = this.lifeSpanInHours || 10000;
    
    // Get total hours used from all measurements
    var seriesList = SmartBulbMeasurementSeries.fetch({
        filter: Filter.eq('smartBulb.id', this.id)
    });
    
    if (!seriesList || !seriesList.objs || seriesList.objs.length === 0) {
        return originalLifespan; // No usage yet
    }
    
    var totalHoursUsed = 0.0;
    
    for (var i = 0; i < seriesList.objs.length; i++) {
        var series = seriesList.objs[i];
        
        var measurements = SmartBulbMeasurement.fetch({
            filter: Filter.eq('parent', series.id)
        });
        
        if (!measurements || !measurements.objs || measurements.objs.length === 0) {
            continue;
        }
        
        for (var j = 0; j < measurements.objs.length; j++) {
            var measurement = measurements.objs[j];
            // Each measurement is exactly 0.5 hours
            totalHoursUsed += 0.5;
        }
    }
    
    var remainingLifespan = originalLifespan - totalHoursUsed;
    return Math.round(remainingLifespan);
}
