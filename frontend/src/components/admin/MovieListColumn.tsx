import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import MovieListColumnAction from "./MovieListColumnAction";
import i18n from "@/utils/i18n";

export type Movie = {
  poster: string;
  title: string;
  status: "public" | "private";
  genres: string[];
};

export const columns: ColumnDef<Movie>[] = [
  {
    accessorKey: "poster",
    header: "TablePoster",
    cell: ({ row }) => {
      const value = row.getValue("poster");
      return (
        <div className="w-28">
          <img src={value} alt="Poster image" className="w-full rounded" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "TableTitle",
    cell: ({ row }) => {
      const value = row.getValue("title");
      return <div className="capitalize">{value}</div>;
    },
  },
  {
    accessorKey: "genres",
    header: "TableGenres",
    cell: ({ row }) => {
      const value = row.getValue("genres");
      const vl = value.map((e) => {
        return (
          <Badge key={e} className="">
            {e}
          </Badge>
        );
      });
      return <div className="flex gap-1">{vl}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "TableStatus",
    cell: ({ row }) => {
      const value = row.getValue("status");
      return <div className="capitalize">{value}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <MovieListColumnAction movieId={row.original.id} />;
    },
  },
];
