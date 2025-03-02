import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import MovieListColumnAction from "./MovieListColumnAction";

export type Movie = {
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
    header: "Title",
    cell: ({ row }) => {
      const value = row.getValue("title");
      return <div className="capitalize">{value}</div>;
    },
  },
  {
    accessorKey: "genres",
    header: "Genres",
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
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status");
      return <div className="capitalize">{value}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <MovieListColumnAction />;
    },
  },
];
