import ImageCard from "components/ImageCard";
import { useRef } from "react";
import Topics from "components/Topics";

// types
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import type { IAPIResponse } from "types/ApiResponse";
import type { ITopicsResponse } from "types/TopicsResponse";

const CatagorySlug = ({
  images,
  topics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const catagoriesWrapper = useRef(null);

  return (
    <div
      ref={catagoriesWrapper}
      className="flex flex-col min-h-screen-sm w-full items-start overflow-x-hidden"
    >
      {images ? (
        <>
          <Topics items={topics} wrapper={catagoriesWrapper} />

          <div className="masonry">
            {images &&
              images.map((image) => (
                <ImageCard
                  key={image.id}
                  link={image.id}
                  width={image.width}
                  height={image.height}
                  src={image.urls.raw}
                  blur_hash={image.blur_hash}
                  alt="any-img"
                />
              ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col font-bold text-2xl items-center justify-center">
          <h1> API LIMIT EXCEED </h1>
          <h1> SORRY UNSPLASH HAS SOME API LIMITATIONS </h1>
          <h1> TRY AGAIN AFTER AN HOUR </h1>
          <h1> API ACCESS LIMIT IS 50 REQ PER HOUR </h1>
        </div>
      )}
    </div>
  );
};

// static Props
export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  // images fn and var declaration starts
  const images: IAPIResponse[] = [];

  await fetch(
    `https://api.unsplash.com/topics/${params?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=24&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IAPIResponse[]) => {
      images.push(...imgData);
    });
  // images fn and var declaration ends

  // topics fn and var declaration starts
  const topics: ITopicsResponse[] = [];

  await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  )
    .then((topicsRes) => topicsRes.json())
    .then((topicsRes: ITopicsResponse[]) => {
      topics.push(...topicsRes);
    });
  // topics fn and var declaration ends

  if (!images) return { props: { images: null, topics }, revalidate: 5 * 60 };

  return { props: { images, topics }, revalidate: 5 * 60 };
};

// static Paths
export const getStaticPaths: GetStaticPaths = async () => {
  let topics: ITopicsResponse[] = await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  ).then((e) => e.json());

  const topicPaths = topics.map(({ slug }) => ({
    params: { slug },
  }));

  return {
    paths: topicPaths,
    fallback: false, // See the "fallback" section below
  };
};

export default CatagorySlug;
