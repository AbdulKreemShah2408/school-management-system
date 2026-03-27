"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { createParent, updateParent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTransition } from "react";
import { toast } from "react-toastify";

const schema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, "Min 3 characters!").max(20),
  // UPDATE FIX: Password ko optional kiya taake update ke waqt khali chora ja sakay
  password: z.string().min(8, "Min 8 characters!").optional().or(z.literal("")),
  name: z.string().min(1, "First name is required!"),
  surname: z.string().min(1, "Last name is required!"),
  email: z.string().email("Invalid email!").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required!"),
  address: z.string().min(1, "Address is required!"),
  students: z.array(z.string()).optional(),
});

type Inputs = z.infer<typeof schema>;

const ParentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen?: any;
  relatedData?: any;
}) => {
  const { students } = relatedData || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createParent : (updateParent as any),
    { success: false, error: false },
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      if (setOpen) setOpen(false);

      toast.success(
        `Parent has been ${type === "create" ? "created" : "updated"} successfully!`,
      );

      router.push("/list/parents");
    }
  }, [state.success, router, setOpen]);
  const [isPending, startTransition] = useTransition();
  const onSubmit = handleSubmit(
    async (values) => {
      startTransition(async () => {
        await (formAction as any)(values);

        if (setOpen) setOpen(false);

        toast.success(
          `Parent has been ${type === "create" ? "created" : "updated"} successfully!`,
        );
      });
    },
    (errors) => {
      console.log("❌ VALIDATION ERRORS:", errors);
    },
  );

  return (
    <form className="flex flex-col gap-8 p-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Parent" : "Update Parent"}
      </h1>

      {data?.id && (
        <input type="hidden" {...register("id")} defaultValue={data.id} />
      )}

      <span className="text-xs text-gray-400 font-medium">Authentication</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors?.password}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Details
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address}
        />

        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-400">
            Students (Ctrl+Click to select many)
          </label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky"
            {...register("students")}
            defaultValue={data?.students?.map((s: any) => s.id) || []}
          >
            {students?.map((student: any) => (
              <option key={student.id} value={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
          {errors.students?.message && (
            <p className="text-xs text-red-400">
              {errors.students.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500 text-sm">
          Error: Something went wrong!
        </span>
      )}

      <button
        disabled={isPending}
        className="bg-blue-400 text-white p-2 rounded-md disabled:bg-blue-200 disabled:cursor-not-allowed"
      >
        {isPending ? "Updating..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
