import { useRef } from "react";
import ImageCard from "components/ImageCard";
import Topics from "components/Topics";

// types
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ISearchResponse } from "types/SearchResponse";
import { ITopicsResponse } from "types/TopicsResponse";

const Search = ({
  images,
  topics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
              images.results.map((image) => (
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

// static stuff

type topicsProps = {
  id: string;
  slug: string;
  title: string;
};

type HomeProps = {
  images: ISearchResponse[] | null;
  topics: topicsProps[] | null;
};

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  // images fn and var declaration starts
  let images: ISearchResponse = { total: 0, total_pages: 0, results: [] };

  await fetch(
    `https://api.unsplash.com/search/photos?query=${query.q}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=24&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgRes: ISearchResponse) => {
      images = imgRes;
    });
  // images fn and var declaration starts

  // topics fn and var declaration starts
  const topics: topicsProps[] = [];

  await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  )
    .then((topicsRes) => topicsRes.json())
    .then((topicsRes: ITopicsResponse[]) => {
      topicsRes.map(({ id, slug, title }) => {
        topics.push({ id, slug, title });
      });
    });
  // topics fn and var declaration ends

  if (!images) return { props: { images: null, topics } };

  return { props: { images, topics } };
};

export default Search;
