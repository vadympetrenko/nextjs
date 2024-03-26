"use client";
import {  RequestTypeEmployee } from "@/models/Request";
import { TiPencil, TiTrash } from "react-icons/ti";
import classes from "@/app/components/Request/RequestList/styles.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { dateFormat } from "@/utils/helper";
import revalidateTagAction from "@/app/actions";
import Modal from "@/utils/Modal";
import { useModal } from "@/hooks/useModal";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import React, { useEffect, useState } from "react";
import { Session } from "next-auth";

type RequestListype = {
  requestsList: RequestTypeEmployee[];
  isAdmin: boolean;
  session: Session;
  setRequests: React.Dispatch<React.SetStateAction<RequestTypeEmployee[]>>
  currentPage: number
  getRequests: (page:number) => void
};

export const RequestList: React.FC<RequestListype> = ({
  requestsList,
  isAdmin,
  session,
  setRequests,
  currentPage,
  getRequests
}) => {
  const route = useRouter();
  const [isShowingModal, toggleModal] = useModal();
  const [id, setId] = useState<string>();

  const editReportHandler = async (
    _id: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
    await revalidateTagAction("requests");
    route.push(`requests/${_id}?edit=true`);
  };

  const reportLinkHandler = async (request: RequestTypeEmployee) => {
    await revalidateTagAction("requests");
    route.push(`/requests/${request._id}`);
  };

  const removeRequestHandler = async (_id: string) => {
    const { data } = await axios.delete(`/requests/${_id}/api?page=${currentPage}`);
    toast(data.message, data.status);

    if (data.status === "success") {
      await revalidateTagAction("requests");
      toggleModal();
      setRequests(data.data.requests)

      if(!data.data.requests.length && currentPage !== 1) {
        getRequests(currentPage - 1)
      }
    }
  };

  useEffect(() => {
    if (
      !isAdmin &&
      requestsList.filter((item) => item.employeeStatus === "unread").length
    ) {
      const readRequests = async () => {
        await axios.put(`/requests/add-request/api`, { _id: session.id });
      };
      readRequests();
    }
  });

  const toggleModalHandler = (
    _id: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    event.stopPropagation();
    setId(_id);
    toggleModal();
  };

  const list = requestsList.map((request) => {
    return (
      <React.Fragment key={request._id}>
        <tr
          key={request._id}
          onClick={reportLinkHandler.bind(null, request)}
          className={`cursor-pointer ${
            request.employeeStatus === "unread" && !isAdmin
              ? classes.unread
              : ""
          }`}
        >
          {isAdmin && <td>{request.employee_id.name}</td>}
          <td>
            {request.date.map((item, index, array) =>
              item === array[array.length - 1]
                ? dateFormat(item, "m/y/d")
                : dateFormat(item, "m/y/d") + " , "
            )}
          </td>
          <td
            className={`${classes[request.adminStatus.toLowerCase()]} ${
              classes.status
            }`}
          >
            {request.adminStatus}
          </td>
          <td className={classes.actions}>
            {isAdmin && (
              <TiPencil onClick={editReportHandler.bind(null, request._id!)} />
            )}
            {isAdmin && (
              <TiTrash onClick={toggleModalHandler.bind(null, request._id!)} />
            )}
            {!isAdmin && request.adminStatus === "pending" && (
              <TiTrash onClick={toggleModalHandler.bind(null, request._id!)} />
            )}
          </td>
        </tr>
      </React.Fragment>
    );
  });

  return (
    <>
      {list}
      <Modal
        modal={[isShowingModal, toggleModal]}
        primaryAction={{
          buttonText: "Remove request",
          action: () => removeRequestHandler(id!),
        }}
      >
        Are you sure you want to delete this request?
      </Modal>
    </>
  );
};
