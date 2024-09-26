import { FC } from "react";

interface ContentSectionProps {
  title: string;
  image: string;
  altText: string;
  sections: { header: string; description: string }[];
}

const ContentSection: FC<ContentSectionProps> = ({
  title,
  image,
  altText,
  sections,
}) => (
  <div className="content-section__container p-8 md:pt-0 lg:p-16 lg:pt-0 xl:p-24">
    <h1 className="font-cormorant text-2xl font-medium md:text-3xl 2xl:text-4xl">
      {title}
    </h1>

    <div className="mt-8 flex h-full flex-col gap-8 lg:flex-row">
      <div className="basis-1/2">
        <img
          src={image}
          alt={altText}
          loading="lazy"
          className="h-full rounded-[4px] object-cover"
        />
      </div>
      <div className="content basis-1/2">
        <div className="flex h-full flex-col gap-8">
          {sections.map((section, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h1 className="mb-1 text-base md:text-xl  ">{section.header}</h1>
              <p className="text-sm text-[#444444] 2xl:text-base">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ContentSection;
