"use client";
import { MyChart } from "@/app/components/Restaurant/MyChart";
import { ReportType } from "@/models/Report";
import { ChartWrapperOptions } from "react-google-charts";

type DashboardChartType = {
  chartData: (string[] | (number | Date)[])[];
  options: ChartWrapperOptions["options"];
  restaurantsId: string[];
  tips: number
};

export const DashboardChart: React.FC<DashboardChartType> = ({
  chartData,
  options,
  restaurantsId,
  tips
}) => (
  <MyChart
    chartData={chartData}
    chartOptions={options}
    restaurant_id={restaurantsId}
    tips={tips}
  />
);
