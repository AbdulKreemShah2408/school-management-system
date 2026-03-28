"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { classSchema, ClassSchema } from "@/lib/formValidationSechma";
import { createClass, updateClass } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, startTransition } from "react";

const ClassForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema) as any,
  });
const router=useRouter();
  const [state, formAction, isPending] = useFormState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    },
  );

 useEffect(() => {
      if (state.success) {
        if (setOpen) setOpen(false);
  
        router.refresh();
  
        router.push("/list/classes");
      }
    }, [state.success, router, setOpen]);
   
    const onSubmit = handleSubmit(
      async (values) => {
        startTransition(async () => {
          await (formAction as any)(values);
  
          if (setOpen) setOpen(false);
  
          toast.success(
            `Class has been ${type === "create" ? "created" : "updated"} successfully!`,
          );
        });
      },
      (errors) => {
        console.log("❌ VALIDATION ERRORS:", errors);
      },
    );
  

  const { teachers = [], grades = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update the class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Class Name */}
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />

        {/* Capacity */}
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />

        {/* Hidden Id for update */}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        {/* Supervisor Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.supervisorId ?? ""}
          >
            <option value="" disabled>
              Select Supervisor
            </option>
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name + " " + teacher.surname}
                </option>
              ),
            )}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>

        {/* Grade Dropdown */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId ?? ""}
          >
            <option value="" disabled>
              Select Grade
            </option>
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-400 text-white p-2 rounded-md disabled:opacity-50"
        disabled={isPending}
      >
        {isPending ? "Please wait..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
