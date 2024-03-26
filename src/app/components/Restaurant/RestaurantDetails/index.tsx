import DatePicker from "react-datepicker";
import { handleGenerateExcel } from "@/utils/generateReport";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import Modal from "@/utils/Modal";
import { Button } from "@/UI/Button";
import classes from "@/app/components/Restaurant/RestaurantDetails/styles.module.scss";
import moment from 'moment'

export const RestaurantDetails = ({
  name,
  address,
  phone_number,
  _id
}: {
  name: string;
  address: string;
  _id: string;
  phone_number: string;
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isShowingModal, toggle] = useModal();
  
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <div className="main-content">
        <h1>{name}</h1>

        <h4>Restaurant information:</h4>
        <address>
          address: {address} <br />
          phone number: {phone_number}
        </address>

        <Button variation="primary" onClick={toggle} className={classes.generate}>
          Generate Report
        </Button>
      </div>

      <Modal
        className={classes.modal}
        modal={[isShowingModal, toggle]}
        disabledAction={!!startDate && !!endDate}
        primaryAction={{
          buttonText: "Generate Request",
          action: () => 
            handleGenerateExcel({
              data: [],
              report: {
                name,
                _id, 
                start: moment(startDate).startOf('day').format(),
                end:  moment(endDate).endOf('day').format(),
              },
            }),
        }}
      >
        <h4>Generate a file based on a given date range</h4>
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          className={classes.date}
          selectsRange
        />
      </Modal>
    </>
  );
};
