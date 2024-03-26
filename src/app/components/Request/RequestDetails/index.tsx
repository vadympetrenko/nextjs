"use client";
import { TextField } from "@/UI/TextField";
import { RequestTypeEmployee } from "@/models/Request";
import DatePicker from "react-datepicker";
import classes from "@/app/components/Request/RequestDetails/style.module.scss";
import { Toolbar } from "@/UI/Toolbar";
import { Button } from "@/UI/Button";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import revalidateTagAction from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RequestDetailsType = {
  request: RequestTypeEmployee;
  isAdmin: boolean;
};

export const RequestDetails: React.FC<RequestDetailsType> = ({
  request,
  isAdmin,
}) => {
  const router = useRouter();

  const changeStatusHandler = async (_id: string, status: string) => {
    const { data } = await axios.put(`/requests/${_id}/api`, { status });

    toast(data.message, data.status);
    if (data.status === "success") {
      await revalidateTagAction("requests");
      router.push("/requests");
    }
  };

  return (
    <>
      <Toolbar>
        {isAdmin && (
          <Button variation="secondary">
            <Link href={`/requests/${request._id}?edit=true`}>Edit</Link>
          </Button>
        )}
        {isAdmin && (
          <Button
            variation="primary"
            onClick={() => changeStatusHandler(request._id!, "approved")}
          >
            Approve
          </Button>
        )}
        {isAdmin && (
          <Button
            variation="tertiary"
            onClick={() => changeStatusHandler(request._id!, "declined")}
          >
            Decline
          </Button>
        )}
      </Toolbar>
      <div className="main-content">
        <TextField>
          <p>Name:</p>
          <p>{request.employee_id.name}</p>
        </TextField>

        <TextField className={classes.calendar}>
          <p>Date:</p>
          <DatePicker
            onChange={() => {}}
            highlightDates={request.date.map((item) => new Date(item))}
            open
          />
        </TextField>

        {request.message && (
          <TextField>
            <p>Message:</p>
            <p>{request.message}</p>
          </TextField>
        )}

        <TextField
          className={`${classes[request.adminStatus]} ${classes.status}`}
        >
          <p>Status:</p>
          <p>{request.adminStatus}</p>
        </TextField>
      </div>
    </>
  );
};
