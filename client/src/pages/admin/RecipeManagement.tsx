import {
  useGetRecipesQuery,
  useDeleteRecipeMutation,
} from "../../slices/recipesApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ErrorResponse, Recipe } from "../../types";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import useConfirmation from "../../hooks/useConfirmation";
import { IoEyeOutline } from "react-icons/io5";

const RecipeManagement = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const {
    data,
    isLoading,
    error: recipeError,
    refetch,
  } = useGetRecipesQuery({ pageNumber });
  const { modal, open } = useConfirmation();

  const error = recipeError as ErrorResponse;

  const [deleteRecipe] = useDeleteRecipeMutation();

  const handleDelete = async (recipe: Recipe) => {
    const isConfirmed = await open(recipe.recipeTitle);
    if (isConfirmed) {
      try {
        await deleteRecipe(recipe._id).unwrap();
        toast.success("Recipe deleted");
        refetch();
      } catch (err) {
        toast.error("Failed to delete recipe");
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

  const { recipes, pages } = data;

  return (
    <div className="p-8 lg:px-16 lg:py-12 xl:px-24">
      {modal}

      <h1 className="mb-4 font-cormorant text-3xl xl:text-4xl">
        Manage Recipes
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-green-700 text-white ">
            <tr>
              <th className=" px-4 py-2 text-left font-normal">Recipe Title</th>
              <th className="px-4 py-2 text-left font-normal">Cuisine Type</th>
              <th className="px-4 py-2 text-left font-normal">Date Created</th>
              <th className="px-4 py-2 text-left font-normal">Created By</th>
              <th className="px-4 py-2 text-left font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe: Recipe) => (
              <tr key={recipe._id} className="border-t">
                <td className="whitespace-nowrap px-4 py-2">
                  {recipe.recipeTitle}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {recipe.cuisineType}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {new Date(recipe.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </td>
                <td className="whitespace-nowrap px-4 py-2">
                  {recipe.user.fullName}
                </td>
                <td className="flex items-center space-x-2 px-4 py-2">
                  <Link
                    to={`/recipe?id=${recipe._id}&recipeTitle=${recipe.recipeTitle}`}
                    className="rounded-md border p-2 text-blue-600 transition-all ease-in-out hover:bg-blue-100"
                  >
                    <IoEyeOutline />
                  </Link>
                  <Link
                    to={`/admin/recipes/edit/${recipe._id}`}
                    className="rounded-md border p-2 text-green-600 transition-all ease-in-out hover:bg-blue-100"
                  >
                    <CiEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe)}
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

export default RecipeManagement;
