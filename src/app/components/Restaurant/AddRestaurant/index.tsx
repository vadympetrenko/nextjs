"use client";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/UI/Input";
import { isRequired } from "@/lib/isFieldRequired";
import { Toolbar } from "@/UI/Toolbar";
import { Button } from "@/UI/Button";
import { PiPlusBold } from "react-icons/pi";
import { InputPhone } from "@/UI/InputPhone";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import revalidateTagAction from "@/app/actions";
import { RestaurantType } from "@/models/Restaurant";

type AddRestaurantType = {
  restaurants?: RestaurantType;
  searchParams?: {
    edit: string;
  };
};

export const AddRestaurant: React.FC<AddRestaurantType> = ({
  restaurants,
  searchParams,
}) => {
  const router = useRouter();
  const edit = searchParams?.edit;
  const editStatus = edit && edit !== "" && JSON.parse(edit!);

  let schema = yup.object().shape({
    name: yup.string().required(),
    address: yup.string().required(),
    phone_number: yup.string().required(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantType>({
    defaultValues: {
      address: restaurants?.address || undefined,
      name: restaurants?.name || undefined,
      phone_number: restaurants?.phone_number || undefined,
      _id: restaurants?._id || undefined,
    },
    resolver: yupResolver(schema),
  });

  const addRestaurantHandler: SubmitHandler<RestaurantType> = async (
    formData
  ) => {
    let response;
    if (editStatus) {
      response = await axios.put(
        "/admin/restaurants/add-restaurant/api",
        formData
      );
    } else {
      response = await axios.post(
        "/admin/restaurants/add-restaurant/api",
        formData
      );
    }

    toast(response.data.message, response.data.status);

    if (response.data.status === "success") {
      await revalidateTagAction("restaurants");
      router.push("/admin");
    }
  };

  return (
    <>
      <Toolbar>
        <Button
          variation="primary"
          onClick={handleSubmit(addRestaurantHandler)}
          icon={<PiPlusBold />}
        >
          {editStatus ? "Update Restaurant" : "Save Restaurant"}
        </Button>
      </Toolbar>
      <div className="main-content">
        <h1> {editStatus ? "Update Restaurant" : "Add Restaurant"}</h1>
        <form>
          <Input
            control={control}
            name="name"
            placeholder="Restaurant name"
            errors={errors}
            isRequired={isRequired({ name: "name", schema })}
          />
          <Input
            control={control}
            name="address"
            placeholder="Address"
            errors={errors}
            isRequired={isRequired({ name: "address", schema })}
          />

          {editStatus && <Input type="hidden" control={control} name="_id" />}

          <InputPhone
            control={control}
            name="phone_number"
            placeholder="Phone number"
            errors={errors}
            isRequired={isRequired({ name: "phone_number", schema })}
          />
        </form>
      </div>
    </>
  );
};
