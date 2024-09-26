import { useGetArticlesByTitleQuery } from "../slices/articlesApiSlice";
import Loader from "./Loader";
import { Article, ErrorResponse } from "../types";
import Message from "./Message";

interface ArticleProps {
  header: string;
  title: string;
}

const ArticlesCard = ({ header, title }: ArticleProps) => {
  const {
    data: articles,
    error,
    isLoading,
  } = useGetArticlesByTitleQuery({
    title,
  });

  return (
    <div className="p-8 md:pb-16 lg:p-16 lg:pb-16 lg:pt-0 xl:px-24 xl:pb-0 ">
      {isLoading ? (
        <Loader className="h-full w-full" />
      ) : error ? (
        <Message
          variant="error"
          message={
            (error as ErrorResponse)?.data?.message || "Failed to load articles"
          }
        />
      ) : (
        <div>
          <h1 className="font-cormorant text-2xl font-medium md:text-3xl lg:text-4xl">
            {header}
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2  lg:grid-cols-3 xl:gap-12">
            {articles?.map((article: Article) => (
              <div key={article._id as React.Key}>
                <div>
                  <img
                    src={article.image}
                    alt={article.subtitle}
                    className="w-full rounded object-cover"
                  />
                </div>
                <div>
                  <h1 className="mt-3 text-sm leading-6 text-[#444444] 2xl:text-base">
                    {article.category}
                  </h1>
                  <h1 className="mt-1 text-base leading-6  md:text-lg lg:text-lg 2xl:text-xl">
                    {article.subtitle}
                  </h1>
                  <p className="mt-2 text-sm text-[#444444] xl:text-base">
                    {article.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesCard;
