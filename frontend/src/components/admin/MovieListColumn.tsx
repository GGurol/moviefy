import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import MovieListColumnAction from "./MovieListColumnAction";
import i18n from "@/utils/i18n";

const BACKEND_URL = "http://localhost:8000";

export type Movie = {
  id: string;
  poster: string;
  title: string;
  status: "public" | "private";
  genres: string[];
};

export const columns: ColumnDef<Movie>[] = [
  {
    accessorKey: "poster",
    header: "Poster",
    cell: ({ row }) => {
      const value = row.getValue("poster") as string;
      const imageUrl = value ? `${BACKEND_URL}${value}` : "/placeholder.png";
      return (
        <div className="w-20 sm:w-28">
          <img src={imageUrl} alt="Poster image" className="w-full rounded" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
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
    header: "Genres",
    cell: ({ row }) => {
      const value = row.getValue("genres") as string[];
      if (!Array.isArray(value)) return null; 
      const vl = value.map((e) => (
        <Badge key={e} className="text-[8px] rounded-sm max-sm:px-1 max-sm:py-0">
          {i18n.t(`genres.${e}`)}
        </Badge>
      ));
      return <div className="flex gap-[1px] sm:gap-1 flex-wrap ">{vl}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      return (
        <div className="capitalize text-xs lg:text-sm">{i18n.t(value)}</div>
      );
    },
  },
  {
    id: "actions",
    // --- CORRECTED: The cell now gets the 'table' instance to access meta properties ---
    cell: ({ row, table }) => {
      // Get the refresh functions passed down from the parent (Movies.tsx)
      const { onDeleteSuccess, onUpdateSuccess } = table.options.meta as any;

      return (
        <MovieListColumnAction 
          movie={row.original} 
          onDeleteSuccess={onDeleteSuccess}
          onUpdateSuccess={onUpdateSuccess}
        />
      );
    },
  },
];