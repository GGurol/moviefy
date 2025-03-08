import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Delete,
  DeleteIcon,
  FileCheck2Icon,
  Loader,
  Trash,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotification } from "../../hooks";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
import { validateMovie } from "../../utils/validator";
import DirectorSelector from "../DirectorSelector";
import CastForm from "../form/CastForm";
import Submit from "../form/Submit";
import PosterSelector from "../PosterSelector";
import { Button, buttonVariants } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { InputTags } from "../ui/InputTags";
import { MultiSelect } from "../ui/MultiSelect";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import WriterSelector from "../WriterSelector";
import MovieUpload from "./MovieUpload";
import Dropzone from "../ui/DropZone";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { GENRES } from "@/utils/genres";
import { formatBytes } from "@/utils/helper";
import i18n from "@/utils/i18n";
import { useTranslation } from "react-i18next";
import { zhCN, enUS } from "date-fns/locale";
type Genres = Record<"value" | "label" | "className", string>;

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  writer: "",
  releaseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

const MAX_POSTER_SIZE = 1024 * 1024 * 10;
const MAX_VIDEO_SIZE = 1024 * 1024 * 10;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/x-matroska",
  "video/x-msvideo",
];

const validatePoster = (file, ctx) => {
  if (!file) return;
  if (file.size > MAX_POSTER_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18n.t("posterTooLargeMessage", {
        maxSize: formatBytes(MAX_POSTER_SIZE),
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

const validateVideo = (file, ctx) => {
  if (!file) return true;
  if (file.size > MAX_VIDEO_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18n.t("videoTooLargeMessage", {
        maxSize: formatBytes(MAX_VIDEO_SIZE),
      }),
      fatal: true,
    });
  }
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: i18n.t("Please upload a valid image file (JPEG, PNG, or WebP)"),
      fatal: true,
    });
  }
  // return true;
};

const commonValidation = {
  title: z
    .string()
    .nonempty(i18n.t("Title cannot be empty"))
    .max(50, i18n.t("Title cannot be greater than 50 characters")),
  storyLine: z
    .string()
    .nonempty(i18n.t("storyLine cannot be empty"))
    .max(2000, i18n.t("storyLine cannot be greater than 2000 characters")),
  tags: z.array(z.string()).nonempty(i18n.t("At least one tag is required")),
  director: z.string().nonempty(i18n.t("Must add one director")),
  writer: z.string().nonempty(i18n.t("Must add one writer")),
  cast: z.array(z.string()).nonempty(i18n.t("At least one actor is required")),
  releaseDate: z.date({ message: i18n.t("Please select a release date") }),
  language: z.string().nonempty(i18n.t("Please select a language")),
  status: z.string().nonempty(i18n.t("Please select a status")),
  type: z.string().nonempty(i18n.t("Please select a type")),
  genres: z
    .array(z.string())
    .nonempty(i18n.t("At least one genre is required")),
};

const formUpdateSchema = z.object({
  ...commonValidation,
  poster: z.any().optional().superRefine(validatePoster),
  video: z.any().optional().superRefine(validateVideo),
});

const formSchema = z.object({
  ...commonValidation,
  poster: z
    .instanceof(File, {
      message: i18n.t("Please select an image file"),
    })
    .superRefine(validatePoster),
  video: z
    .instanceof(File, {
      message: i18n.t("Please select a video file"),
    })
    .superRefine(validateVideo),
});

