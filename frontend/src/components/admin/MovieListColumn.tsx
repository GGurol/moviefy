import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import MovieListColumnAction from "./MovieListColumnAction";
import i18n from "@/utils/i18n";

// This constant should ideally come from an environment variable
const BACKEND_URL = "http://localhost:8000";

export type Movie = {
  id: string; // Add id to the type for the action column
  poster: string;
  title: string;
  status: "public" | "private";
  genres: string[];
};

export const columns: ColumnDef<Movie>[] = [
  {
    accessorKey: "poster",
    header: "Poster", // Changed to a simple string
    cell: ({ row }) => {
      const value = row.getValue("poster") as string;
      // CORRECTED: Prepend the backend URL to the poster path
      const imageUrl = value ? `${BACKEND_URL}${value}` : "/placeholder.png"; // Added a fallback
      return (
        <div className="w-20 sm:w-28">
          <img src={imageUrl} alt="Poster image" className="w-full rounded" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title", // Changed to a simple string
    cell: ({ row }) => {
      // CORRECTED: Get the title directly from the row's data
      const title = row.getValue("title") as string;
      return (
        <div className="capitalize text-[10px] sm:text-xs lg:text-sm font-semibold">
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "genres",
    header: "Genres", // Changed to a simple string
    cell: ({ row }) => {
      const value = row.getValue("genres") as string[];
      // Added a check to prevent error if genres is not an array
      if (!Array.isArray(value)) return null; 
      
      const vl = value.map((e) => {
        return (
          <Badge
            key={e}
            className="text-[8px] rounded-sm max-sm:px-1 max-sm:py-0 max-sm:bg-muted-foreground sm:rounded-full  sm:text-xs"
          >
            {i18n.t(`genres.${e}`)}
          </Badge>
        );
      });
      return <div className="flex gap-[1px] sm:gap-1 flex-wrap ">{vl}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status", // Changed to a simple string
    enableHiding: true,
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      return (
        <div className="capitalize  text-xs lg:text-sm">{i18n.t(value)}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Pass the entire movie object to the action component
      return <MovieListColumnAction movie={row.original} />;
    },
  },
];