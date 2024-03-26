import { TransferObjectType } from "@/app/admin/page";
import { ReportType, ReportTypeExtended } from "@/models/Report";
import { AxiosResponse } from "axios";

export const checkAdminStatus = (array: any) =>
  array.includes("admin") ? true : false;

export const dateFormat = (
  date: string | Date,
  format?: "m/y/d" | "m/y/d:h"
) => {
  if (format === "m/y/d") {
    return new Date(date).toLocaleString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  }
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const dateChartFormat = (date: Date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
};

export const makeChartData = (data: ReportType[]) => {
  const newData: any = [["Date", "Total 1", "Total 2"]];
  data.forEach((report) => {
    newData.push([
      dateFormat(report.createdAt!, "m/y/d"),
      report.total_1,
      report.total_2,
    ]);
  });

  return newData;
};

export const makeTipsData = (data: ReportType[]) => {
  const tips = data.reduce(
    (acc, current) => (current.tips ? current.tips + acc : acc + 0),
    0
  );
  return tips;
};

type Type = {
  data: ReportType[];
};

const getReportData = (restaurantsReport: AxiosResponse<any, any>[] | Type) => {
  return Array.isArray(restaurantsReport)
    ? ([] as ReportTypeExtended[]).concat(
        ...restaurantsReport.map((item) =>
          item.data.data ? item.data.data : item.data
        )
      )
    : restaurantsReport.data;
};

export const allReportsData =
  (restaurantsReport: AxiosResponse<any, any>[] | Type) => () => {
    let data: TransferObjectType = {};

    const allData = getReportData(restaurantsReport);

    allData.forEach((item) => {
      if (new Date(item.createdAt!).toLocaleDateString() in data) {
        data[new Date(item.createdAt!).toLocaleDateString()] = {
          createdAt: new Date(item.createdAt!).toLocaleDateString(),
          total_1: (
            item.total_1 +
            +data[new Date(item.createdAt!).toLocaleDateString()].total_1
          ).toFixed(2),
          total_2: (
            item.total_2 +
            +data[new Date(item.createdAt!).toLocaleDateString()].total_2
          ).toFixed(2),
        };
      } else {
        data[new Date(item.createdAt!).toLocaleDateString()] = {
          createdAt: new Date(item.createdAt!).toLocaleDateString(),
          total_1: item.total_1.toFixed(2),
          total_2: item.total_2.toFixed(2),
        };
      }
    });

    const chartData = [
      ["Date", "Total 1", "Total 2"],
      ...Object.keys(data).map((item) => [
        new Date(data[item].createdAt),
        +data[item].total_1,
        +data[item].total_2,
      ]),
    ];

    return chartData;
  };

export const allTipsData =
  (restaurantsReport: AxiosResponse<any, any>[] | Type) => () => {
    const allReports = getReportData(restaurantsReport);
    const tips = makeTipsData(allReports)
    return tips
  }
