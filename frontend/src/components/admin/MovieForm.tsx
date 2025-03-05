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
type Genres = Record<"value" | "label" | "className", string>;

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  writer: "",
  releseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

const MAX_FILE_SIZE = 1024 * 1024 * 10;

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

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const validatePoster = (file) => {
  if (!file) return true;
  if (file.size > MAX_FILE_SIZE) {
    return new Error(
      `Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`
    );
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return new Error("Please upload a valid image file (JPEG, PNG, or WebP).");
  }
  return true;
};

const validateVideo = (file) => {
  if (!file) return true;
  if (file.size > MAX_FILE_SIZE) {
    return new Error(
      `Please choose a video file smaller than ${formatBytes(MAX_FILE_SIZE)}.`
    );
  }
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    return new Error("Please upload a valid video file (MP4, AVI, or MKV)");
  }
  return true;
};

const commonValidation = {
  title: z.string().min(2).max(50),
  storyLine: z.string().min(2).max(2000),
  tags: z.array(z.string()).nonempty("At least one tag is required"),
  director: z.string().nonempty("Must add one director"),
  writer: z.string().nonempty("Must add one writer"),
  cast: z.array(z.string()).nonempty("At least one actor is required"),
  releaseDate: z.date(),
  language: z.string(),
  status: z.string(),
  type: z.string(),
  genres: z.array(z.string()).nonempty("At least one genre is required"),
};

const formUpdateSchema = z.object({
  ...commonValidation,
  poster: z.any().optional().refine(validatePoster),
  video: z.any().optional().refine(validateVideo),
});

const formSchema = z.object({
  ...commonValidation,
  poster: z
    .instanceof(File, {
      message: "Please select an image file.",
    })
    .refine(validatePoster),

  video: z
    .instanceof(File, {
      message: "Please select a video file.",
    })
    .refine(validateVideo),
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
          message: "File type is not valid",
          type: "typeError",
        });
      } else {
        form.setValue("video", acceptedFiles[0]);
        form.clearErrors("video");
      }
    } else {
      form.setValue("video", null);
      form.setError("video", {
        message: "Video is required",
        type: "typeError",
      });
    }
  }

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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter movie title" />
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
                <FormLabel>Genres</FormLabel>
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
                <FormLabel>Director</FormLabel>
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
                <FormLabel>Writer</FormLabel>
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
            name="tags"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Movie Tags</FormLabel>
                  <FormControl>
                    <InputTags
                      value={tagValues}
                      onChange={(values) => {
                        setTagValues(values);
                        field.value = values;
                        // form.setValue("tags", values);
                        field.onChange(values);
                      }}
                      placeholder="Enter comma separated values..."
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
                <FormLabel>Leader Actors</FormLabel>
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
                <FormLabel>Release Date</FormLabel>
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
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
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
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languageOptions.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.title}
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
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typeOptions.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.title}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.title}
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
                <FormLabel>Story Line</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter movie story line" />
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
                <FormLabel>Poster</FormLabel>
                <FormControl>
                  <PosterSelector
                    name="poster"
                    selectedPoster={selectedPosterForUI}
                    label="Select poster"
                    className="w-60 h-36 aspect-square object-cover rounded-md hover:bg-muted"
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
                <FormLabel>Video</FormLabel>
                <FormControl>
                  <Dropzone
                    {...field}
                    dropMessage="Drop file or click"
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
              <CardHeader className="p-2">
                <CardDescription className="flex items-center justify-between">
                  <span>Selected Video</span>
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
                        <p>Remove the video</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs pt-1 pl-2 pb-4 flex justify-between items-center overflow-auto ">
                <span>{form.watch("video")?.name}</span>
              </CardContent>
            </Card>
          )}
          <div className="flex flex-col gap-2 w-60">
            <Button type="submit" variant="default" disabled={busy}>
              {busy ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="secondary">
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All the form data will be removed, if you accidentally
                    clicked it, please click "Cancel" to avoid data loss.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    type="reset"
                    onClick={resetForm}
                  >
                    Reset
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
