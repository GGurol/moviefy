import { ColumnDef } from "@tanstack/react-table";
import ActorListColumnAction from "./ActorListColumnAction";
import { Actor } from "@/types/actor";

const BACKEND_URL = "http://localhost:8000";

export const columns: ColumnDef<Actor>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatar = row.getValue("avatar") as string;
      const imageUrl = avatar ? `${BACKEND_URL}${avatar}` : "/default-avatar.png";
      return (
        <div className="w-12 h-12">
          <img src={imageUrl} alt="Actor Avatar" className="w-full h-full object-cover rounded-full" />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="font-semibold">{row.getValue("name") as string}</p>,
  },
  {
    accessorKey: "about",
    header: "About",
    cell: ({ row }) => {
      const about = row.getValue("about") as string;
      if (about.length > 200) {
        return <p className="text-sm text-muted-foreground">{about.substring(0, 200)}...</p>;
      }
      return <p className="text-sm text-muted-foreground">{about}</p>;
    }
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <p className="capitalize">{row.getValue("gender") as string}</p>
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { onActionSuccess } = table.options.meta as any;
      return (
        <ActorListColumnAction 
          actor={row.original} 
          onActionSuccess={onActionSuccess}
        />
      );
    },
  },
];