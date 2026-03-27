"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  announcementSchema,
  AnnouncementSchema,
} from "@/lib/formValidationSechma";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction, useEffect, useTransition } from "react";
import { useFormState } from "react-dom";

const AnnouncementForm = ({
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
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: data,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    { success: false, error: false },
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      if (setOpen) setOpen(false);

      router.refresh();

      router.push("/list/nnouncements");
    }
  }, [state.success, router, setOpen]);
  const [isPending, startTransition] = useTransition();
  const onSubmit = handleSubmit(
    async (values) => {
      startTransition(async () => {
        await (formAction as any)(values);

        if (setOpen) setOpen(false);

        toast.success(
          `Announcement has been ${type === "create" ? "created" : "updated"} successfully!`,
        );
      });
    },
    (errors) => {
      console.log("❌ VALIDATION ERRORS:", errors);
    },
  );

  const { classes } = relatedData || {};

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "New Announcement" : "Update Announcement"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={
            data?.date ? new Date(data.date).toISOString().split("T")[0] : ""
          }
          register={register}
          error={errors?.date}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class (Optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            <option value="">All School</option>
            {classes?.map((c: { id: number; name: string }) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {data?.id && (
        <input type="hidden" {...register("id")} defaultValue={data.id} />
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">Submit</button>
    </form>
  );
};

export default AnnouncementForm;
