import { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-component";
import ImageCard from "components/ImageCard";
import Topics from "components/Topics";

// types
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import type { IAPIResponse } from "types/ApiResponse";
import type { ITopicsResponse } from "types/TopicsResponse";
import { useRouter } from "next/dist/client/router";

const CatagorySlug = ({
  images,
  topics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const catagoriesWrapper = useRef(null);
  const [page, setPage] = useState(3);

  const router = useRouter();

  const nextFunction = () => {
    fetch(
      `https://api.unsplash.com/topics/${router?.query?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=15&page=${page}&order_by=popular`
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
      {router.isFallback && <h1> LOADING ... </h1>}

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
    `https://api.unsplash.com/topics/${params?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=30&order_by=popular`
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

  if (!images) return { props: { images: null, topics } };

  return { props: { images, topics }, revalidate: 10 * 60 }; // revalidate in seconds
};

// static Paths
export const getStaticPaths: GetStaticPaths = async () => {
  let topics: ITopicsResponse[] = await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=35`
  ).then((e) => e.json());

  const topicPaths = topics.map(({ slug }) => ({
    params: { slug },
  }));

  return {
    paths: topicPaths,
    fallback: false,
  };
};

export default CatagorySlug;
