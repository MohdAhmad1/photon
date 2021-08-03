import { useEffect, useRef, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-component";
import ImageCard from "components/ImageCard";
import Topics from "components/Topics";

// types
import type { InferGetStaticPropsType } from "next";
import type { IAPIResponse } from "types/ApiResponse";
import type { ITopicsResponse } from "types/TopicsResponse";

type HomeProps = InferGetStaticPropsType<typeof getStaticProps> & {};

const Home = ({ images, topics }: HomeProps) => {
  const catagoriesWrapper = useRef(null);
  const [page, setPage] = useState(3);

  useEffect(() => {
    console.error("hello WOrld");
  }, []);

  const nextFunction = () => {
    fetch(
      `https://api.unsplash.com/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=15&page=${page}&order_by=popular`
    )
      .then((data) => data.json())
      .then((imgData: IAPIResponse[]) => {
        images?.push(...imgData);
        setPage(page + 1);
      });
  };

  return (
    <div
      ref={catagoriesWrapper}
      className="flex flex-col min-h-screen-sm w-full items-start overflow-x-hidden"
    >
      {images ? (
        <>
          <Topics items={topics} wrapper={catagoriesWrapper} />

          <div className="w-full">
            <InfiniteScroll
              dataLength={images.length}
              next={nextFunction}
              scrollThreshold={0.7}
              hasMore={true}
              loader={
                <h1 className="font-medium text-center mb-2 text-2xl">
                  Loading ...
                </h1>
              }
            >
              <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                className="overflow-hidden"
              >
                {images?.map((image) => (
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
              </Masonry>
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col font-bold h-90vh w-full text-2xl items-center justify-center">
            <h1 className="my-0.5"> API LIMIT EXCEED </h1>
            <h1 className="my-0.5">SORRY UNSPLASH HAS SOME API LIMITATIONS</h1>
            <h1 className="my-0.5"> TRY AGAIN AFTER AN HOUR </h1>
            <h1 className="my-0.5"> API ACCESS LIMIT IS 50 REQ PER HOUR </h1>
          </div>
        </>
      )}
    </div>
  );
};

// static stuff
export const getStaticProps = async () => {
  // images fn and var declaration starts
  const images: IAPIResponse[] = [];

  await fetch(
    `https://api.unsplash.com/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20&order_by=popular`
  )
    .then((data) => data.json())
    .then((imgData: IAPIResponse[]) => {
      images.push(...imgData);
    })
    .catch((err) => console.log(err));
  // images fn and var declaration ends

  // topics fn and var declaration starts
  const topics: ITopicsResponse[] = [];

  await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  )
    .then((data) => data.json())
    .then((topicsData: ITopicsResponse[]) => {
      topics.push(...topicsData);
    })
    .catch((err) => console.log(err));
  // topics fn and var declaration ends

  if (images.length === 0) return { props: { images: null, topics: null } };

  // return { props: { images, topics } };
  return { props: { images, topics }, revalidate: 600 };
};

export default Home;
