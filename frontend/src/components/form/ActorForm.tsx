import i18n from "@/utils/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import PosterSelector from "../PosterSelector";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { formatBytes } from "@/utils/helper";

const BACKEND_URL = "http://localhost:8000";

const MAX_FILE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Validation logic and schemas remain the same
const validateAvatar = (file: File | undefined, ctx: z.RefinementCtx) => {
  if (!file) return;
  if (file.size > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18n.t("avatarTooLargeMessage", {
        maxSize: formatBytes(MAX_FILE_SIZE),
      }),
      fatal: true,
    });
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18n.t("Please upload a valid image file (JPEG, PNG, or WebP)"),
      fatal: true,
    });
  }
};

const commonValidations = {
  name: z
    .string()
    .nonempty(i18n.t("Name cannot be empty"))
    .max(50, i18n.t("Name cannot be greater than 50 characters")),
  about: z
    .string()
    .nonempty(i18n.t("About cannot be empty"))
    .max(1000, i18n.t("About cannot be greater than 1000 characters")),
  gender: z.enum(["male", "female"], {
    errorMap: (issue, ctx) => ({ message: i18n.t("Gender cannot be empty") }),
  }),
};

const formUpdateSchema = z.object({
  ...commonValidations,
  avatar: z.any().optional().superRefine(validateAvatar),
});

const formSchema = z.object({
  ...commonValidations,
  avatar: z
    .instanceof(File, {
      message: i18n.t("Please select an image file"),
    })
    .superRefine(validateAvatar),
});

export default function ActorForm({
  busy,
  initialState,
  onSubmit,
  isUpdate = false,
}) {
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");
  const { t } = useTranslation("translation");
  
  // --- THE FIX IS HERE ---
  // 1. Determine the schema to use BEFORE calling the hook.
  const schema = isUpdate ? formUpdateSchema : formSchema;
  
  // 2. Pass the stable 'schema' variable to the resolver.
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialState?.name || "",
      about: initialState?.about || "",
      gender: initialState?.gender,
      avatar: undefined,
    },
  });
  // --- END OF FIX ---

  const handleSubmit = (values: z.infer<typeof schema>) => {
    const formData = new FormData();
    for (const key in values) {
      if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    }
    onSubmit(formData);
  };

  useEffect(() => {
    if (initialState) {
      form.reset({
        name: initialState.name,
        about: initialState.about,
        gender: initialState.gender,
      });
      if (initialState.avatar) {
        setSelectedAvatarForUI(`${BACKEND_URL}${initialState.avatar}`);
      } else {
        setSelectedAvatarForUI("");
      }
    }
  }, [initialState, form]);

  const updatePosterForUI = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedAvatarForUI(url);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = event.target;
    if (name === "avatar") {
      const file = files?.[0];
      if (file) {
        updatePosterForUI(file);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-0 sm:gap-8 flex-col sm:flex-row"
      >
        <div className="space-y-2 sm:space-y-5  sm:w-[50%]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Actor name")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("Enter actor's name")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("About")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("Enter actor's information")}
                    className="h-36"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Gender")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select actor's gender")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">{t("Male")}</SelectItem>
                    <SelectItem value="female">{t("Female")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2 max-sm:mt-2 sm:space-y-5">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Avatar")}</FormLabel>
                <FormControl>
                  <PosterSelector
                    selectedPoster={selectedAvatarForUI}
                    className="h-48 w-64 sm:w-56 sm:h-64 aspect-square object-cover rounded"
                    name="avatar"
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                      handleChange(e);
                    }}
                    label={t("Select avatar")}
                    accept="image/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={busy}
            >
              {busy ? (
                <Loader className="animate-spin" />
              ) : isUpdate ? (
                t("Update")
              ) : (
                t("Create")
              )}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
}