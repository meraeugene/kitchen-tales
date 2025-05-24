import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useGetRecipeDetailsQuery,
  useUpdateRecipeMutation,
} from "../../slices/recipesApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { Recipe } from "../../types";

const cuisineOptions = [
  "Italian",
  "Mexican",
  "Indian",
  "Chinese",
  "French",
  "American",
  "Thai",
];

const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetRecipeDetailsQuery(id!);
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();

  const [formData, setFormData] = useState<Partial<Recipe>>({});
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (data) {
      setFormData(data);
      setPreviewImage(data.mainImage || "");
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => ({ ...prev, mainImage: base64 }));
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateRecipe({ id, ...formData }).unwrap();
      toast.success("Recipe updated successfully");
      navigate("/admin/recipe-management");
    } catch (err) {
      toast.error("Failed to update recipe");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="error" message="Failed to load recipe" />;

  return (
    <div className="p-8 lg:px-16 lg:py-12 xl:px-24">
      <h1 className="mb-6 text-3xl font-bold">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-6">
        {/* Recipe Title */}
        <div>
          <label htmlFor="recipeTitle" className="mb-1 block font-semibold">
            Recipe Title
          </label>
          <input
            id="recipeTitle"
            name="recipeTitle"
            type="text"
            value={formData.recipeTitle || ""}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1 block font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="w-full rounded border p-2"
            rows={4}
            required
          />
        </div>

        {/* Servings */}
        <div>
          <label htmlFor="servings" className="mb-1 block font-semibold">
            Servings
          </label>
          <input
            id="servings"
            name="servings"
            type="number"
            value={formData.servings || ""}
            onChange={handleChange}
            className="w-full rounded border p-2"
            min={1}
          />
        </div>

        {/* Cuisine Type */}
        <div>
          <label htmlFor="cuisineType" className="mb-1 block font-semibold">
            Cuisine Type
          </label>
          <select
            id="cuisineType"
            name="cuisineType"
            value={formData.cuisineType || ""}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          >
            <option value="">Select Cuisine</option>
            {cuisineOptions.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Video Link */}
        <div>
          <label htmlFor="videoLink" className="mb-1 block font-semibold">
            Video Link (optional)
          </label>
          <input
            id="videoLink"
            name="videoLink"
            type="url"
            value={formData.videoLink || ""}
            onChange={handleChange}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="mb-1 block font-semibold">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags?.join(", ") || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((tag) => tag.trim()),
              }))
            }
            className="w-full rounded border p-2"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="mainImage" className="mb-1 block font-semibold">
            Main Image
          </label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mb-2 h-40 w-auto rounded border"
            />
          )}
          <input
            id="mainImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="mt-3 h-[45px] rounded-md bg-[#2E5834] px-4 text-white"
        >
          {isUpdating ? (
            <div className="flex items-center gap-3">
              <l-dot-pulse size="38" speed="1.3" color="white"></l-dot-pulse>
              <span>Updating</span>
            </div>
          ) : (
            "Update Recipe"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditRecipePage;
