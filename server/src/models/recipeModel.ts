import mongoose from "mongoose";

// Define the reply schema separately
const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullName: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: true,
    },
    parentReplyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
    },
    replies: [this],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullName: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
      default:
        "https://scontent.fcgy1-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH52Q10Jqqp0AxPbO3WRE_zso2H55p0AlGyjYfnmnQCUX4ot_nc1F8YABqfZQrAu0YUDY_-l1HBTrswASdTbM2j&_nc_ohc=N-xlEn92hSUAb4h2fLN&_nc_ht=scontent.fcgy1-1.fna&oh=00_AfBrlSyXS_ddvLrjkNlN615DyflKLkKkopX1kpTSkR0zFQ&oe=6645E638",
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    replies: [replySchema], // Embed the full reply schema for nested replies
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Define the recipe schema
const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  mainImage: {
    type: String,
    required: true,
  },
  recipeTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  preparationTime: {
    hours: {
      type: Number,
      required: false,
    },
    minutes: {
      type: Number,
      required: false,
    },
  },
  cookTime: {
    hours: {
      type: Number,
      required: false,
    },
    minutes: {
      type: Number,
      required: false,
    },
  },
  totalTime: {
    hours: {
      type: Number,
      required: false,
    },
    minutes: {
      type: Number,
      required: false,
    },
  },
  ingredients: [
    {
      quantity: {
        type: String,
        required: false,
      },
      measurement: {
        type: String,
        required: false,
      },
      item: {
        type: String,
        required: false,
      },
    },
  ],
  videoLink: {
    type: String,
    required: true,
    set: (value: string) => {
      // Extract the video ID from the YouTube link
      const videoIdMatch = value.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );

      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        return `https://www.youtube.com/embed/${videoId}`;
      } else {
        return value;
      }
    },
  },
  instructions: [
    {
      step: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false,
      },
    },
  ],
  cooksTips: {
    type: [String],
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  cuisineType: {
    type: String,
    required: true,
    enum: [
      "Italian",
      "Mexican",
      "Indian",
      "Asian",
      "Mediterranean",
      "Middle Eastern",
      "African",
      "French",
      "Mocktail",
    ],
  },
  dietPreference: {
    type: String,
    required: true,
    enum: ["Vegetarian", "Vegan", "Keto", "Paleo", "Low Carb", "High Protein"],
  },
  mealType: {
    type: String,
    required: true,
    enum: [
      "Breakfast",
      "Brunch",
      "Lunch",
      "Dinner",
      "Snack",
      "Dessert",
      "Appetizer",
      "Side Dish",
      "Salad",
      "Soup",
      "Main Course",
      "Beverage",
    ],
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
