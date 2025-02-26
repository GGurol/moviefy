import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Delete,
  DeleteIcon,
  FileCheck2Icon,
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
import { Button } from "../ui/button";
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

const formSchema = z.object({
  title: z.string().min(2).max(50),
  storyLine: z.string().min(2).max(200),
  tags: z.array(z.string()),
  director: z.string(),
  writer: z.string(),
  cast: z.array(z.string()),
  releaseDate: z.date(),
  file: z.any(),
});

export default function MovieForm({ onSubmit, busy, initialState, btnTitle }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");

  const { updateNotification } = useNotification();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      storyLine: "",
      tags: [],
      director: "",
      writer: "",
      cast: [],
      file: null,
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification("error", error);

    const { tags, genres, cast, writers, director, poster } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,
    };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    // cast: [
    //   {
    //     actor: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor' },
    //     roleAs: String,
    //     leadActor: Boolean,
    //   },
    // ],

    // console.log(cast);
    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((c) => c.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    if (director.id) finalMovieInfo.director = director.id;

    if (poster) finalMovieInfo.poster = poster;

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

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
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

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };

  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is already selected!"
        );
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };
  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    const newWriters = writers.filter(({ id }) => id !== profileId);
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        poster: null,
        releseDate: initialState.releseDate.split("T")[0],
      });
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState]);
  const [values, setValues] = useState<string[]>([]);

  // const leaderActors = useActorStore((state) => state.leaderActors);
  // console.log(leaderActors);

  const [uniqValues, setUniqValues] = useState([]);

  const handleUniqValuesChange = (newValues) => {
    setUniqValues(newValues);
  };
  console.log(uniqValues);
  const [files, setFiles] = useState<string[]>([]);

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = ["video/mp4", "video/mpeg"];
      const fileType = allowedTypes.find(
        (type) => type === acceptedFiles[0].type
      );
      if (!fileType) {
        form.setValue("file", null);
        form.setError("file", {
          message: "File type is not valid",
          type: "typeError",
        });
      } else {
        form.setValue("file", acceptedFiles[0]);
        form.clearErrors("file");
      }
    } else {
      form.setValue("file", null);
      form.setError("file", {
        message: "File is required",
        type: "typeError",
      });
    }
  }

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
      <form className="flex gap-10">
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
                {/* <FormDescription>Please enter movie title</FormDescription> */}
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
                {/* <FormDescription>
                    Please enter movie story line
                  </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tags"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Movie Tags</FormLabel>
                <FormControl>
                  {/* <TagsInput value={tags} name="tags" onChange={updateTags} /> */}
                  {/* <Input {...field} /> */}
                  <InputTags
                    value={values}
                    onChange={(values) => {
                      setValues(values);
                      field.value = values;
                    }}
                    placeholder="Enter values, comma separated"
                  />
                </FormControl>
                {/* <FormDescription>
                    Please enter movie tags, separate by comma
                  </FormDescription> */}
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
                  <DirectorSelector updateDirector={updateDirector} />
                </FormControl>
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
                  <WriterSelector updateWriter={updateWriter} />
                </FormControl>
              </FormItem>
            )}
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
                    onUniqValuesChange={handleUniqValuesChange}
                    uniqValues={uniqValues}
                    setUniqValues={setUniqValues}
                  />
                </FormControl>
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languageOptions.map((e) => (
                      <SelectItem value={e.value}>{e.title}</SelectItem>
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((e) => (
                      <SelectItem value={e.value}>{e.title}</SelectItem>
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-muted">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {typeOptions.map((e) => (
                      <SelectItem value={e.value}>{e.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <MultiSelect />
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
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Video</FormLabel>
                <FormControl>
                  <Dropzone
                    {...field}
                    dropMessage="Drop file or click"
                    handleOnDrop={handleOnDrop}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("file") && (
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
                          onClick={() => form.setValue("file", null)}
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
                <span>{form.watch("file")?.name}</span>
              </CardContent>
            </Card>
          )}
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="default"
            className="w-60"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
