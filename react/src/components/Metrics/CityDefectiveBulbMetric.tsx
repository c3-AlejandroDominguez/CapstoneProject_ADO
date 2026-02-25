/*
 * Copyright 2009-2026 C3 AI (www.c3.ai). All Rights Reserved.
 * Confidential and Proprietary C3 Materials.
 */

import { useState, useEffect } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { Card, CardBody, CardHeader } from "@progress/kendo-react-layout";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { c3Action } from "@/c3Action";

interface MetricResult {
  cityId: string;
  cityName: string;
  value: number;
}

export default function CityDefectiveBulbMetric() {
  const [metricData, setMetricData] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defectiveBulbCount, setDefectiveBulbCount] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>("February");

  const cityOptions = [1, 2, 3, 4, 5];
  const monthOptions = ["January", "February", "March", "April", "May", "June"];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDefectiveBulbMetric();
  }, [selectedCity, selectedMonth]);

  const fetchDefectiveBulbMetric = async () => {
    try {
      setLoading(true);
      setError(null);

      const cityId = `city${selectedCity}`;

      // Calculate start and end dates based on selected month
      const monthIndex = monthOptions.indexOf(selectedMonth);
      const year = 2026;
      const startDay = new Date(year, monthIndex, 1);
      const endDay = new Date(year, monthIndex + 1, 0);

      const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      const payload = {
        ids: cityId,
        expressions: ["DefectiveBulbCount"],
        interval: "DAY",
        start: formatDate(startDay),
        end: formatDate(endDay),
      };
      const result = await c3Action("City", "evalMetrics", [payload]);

      const metricResult = result?.result?.[cityId]?.["DefectiveBulbCount"];

      if (metricResult?._data && metricResult._data.length > 0) {
        const dataArray = metricResult._data;
        const tsInfo = metricResult.tsInfo;

        const latestValue = dataArray.filter((v: number) => v > 0).pop();

        if (latestValue !== null && latestValue !== undefined) {
          setDefectiveBulbCount(parseFloat(latestValue.toFixed(0)));
        }

        const chartData = dataArray
          .map((value: number, index: number) => {
            const currentDate = new Date(tsInfo.start);
            currentDate.setDate(currentDate.getDate() + index);
            return {
              cityId: cityId,
              cityName: currentDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              value: value,
            };
          })
          .filter((point: MetricResult) => point.value > 0)
          .slice(-100);

        setMetricData(chartData);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch defective bulb count metric"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="c3-kendo-wrapper p-4">
        <Card>
          <CardBody>
            <div className="text-center">Loading defective bulb data...</div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="c3-kendo-wrapper p-4">
        <Card>
          <CardBody>
            <div className="text-danger">Error: {error}</div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="c3-kendo-wrapper p-4">
      <div
        className="shadow-xl rounded-lg"
        style={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)" }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center w-full">
              <div></div>
              <h2 className="text-xl font-bold">City Defective Bulb Count</h2>
              <div></div>
            </div>
          </CardHeader>

          <CardBody>
            <div className="mb-4">
              <div className="flex justify-center items-center gap-8">
                <div>
                  <DropDownList
                    data={monthOptions}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ width: "150px" }}
                  />
                </div>
                <div>
                  <DropDownList
                    data={cityOptions}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={{ width: "150px" }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary">
                    {defectiveBulbCount !== null ? `${defectiveBulbCount}` : "N/A"}
                  </h3>
                  <p className="text-secondary">Defective Bulbs</p>
                </div>
              </div>
            </div>

            {metricData.length > 0 && (
              <Chart>
                <ChartTitle
                  text={`City Defective Bulb Count Over Time - ${selectedMonth} 2026`}
                />
                <ChartLegend position="bottom" orientation="horizontal" />
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem
                    categories={metricData.map((d) => d.cityName)}
                    labels={{ rotation: -45 }}
                  />
                </ChartCategoryAxis>
                <ChartSeries>
                  <ChartSeriesItem
                    type="line"
                    data={metricData.map((d) => d.value)}
                    name="Defective Bulbs"
                    color="#28a745"
                  />
                </ChartSeries>
              </Chart>
            )}

            {metricData.length === 0 && !loading && (
              <div className="text-center text-secondary mt-4">
                No defective bulb data available
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
