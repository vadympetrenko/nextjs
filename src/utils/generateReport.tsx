import React from "react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { dateFormat } from "@/utils/helper";
import axios from "axios";
import { EventObject } from "@/models/Event";
import moment from "moment";

interface DataItem {
  name: string;
  address: string;
  rate: number;
  hours: number;
  date: Date;
}

interface ReportName {
  name: string;
  start: string;
  end: string;
  _id: string;
}

interface Props {
  data: DataItem[];
  report?: ReportName;
}

type EventObjectExtended = EventObject & {
  restaurant_id: {
    name: string;
  };
  employee_id: {
    name: string;
    rate: number;
  };
};

export const handleGenerateExcel = async ({ data, report }: Props) => {
  const { data: reporstData } = await axios.get(
    `/api/events?_id=${report?._id}&start=${new Date(
      report?.start as string
    ).getTime()}&end=${new Date(report?.end as string).getTime()}`
  );
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");
  worksheet.addRow([
    "Full Name",
    "Restaurant Name",
    "Date",
    "Rate",
    "Hours amount",
    "Total",
  ]);

  reporstData.data.reduce(
    (
      total: { employeeTitle: number; grandTotal: number },
      item: EventObjectExtended,
      index: number,
      array: EventObjectExtended[]
    ) => {
      if (
        array[index - 1]?.title !== item.title &&
        array[index - 1]?.title !== undefined
      ) {
        const row = worksheet.addRow([
          `Total for ${moment(report?.start).format("ll")} - ${moment(
            report?.end
          ).format("ll")} for ${array[index - 1]?.title}`,
          null,
          null,
          null,
          null,
          total.employeeTitle,
        ]);
        worksheet.addRow([]);

        const lastCell = row.getCell(6);

        lastCell.font = { bold: true };

        total.employeeTitle = 0;
      }

      worksheet.addRow([
        item.employee_id.name,
        item.restaurant_id.name,
        moment(item.start).format("ll"),
        item.employee_id.rate,
        item.time,
        item.employee_id.rate * item.time,
      ]);

      if (array[array.length - 1] === item) {
        const row = worksheet.addRow([
          `Total for ${moment(report?.start).format("ll")} - ${moment(
            report?.end
          ).format("ll")} for ${array[index - 1]?.title}`,
          null,
          null,
          null,
          null,
          total.employeeTitle + item.employee_id.rate * item.time,
        ]);
        worksheet.addRow([]);

        const lastCell = row.getCell(6);

        lastCell.font = { bold: true };
        worksheet.addRow([]);

        const grandTotal = worksheet.addRow([
          "Grand Total:",
          null,
          null,
          null,
          null,
          total.grandTotal + item.employee_id.rate * item.time,
        ]);

        grandTotal.font = { bold: true };
      }

      return (total = {
        employeeTitle: total.employeeTitle + item.employee_id.rate * item.time,
        grandTotal: total.grandTotal + item.employee_id.rate * item.time,
      });
    },
    {
      employeeTitle: 0,
      grandTotal: 0,
    }
  );

  console.dir(worksheet, { depth: null });

  const fileName = report
    ? `${report.name}-(${dateFormat(report.start, "m/y/d")}-${dateFormat(
        report.end,
        "m/y/d"
      )}).xlsx`
    : "data.xlsx";

  workbook.xlsx.writeBuffer().then((buffer) => {
    saveAs(new Blob([buffer]), fileName);
  });
};
