import { TextField } from "@/UI/TextField";
import { ReportTypeExtended } from "@/models/Report";
import classes from "@/app/components/Report/ReportDetails/styles.module.scss";

type ReportComponentType = {
  report: ReportTypeExtended;
};

export const Report: React.FC<ReportComponentType> = ({ report }) => {
  return (
    <>
      <div className={`flex ${classes.wrapper}`}>
        <div>
          <TextField>
            <p>Restoraunt name:</p>
            <p>{report.restaurant.name}</p>
          </TextField>

          <TextField>
            <p>Product Total:</p>
            <p>{report.product_total}</p>
          </TextField>

          <TextField>
            <p>Coupons:</p>
            <p>-{report.coupons}</p>
          </TextField>
          <div className="mb-8">
            <p>Subtotal (Product Total + Coupons) = {report.subtotal}</p>
          </div>
          <TextField>
            <p>GST:</p>
            <p>{report.gst}</p>
          </TextField>
        </div>

        <div>
          <TextField>
            <p>Debit/credit #1:</p>
            <p>{report.debit1}</p>
          </TextField>

          <TextField>
            <p>Debit/credit #2:</p>
            <p>{report.debit2}</p>
          </TextField>
          <TextField>
            <p>All Cash:</p>
            <p>{report.allcash}</p>
          </TextField>

          <TextField>
            <p>Gift Card:</p>
            <p>{report.giftcard}</p>
          </TextField>

          <TextField>
            <p>Skip:</p>
            <p>{report.skip}</p>
          </TextField>

          <TextField>
            <p>Uber:</p>
            <p>{report.uber}</p>
          </TextField>
          <TextField>
            <p>Mobi2Go:</p>
            <p>{report.mobi2go}</p>
          </TextField>
          <TextField>
            <p>Tips:</p>
            <p>{report.tips}</p>
          </TextField>
        </div>
      </div>
      <div className={`flex ${classes.wrapper}`}>
        <div className={classes.totals}>
          <p>Total 1 (Subtotal + GST) = {report.total_1}</p>
        </div>
        <div className={classes.totals}>
          <p>Total 2 (the sum of the columns above) -250 = {report.total_2}</p>
        </div>
      </div>
      <div className={`${classes.grandTotal} text-center`}>
        <p>Total 2 (-250) - Total 1 = {report.grandTotal}</p>
      </div>
      <div className={`${classes.cash} text-center`}>
        <p>Cash - 250 = {report.allcash - 250}</p>
      </div>
    </>
  );
};
