import ImageCard from "components/ImageCard";
import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// types
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import type { IAPIResponse } from "types/ApiResponse";
import type { ITopicsResponse } from "types/TopicsResponse";

const Home = ({
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
          <motion.div
            key="tags"
            drag="x"
            dragPropagation
            dragConstraints={catagoriesWrapper}
            dragTransition={{ power: 0.035 }}
            className="rounded-lg cursor-move flex my-2"
          >
            {topics?.map((topic) => (
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
              images.map((image) => (
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

type imageProps = {
  id: string;
  width: number;
  height: number;
  blur_hash: string;
  url: string;
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

// static Props
export const getStaticProps: GetStaticProps<HomeProps> = async ({
  params,
}: GetStaticPropsContext) => {
  // images fn and var declaration starts
  const images: imageProps[] = [];

  await fetch(
    `https://api.unsplash.com/topics/${params?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=24&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IAPIResponse[]) => {
      imgData.map(({ id, width, height, blur_hash, urls }) => {
        images.push({ id, width, height, blur_hash, url: urls.thumb });
      });
    });
  // images fn and var declaration ends

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

export default Home;