export default function MovieForm({
  onSubmit,
  busy,
  initialState,
  btnTitle,
  isUpdate = false,
}) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");

  let form;

  if (isUpdate) {
    form = useForm<z.infer<typeof formUpdateSchema>>({
      resolver: zodResolver(formUpdateSchema),
      defaultValues: {
        title: "",
        storyLine: "",
        tags: [],
        director: "",
        writer: "",
        cast: [],
        video: undefined,
        poster: undefined,
        genres: [],
        type: "",
        language: "",
        status: "",
      },
    });
  } else {
    form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        storyLine: "",
        tags: [],
        director: "",
        writer: "",
        cast: [],
        video: undefined,
        poster: undefined,
        genres: [],
        type: "",
        language: "",
        status: "",
      },
    });
  }

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    const finalMovieInfo = {
      ...values,
    };

    finalMovieInfo.tags = JSON.stringify(values.tags);
    finalMovieInfo.genres = JSON.stringify(values.genres);
    finalMovieInfo.cast = JSON.stringify(values.cast);

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    onSubmit(formData);
  };

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  const handleChange = ({ target }) => {
    const { name, value, files } = target;
    if (name === "poster") {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }
    setMovieInfo({ ...movieInfo, [name]: value });
  };

  // const updateTags = (tags) => {
  //   setMovieInfo({ ...movieInfo, tags });
  // };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };
  const updateWriter = (profile) => {
    setMovieInfo({ ...movieInfo, writer: profile });
  };

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  // const updateGenres = (genres) => {
  //   setMovieInfo({ ...movieInfo, genres });
  // };

  // const updateWriters = (profile) => {
  //   const { writers } = movieInfo;
  //   for (let writer of writers) {
  //     if (writer.id === profile.id) {
  //       return updateNotification(
  //         "warning",
  //         "This profile is already selected!"
  //       );
  //     }
  //   }
  //   setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  // };

  // const hideWritersModal = () => {
  //   setShowWritersModal(false);
  // };

  // const displayWritersModal = () => {
  //   setShowWritersModal(true);
  // };
  // const hideCastModal = () => {
  //   setShowCastModal(false);
  // };

  // const displayCastModal = () => {
  //   setShowCastModal(true);
  // };

  // const hideGenresModal = () => {
  //   setShowGenresModal(false);
  // };

  // const displayGenresModal = () => {
  //   setShowGenresModal(true);
  // };

  // const handleWriterRemove = (profileId) => {
  //   const { writers } = movieInfo;
  //   const newWriters = writers.filter(({ id }) => id !== profileId);
  //   if (!newWriters.length) hideWritersModal();
  //   setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  // };

  // const handleCastRemove = (profileId) => {
  //   const { cast } = movieInfo;
  //   const newCast = cast.filter(({ profile }) => profile.id !== profileId);
  //   if (!newCast.length) hideCastModal();
  //   setMovieInfo({ ...movieInfo, cast: [...newCast] });
  // };

  const [tagValues, setTagValues] = useState<string[]>([]);
  const [directorVal, setDirectorVal] = useState("");
  const [writerVal, setWriterVal] = useState("");
  const [castVal, setCastVal] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState<Genres[]>([GENRES[0]]);
  const [writerSelectRes, setWriterSelectRes] = useState("");
  const [directorSelectRes, setDirectorSelectRes] = useState("");
  // const [dupValues, setDupValues] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const { t, i18n } = useTranslation();

  // const leaderActors = useActorStore((state) => state.leaderActors);
  // console.log(leaderActors);

  // const [uniqValues, setUniqValues] = useState([]);

  // const handleUniqValuesChange = (newValues) => {
  //   // setUniqValues(newValues);
  //   setSelectedActors(newValues);
  // };

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = [
        "video/mp4",
        "video/mpeg",
        "video/x-matroska",
        "video/x-msvideo",
      ];
      const fileType = allowedTypes.find(
        (type) => type === acceptedFiles[0].type
      );
      if (!fileType) {
        form.setValue("video", null);
        form.setError("video", {
          message: t("File type is not valid"),
          type: "typeError",
        });
      } else {
        form.setValue("video", acceptedFiles[0]);
        form.clearErrors("video");
      }
    } else {
      form.setValue("video", null);
      form.setError("video", {
        message: t("Video file is required"),
        type: "typeError",
      });
    }
  }

  const getLocale = () => {
    return i18n.language === "en"
      ? enUS
      : i18n.language === "zh"
      ? zhCN
      : undefined;
  };

  useEffect(() => {
    if (initialState) {
      // setMovieInfo({
      //   ...initialState,
      //   poster: null,
      //   releaseDate: initialState.releaseDate.split("T")[0],
      // });
      form.setValue("title", initialState.title);
      form.setValue("storyLine", initialState.storyLine);
      form.setValue("status", initialState.status);
      form.setValue("language", initialState.language);
      const cast = initialState.cast.map((item) => {
        for (let p in item) return item[p];
      });
      // form.setValue("cast", initialState.cast.id);
      // setDupValues(cast);
      setSelectedActors(cast);
      // setUniqValues(initialState.cast);
      // setCastVal(initialState.cast.id);
      const genre = GENRES.filter((e) => initialState.genres.includes(e.value));
      form.setValue("genres", initialState.genres);
      setSelectedGenre(genre);
      form.setValue("director", initialState.director.id);
      setDirectorSelectRes(initialState.director);
      form.setValue("writer", initialState.writer.id);
      setWriterSelectRes(initialState.writer);
      form.setValue("releaseDate", new Date(initialState.releaseDate));
      form.setValue("tags", initialState.tags);
      form.setValue("type", initialState.type);
      setTagValues(initialState.tags);
      setSelectedPosterForUI(initialState.poster);
      // console.log(form.getValues("cast"));
      // console.log(dupValues);
      console.log(initialState.cast);
    }
  }, [initialState]);

  const resetForm = () => {
    form.reset();
    setSelectedGenre([]);
    setTagValues([]);
    setWriterSelectRes("");
    setWriterVal("");
    setDirectorSelectRes("");
    setDirectorVal("");
    // setDupValues([]);
    setSelectedActors([]);
    setSelectedPosterForUI("");
  };

  const {
    title,
    storyLine,
    writers,
    cast,
    tags,
    genres,
    type,
    language,
    status,
    releseDate,
  } = movieInfo;
  return (
    <Form {...form}>
      <form className="flex gap-10" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-5 w-[33%]">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormTitle")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("Enter movie title")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormGenres")}</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={selectedGenre}
                    setSelected={setSelectedGenre}
                    onSelect={(values) => {
                      const vl = values
                        .filter((e) => e.value !== "-")
                        .map((e) => e.value);
                      field.value = vl;
                      field.onChange(vl);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="director"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormDirector")}</FormLabel>
                <FormControl>
                  <DirectorSelector
                    updateDirector={updateDirector}
                    value={directorVal}
                    setValue={setDirectorVal}
                    onSelect={(value) => {
                      setDirectorVal(value);
                      field.value = value;
                      // form.setValue("director", value);
                      field.onChange(value);
                    }}
                    selectRes={directorSelectRes}
                    setSelectRes={setDirectorSelectRes}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="writer"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormWriter")}</FormLabel>
                <FormControl>
                  <WriterSelector
                    updateWriter={updateWriter}
                    value={writerVal}
                    setValue={setWriterVal}
                    onSelect={(value) => {
                      setWriterVal(value);
                      field.value = value;
                      field.onChange(value);
                    }}
                    selectRes={writerSelectRes}
                    setSelectRes={setWriterSelectRes}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormStatus")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder={t("Select a status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {t(e.title)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tags"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{t("FormMovieTags")}</FormLabel>
                  <FormControl>
                    <InputTags
                      value={tagValues}
                      onChange={(values) => {
                        setTagValues(values);
                        field.value = values;
                        // form.setValue("tags", values);
                        field.onChange(values);
                      }}
                      placeholder={t("'Enter' key or comma separated")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="space-y-5 w-[33%]">
          <FormField
            name="cast"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormLeaderActors")}</FormLabel>
                <FormControl>
                  <CastForm
                    updateCast={updateCast}
                    // onUniqValuesChange={handleUniqValuesChange}
                    // uniqValues={uniqValues}
                    // setUniqValues={setUniqValues}
                    values={castVal}
                    setValues={setCastVal}
                    onSelect={(values) => {
                      setCastVal(values);
                      field.value = values;
                      field.onChange(values);
                    }}
                    // dupValues={dupValues}
                    // setDupValues={setDupValues}
                    setSelectedActors={setSelectedActors}
                    selectedActors={selectedActors}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("FormReleaseDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: getLocale() })
                        ) : (
                          <span>{t("Pick a date")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      weekStartsOn={1}
                      locale={getLocale()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormLanguage")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder={t("Select a language")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languageOptions.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {t(e.title)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormType")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder={t("Select a type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typeOptions.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {t(e.title)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="storyLine"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormStoryLine")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("Enter movie story line")}
                    className="h-36"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-5 w-[33%]">
          <FormField
            control={form.control}
            name="poster"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FormPoster")}</FormLabel>
                <FormControl>
                  <PosterSelector
                    name="poster"
                    selectedPoster={selectedPosterForUI}
                    label={t("Select poster")}
                    className="w-60 h-36 text-sm aspect-square object-cover rounded-md hover:bg-muted"
                    onChange={(e) => {
                      field.onChange(e.target.files && e.target.files[0]);
                      handleChange(e);
                    }}
                    accept="image/*"
                    // ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("FormVideo")}</FormLabel>
                <FormControl>
                  <Dropzone
                    {...field}
                    dropMessage={t("Drop video file here or click here")}
                    handleOnDrop={handleOnDrop}
                    accept="video/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("video") && (
            <Card className="w-60 h-20">
              <CardHeader className="p-2 pb-1">
                <CardDescription className="flex items-center justify-between">
                  <span>{t("Selected Video")}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          size={25}
                          className="hover:bg-muted cursor-pointer rounded border p-1 "
                          onClick={() => form.setValue("video", null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("Remove the video")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs px-2 pb-2 flex justify-between items-center overflow-auto ">
                <span>{form.watch("video")?.name}</span>
              </CardContent>
            </Card>
          )}
          <div className="flex flex-col gap-2 w-60">
            <Button type="submit" variant="default" disabled={busy}>
              {busy ? <Loader className="animate-spin" /> : t("Submit")}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="secondary">
                  {t("Reset Form")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "All the form data will be removed. If you accidentally clicked it, please click 'Cancel' to avoid data loss."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    type="reset"
                    onClick={resetForm}
                  >
                    {t("Reset Form")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </form>
    </Form>
  );
}
