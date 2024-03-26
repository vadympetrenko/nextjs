import dbConnect from "@/lib/dbConnect";
import Employee from "@/models/Employee";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Restaurant from "@/models/Restaurant";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const employee = await request.json();

    const hashedPassword = bcryptjs.hashSync(
      employee.password,
      bcryptjs.genSaltSync(10)
    );

    await Employee.create({
      ...employee,
      password: hashedPassword,
    });

    if (employee.store.length) {
      employee.store.map(async (item: string) => {
        const restaurant = await Restaurant.findOne({ _id: item });
        if (!restaurant.employee_id.includes(employee._id)) {
          restaurant.employee_id.push(employee._id);
          restaurant.save();
        }
      });
    }

    return NextResponse.json({
      message: "Employee is saved",
      status: "success",
    });
  } catch (error) {
    return NextResponse.json({
      message:
        "We are experiencing difficulties at the moment. Try again later",
      status: "error",
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const employee = await request.json();

    const hashedPassword = bcryptjs.hashSync(
      employee.password,
      bcryptjs.genSaltSync(10)
    );

    if (employee.password !== "") {
      await Employee.updateOne(
        { _id: employee._id },
        {
          ...employee,
          password: hashedPassword,
        }
      );
    }

    if (employee.password === "") {
      await Employee.updateOne(
        { _id: employee._id },
        {
          ...employee,
          hashedPassword,
        }
      );
    }

    if (employee.store.length) {
      employee.store.map(async (item: string) => {
        const restaurant = await Restaurant.findOne({ _id: item });
        if (!restaurant.employee_id.includes(employee._id)) {
          restaurant.employee_id.push(employee._id);
          restaurant.save();
        }
      });
    }

    return NextResponse.json({
      message: "Employee is updated",
      status: "success",
    });
  } catch (error) {
    return NextResponse.json({
      message:
        "We are experiencing difficulties at the moment. Try again later",
      status: "error",
    });
  }
}
