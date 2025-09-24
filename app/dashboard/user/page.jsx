//import { CreateUser } from "@/app/ui/user/button";
import TableUsersPage from "@/app/ui/user/table-users";

const page = ({
  searchParams = {
    query: "",
    page: "1",
    limit: "10",
    sort: "name",
    order: "asc",
  },
}) => {
  const query = searchParams?.query?.toString() || "";
  // TODO: revisar si es necesario este parámetro, sino para eliminar
  //const page = searchParams?.page?.toString() || "1";
  return (
    <div className="w-full">
      <TableUsersPage query={query} />
    </div>
  );
};
export default page;
