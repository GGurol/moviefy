import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
// import { useTheme } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Clapperboard,
  Moon,
  MoveIcon,
  PanelLeftClose,
  ShoppingBag,
  Sun,
  User2,
  Users,
} from "lucide-react";
import { useTheme } from "../ui/theme-provider";
import ThemeButton from "../ui/ThemeButton";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ActorForm from "../form/ActorForm";
import ActorUpload from "../modals/ActorUpload";
import MovieForm from "./MovieForm";
import { createMovie, uploadTrailer } from "@/api/movie";

export default function Header({ onAddActorClick, onAddMovieClick }) {
  // const [showOptions, setShowOptions] = useState(false);
  // // const { toggleTheme } = useTheme();
  // const { setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmitMovie = async (data) => {
    const { error, movie, message } = await createMovie(data);
    console.log("error:", error);
    console.log("movie:", movie);
    console.log("message", message);
  };

  // const options = [
  //   { title: "Add Movie", onClick: onAddMovieClick },
  //   { title: "Add Actor", onClick: onAddActorClick },
  // ];

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      return;
    }
    navigate("/search?title=" + search);
    setSearch("");
  };

  return (
    <div className="flex items-center justify-between relative p-5">
      {/* <AppSearchForm
        onSubmit={handleSearchSubmit}
        placeholder="Search Movies..."
      /> */}
      <div className=" flex gap-5 items-center">
        <SidebarTrigger />

        <form onSubmit={handleSubmit}>
          <Input
            name="search"
            value={search}
            onChange={handleChange}
            placeholder="Search movies..."
          />
        </form>
      </div>

      <div className="flex items-center space-x-3">
        {/* <button
          onClick={toggleTheme}
          className='dark:text-white text-light-subtle'
        >
          <BsFillSunFill size={24} />
        </button> */}
        <ThemeButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Create</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Dialog>
              <DialogTrigger>
                <DropdownMenuItem
                  className="gap-4"
                  // onClick={onAddMovieClick}
                  onSelect={(e) => e.preventDefault()}
                >
                  <Clapperboard size="20" />
                  <span>Create movies</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent
                className="w-[900px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Create Movie</DialogTitle>
                </DialogHeader>
                <MovieForm onSubmit={handleSubmitMovie} />
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className="gap-4" asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Users size="20" />
                  <span>Create actors</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent
                className="w-[500px]"
                onInteractOutside={(e) => {
                  e.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Create Actor</DialogTitle>
                  <DialogDescription>
                    Submit to create an actor, all fields are required.
                  </DialogDescription>
                </DialogHeader>
                <ActorUpload setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <button
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-2 dark:border-dark-subtle border-light-subtle dark:text-dark-subtle text-light-subtle    hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button> */}
        {/* <CreateOptions
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          options={options}
        /> */}
      </div>
    </div>
  );
}

// const CreateOptions = ({ options, visible, onClose }) => {
//   const container = useRef();
//   const containerID = "option-container";

//   useEffect(() => {
//     const handleClose = (e) => {
//       if (!visible) return;
//       const { parentElement, id } = e.target;
//       // console.log(parentElement, id);

//       if (parentElement.id === containerID || id === containerID) return;
//       container.current.classList.remove("animate-scale");
//       container.current.classList.add("animate-scale-reverse");
//     };

//     document.addEventListener("click", handleClose, true);
//     return () => document.removeEventListener("click", handleClose, true);
//   }, [visible]);

//   const handleAnimationEnd = (e) => {
//     if (e.target.classList.contains("animate-scale-reverse")) onClose();
//     e.target.classList.remove("animate-scale");
//   };

//   const handleClick = (fn) => {
//     fn();
//     onClose();
//   };

//   if (!visible) return null;
//   return (
//     <div
//       id={containerID}
//       ref={container}
//       className="absolute right-0 top-12 z-50 flex flex-col space-y-3 p-5 dark:bg-secondary drop-shadow-lg rounded animate-scale"
//       onAnimationEnd={handleAnimationEnd}
//     >
//       {options.map(({ title, onClick }) => {
//         return (
//           <Option key={title} onClick={() => handleClick(onClick)}>
//             {title}
//           </Option>
//         );
//       })}
//     </div>
//   );
// };

// const Option = ({ children, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className="dark:text-white text-secondary hover:opacity-80 transition"
//     >
//       {children}
//     </button>
//   );
// };
