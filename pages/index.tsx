import ImageCard from "components/ImageCard";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
// import StackGrid from "react-stack-grid";
import InfiniteScroll from "react-infinite-scroll-component";

import sizeMe from "react-sizeme";

// types
import type { InferGetStaticPropsType } from "next";
import type { IAPIResponse } from "types/ApiResponse";
import type { ITopicsResponse } from "types/TopicsResponse";

type HomeProps = InferGetStaticPropsType<typeof getStaticProps> & {
  size: {
    width: number | null;
    height: number | null;
  };
};

const Home = ({ images, topics, size }: HomeProps) => {
  const catagoriesWrapper = useRef(null);
  const [newImages, setNewImages] = useState<IAPIResponse[] | []>([]);
  const [page, setPage] = useState(3);

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

          <div className="w-full">
            {/* <StackGrid
              columnWidth={(size?.width as number) <= 768 ? "50%" : "33.33%"}
              enableSSR={true}
              className="overflow-hidden"
              gutterHeight={0}
              gutterWidth={0}
            >
              {images?.map((image) => (
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
            </StackGrid> */}
            {/* 
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
            >
              <Masonry>
                {images?.map((image) => (
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
              </Masonry>
            </ResponsiveMasonry> */}

            <div className="masonry">
              <InfiniteScroll
                dataLength={images.length + newImages.length}
                next={() => {
                  fetch(
                    `https://api.unsplash.com/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=15&page=${page}&order_by=popular`
                  )
                    .then((data) => data.json())
                    .then((imgData: IAPIResponse[]) => {
                      // imgData.map(({ id, width, height, blur_hash, urls }) => {
                      //   images?.push({ id, width, height, blur_hash, url: urls.thumb });
                      // });
                      setNewImages([...newImages, ...imgData]);
                      setPage(page + 1);
                    });
                }}
                hasMore={true}
                loader={<h1>Lading</h1>}
              >
                {images?.map((image) => (
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
                {newImages?.map((image) => (
                  <ImageCard
                    key={image.id}
                    link={image.id}
                    width={image.width}
                    height={image.height}
                    src={image.urls.thumb}
                    blur_hash={image.blur_hash}
                    alt="any-img"
                    diff
                  />
                ))}
              </InfiniteScroll>
            </div>
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
export const getStaticProps = async () => {
  // images fn and var declaration starts
  const images: {
    id: string;
    width: number;
    height: number;
    blur_hash: string;
    url: string;
  }[] = [];

  await fetch(
    `https://api.unsplash.com/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20&order_by=popular`
  )
    .then((data) => data.json())
    .then((imgData: IAPIResponse[]) => {
      imgData.map(({ id, width, height, blur_hash, urls }) => {
        images.push({ id, width, height, blur_hash, url: urls.thumb });
      });
    });
  // images fn and var declaration ends

  // topics fn and var declaration starts
  const topics: { id: string; slug: string; title: string }[] = [];

  await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  )
    .then((data) => data.json())
    .then((imgData: ITopicsResponse[]) => {
      imgData.map(({ id, slug, title }) => {
        topics.push({ id, slug, title });
      });
    });
  // topics fn and var declaration ends

  // if (!images) return { props: { images: null, topics }, revalidate: 5 * 60 };

  return { props: { images, topics } };
  // return { props: { images, topics }, revalidate: 5 * 60 };
};

export default Home;
