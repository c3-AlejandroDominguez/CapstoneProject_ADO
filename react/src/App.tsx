/*
 * Copyright 2009-2026 C3 AI (www.c3.ai). All Rights Reserved.
 * Confidential and Proprietary C3 Materials.
 * This material, including without limitation any software, is the confidential trade secret and proprietary
 * information of C3 and its licensors. Reproduction, use and/or distribution of this material in any form is
 * strictly prohibited except as set forth in a written license agreement with C3 and/or its authorized distributors.
 * This material may be covered by one or more patents or pending patent applications.
 */

import { Routes, Route } from "react-router-dom";
import SideNav from "./components/SideNav/SideNav";
import TopNav from "./components/TopNav/TopNav";
import BuildingLumensMetric from "./components/Metrics/BuildingLumensMetric";
import BuildingVoltageMetric from "./components/Metrics/BuildingVoltageMetric";
import BuildingTemperatureMetric from "./components/Metrics/BuildingTemperatureMetric";
import CityLumensMetric from "./components/Metrics/CityLumensMetric";
import CityDefectiveBulbMetric from "./components/Metrics/CityDefectiveBulbMetric";
import CityEfficiencyMetric from "./components/Metrics/CityEfficiencyMetric";

if (import.meta.env.MODE === "development") {
  const authToken = import.meta.env.VITE_C3_AUTH_TOKEN;
  if (authToken) document.cookie = `c3auth=${authToken}`;
}

export default function App() {
  return (
    <>
      <div className="h-screen flex max-w-full overflow-hidden">
        <SideNav />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto">
            <TopNav title="C3 Capstone Project - Pure React" />
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold text-center mb-4 mt-4">
                        Building Metrics
                      </h1>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                        <BuildingLumensMetric />
                        <BuildingVoltageMetric />
                        <BuildingTemperatureMetric />
                      </div>
                    </div>
                    <div className="mb-8">
                      <h1 className="text-2xl font-bold text-center mb-4">
                        City Metrics
                      </h1>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                        <CityLumensMetric />
                        <CityDefectiveBulbMetric />
                        <CityEfficiencyMetric />
                      </div>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
