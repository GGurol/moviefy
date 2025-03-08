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
  FormDescription,
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

// const defaultActorInfo = {
//   name: "",
//   about: "",
//   gender: "male",
//   avatar: undefined,
// };

const MAX_FILE_SIZE = 1024 * 1024 * 10;
// const MAX_FILE_SIZE = 1024 * 10;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const validateAvatar = (file, ctx) => {
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
  // return true;
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
  // const [actorInfo, setActorInfo] = useState({
  //   ...defaultActorInfo,
  // });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");
  const { t } = useTranslation("translation");

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;
    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      // return setActorInfo({ ...actorInfo, avatar: file });
    }

    // setActorInfo({ ...actorInfo, [name]: value });
  };

  let form;
  if (isUpdate) {
    form = useForm<z.infer<typeof formUpdateSchema>>({
      resolver: zodResolver(formUpdateSchema),
      defaultValues: {
        name: "",
        about: "",
        gender: undefined,
        avatar: undefined,
      },
    });
  } else {
    form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        about: "",
        gender: undefined,
        avatar: undefined,
      },
    });
  }

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value);
    }
    onSubmit(formData);
  };

  useEffect(() => {
    if (initialState) {
      form.setValue("name", initialState.name);
      form.setValue("about", initialState.about);
      form.setValue("gender", initialState.gender);
      // form.setValue("avatar", null);
      // setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);

  // const { name, about, gender } = actorInfo;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-8">
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Actor name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("Please enter actor name")}
                </FormDescription>
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
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  {t("Please enter actor's information")}
                </FormDescription>
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
                      <SelectValue placeholder={t("Gender")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">{t("Male")}</SelectItem>
                    <SelectItem value="female">{t("Female")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("Please select actor's gender")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-5">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Avatar")}</FormLabel>
                <FormControl>
                  <PosterSelector
                    selectedPoster={selectedAvatarForUI}
                    className="w-56 h-56 aspect-square object-cover rounded"
                    name="avatar"
                    onChange={(e) => {
                      field.onChange(e.target.files && e.target.files[0]);
                      handleChange(e);
                    }}
                    label={t("Select avatar")}
                    accept="image/*"
                    // ref={field.ref}
                  />
                </FormControl>
                <FormDescription>
                  {t("Please select an avatar")}
                </FormDescription>
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
