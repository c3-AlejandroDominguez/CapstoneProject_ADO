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
  buildingId: string;
  buildingName: string;
  value: number;
}

export default function BuildingTemperatureMetric() {
  const [metricData, setMetricData] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avgTemp, setAvgTemp] = useState<number | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>("February");

  const buildingOptions = [1, 2, 3, 4, 5];
  const monthOptions = ["January", "February", "March", "April", "May", "June"];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTemperatureMetric();
  }, [selectedBuilding, selectedMonth]);

  const fetchTemperatureMetric = async () => {
    try {
      setLoading(true);
      setError(null);

      const buildingId = `bld${selectedBuilding}`;

      // Calculate start and end dates based on selected month
      const monthIndex = monthOptions.indexOf(selectedMonth);
      const year = 2026;
      const startDay = new Date(year, monthIndex, 1);
      const endDay = new Date(year, monthIndex + 1, 0); // Last day of the month

      const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      const payload = {
        ids: buildingId,
        expressions: ["AverageTemperature"],
        interval: "DAY",
        start: formatDate(startDay),
        end: formatDate(endDay),
      };
      const result = await c3Action("Building", "evalMetrics", [payload]);

      const metricResult = result?.result?.[buildingId]?.["AverageTemperature"];

      if (metricResult?._data && metricResult._data.length > 0) {
        const dataArray = metricResult._data;
        const tsInfo = metricResult.tsInfo;

        const latestValue = dataArray.filter((v: number) => v > 0).pop();

        if (latestValue !== null && latestValue !== undefined) {
          setAvgTemp(parseFloat(latestValue.toFixed(2)));
        }

        const chartData = dataArray
          .map((value: number, index: number) => {
            const currentDate = new Date(tsInfo.start);
            currentDate.setDate(currentDate.getDate() + index);
            return {
              buildingId: buildingId,
              buildingName: currentDate.toLocaleDateString("en-US", {
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
        err instanceof Error
          ? err.message
          : "Failed to fetch temperature metric",
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
            <div className="text-center">Loading temperature data...</div>
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
              <h2 className="text-xl font-bold">Temperature Metrics</h2>
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
                    data={buildingOptions}
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    style={{ width: "150px" }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary">
                    {avgTemp !== null ? `${avgTemp}°C` : "N/A"}
                  </h3>
                  <p className="text-secondary">Average Temperature</p>
                </div>
              </div>
            </div>

            {metricData.length > 0 && (
              <Chart>
                <ChartTitle
                  text={`Average Temperature Over Time - ${selectedMonth} 2026`}
                />
                <ChartLegend position="bottom" orientation="horizontal" />
                <ChartCategoryAxis>
                  <ChartCategoryAxisItem
                    categories={metricData.map((d) => d.buildingName)}
                    labels={{ rotation: -45 }}
                  />
                </ChartCategoryAxis>
                <ChartSeries>
                  <ChartSeriesItem
                    type="line"
                    data={metricData.map((d) => d.value)}
                    name="Avg Temperature (°C)"
                    color="#dc3545"
                  />
                </ChartSeries>
              </Chart>
            )}

            {metricData.length === 0 && !loading && (
              <div className="text-center text-secondary mt-4">
                No temperature data available
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
