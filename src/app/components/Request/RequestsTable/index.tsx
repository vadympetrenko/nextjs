"use client";
import { RequestTypeEmployee } from "@/models/Request";
import { RequestList } from "@/app/components/Request/RequestList";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import Pagination from "rc-pagination";
import axios from "axios";
import { useRouter } from "next/navigation";

type RequestsTableType = {
  requestsData: {
    requests: RequestTypeEmployee[];
    totalCount: number;
  };
  isAdmin: boolean;
  session: Session;
  className?: string;
  title?: string;
  pagination?: boolean;
};

export const RequestsTable: React.FC<RequestsTableType> = ({
  requestsData,
  isAdmin,
  session,
  className,
  title = "All Requests",
  pagination = false,
}) => {
  const [requests, setRequests] = useState(requestsData.requests);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter()

  useEffect(() => {
    router.refresh()
  }, [])
  
  const getRequests = async (page: number) => {
    const { data: requestData } = await axios.get(`/requests/api?page=${page}`);
    setCurrentPage(page);
    setRequests(requestData.data.requests);
  };

  if (!requests.length)
    return (
      <div className={`bg-white rounded ${className ? className : ""}`}>
        <h3>{title}</h3>
        <h4 className="text-center">No requests yet</h4>
      </div>
    );

  return (
    <div className={`bg-white rounded ${className ? className : ""}`}>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            {isAdmin && <th>Name</th>}
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <RequestList
            requestsList={requests}
            isAdmin={isAdmin}
            session={session}
            setRequests={setRequests}
            currentPage={currentPage}
            getRequests={getRequests}
          />
        </tbody>
      </table>
      {pagination && (
        <Pagination
          className="pagination"
          onChange={getRequests}
          current={currentPage}
          showTotal={(total, range) =>
            `${range[0]} - ${range[1]} of ${total} items`
          }
          total={+requestsData.totalCount}
        />
      )}
    </div>
  );
};
