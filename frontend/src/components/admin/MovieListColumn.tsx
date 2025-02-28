import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-3">
              <ExternalLink strokeWidth={0.9} size={20} />
              <span>Open</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <Pencil strokeWidth={0.9} size={20} />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3">
              <Trash2 strokeWidth={0.9} size={20} />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
