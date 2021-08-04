import { useRef, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-component";
import ImageCard from "components/ImageCard";
import Topics from "components/Topics";

// types
import type { InferGetStaticPropsType } from "next";
import type { IAPIResponse } from "types/ApiResponse";
import type { ITopicsResponse } from "types/TopicsResponse";
import Image from "next/image";

type HomeProps = InferGetStaticPropsType<typeof getStaticProps> & {};

const Home = ({ images, topics, imgOfTheDay }: HomeProps) => {
  const catagoriesWrapper = useRef(null);
  const [page, setPage] = useState(3);

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
          <div className="h-lg w-full relative">
            {imgOfTheDay && (
              <Image
                src={`${imgOfTheDay.urls.raw}&w=1500&fm=webp&q=75`}
                alt={imgOfTheDay.alt_description || "Image Of The Day"}
                unoptimized={true}
                layout="fill"
                className="object-cover"
              />
            )}
          </div>

          <Topics items={topics} wrapper={catagoriesWrapper} />

          <div className="w-full px-0.5">
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
              className="w-full"
            >
              <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                className="w-full overflow-hidden"
              >
                {images?.map((image) => (
                  <ImageCard key={image.id} data={image} />
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
    `https://api.unsplash.com/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=30&order_by=popular`
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

  // random img fn and var declatation starts
  var imgOfTheDay: IAPIResponse;

  await fetch(
    `https://api.unsplash.com/photos/random/?client_id=${process.env.NEXT_PUBLIC_API_KEY}`
  )
    .then((data) => data.json())
    .then((imgData: IAPIResponse) => {
      imgOfTheDay = imgData;
    })
    .catch((err) => console.log(err));
  // random img fn and var declatation ends

  if (images.length === 0)
    return { props: { images: null, topics: null, imgOfTheDay: null } };

  // return { props: { images, topics } };
  return { props: { images, topics, imgOfTheDay }, revalidate: 10 * 60 }; // revalidate in seconds
};

export default Home;
