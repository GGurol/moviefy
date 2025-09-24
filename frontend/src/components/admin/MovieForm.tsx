import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { languageOptions, statusOptions, typeOptions } from "../../utils/options";
import DirectorSelector from "../DirectorSelector";
import CastForm from "../form/CastForm";
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
import Dropzone from "../ui/DropZone";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
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
const BACKEND_URL = "http://localhost:8000";

const formatDateInput = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const chars = cleanValue.split('');
  let formattedValue = '';

  if (chars.length > 0) {
    formattedValue += chars.slice(0, 2).join('');
  }
  if (chars.length > 2) {
    formattedValue += '/' + chars.slice(2, 4).join('');
  }
  if (chars.length > 4) {
    formattedValue += '/' + chars.slice(4, 8).join('');
  }
  
  return formattedValue;
};


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
    .nonempty(i18n.t("Story line cannot be empty"))
    .max(2000, i18n.t("Story line cannot be greater than 2000 characters")),
  tags: z.array(z.string()).nonempty(i18n.t("At least one tag is required")),
  director: z.string().nonempty(i18n.t("Must add one director")),
  writer: z.string().nonempty(i18n.t("Must add one writer")),
  cast: z.array(z.string()).nonempty(i18n.t("At least one actor is required")),
  releaseDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: i18n.t("Please use DD/MM/YYYY format"),
  }),
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
  const [existingVideo, setExistingVideo] = useState<string | null>(null);

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

  const [directorVal, setDirectorVal] = useState("");
  const [writerVal, setWriterVal] = useState("");
  const [castVal, setCastVal] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState<Genres[]>([GENRES[0]]);
  const [writerSelectRes, setWriterSelectRes] = useState("");
  const [directorSelectRes, setDirectorSelectRes] = useState("");
  // const [dupValues, setDupValues] = useState([]);
  const [selectedActors, setSelectedActors] = useState([]);
  const { t, i18n } = useTranslation();

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
    // Set simple text/date/select values
    form.setValue("title", initialState.title);
    form.setValue("storyLine", initialState.storyLine);
    form.setValue("status", initialState.status);
    form.setValue("language", initialState.language);
    const formattedDate = format(new Date(initialState.releaseDate), "dd/MM/yyyy");
    form.setValue("releaseDate", formattedDate);
    form.setValue("tags", initialState.tags);
    form.setValue("type", initialState.type);
    
    // --- THE FIX FOR ACTORS IS HERE ---
    // 1. Set the local state for the UI component with the FULL actor objects from the API
    setSelectedActors(initialState.cast || []); 

    // 2. Set the react-hook-form value with only the actor IDs, as the schema expects
    form.setValue("cast", initialState.cast ? initialState.cast.map(actor => actor.id) : []);
    // --- END OF FIX ---

    // Set genres for the MultiSelect component
    const genreObjects = GENRES.filter((e) => initialState.genres.includes(e.value));
    form.setValue("genres", initialState.genres);
    setSelectedGenre(genreObjects);
    
    // Set complex objects for custom selector components
    form.setValue("director", initialState.director.id);
    setDirectorSelectRes(initialState.director);
    
    // Your original code used "writer", singular. Assuming it's one object.
    form.setValue("writer", initialState.writer.id); 
    setWriterSelectRes(initialState.writer);
    
    // Set UI state for the poster
    if (initialState.poster) {
      setSelectedPosterForUI(`${BACKEND_URL}${initialState.poster}`);
    }
    if (initialState.video) {
        // Dosya yolundan sadece dosya adını alıyoruz (örn: /uploads/video.mp4 -> video.mp4)
      const videoFileName = initialState.video.split('/').pop();
      setExistingVideo(videoFileName);
    }
  }
}, [initialState, form]); // form.reset was removed, so form is the correct dependency

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
    setExistingVideo(null);
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
      <form
        className="flex max-sm:flex-col max-sm:gap-0  gap-1 md:gap-2 lg:gap-10"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="space-y-5 w-[33%] max-sm:w-full ">
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
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("FormMovieTags")}</FormLabel>
      <FormControl>
        <InputTags
          value={field.value}
          onChange={field.onChange}
          placeholder={t("'Enter' key or comma separated")}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
        </div>
        <div className="space-y-5 max-sm:mt-5 w-[33%] max-sm:w-full">
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
    <FormItem>
      <FormLabel>{t("FormReleaseDate")}</FormLabel>
      <FormControl>
        <Input
          {...field}
          placeholder="DD/MM/YYYY"
          onChange={(e) => {
            const formatted = formatDateInput(e.target.value);
            field.onChange(formatted);
          }}
        />
      </FormControl>
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
        <div className="space-y-5 max-sm:mt-5 md:w-[33%] max-sm:w-full">
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
                    className="w-full sm:w-52 md:w-60 h-36 text-sm aspect-square object-cover rounded-md hover:bg-muted"
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
                  {/* Eğer yeni bir video seçilmediyse VE mevcut bir video varsa, onu göster */}
                  {existingVideo && !form.watch("video") ? (
                    <Card className="w-full">
                      <CardHeader className="p-2 pb-1">
                        <CardDescription className="flex items-center justify-between">
                          <span>{t("Current Video")}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setExistingVideo(null); // Mevcut videoyu kaldır ve Dropzone'u göster
                                  }}
                                >
                                  <Trash2 size={18} className="text-red-500"/>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("Change the video")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-xs px-2 pb-2 overflow-auto">
                        <span>{existingVideo}</span>
                      </CardContent>
                    </Card>
                  ) : (
                    // Aksi halde, yeni video yükleme alanını göster
                    <Dropzone
                      {...field}
                      dropMessage={t("Drop video file here or click here")}
                      handleOnDrop={(files) => field.onChange(files?.[0])}
                      accept="video/*"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("video") && (
            <Card className="w-full">
              <CardHeader className="p-2 pb-1">
                <CardDescription className="flex items-center justify-between">
                  <span>{t("New Selected Video")}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2
                          size={25}
                          className="hover:bg-muted cursor-pointer rounded border p-1 "
                          onClick={() => form.setValue("video", undefined, { shouldValidate: true })}
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
                <span>{(form.watch("video") as File)?.name}</span>
              </CardContent>
            </Card>
          )}
          <div className="flex flex-col gap-2 w-full sm:w-52 md:w-60">
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
