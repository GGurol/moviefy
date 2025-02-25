import { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import TagsInput from "../TagsInput";
import Submit from "../form/Submit";
import { useNotification } from "../../hooks";
import WritersModal from "../modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
import Label from "../Label";
import DirectorSelector from "../DirectorSelector";
import WriterSelector from "../WriterSelector";
import { ViewAllBtn } from "../ViewAllButton";
import { LabelWithBadge } from "../LabelWithBadge";
import { validateMovie } from "../../utils/validator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { InputTags } from "../ui/InputTags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useActorStore from "@/store/actor";
import { useArray } from "@/store/array";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { MultiSelect } from "../ui/MultiSelect";

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
      <form className="flex space-x-3 ">
        <div className="w-[70%] flex gap-5">
          <div className="space-y-5">
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
          <div className="space-y-5">
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
                            "w-[240px] pl-3 text-left font-normal",
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
            {/* <GenresSelector
              badge={genres.length}
              onClick={displayGenresModal}
            /> */}
          </div>

          {/* <div>
            <Label htmlFor="storyLine">Story line</Label>
            <textarea
              id="storyLine"
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              className={commonInputClasses + " resize-none h-24 border-b-2"}
              placeholder="Movie story line..."
            ></textarea>
          </div> */}

          {/* <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div> */}

          {/* <DirectorSelector onSelect={updateDirector} /> */}

          {/* <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>
            <WriterSelector onSelect={updateWriters} />
          </div> */}

          {/* <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div> */}

          {/* <input
            type="date"
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
            onChange={handleChange}
            name="releseDate"
            value={releseDate}
          /> */}

          <Submit
            busy={busy}
            value={btnTitle}
            onClick={handleSubmit}
            type="button"
          />
        </div>
        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            accept="image/jpg, image/jpeg, image/png"
            label="Select poster"
          />
          {/* <GenresSelector badge={genres.length} onClick={displayGenresModal} /> */}
          {/* <Selector
            value={type}
            onChange={handleChange}
            name="type"
            options={typeOptions}
            label="Type"
          />
          <Selector
            value={language}
            onChange={handleChange}
            name="language"
            options={languageOptions}
            label="Language"
          />
          <Selector
            value={status}
            onChange={handleChange}
            name="status"
            options={statusOptions}
            label="Status"
          /> */}
        </div>
      </form>

      {/* <WritersModal
        onClose={hideWritersModal}
        profiles={writers}
        visible={showWritersModal}
        onRemoveClick={handleWriterRemove}
      /> */}
      {/* <CastModal
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
        onRemoveClick={handleCastRemove}
      /> */}
      {/* <GenresModal
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
        previousSelection={genres}
      /> */}
    </Form>
  );
}
