"use client";
import { Message } from "@/UI/Message";
import { Status } from "@/lib/serverFetching";
import { EmployeeType, EmployeeTypeStoreExtended } from "@/models/Employee";
import React, { useState } from "react";
import classes from "@/app/components/AllEmployees/styles.module.scss"
import { TiTrash, TiPencil } from "react-icons/ti";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toolbar } from "@/UI/Toolbar";
import { Button } from "@/UI/Button";
import { TiUserAddOutline } from "react-icons/ti";
import { useModal } from "@/hooks/useModal";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import Modal from "@/utils/Modal";
import { RestaurantType } from "@/models/Restaurant";
import revalidateTagAction from "@/app/actions";



export type AllEmployeesType = {
  employees: EmployeeTypeStoreExtended[];
  status: Status;
};

export const AllEmployees: React.FC<AllEmployeesType> = ({
  employees,
  status,
}) => {
  const [allEmployees, setEmployess] = useState<EmployeeTypeStoreExtended[]>(employees);
    const [search, setSearch] = useState('')
    const router = useRouter()
    const [isShowingModal, toggleModal] = useModal();

    const removeEmployeeHandler = async ( _id: string, ) => {
      const {data} = await axios.delete(`/admin/employees/${_id}/api`)

      toast(data.message, data.status)
      setEmployess(data.employees)

      if(data.status === 'success') {
        toggleModal()
        revalidateTagAction('all-employees')
        router.push('/admin/employees')
      }
    }

  if (status === "warning")
    return (
      <div className="main-content">
        <Message message="you haven't added employees yet" status="warning" />
      </div>
    );

    const searchHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setEmployess(() => {
            return employees.filter(employee => employee.name.toLowerCase().includes(e.target.value.toLowerCase()))
        })
    }

    const toggleModalHandler = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      toggleModal()
    }

    const editHandler = (_id:string, event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      router.push(`/admin/employees/${_id!}?edit=true`)
    }

  return (
    <>
    <Toolbar>
      <Link href={'/admin/add-employee'}><Button variation="primary" className={classes.AddEmployee}><TiUserAddOutline/>Add Employee</Button></Link>
    </Toolbar>
    <div className="main-content">
        <input type="text" className={classes.search} value={search} onChange={searchHandler} placeholder="Search..."/>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Restaurant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>            {allEmployees.map((employee) => (
            <React.Fragment key={employee.phone_number}>
              <tr onClick={() => router.push(`/admin/employees/${employee._id!}`)} className={classes.tableRow}>
                <td>{employee.name}</td>
                <td>{employee.role.join(', ')}</td>
                <td>{employee?.store?.length && Array.isArray(employee.store) ? employee?.store?.map((item, index, arr) => item === arr[arr.length - 1] ? (<p key={item._id }>{`${item.name}`}</p>) :  (<p key={item._id}>{`${item.name}, `}</p>)) : '-'}</td>
                <td className={classes.actions}><TiPencil onClick={editHandler.bind(null, employee._id!)}/><TiTrash onClick={toggleModalHandler}/></td>
              </tr>
              <Modal modal={[isShowingModal, toggleModal]} primaryAction={{buttonText: 'Remove Employee', action: removeEmployeeHandler.bind(null, employee._id!)}}>
                Are you sure you want to delete the employee?
              </Modal>
            </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
    </>
  );
};
