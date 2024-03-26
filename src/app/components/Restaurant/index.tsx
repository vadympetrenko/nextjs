"use client";
import { Button } from "@/UI/Button";
import { Toolbar } from "@/UI/Toolbar";
import { useModal } from "@/hooks/useModal";
import { EmployeeType } from "@/models/Employee";
import { RestaurantEmployeeType } from "@/models/Restaurant";
import Modal from "@/utils/Modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TiPencil } from "react-icons/ti";
import { toast } from "@/hooks/useToast";
import classes from "@/app/components/Restaurant/style.module.scss";
import { useState } from "react";
import { DnDOutsideResource } from "@/app/components/Restaurant/Calendar";
import { EventObject } from "@/models/Event";
import { MyChart } from "@/app/components/Restaurant/MyChart";
import { RestaurantDetails } from "@/app/components/Restaurant/RestaurantDetails";
import revalidateTagAction from "@/app/actions";
import { ChartWrapperOptions } from "react-google-charts";

type RestaurantComponentType = {
  restaurants: RestaurantEmployeeType;
  unassigned: EmployeeType[];
  events: EventObject[];
  allEmployees: EmployeeType[];
  chartData: [];
  chartOptions: ChartWrapperOptions["options"];
  tips: number
};

export const Restaurant: React.FC<RestaurantComponentType> = ({
  restaurants,
  unassigned,
  events,
  allEmployees,
  chartData,
  chartOptions,
  tips
}) => {
  const router = useRouter();
  const [isShowingModal, toggleModal] = useModal();
  const [isShowingModal2, toggleModal2] = useModal();
  const [employees, setEmployees] = useState([
    [...restaurants.employee_id],
    [...unassigned],
  ]);
  const [myEvents, setMyEvents] = useState<EventObject[]>(events || []);
  const [assigned, setAssigned] = useState([...restaurants.employee_id]);

  const removeRestorantHandler = async (_id: string) => {
    const { data } = await axios.delete(`/admin/restaurants/${_id}/api`);
    toast(data.message, data.status);

    if (data.status === "success") {
      toggleModal();
      await revalidateTagAction('restaurants')
      router.push("/admin");
    }
  };

  const addEmployeeToTheListHandler = async (_id: string) => {
    const { data } = await axios.put(
      `/admin/restaurants/${restaurants._id}/api`,
      {
        employees: employees[0],
        unassigned: employees[1],
        _id: restaurants._id,
      }
    );
    toast(data.message, data.status);

    if (data.status === "success") {
      setAssigned(data.employees);
      setEmployees((prevState) => {
        const updatedState = [...prevState];
        updatedState[1] = [...data.unassigned];
        return updatedState;
      });
      revalidateTagAction('employee')
      toggleModal2();
    }
  };

  const manageEmployeeLists = (
    index: number,
    item: EmployeeType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isRestaurantList = index === 0;

    if (isRestaurantList) {
      setEmployees((prevState) => {
        const newState = prevState[index].filter(
          (item) => item._id !== event.target.value
        );
        const updatedState = [...prevState];
        updatedState[1].push(item);
        updatedState[index] = newState;
        return updatedState;
      });
    } else {
      setEmployees((prevState) => {
        const newState = prevState[1].filter(
          (item) => item._id !== event.target.value
        );
        const updatedState = [...prevState];
        updatedState[0].push(item);
        updatedState[index] = newState;
        return updatedState;
      });
    }
  };

  return (
    <>
      <Toolbar>
        <Button
          variation="primary"
          onClick={() =>
            router.push(`/admin/restaurants/${restaurants._id}?edit=true`)
          }
          icon={<TiPencil />}
        >
          Edit Restaurant
        </Button>
        <Button variation="tertiary" onClick={toggleModal}>
          Remove Restaurant
        </Button>
      </Toolbar>
      <div className={classes.wrapper}>
          <RestaurantDetails name={restaurants.name} address={restaurants.address} phone_number={restaurants.phone_number} _id={restaurants._id!} />

        <div className={classes.employeesList}>
          <div className={classes.title}>
            <h5>Employees list:</h5>
            <Button variation="secondary" onClick={toggleModal2}>
              Add/Remove employees
            </Button>
          </div>
          {assigned.map((item: EmployeeType) => (
            <p key={item._id}>
              {item.name} <span>({item.role.join(", ")})</span>
            </p>
          ))}
        </div>

        <MyChart
          chartData={chartData}
          chartOptions={chartOptions}
          restaurant_id={restaurants._id!}
          tips={tips}
        />

        <div className={classes.calendar}>
          <DnDOutsideResource
            restaurant={restaurants}
            myEvents={myEvents}
            setMyEvents={setMyEvents}
            allEmployees={allEmployees}
          />
        </div>
      </div>

      <Modal
        modal={[isShowingModal, toggleModal]}
        primaryAction={{
          buttonText: "Remove Restaurant",
          action: removeRestorantHandler.bind(null, restaurants._id!),
        }}
      >
        Are you sure you want to delete the restaurant?
      </Modal>
      <Modal
        modal={[isShowingModal2, toggleModal2]}
        className={classes.addModal}
        primaryAction={{
          buttonText: "Update List",
          action: addEmployeeToTheListHandler.bind(null, restaurants._id!),
        }}
      >
        Select a checkbox for who you want to add
        {employees.map((list, index) => {
          return (
            <div key={index}>
              <p className={classes.listTitle}>
                {index === 0 ? restaurants.name : "Other employees"}
              </p>
              {list.map((item) => {
                return (
                  <label key={item._id} className={classes.label}>
                    <input
                      type="checkbox"
                      value={item._id}
                      checked={index == 0}
                      onChange={manageEmployeeLists.bind(null, index, item)}
                    />
                    {item.name}
                  </label>
                );
              })}
            </div>
          );
        })}
      </Modal>
    </>
  );
};

//
