"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Role, WorkingType } from "@/types/types";
import { EmployeeType, EmployeeTypeStoreExtended } from "@/models/Employee";
import { Input } from "@/UI/Input";
import { Button } from "@/UI/Button";
import axios from "axios";
import { Checkbox } from "@/UI/Checbox";
import { Radio } from "@/UI/Radio";
import { InputPhone } from "@/UI/InputPhone";
import { isRequired } from "@/lib/isFieldRequired";
import { DatePicker } from "@/UI/DatePicker";
import { Toolbar } from "@/UI/Toolbar";
import { PiPlusBold } from "react-icons/pi";
import { RestaurantType } from "@/models/Restaurant";
import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { InputColor } from "@/UI/InputColor";
import getRandomColor from "@/utils/generateColor";
import revalidateTagAction from "@/app/actions";

export const AddEmployee: React.FC<{
  restaurants: RestaurantType[];
  employee?: EmployeeTypeStoreExtended;
  searchParams?: { edit: string };
}> = ({ restaurants, employee, searchParams }) => {
  const edit = searchParams?.edit;
  const router = useRouter();
  const editStatus = edit && edit !== "" && JSON.parse(edit!);

  let schema = yup.object({
    email: yup.string().email().required(),
    password: editStatus ? yup.string() : yup.string().required(),
    phone_number: yup.string().required(),
    name: yup.string().required(),
    dob: yup.string(),
    rate: yup.number().required(),
    role: yup.array().min(1).required(),
    store: yup.array(),
    working_type: yup
      .mixed<WorkingType>()
      .oneOf(Object.values(WorkingType))
      .required(),
    color: yup.string().required(),
  });

  if (editStatus) {
    schema = schema.shape({
      confirm_password: yup
        .string()
        .oneOf([yup.ref("password"), undefined], "Passwords must match"),
    });
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeType>({
    defaultValues: {
      store: employee?.store.map((item) => item._id) || [],
      email: employee?.email || undefined,
      password: undefined,
      phone_number: employee?.phone_number || undefined,
      name: employee?.name || undefined,
      role: employee?.role || [],
      dob: employee?.dob || undefined,
      rate: employee?.rate || undefined,
      working_type: employee?.working_type || undefined,
      color: employee?.color || getRandomColor(),
      _id: employee?._id || undefined
    },
    resolver: yupResolver(schema),
  });

  const addEmployeeHandler: SubmitHandler<EmployeeType> = async (
    employeeData
  ) => {
    let response

    if(editStatus) {
      response = await axios.put("/admin/employees/add-employee/api", employeeData);
    } else {
      response = await axios.post("/admin/employees/add-employee/api", employeeData);
    }
    toast(response.data.message, response.data.status);

    if (response.data.status === "success") {
      await revalidateTagAction("all-employees");
      router.push("/admin/employees");
    }
  };

  return (
    <>
      <Toolbar>
        <Button
          variation="primary"
          onClick={handleSubmit(addEmployeeHandler)}
          icon={<PiPlusBold />}
        >
          {edit ? "Update Employee" : "Save Employee"}
        </Button>
        {edit ? <Button variation="tertiary">Remove Employee</Button> : ""}
      </Toolbar>
      <div className="main-content">
        <h1>Add Employee</h1>
        <form>
          <Input
            name="name"
            placeholder="Name"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "name", schema })}
          />
          <Checkbox
            name="role"
            control={control}
            data={Role}
            errors={errors}
            placeholder="Role"
            isRequired={isRequired({ name: "role", schema })}
          />
          <Input
            name="email"
            placeholder="Email"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "email", schema })}
          />
          <Input
            name="password"
            placeholder="Password"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "password", schema })}
          />
          {edit && (
            <Input
              name="confirm_password"
              placeholder="Confirm Password"
              control={control}
              errors={errors}
              isRequired={isRequired({ name: "confirm_password", schema })}
            />
          )}
          <InputPhone
            control={control}
            name="phone_number"
            placeholder="Phone number"
            errors={errors}
            isRequired={isRequired({ name: "phone_number", schema })}
          />
          <DatePicker
            name="dob"
            placeholder="Date of birth"
            type="date"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "dob", schema })}
          />
          <Input
            type="number"
            name="rate"
            placeholder="Rate"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "rate", schema })}
          />
          <Radio
            name="working_type"
            control={control}
            data={WorkingType}
            errors={errors}
            placeholder="Working type"
            isRequired={isRequired({ name: "working_type", schema })}
          />

          <Checkbox
            name="store"
            control={control}
            data={restaurants}
            errors={errors}
            placeholder="Restaurant"
            isRequired={isRequired({ name: "store", schema })}
          />

          {editStatus && <Input type="hidden" control={control} name="_id" />}

          <InputColor
            name="color"
            placeholder="Color: (you will see this color on the calendar.)"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "color", schema })}
          />
        </form>
      </div>
      ;
    </>
  );
};
