// Define types for request parameters
interface FilterParams {
  cuisineType?: string;
  dietPreference?: string;
  mealType?: string;
  cookTime?: string;
}

// Helper function to build filter query based on request parameters
export const buildFilterQuery = (query: FilterParams) => {
  const filterQuery: {
    [key: string]:
      | string
      | { $lt?: number; $gte?: number; $lte?: number; $gt?: number };
  } = {};

  if (query.mealType) {
    filterQuery.mealType = query.mealType;
  }

  if (query.cuisineType) {
    filterQuery.cuisineType = query.cuisineType;
  }

  if (query.dietPreference) {
    filterQuery.dietPreference = query.dietPreference;
  }

  if (query.cookTime) {
    if (query.cookTime === "5 minutes below") {
      filterQuery["cookTime.minutes"] = {
        $lte: 5, // is equal to 5 minutes or below
      };
    } else if (query.cookTime === "6-10 minutes") {
      filterQuery["cookTime.minutes"] = {
        $gte: 6, // is equal to 6 minutes or above
        $lte: 10, // is equal to 10 minutes or below
      };
    } else if (query.cookTime === "15 minutes above") {
      filterQuery["cookTime.minutes"] = {
        $gte: 15, // is equal to 15 minutes or above
      };
    }
  }

  return filterQuery;
};
