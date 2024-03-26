"use client";
import { ReportTypeExtended } from "@/models/Report";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TiPencil, TiTrash } from "react-icons/ti";
import classes from "@/app/components/Report/ReportsTable/styles.module.scss";
import axios from "axios";
import { useModal } from "@/hooks/useModal";
import Modal from "@/utils/Modal";
import { toast } from "@/hooks/useToast";
import { dateFormat } from "@/utils/helper";
import moment from "moment";
import Pagination from "rc-pagination";
import revalidateTagAction from "@/app/actions";

type ReportsTableType = {
  reportsData: {
    reports: ReportTypeExtended[];
    totalCount: number;
  };
  className?: string;
  title: string;
  isAdmin?: boolean;
  pagination?: boolean;
};

export const ReportsTable: React.FC<ReportsTableType> = ({
  className,
  reportsData,
  title,
  isAdmin,
  pagination = false,
}) => {
  const router = useRouter();
  const [isShowingModal, toggleModal] = useModal();
  const [localReports, setLocalReports] = useState(reportsData.reports);
  const [id, setId] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    router.refresh()
  }, [])

  const removeReportHandler = async (_id: string) => {
    const { data } = await axios.delete(
      `/reports/${_id}/api?page=${currentPage}`
    );
    toast(data.message, data.status);

    if (data.status === "success") {
      revalidateTagAction("reports");
      toggleModal();
      setLocalReports(data.data.reports);

      if (!data.data.reports.length && currentPage !== 1) {
        getReports(currentPage - 1);
      }
    }
  };

  const toggleModalHandler = (
    _id: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
    setId(_id);
    toggleModal();
  };

  const editReportHandler = (
    _id: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
    router.push(`/reports/${_id}?edit=true`);
  };

  const getReports = async (page: number) => {
    const { data } = await axios.get(`/api/report?page=${page}`);
    setCurrentPage(page);
    setLocalReports(data.data.reports);
    revalidateTagAction("reports");
  };

  if (!localReports.length)
    return (
      <div className={`bg-white rounded ${className}`}>
         <h3>{title}</h3>
        <h4 className="text-center">No reports yet</h4>
      </div>
    );

  return (
    <>
      <div className={`bg-white rounded ${className ? className : ''}`}>
        <h3>{title}</h3>
        <table>
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localReports.map((report) => {
              return (
                <React.Fragment key={report._id}>
                  <tr
                    onClick={() => router.push(`/reports/${report._id}`)}
                    className="cursor-pointer"
                  >
                    <td>{report.restaurant.name}</td>
                    <td>{report?.employee_id?.name || "Admin"} </td>
                    <td>{dateFormat(report.createdAt)}</td>
                    <td className={classes.actions}>
                      {moment().diff(moment(report.createdAt), "hours") <= 24 ||
                      isAdmin ? (
                        <TiPencil
                          onClick={editReportHandler.bind(null, report._id)}
                        />
                      ) : null}
                      {isAdmin && (
                        <TiTrash
                          onClick={toggleModalHandler.bind(null, report._id)}
                        />
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {pagination && (
          <Pagination
            className="pagination"
            onChange={getReports}
            current={currentPage}
            hideOnSinglePage={true}
            showTotal={(total, range) =>
              `${range[0]} - ${range[1]} of ${total} items`
            }
            total={+reportsData.totalCount}
          />
        )}
      </div>
      <Modal
        modal={[isShowingModal, toggleModal]}
        primaryAction={{
          buttonText: "Delete Report",
          action: removeReportHandler.bind(null, id!),
        }}
      >
        Are you sure you want to delete the report?
      </Modal>
    </>
  );
};
