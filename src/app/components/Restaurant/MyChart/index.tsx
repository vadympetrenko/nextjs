import Chart, { ChartWrapperOptions } from "react-google-charts";
import { LuLoader } from "react-icons/lu";
import classes from "@/app/components/Restaurant/MyChart/styles.module.scss";
import { Button } from "@/UI/Button";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import Modal from "@/utils/Modal";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import { allReportsData, allTipsData, makeChartData, makeTipsData } from "@/utils/helper";

type ChartDataType = {
  chartData: (string[] | (number | Date)[])[];
  chartOptions: ChartWrapperOptions["options"];
  restaurant_id: string | string[];
  tips: number
};

export const MyChart: React.FC<ChartDataType> = ({
  chartData,
  chartOptions,
  restaurant_id,
  tips
}) => {
  const date = new Date();
  const [data, setData] = useState(chartData);
  const [isShowing, toggle] = useModal();
  const [from, setFrom] = useState<Date>(date);
  const [to, setTo] = useState<Date>(date);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [active, setActive] = useState<number>(3)
  const [tipsData, setTipsData] = useState(tips)

  const request = (url: string, from?: Date, to?: Date) => {
    return from
      ? `/reports/api?restaurant_id=${url}&start=${moment(from).startOf('day').toDate()}&end=${moment(to).endOf('day').toDate()}`
      : `/reports/api?restaurant_id=${url}`;
  };

  const chartFilterHandler = async ({
    from,
    to = new Date(),
    event
  }: {
    from?: Date;
    to?: Date;
    event?: React.MouseEvent<HTMLElement> | number
  } = {}) => {
    setIsError(false);
    setIsLoading(true);
    setActive(event && typeof event === 'number' ? event : typeof event !== 'number' ? (event?.target as HTMLElement).tabIndex : 1)

    const urlRequest = !Array.isArray(restaurant_id)
      ? request(restaurant_id, from, to)
      : restaurant_id.map((url) => request(url, from, to));

    if (!Array.isArray(urlRequest)) {
      try {
        const { data } = await axios.get(urlRequest);
        toast(data.message, data.status);

        if (data.status === "success" && !!data.data.length) {
          setData(makeChartData(data.data));
          setTipsData(makeTipsData(data.data))
        } else {
          setData([]);
        }
      } catch (error) {
        setIsError(true);
      }
    } else {
      try {
        const response = await Promise.all(urlRequest.map((url) => axios.get(url)))
        setData(allReportsData(response)())
        setTipsData(allTipsData(response)())
      } catch (error) {
        setIsError(true);
      }
    }

    setIsLoading(false);
  };

  const modalActionHandler = () => {
    chartFilterHandler({
      from,
      to,
      event: 4
    });

    toggle();
  };

  

  return (
    <>
      <div className="rounded-2xl bg-white">
        <div className="flex items-center justify-center w-full mt-4">
          <Button variation="secondary" onClick={(event) => chartFilterHandler({event})} tabIndex={1} active={active}>
            All days
          </Button>
          <Button
           active={active}
            variation="secondary"
            onClick={(event) =>
              chartFilterHandler({
                from: new Date(moment().subtract(7, "days").toDate()), event
              })
            }
            tabIndex={2}
          >
            Last 7 days
          </Button>
          <Button 
            active={active}
            variation="secondary"
            onClick={(event) =>
              chartFilterHandler({
                from: new Date(moment().subtract(30, "days").toDate()), event
              })
            }
            tabIndex={3}
          >
            Last 30 days
          </Button>
          <Button variation="secondary" onClick={toggle} tabIndex={4} active={active}>
            Filter
          </Button>
        </div>
        <div className={classes.chartWrapper}>
          {isLoading && (
            <div className={`${classes.chartLoading} ${classes.zIndex}`}>
              <LuLoader />
            </div>
          )}
          {isError && (
            <div>
              <h2>No Result</h2>
            </div>
          )}
          {data && data.length >= 2 ? (
            <Chart
              chartType="LineChart"
              data={data}
              options={chartOptions}
              height="400px"
              legendToggle
              loader={
                <div className={classes.chartLoading}>
                  <LuLoader />
                </div>
              }
            />
          ) : (
            <h4 className="flex justify-center items-center h-full mt-5">
              you do not have data for this period
            </h4>
          )}
        </div>
        {Boolean(tipsData) && <p className="ml-12 p-4">Tips for this perdiod: {tipsData}</p>}
      </div>
      <Modal
        className={classes.modal}
        modal={[isShowing, toggle]}
        primaryAction={{
          buttonText: "Set filter",
          action: modalActionHandler,
        }}
      >
        <h5>Select dates for the chart.</h5>
        <div>
          <span>From:</span>
          <DatePicker onChange={(e) => setFrom(e!)} selected={from} />
        </div>
        <br />
        <div>
          <span>To:</span>
          <DatePicker onChange={(e) => setTo(e!)} selected={to} />
        </div>
      </Modal>
    </>
  );
};
