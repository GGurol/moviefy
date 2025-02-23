import { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import { useNotification } from "../../hooks";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) return { error: "Actor name is missing!" };
  if (!about.trim()) return { error: "Actor section is missing!" };
  if (!gender.trim()) return { error: "Actor gender is missing!" };
  if (avatar && !avatar.type?.startsWith("image"))
    return { error: "Invalid image / avatar file!" };

  return { error: null };
};

const formSchema = z.object({
  actorName: z.string().min(2).max(50),
  about: z.string().min(2).max(200),
  gender: z.enum(["male", "female"]),
  avatar: z.instanceof(File),
});

export default function ActorForm({ title, btnTitle, busy, initialState }) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");
  const { updateNotification } = useNotification();

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;
    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file });
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actorName: "",
      about: "",
      gender: "male",
      avatar: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateActor(actorInfo);
    if (error) return updateNotification("error", error);

    // submit form
    const formData = new FormData();
    for (let key in actorInfo) {
      if (key) formData.append(key, actorInfo[key]);
    }
    // onSubmit(formData);
  };

  useEffect(() => {
    if (initialState) {
      setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);

  const { name, about, gender } = actorInfo;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-8">
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="actorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actor name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Please enter actor name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Please enter actor's information
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
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Please select actor's gender</FormDescription>
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
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <PosterSelector
                    selectedPoster={selectedAvatarForUI}
                    className="w-56 h-56 aspect-square object-cover rounded"
                    name="avatar"
                    onChange={handleChange}
                    label="Select avatar"
                    accept="image/jpg, image/jpeg, image/png"
                  />
                </FormControl>
                <FormDescription>Please select an avatar</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="secondary" className="w-full">
            Create
          </Button>
        </div>
        {/* <div className="flex justify-between items-center mb-3">
          <h1 className="font-semibold text-xl dark:text-white text-primary">
            {title}
          </h1>
          <button
            type="submit"
            className="h-8 w-24 bg-primary text-white  dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
          >
            {busy ? <FaSpinner className="animate-spin" /> : btnTitle}
          </button>
        </div> */}
        {/* <div className="flex space-x-2">
          <PosterSelector
            selectedPoster={selectedAvatarForUI}
            className="w-36 h-36 aspect-square object-cover rounded"
            name="avatar"
            onChange={handleChange}
            label="Select avatar"
            accept="image/jpg, image/jpeg, image/png"
          />
          <div className="flex-grow flex flex-col space-y-2">
            <input
              placeholder="Enter name"
              type="text"
              className={commonInputClasses + " border-b-2"}
              name="name"
              value={name}
              onChange={handleChange}
            />
            <textarea
              name="about"
              value={about}
              onChange={handleChange}
              placeholder="About"
              className={commonInputClasses + " border-b-2 resize-none h-full"}
            ></textarea>
          </div>
        </div> */}

        {/* <div className="mt-3">
          <Selector
            options={genderOptions}
            label="Gender"
            value={gender}
            onChange={handleChange}
            name="gender"
          />
        </div> */}
      </form>
    </Form>
  );
}
