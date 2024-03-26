"use client";
import { useSession } from "next-auth/react";
import classes from "@/app/components/Report/AddReport/styles.module.scss";
import { Input } from "@/UI/Input";
import { isRequired } from "@/lib/isFieldRequired";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { RestaurantType } from "@/models/Restaurant";
import { Select } from "@/UI/Select";
import { Button } from "@/UI/Button";
import {
  REQUIRED_MESSAGE_ERROR,
  REQUIRED_NUMBER_MESSAGE,
} from "@/lib/constants";
import { ReportType, ReportTypeExtended } from "@/models/Report";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { dateFormat } from "@/utils/helper";
import revalidateTagAction from "@/app/actions";

type ReportComopnentType = {
  restaurants: RestaurantType[];
  report?: ReportTypeExtended;
  edit?: string
};

export const AddReport: React.FC<ReportComopnentType> = ({ restaurants, report, edit }) => {
  const { data: session } = useSession();
const router = useRouter()
  let schema = yup.object({
    product_total: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    coupons: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    gst: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    debit1: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    debit2: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    allcash: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    giftcard: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    skip: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    uber: yup
      .number()
      .typeError(REQUIRED_NUMBER_MESSAGE)
      .required(REQUIRED_MESSAGE_ERROR),
    mobi2goString: yup.string().required(REQUIRED_MESSAGE_ERROR),
    restaurant: yup.string().required(REQUIRED_MESSAGE_ERROR),
    employee_id: yup.string().required(REQUIRED_MESSAGE_ERROR),
    mobi2go: yup.number().required(),
    subtotal: yup.number().required(),
    grandTotal: yup.number().required(),
    total_1: yup.number().required(),
    total_2: yup.number().required(),
    report_id: yup.string(),
    tips: yup.number()
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      product_total: report?.product_total ?? undefined, 
      coupons: report?.coupons ?? undefined,
      gst: report?.gst ?? undefined,
      debit1: report?.debit1 ?? undefined,
      debit2: report?.debit2 ?? undefined,
      allcash: report?.allcash ?? undefined,
      giftcard: report?.giftcard ?? undefined,
      skip: report?.skip ?? undefined,
      uber: report?.uber ?? undefined,
      mobi2go: report?.mobi2go ?? undefined,
      restaurant: report?.restaurant?._id.toString() ?? undefined,
      mobi2goString: report?.mobi2go ? String(report?.mobi2go) : undefined,
      employee_id: session?.id,
      report_id: report?._id || undefined,
      tips: report?.tips || undefined
    },
    resolver: yupResolver(schema),
  });

  const product_total = watch("product_total") || 0;
  const coupouns = watch("coupons") || 0;
  const subtotal = Math.round((product_total - +coupouns) * 100) / 100;
  const GST = watch("gst") || 0;

  const total_1 = Math.round((subtotal + +GST) * 100) / 100;

  const substractedCash = -250;

  const tips = watch("tips") || 0;
  const debitCredit1 = watch("debit1") || 0;
  const debitCredit2 = watch("debit2") || 0;
  const allCash = watch("allcash") || 0;
  const giftCard = watch("giftcard") || 0;
  const skip = watch("skip") || 0;
  const uber = watch("uber") || 0;
  const mobi2goString = watch("mobi2goString") || "";
  const mobi2go = (() =>
    mobi2goString
      .split("+")
      .map((num) => parseFloat(num) || 0)
      .reduce((acc, num) => acc + num, 0))().toFixed(2);

  const total_2 =
    Math.round(
      (+debitCredit1 +
        +debitCredit2 +
        +allCash +
        +giftCard +
        +skip +
        +uber +
        +mobi2go +
        substractedCash) *
        100
    ) / 100;
  const grandTotal = +total_2 > 0 ? (total_2 - total_1).toFixed(2) : (total_2 + total_1).toFixed(2);
  const finalCash = (+allCash + +substractedCash).toFixed(2);

  const total_1Val = watch('total_1')
  const total_2Val = watch('total_2')
  const subtotalVal = watch('subtotal')
  const grandTotalVal = watch('grandTotal')

  useEffect(() => {
    setValue("mobi2go", +mobi2go);
    setValue("total_1", total_1);
    setValue("total_2", total_2);
    setValue("subtotal", subtotal);
    setValue("grandTotal", +grandTotal);
  }, [
    mobi2goString,
    setValue,
    mobi2go,
    total_1,
    total_2,
    subtotal,
    grandTotal,
  ]);

  const submitHandler: SubmitHandler<ReportType> = async (formData) => {
    let response
    if(edit) {
      const { data } = await axios.put("/reports/api", formData);
      response = data
    } else {
      const { data } = await axios.post("/reports/api", formData);
      response = data
    }
    toast(response.message, response.status)
    
    if(response.status === 'success') {
      await revalidateTagAction('reports')
      router.push('/reports')
    }
  };

  return (
    <div className="main-content">
      <h1>{edit ? 'Update' : 'Create '} Report for {edit ? dateFormat(report?.createdAt as string) : dateFormat(new Date())}</h1>
      {report?.createdAt !== report?.updatedAt && <h4>updated on {dateFormat(report?.updatedAt as string)}</h4>}
      <form
        className={`flex justify-between flex-wrap ${classes.form}`}
      >
        <div>
          {edit && <Input
            type="hidden"
            name="report_id"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "report_id", schema })}
          />
          }
          <Input
            type="hidden"
            name="mobi2go"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "mobi2goString", schema })}
          />
          <Select
            name={"restaurant"}
            control={control}
            placeholder={"Restaurant"}
            errors={errors}
            data={restaurants}
            isRequired={isRequired({ name: "restaurant", schema })}
          />
          <Input
            name="product_total"
            placeholder="Product Total"
            control={control}
            type="number"
            errors={errors}
            isRequired={isRequired({ name: "product_total", schema })}
          />
          <Input
            name="coupons"
            placeholder="Coupons"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "coupons", schema })}
            className={classes.minus}
          />

          <p className={classes.title}>
            Subtotal (Product Total + Coupons) = {subtotalVal}
          </p>

          <Input
            name="gst"
            placeholder="GST"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "gst", schema })}
          />
        </div>
        <div>
          <Input
            name="debit1"
            placeholder="Debit/Credit #1"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "debit1", schema })}
          />
          <Input
            name="debit2"
            placeholder="Debit/Credit #2"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "debit2", schema })}
          />
          <Input
            name="allcash"
            placeholder="All Cash"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "allcash", schema })}
          />
          <Input
            name="giftcard"
            placeholder="Gift Card"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "giftcard", schema })}
          />
          <Input
            name="skip"
            placeholder="Skip"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "skip", schema })}
          />
          <Input
            name="uber"
            placeholder="Uber"
            type="number"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "uber", schema })}
          />
          <Input
            name="mobi2goString"
            placeholder="Mobi2Go"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "mobi2goString", schema })}
          />

          <p>mobi2go total: {mobi2go}</p>

          <Input
            className="mt-5"
            name="tips"
            placeholder="Tips"
            control={control}
            errors={errors}
            isRequired={isRequired({ name: "tips", schema })}
          />
        </div>
        <div
          className={`flex jjustify-between flex-wrap ${classes.total}`}
        >
          <div>
            <p className={classes.title}>
              Total 1 (Subtotal + GST) = {total_1Val}
            </p>
          </div>
          <div>
            <p className={classes.title}>
              Total 2 (the sum of the columns above) {substractedCash} = {total_2Val}
            </p>
          </div>
        </div>
      </form>
      <div className={classes.grandTotal}>
        Total 2 ({substractedCash}) - Total 1 = {grandTotalVal}
      </div>
      <div className={classes.cash}>
        Cash {allCash} - 250 (amount for the cash register) = {finalCash}
      </div>

      <Button
        variation="primary"
        className={classes.sendReport}
        onClick={handleSubmit(submitHandler)}
      >
        {edit ? 'Update' : 'Send'} report
      </Button>
    </div>
  );
};
