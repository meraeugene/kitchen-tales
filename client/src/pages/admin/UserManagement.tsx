import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorResponse } from "../../types";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import useConfirmation from "../../hooks/useConfirmation";
import { IoEyeOutline } from "react-icons/io5";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";

const UserManagement = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const {
    data,
    isLoading,
    error: recipeError,
    refetch,
  } = useGetUsersQuery({ pageNumber });
  const { modal, open } = useConfirmation();

  console.log(data);

  const error = recipeError as ErrorResponse;

  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (user: any) => {
    const isConfirmed = await open(user.fullName);
    if (isConfirmed) {
      try {
        await deleteUser(user._id).unwrap();
        toast.success("User deleted");
        refetch();
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handlePageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="error" message={error?.data?.message || error.error} />
    );
  }

  const { users, pages } = data;

  return (
    <div className="p-8 lg:px-16 lg:py-12 xl:px-24">
      {modal}

      <h1 className="mb-4 font-cormorant text-3xl xl:text-4xl">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-green-700 text-white ">
            <tr>
              <th className=" px-4 py-2 text-left font-normal">Full Name</th>
              <th className=" px-4 py-2 text-left font-normal">Email</th>
              <th className=" px-4 py-2 text-left font-normal">Address</th>
              <th className=" px-4 py-2 text-left font-normal">Bio</th>
              <th className=" px-4 py-2 text-left font-normal">Role</th>
              <th className=" px-4 py-2 text-left font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id} className="border-t">
                <td className="whitespace-nowrap px-4 py-2">{user.fullName}</td>
                <td className="whitespace-nowrap px-4 py-2">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-2">{user.address}</td>
                <td className="whitespace-nowrap px-4 py-2">{user.aboutMe}</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <span
                    className={`inline-block border px-2 py-1 ${
                      user.isAdmin
                        ? "w-1/2 rounded-md  border-red-100 bg-red-100 text-red-600"
                        : "w-1/2 rounded-md border-blue-100 bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </td>

                <td className="flex items-center space-x-2 px-4 py-2">
                  <Link
                    to={`/recipe/about-creator/${user._id}`}
                    className="rounded-md border p-2 text-blue-600 transition-all ease-in-out hover:bg-blue-100"
                  >
                    <IoEyeOutline />
                  </Link>
                  <Link
                    to={`/admin/recipes/edit/${user._id}`}
                    className="rounded-md border p-2 text-green-600 transition-all ease-in-out hover:bg-blue-100"
                  >
                    <CiEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(user)}
                    className="rounded-md border p-2 text-red-600 transition-all ease-in-out hover:bg-red-100"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 md:justify-center">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="rounded bg-green-700 px-4 py-2 text-white transition-all ease-in-out hover:bg-green-800 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: pages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`text-green rounded border  border-green-700 px-4 py-2 transition-all  ease-in-out hover:bg-green-800 hover:text-white  ${
              pageNumber === index + 1 ? "bg-green-800 text-white" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === pages}
          className="rounded bg-green-700 px-4 py-2 text-white transition-all ease-in-out hover:bg-green-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
