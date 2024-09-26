import { useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { TagsInput } from "react-tag-input-component";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useUploadSingleImageMutation } from "../../slices/uploadsApiSlice";
import { ErrorResponse, Recipe } from "../../types";
import { useCreateRecipeMutation } from "../../slices/recipesApiSlice";
import { getOrdinal } from "../../utils/getOrdinal";

const AddRecipe = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Recipe>();

  // RECIPE INGREDIENTS LOGIC
  const [ingredients, setIngredients] = useState([
    { quantity: "", measurement: "", item: "" },
  ]);

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { quantity: "", measurement: "", item: "" },
    ]);
  };

  const handleDeleteIngredient = (index: number) => {
    // Do not delete if there's only one ingredient
    if (ingredients.length === 1) {
      return;
    }
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // RECIPE TAGS STATE
  const [tags, setTags] = useState(["Newest Recipe"]);

  // RECIPE MAIN IMAGE LOGIC
  const [mainImage, setMainImage] = useState<string>("");
  const [mainImageError, setMainImageError] = useState<string | null>("");
  const [isUploadingMainImage, setIsUploadingMainImage] =
    useState<boolean>(false);

  const [uploadProductImage] = useUploadSingleImageMutation({});

  const uploadMainImageHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        setIsUploadingMainImage(true);
        const response = await uploadProductImage(formData).unwrap();

        toast.success(response.message);

        // actual image from server
        setMainImage(response.image);
        setMainImageError(null);
      } catch (error) {
        console.log(error);

        const errorMessage =
          (error as ErrorResponse)?.data?.error ||
          (error as ErrorResponse)?.data?.message ||
          "An unknown error occurred.";

        toast.error(errorMessage);
      } finally {
        setIsUploadingMainImage(false);
      }
    }
  };

  // RECIPE STEPS  LOGIC
  const [steps, setSteps] = useState([{ step: "", image: "" }]);
  //creates a new array with a length equal to the number of elements in the steps array, and fills it with false values. It's a way to initialize an array of boolean values with each element set to false.
  const [stepLoading, setStepLoading] = useState(
    Array(steps.length).fill(false),
  );

  const handleAddStep = () => {
    setSteps((prevSteps) => [...prevSteps, { step: "", image: "" }]);
  };

  const handleDeleteStep = (index: number) => {
    // Do not delete if there's only one step
    if (steps.length === 1) {
      return;
    }
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps.splice(index, 1);
      return newSteps;
    });
  };

  const uploadStepsImageHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      try {
        const formData = new FormData();
        formData.append("image", selectedFile);

        // Set loading status for this step index
        //  A new array newLoading is created by spreading the prevLoading array. This ensures that we're not mutating the previous state directly, which is important in React to maintain immutability. Then, the loading state of the step at the specified index is set to true in the newLoading array.
        setStepLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = true;
          return newLoading;
        });

        const response = await uploadProductImage(formData).unwrap();

        setSteps((prevSteps) => {
          // Update the steps state by creating a new array based on the previous steps array.
          const updatedSteps = [...prevSteps];

          // Update the image of the last step by replacing the previous step object with a new object that includes the previous step properties and the new image URL obtained from the response.
          updatedSteps[index] = {
            ...updatedSteps[index],
            image: response.image,
          };

          // Return the updatedSteps array, which will replace the previous steps array in the state.
          return updatedSteps;
        });

        toast.success(response.message);
      } catch (error) {
        const errorMessage =
          (error as ErrorResponse)?.data?.error ||
          (error as ErrorResponse)?.data?.message ||
          "An unknown error occurred.";

        toast.error(errorMessage);
      } finally {
        // Reset loading status for this step index
        setStepLoading((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;
          return newLoading;
        });
      }
    }
  };

  // RECIPE SUBMIT LOGIC

  const [createRecipe] = useCreateRecipeMutation();

  const onSubmit: SubmitHandler<Recipe> = async (data) => {
    try {
      if (!mainImage) {
        toast.error("Main image is required.");
        setMainImageError("Required");
        return;
      }

      data.mainImage = mainImage;
      data.tags = tags;

      // Map steps to match the expected structure with both step and image properties
      data.instructions = steps.map((step, index) => ({
        step: data.instructions[index]?.step, // Access step value from form data
        image: step.image, //  step.image contains the image URL
      }));

      const response = await createRecipe(data).unwrap();
      toast.success(response.message);
      reset();
      setMainImage("");
      setSteps([{ step: "", image: "" }]);
    } catch (error) {
      console.log(error);

      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-8 lg:px-16 lg:py-8 xl:px-24">
      <div className="header mb-8 flex flex-col gap-4 border-b-[2px] border-gray-200 pb-10">
        <h1 className="text-center font-cormorant text-4xl font-medium">
          Add a Recipe
        </h1>
        <p className="text-center text-sm md:text-lg">
          Feeling like a kitchen Picasso? We want to see your masterpiece! Add
          your recipe and show off your culinary creativity.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="main-image__container">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-medium">
              Main Image <span className="text-red-500">*</span>
            </h3>
            {mainImageError && (
              <div className="text-red-500">({mainImageError})</div>
            )}
          </div>
          <div
            className={`${
              mainImageError
                ? "border-[2px] border-solid border-red-500"
                : "border-dotted"
            } main-image__container relative mt-4 flex h-[560px] w-full items-center justify-center rounded-md border-[2px] border-gray-200 `}
          >
            <input
              type="file"
              name="image"
              id="mainImage"
              accept="image/*"
              className="hidden"
              onChange={uploadMainImageHandler}
            />

            <div className="relative h-[560px] w-full">
              {mainImage &&
                (isUploadingMainImage ? null : (
                  <img
                    src={mainImage}
                    alt="Preview"
                    className="h-full w-full rounded-md object-cover"
                  />
                ))}

              <label
                htmlFor="mainImage"
                className="2xl:w-10%] absolute left-1/2 top-1/2 flex h-[45px] w-[55%] -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2E5834] px-4 text-white md:w-[25%] lg:w-[20%] xl:w-[15%] "
              >
                {isUploadingMainImage ? (
                  <>
                    <l-tailspin
                      size="25"
                      stroke="3.5"
                      speed="1"
                      color="white"
                    ></l-tailspin>
                    <h1>Uploading Image</h1>
                  </>
                ) : mainImage ? (
                  <>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="15"
                        cy="15"
                        r="14"
                        fill="#2E5834"
                        stroke="#EEEEEE"
                        strokeWidth="2"
                      />
                      <path
                        d="M15.0004 9.12891V20.868M9.13086 14.9985H20.87"
                        stroke="#EEEEEE"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Replace Image</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="15"
                        cy="15"
                        r="14"
                        fill="#2E5834"
                        stroke="#EEEEEE"
                        strokeWidth="2"
                      />
                      <path
                        d="M15.0004 9.12891V20.868M9.13086 14.9985H20.87"
                        stroke="#EEEEEE"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Add a photo</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <label htmlFor="recipeTitle">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-medium">
              Recipe Title <span className="text-red-500">*</span>
            </h3>
            {errors.recipeTitle && (
              <div className=" text-red-500">
                ({errors.recipeTitle.message})
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Enter your recipe title"
            className={`${errors.recipeTitle ? "border-[2px] border-red-500" : ""} mt-4 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f] lg:w-1/2 2xl:w-1/3`}
            {...register("recipeTitle", {
              required: "Required",
            })}
          />
        </label>

        <label htmlFor="description">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-medium">
              Description <span className="text-red-500">*</span>
            </h3>
            {errors.description && (
              <div className=" text-red-500">
                ({errors.description.message})
              </div>
            )}
          </div>
          <textarea
            id="description"
            className={`${errors.description ? "border-[2px] border-red-500" : ""} mt-4 w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f] lg:w-1/2 2xl:w-1/3`}
            rows={7}
            placeholder="Describe your recipe in a way that makes mouths water."
            {...register("description", {
              required: "Required",
            })}
          ></textarea>
        </label>

        <label
          htmlFor="videoLink"
          className="border-b-[2px] border-gray-200 pb-10 lg:w-1/2 2xl:w-1/3"
        >
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-medium">
              Youtube Video Link <span className="text-red-500">*</span>
            </h3>
            {errors.videoLink && (
              <div className=" text-red-500">({errors.videoLink.message})</div>
            )}
          </div>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=YT8oN4U7Vm8"
            className={`${errors.videoLink ? "border-[2px] border-red-500" : ""} mt-4 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f] `}
            {...register("videoLink", {
              required: "Required",
              pattern: {
                value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                message: "Please provide a valid youtube link. ",
              },
            })}
          />
        </label>

        <div className="servings-cooktime-preptime-totaltime__container flex  flex-col gap-6  ">
          <label htmlFor="servings" className="flex flex-col  gap-4">
            <div className="flex basis-1/2 items-center gap-4">
              <h3 className=" text-xl font-medium">
                Servings <span className="text-red-500">*</span>
              </h3>
              {errors.servings && (
                <div className=" text-red-500">({errors.servings.message})</div>
              )}
            </div>
            <div className="w-full basis-1/2">
              <input
                type="text"
                placeholder="e.g 4"
                className={`${errors.servings ? "border-[2px] border-red-500" : ""} w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f] lg:w-1/2 2xl:w-1/3`}
                {...register("servings", {
                  required: "Required",
                })}
              />
            </div>
          </label>

          <label
            htmlFor="preparataionTime"
            className="flex flex-col  gap-4 lg:w-1/2 2xl:w-1/3"
          >
            <div className="flex basis-1/2 items-center gap-3">
              <h3 className="text-xl font-medium">Preparation Time</h3>
              <span className="text-xs text-gray-500">(optional)</span>
            </div>

            <div className="flex basis-1/2 gap-4">
              <input
                type="text"
                placeholder="hours"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]"
                {...register("preparationTime.hours")}
              />

              <input
                type="text"
                placeholder="minutes"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]"
                {...register("preparationTime.minutes")}
              />
            </div>
          </label>

          <label
            htmlFor="cookTime"
            className="flex flex-col gap-4  lg:w-1/2 2xl:w-1/3"
          >
            <div className="flex basis-1/2 items-center gap-3">
              <h3 className="text-xl font-medium">Cook Time</h3>
              <span className="text-xs text-gray-500">(optional)</span>
            </div>

            <div className="flex basis-1/2 gap-4">
              <input
                type="text"
                placeholder="hours"
                className=" w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]"
                {...register("cookTime.hours")}
              />
              <input
                type="text"
                placeholder="minutes"
                className=" w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]"
                {...register("cookTime.minutes")}
              />
            </div>
          </label>

          <label
            htmlFor="totalTime"
            className="flex flex-col  gap-4 lg:w-1/2 2xl:w-1/3"
          >
            <div className="flex basis-1/2 items-center gap-3">
              <h3 className="text-xl font-medium">Total Time</h3>
              <span className="text-xs text-gray-500">(optional)</span>
            </div>

            <div className="flex basis-1/2 gap-4">
              <input
                type="text"
                placeholder="hours"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]"
                {...register("totalTime.hours")}
              />
              <input
                type="text"
                placeholder="minutes"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]"
                {...register("totalTime.minutes")}
              />
            </div>
          </label>
        </div>

        <div className="ingredients__container mt-4 border-y-[2px] border-gray-200 pb-11 pt-8 lg:w-1/2 2xl:w-1/3">
          <h3 className="text-xl font-medium">
            Ingredients <span className="text-red-500">*</span>
          </h3>
          <p className="mb-8 mt-4 w-[95%] text-base lg:text-lg">
            List one ingredient per line, specifying quantities (1, 2),
            measurements (cups, spoons), and any prep details (chopped, sifted)
            along with the item. Let your creativity flow in every detail!
          </p>
          {ingredients.map((ingredient, index) => (
            <div
              key={`${ingredient}-${index + 1}`}
              className="mt-6 flex w-full flex-col gap-6  "
            >
              <div className="flex items-center justify-between">
                <h1 className=" text-base- font-medium">
                  {getOrdinal(index + 1)} Ingredient
                </h1>

                <div>
                  <button
                    onClick={() => handleDeleteIngredient(index)}
                    type="button"
                  >
                    <TiDeleteOutline size={28} color="#CD5C5C" />
                  </button>
                </div>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Quantity"
                  className="w-full basis-[15%]  rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]"
                  {...register(`ingredients.${index}.quantity`)}
                />
              </div>

              <div className="w-full">
                <select
                  id="measurement"
                  className={`${errors.ingredients?.[index]?.measurement ? "border-[2px] border-red-500" : ""} w-full basis-[35%] rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]`}
                  {...register(`ingredients.${index}.measurement`, {
                    required: "Measurement is required",
                  })}
                >
                  <option value="" hidden>
                    Select Measurement
                  </option>
                  <option value="cup">Cloves</option>
                  <option value="cup">Cup (c)</option>
                  <option value="dozen">Dozen</option>
                  <option value="drop">Drop</option>
                  <option value="fluid_ounce">Fluid Ounce (fl oz)</option>
                  <option value="gallon">Gallon (gal)</option>
                  <option value="gram">Gram (g)</option>
                  <option value="kilogram">Kilogram (kg)</option>
                  <option value="liter">Liter (l)</option>
                  <option value="milliliter">Milliliter (ml)</option>
                  <option value="ounce">Ounce (oz)</option>
                  <option value="piece">Pieces</option>
                  <option value="pinch">Pinch</option>
                  <option value="pound">Pound (lb)</option>
                  <option value="quart">Quart (qt)</option>
                  <option value="slice">Slice</option>
                  <option value="tablespoon">Tablespoon (tbsp)</option>
                  <option value="teaspoon">Teaspoon (tsp)</option>
                </select>
              </div>

              <div className="flex w-full items-center gap-8">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Item"
                    className={`${errors.ingredients?.[index]?.item ? "border-[2px] border-red-500" : ""} w-full basis-[50%] rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]`}
                    {...register(`ingredients.${index}.item`, {
                      required: "Item is required",
                    })}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="mt-8 h-[45px] rounded-full bg-[#2E5834] px-4 text-base text-white"
            onClick={handleAddIngredient}
            type="button"
          >
            + Add Ingredient
          </button>
        </div>

        <div className="instructions__container  border-b-[2px] border-gray-200 pb-10 ">
          <h3 className="text-xl font-medium">
            Instructions <span className="text-red-500">*</span>
          </h3>
          <p className=" mt-4 w-[95%] text-lg">
            Break down your recipe into clear, step-by-step instructions.
          </p>
          {steps.map((step, index) => (
            <div className="my-8" key={index}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <h1 className=" text-lg font-medium">Step {index + 1}</h1>
                  <span className="text-sm text-gray-500">
                    (Image is optional)
                  </span>
                </div>

                <button onClick={() => handleDeleteStep(index)} type="button">
                  <TiDeleteOutline size={28} color="#CD5C5C" />
                </button>
              </div>

              <div className=" flex flex-col gap-6   md:flex-row">
                <div className=" flex h-full  basis-[50%]   items-center justify-center rounded-md border-[2px] border-dotted border-gray-200">
                  <input
                    type="file"
                    name="image"
                    id={`step-${index + 1}`}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadStepsImageHandler(e, index)}
                  />

                  <div className="relative h-[300px] w-full">
                    {step.image &&
                      (stepLoading[index] ? null : (
                        <img
                          src={step.image}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ))}

                    <label
                      htmlFor={`step-${index + 1}`}
                      className="absolute left-1/2 top-1/2 flex h-[45px] w-[60%] -translate-x-1/2  -translate-y-1/2  transform cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2E5834]  px-4 text-white md:w-[50%] lg:w-[40%] xl:w-[30%] "
                    >
                      {stepLoading[index] ? ( // Check loading status for this step index
                        <>
                          <l-tailspin
                            size="25"
                            stroke="3.5"
                            speed="1"
                            color="white"
                          ></l-tailspin>
                          <h1>Uploading Image</h1>
                        </>
                      ) : step.image ? (
                        <>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="15"
                              cy="15"
                              r="14"
                              fill="#2E5834"
                              stroke="#EEEEEE"
                              strokeWidth="2"
                            />
                            <path
                              d="M15.0004 9.12891V20.868M9.13086 14.9985H20.87"
                              stroke="#EEEEEE"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>Replace Image</span>
                        </>
                      ) : (
                        <>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="15"
                              cy="15"
                              r="14"
                              fill="#2E5834"
                              stroke="#EEEEEE"
                              strokeWidth="2"
                            />
                            <path
                              d="M15.0004 9.12891V20.868M9.13086 14.9985H20.87"
                              stroke="#EEEEEE"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>Add a photo</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <div className=" basis-[50%] ">
                  <textarea
                    {...register(`instructions.${index}.step`, {
                      required: `Step ${index + 1} is required`,
                    })}
                    id={`step-${index + 1}`}
                    className={`${errors.instructions?.[index]?.step ? "border-[2px] border-red-500" : ""} h-full w-full resize-none rounded-md border  border-gray-200 bg-gray-50   p-3 font-normal outline-[#448c4f]`}
                    rows={7}
                    placeholder={`Describe what to do in step ${index + 1} ...`}
                  ></textarea>
                  {errors.instructions?.[index]?.step && (
                    <div className="mt-2 text-red-500">
                      {errors.instructions?.[index]?.step?.message ??
                        "Step is required"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            className="h-[45px] rounded-full bg-[#2E5834] px-4 text-base text-white"
            onClick={handleAddStep}
            type="button"
          >
            + Add Step
          </button>
        </div>

        <label
          htmlFor="cookTips"
          className="border-b-[2px] border-gray-200 pb-10"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-medium">Cook's Tips</h3>
            <span className="text-xs text-gray-500">(optional)</span>
          </div>

          <textarea
            {...register(`cooksTips`)}
            id="cooksTips"
            className="mt-4 w-full resize-none rounded-md border  border-gray-200 bg-gray-50   p-3 font-normal outline-[#448c4f] lg:w-1/2 "
            rows={7}
            placeholder="Share your kitchen secrets! Oven hacks, swaps, or any tips for ultimate recipe success."
          ></textarea>
        </label>

        <div className=" flex flex-col justify-between gap-10 md:flex-row md:gap-4 lg:flex-row">
          <label htmlFor="cusineType" className="basis-[35%]">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-medium">
                Cuisine Type <span className="text-red-500">*</span>
              </h3>
              {errors.cuisineType && (
                <div className="mt-2 text-red-500">
                  ({errors.cuisineType.message})
                </div>
              )}
            </div>

            <select
              id="cuisineType"
              className={`${errors.cuisineType ? "border-[2px] border-red-500" : ""} mt-4 w-full rounded-md  border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]`}
              {...register(`cuisineType`, {
                required: "Required",
              })}
            >
              <option value="" hidden>
                Select Cuisine Type
              </option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="Indian">Indian</option>
              <option value="Asian">Asian</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Middle Eastern">Middle Eastern</option>
              <option value="African">African</option>
              <option value="French">French</option>
            </select>
          </label>

          <label htmlFor="mealType" className="basis-[35%]">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-medium">
                Meal Type <span className="text-red-500">*</span>
              </h3>
              {errors.mealType && (
                <div className="mt-2 text-red-500">
                  ({errors.mealType.message})
                </div>
              )}
            </div>

            <select
              id="mealType"
              className={`${errors.mealType ? "border-[2px] border-red-500" : ""} mt-4 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]`}
              {...register(`mealType`, {
                required: "Required",
              })}
            >
              <option value="" hidden>
                Select Meal Type
              </option>
              <option value="Breakfast">Breakfast</option>
              <option value="Brunch">Brunch</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snacks">Snacks</option>
              <option value="Desserts">Desserts</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Side Dish">Side Dish</option>
              <option value="Salad">Salad</option>
              <option value="Soup">Soup</option>
              <option value="Main Course">Main Course</option>
              <option value="Beverage">Beverage</option>
            </select>
          </label>

          <label htmlFor="dietPreference" className="basis-[35%]">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-medium">
                Diet Preference <span className="text-red-500">*</span>
              </h3>
              {errors.dietPreference && (
                <div className="mt-2 text-red-500">
                  ({errors.dietPreference.message})
                </div>
              )}
            </div>

            <select
              id="dietPreference"
              className={`${errors.dietPreference ? "border-[2px] border-red-500" : ""} mt-4 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-4 outline-[#448c4f]`}
              {...register(`dietPreference`, {
                required: "Required",
              })}
            >
              <option value="" hidden>
                Select Diet Preference
              </option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="Paleo">Paleo</option>
              <option value="Low Carb">Low Carb</option>
              <option value="High Protein">High Protein</option>
            </select>
          </label>
        </div>

        <label htmlFor="tags">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-medium">Tags</h3>
            <span className="text-xs text-gray-500">(optional)</span>
          </div>

          <div className="mt-4">
            <TagsInput
              value={tags}
              onChange={setTags}
              name="tags"
              placeHolder="Input tags here, and press Enter to submit"
              classNames={{ input: "rti--container" }}
            />
          </div>
        </label>

        <div className="flex items-center gap-4  border-b-[2px] border-gray-200 pb-10">
          <button className="h-[45px] rounded-full border border-[#2E5834] px-6">
            Cancel{" "}
          </button>
          <button
            className="h-[45px] rounded-full bg-[#2E5834] px-5 text-white"
            disabled={isSubmitting || isUploadingMainImage}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-4">
                <l-dot-pulse size="38" speed="1.3" color="white"></l-dot-pulse>
                <span>Submitting Recipe</span>
              </div>
            ) : (
              <span>Submit Recipe</span>
            )}
          </button>
        </div>

        <p className="mb-8 text-sm">
          If you've come across this recipe in a magazine, cookbook, or on
          another website, we're unable to publish it here. Our platform thrives
          on originality, and published recipes must adhere to our Terms of
          Service. Let's keep the kitchen creativity flowing with your unique
          recipes.
        </p>
      </form>
    </div>
  );
};

export default AddRecipe;
