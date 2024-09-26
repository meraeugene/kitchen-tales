export interface Recipe {
  _id: string;
  recipeTitle: string;
  mainImage: string;
  description: string;
  user: {
    fullName: string;
    _id: string;
    email: string;
  };
  servings: number;
  preparationTime: Time;
  cookTime: Time;
  totalTime: Time;
  ingredients: Ingredient[];
  videoLink: string;
  instructions: Instruction[];
  cooksTips?: string[];
  tags: string[];
  cuisineType: string;
  dietPreference: string;
  mealType: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
  bookmarks: string[];
}

export interface Review {
  user: string;
  fullName: string;
  email: string;
  rating: number;
  comment: string;
  image?: string;
  _id: string;
  createdAt: string;
  replies: {
    _id: string;
    image: string;
    user: string;
    comment: string;
    createdAt: string;
    fullName: string;
    likes: string[];
    dislikes: string[];
  }[];
  likes: string[];
  dislikes: string[];
}

export interface Reply {
  _id: string;
  image: string;
  user: string;
  comment: string;
  createdAt: string;
  fullName: string;
  parentReplyId?: string | null; // Optional, for nested replies
  replies?: Reply[]; // Allow nested replies
  likes: string[];
  dislikes: string[];
}

export interface Time {
  hours?: number;
  minutes?: number;
}

export interface Instruction {
  _id?: string;
  step: string;
  image?: string;
}

export interface Ingredient {
  quantity?: string | number;
  measurement?: string;
  item?: string;
}

export interface Article {
  _id: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface RootState {
  auth: {
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
  };
}

export interface UserInfo {
  _id: string;
  isAdmin: boolean;
}

export interface BookmarkRecipes {
  recipes: {
    bookmarkedRecipesID: string[];
    bookmarkedRecipesData: Recipe[];
  };
}

export interface Bookmark {
  recipe: Recipe;
  user: string;
  _id: string;
}

export interface ErrorResponse {
  data?: {
    error?: string;
    message?: string;
  };
  error?: string;
}

export interface Props {
  header: string;
  title?: string;
}

export interface RecipeByTagProps {
  tag: string | null;
  count?: number;
  currentRecipeId?: string | null;
}

export interface RatingProps {
  value: number;
  numReviews?: number;
}
