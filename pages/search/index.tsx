import ImageCard from "components/ImageCard";
import { motion } from "framer-motion";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRef } from "react";
import { IAPIResponse } from "types/ApiResponse";
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
          <motion.div
            key="tags"
            drag="x"
            dragPropagation
            dragConstraints={catagoriesWrapper}
            dragTransition={{ power: 0.035 }}
            className="rounded-lg cursor-move flex my-2"
          >
            {topics.map((topic) => (
              <div key={topic.id}>
                <Link href={`/category/${topic.slug}`} passHref>
                  <a className="rounded-lg cursor-pointer bg-light-500 mx-2 w-max py-2 px-4 transition-all duration-150 inline-block dark:bg-dark-200 dark:hover:bg-dark-100 hover:bg-light-700">
                    #{topic.title}
                  </a>
                </Link>
              </div>
            ))}
          </motion.div>

          <div className="masonry">
            {images &&
              images.data.map((image) => (
                <ImageCard
                  key={image.id}
                  link={image.id}
                  width={image.width}
                  height={image.height}
                  src={image.url}
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

type imageProps = {
  totalResult: number;
  totalPages: number;

  data: {
    id: string;
    width: number;
    height: number;
    blur_hash: string;
    url: string;
  }[];
};

type topicsProps = {
  id: string;
  slug: string;
  title: string;
};

type HomeProps = {
  images: imageProps[] | null;
  topics: topicsProps[] | null;
};

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  // images fn and var declaration starts
  const images: imageProps = { totalPages: 0, totalResult: 0, data: [] };

  await fetch(
    `https://api.unsplash.com/search/photos?query=${query.q}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=24&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgRes: ISearchResponse) => {
      images.totalPages = imgRes.total_pages;
      images.totalResult = imgRes.total;

      imgRes.results.map(({ id, width, height, blur_hash, urls }) => {
        images.data.push({ id, width, height, blur_hash, url: urls.thumb });
      });
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
