"use client";
import { Autocomplete, selectFuncType } from "@/UI/Autocomplete";
import { EmployeeType } from "@/models/Employee";
import { RequestType, adminStatusArray } from "@/models/Request";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/UI/Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classes from "@/app/components/Request/AddRequest/style.module.scss";
import { Button } from "@/UI/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isRequired } from "@/lib/isFieldRequired";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import { Select } from "@/UI/Select";
import { adminStatus } from "@/types/types";
import { useRouter } from "next/navigation";
import revalidateTagAction from "@/app/actions";
import { useSession } from "next-auth/react";

type AddRequestType = {
  employeeList: EmployeeType[] | undefined;
  isAdmin: boolean;
  request?: RequestTypeExtended;
  searchParams?: {
    edit: string;
  };
};

type RequestTypeExtended = RequestType & {
  employee_id: {
    name: string;
    _id: string;
  };
};

type RequestPostType = {
  message?: string;
  employee_id: string;
  dates: (string | undefined)[];
  employee_name: string;
  adminStatus?: adminStatus;
  _id?: string;
};

export const AddRequest: React.FC<AddRequestType> = ({
  employeeList,
  isAdmin,
  request,
  searchParams,
}) => {
  let schema = yup.object({
    message: yup.string(),
    employee_id: yup
      .string()
      .required("Looks like the name is spelled incorrectly"),
    employee_name: yup.string().required("Name is required"),
    dates: yup
      .array()
      .of(yup.string())
      .required()
      .min(1, "You should select at least 1 day"),
  });
  const router = useRouter();
  const {data: session} = useSession()

  const status = Object.entries(adminStatus).map(([item, value]) => {
    return {
      _id: item,
      name: value,
    };
  });
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RequestPostType>({
    defaultValues: {
      message: request?.message || undefined,
      employee_id: request?.employee_id._id || session?.id || undefined,
      employee_name: request?.employee_id.name || session?.id || undefined,
      dates: request?.date.map((item) => new Date(item).toLocaleString()) || [],
      adminStatus: request?.adminStatus || undefined,
      _id: request?._id || undefined,
    },
    resolver: yupResolver(schema),
  });
  const [show, setShow] = useState<boolean>(false);

  const employee_nameValue = watch("employee_name");
  const employee_nameId = watch("employee_id");

  const selecEmployeeId = ({ employee_id, employee_name }: selectFuncType) => {
    setValue("employee_id", employee_id);
    setValue("employee_name", employee_name);
    setShow(false);
  };

  const filteredEmployeeList = useMemo(() => {
    return employee_nameValue
      ? employeeList?.filter((item) =>
          item.name
            .toLowerCase()
            .includes(String(employee_nameValue).toLowerCase() as string)
        )
      : [];
  }, [employeeList, employee_nameValue]);

  useEffect(() => {
    if (
      filteredEmployeeList?.length &&
      filteredEmployeeList[0].name === employee_nameValue &&
      filteredEmployeeList[0]._id === employee_nameId
    ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [filteredEmployeeList, employee_nameValue, employee_nameId]);

  const [selectedDates, setSelectedDates] = useState<string[]>(
    request?.date.map((item) => new Date(item).toLocaleString()) || []
  );

  const calendarSelectHandler = (date: Date) => {
    setSelectedDates((prevState) =>
      prevState.includes(date.toLocaleString())
        ? [
            ...prevState.filter(
              (item) => item.toLocaleString() !== date.toLocaleString()
            ),
          ]
        : [...prevState, date.toLocaleString()]
    );
  };

  const sendRequestHandler = async (formData: RequestPostType) => {
    let response;

    if (searchParams) {
      response = await axios.put("/requests/api", formData);
    } else {
      response = await axios.post("/requests/api", formData);
    }

    setSelectedDates([]);
    toast(response.data.message, response.data.status);
    if (response.data.status === "success") {
      await revalidateTagAction('requests')
      router.push("/requests");
    }
  };

  return (
    <div className="main-content">
      <h1 className="mb-12">
        {searchParams ? "Update " : "Add "}a request for a day off
      </h1>
      <form onSubmit={handleSubmit(sendRequestHandler)}>
        <div className="relative w-72">
          {isAdmin && filteredEmployeeList && (
            <Autocomplete<EmployeeType[]>
              data={filteredEmployeeList}
              name={"employee_name"}
              control={control}
              selectFunc={selecEmployeeId}
              showList={show}
              className="w-72"
              errors={errors}
              isRequired={isRequired({ name: "employee_name", schema })}
            />
          )}

        </div>
        {errors["employee_id"]?.message && (
          <p className={classes.calendarError}>
            {errors["employee_id"].message}
          </p>
        )}
        <Input name={"employee_id"} control={control} type="hidden" />

        <p className={isRequired({ name: "employee_name", schema }) as string}>
          Select dates:{" "}
        </p>
        <div className={classes.calendar}>
          <Controller
            name="dates"
            control={control}
            
            render={({ field }) => {
              return (
                <>
                  <DatePicker
                    onChange={(date: Date) => {
                      field.value.includes(date!.toLocaleString())
                        ? (field.value = field.value.filter(
                            (item) => item !== date.toLocaleString()
                          ))
                        : field.value.push(date.toLocaleString());
                      field.onChange(field.value);
                      calendarSelectHandler(date!);
                    }}
                    highlightDates={
                      selectedDates?.length
                        ? selectedDates.map((item) => new Date(item))
                        : []
                    }
                    inline
                    open={true}
                  />
                  {errors["dates"]?.message && (
                    <p className={classes.calendarError}>
                      {errors["dates"].message}
                    </p>
                  )}
                </>
              );
            }}
          />
        </div>

        <Input
          name="message"
          control={control}
          className="w-72"
          placeholder="Message:"
          errors={errors}
          isRequired={isRequired({ name: "message", schema })}
        />

        {searchParams && <Input name="_id" control={control} type="hidden" />}
        {isAdmin && (
          <Select
            name="adminStatus"
            control={control}
            data={status}
            placeholder="Status"
            defaultValue={'choose the status'}
          />
        )}

        <Button variation="primary">
          {searchParams ? "Update Request" : "Send Request"}
        </Button>
      </form>
    </div>
  );
};
