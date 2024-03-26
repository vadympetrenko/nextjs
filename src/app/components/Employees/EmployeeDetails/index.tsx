"use client";
import { Button } from "@/UI/Button";
import { TextField } from "@/UI/TextField";
import { Toolbar } from "@/UI/Toolbar";
import revalidateTagAction from "@/app/actions";
import { toast } from "@/hooks/useToast";
import { EmployeeType } from "@/models/Employee";
import { RestaurantType } from "@/models/Restaurant";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserAltSlash, FaUserEdit } from "react-icons/fa";

export const EmployeeDetails: React.FC<EmployeeType> = (employee) => {
  const router = useRouter();

  const removeEmployeeHandler = async (_id: string) => {
    const { data } = await axios.delete(`/admin/employees/${_id}/api`);
    toast(data.message, data.status);

    if (data.status === "success") {
      await revalidateTagAction("all-employee");
      router.push("/admin/employees");
    }
  };

  return (
    <>
      <Toolbar>
        <Link href={`/admin/employees/${employee._id}?edit=true`}>
          <Button variation="secondary">
            <FaUserEdit />
            Edit Employee
          </Button>
        </Link>
        <Button
          variation="tertiary"
          onClick={removeEmployeeHandler.bind(null, employee._id!)}
        >
          <FaUserAltSlash />
          Remove Employee
        </Button>
      </Toolbar>
      <div className="main-content">
        <TextField>
          <p>Name:</p>
          <p>{employee.name}</p>
        </TextField>
        <TextField>
          <p>Role{employee.role.length > 1 ? "s" : ""}:</p>
          {employee.role.join(", ")}
        </TextField>

        <TextField>
          <p>Email:</p>
          <p>{employee.email}</p>
        </TextField>
        <TextField>
          <p>Phone number:</p>
          <p>{employee.phone_number}</p>
        </TextField>
        {employee.dob && (
          <TextField>
            <p>Date of Birth:</p>
            <p>{employee.dob}</p>
          </TextField>
        )}
        <TextField>
          <p>Working type:</p>
          <p>{employee.working_type}</p>
        </TextField>
        <TextField>
          <p>Rate:</p>
          <p>{employee.rate}</p>
        </TextField>
        {employee?.store && (
          <TextField>
            <p>Restaurant{employee.store.length > 1 ? "s" : ""}:</p>
            {(employee.store as RestaurantType[]).map((item) => item.name)}
          </TextField>
        )}
      </div>
    </>
  );
};
