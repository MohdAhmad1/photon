import { useRef, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";

import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-component";
import { BlurhashCanvas } from "react-blurhash";

import ImageCard from "components/ImageCard";
import Topics from "components/Topics";

// types
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import type { IAPIResponse } from "types/ApiResponse";
import type {
  ICurrentTopicResponse,
  ITopicsResponse,
} from "types/TopicsResponse";

type CatagorySlugProps = InferGetStaticPropsType<typeof getStaticProps>;

const CatagorySlug = ({ images, topics, currentTopic }: CatagorySlugProps) => {
  const catagoriesWrapper = useRef(null);
  const [page, setPage] = useState(3);

  const router = useRouter();

  const nextFunction = () => {
    fetch(
      `https://api.unsplash.com/topics/${router?.query?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=15&page=${page}&order_by=popular`
    )
      .then((data) => data.json())
      .then((imgData: IAPIResponse[]) => {
        (images as IAPIResponse[])?.push(...imgData);
        setPage(page + 1);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div ref={catagoriesWrapper} className="category">
      {router.isFallback && <h1> LOADING ... </h1>}

      {images.length !== 0 ? (
        <>
          <div className="random-img">
            {currentTopic && (
              <>
                <BlurhashCanvas
                  hash={currentTopic.cover_photo.blur_hash!}
                  punch={1}
                  height={32}
                  width={32}
                />

                <Image
                  src={`${
                    currentTopic.cover_photo.urls!.raw
                  }&w=1500&fm=webp&q=75`}
                  alt={
                    currentTopic.cover_photo.alt_description ||
                    "Image Of The Day"
                  }
                  unoptimized={true}
                  layout="fill"
                  objectFit="cover"
                />

                <div className="category-info">
                  <h1>{currentTopic.title}</h1>

                  <p
                    dangerouslySetInnerHTML={{
                      __html: currentTopic.description,
                    }}
                  />
                </div>

                <p className="credits">
                  Photo by{" "}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`${
                      currentTopic.cover_photo.user!.links!.html
                    }?utm_source=photon&utm_medium=referral`}
                  >
                    {`${currentTopic.cover_photo.user!.first_name} ${
                      currentTopic.cover_photo.user!.last_name
                    }`}
                  </a>{" "}
                  on{" "}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://unsplash.com/?utm_source=photon&utm_medium=referral"
                  >
                    Unsplash
                  </a>
                </p>
              </>
            )}
          </div>

          <Topics items={topics} wrapper={catagoriesWrapper} />

          <div className="infinite-scroll-wrapper">
            <InfiniteScroll
              dataLength={images.length}
              next={nextFunction}
              scrollThreshold={0.7}
              hasMore={true}
              loader={
                <h1 className="loading-msg">
                  <Image
                    src="/loading.gif"
                    loading="eager"
                    width={32}
                    height={32}
                    alt="1"
                  />
                  <span className="ml-2"> Loading </span>
                </h1>
              }
              className="infinite-scroll"
              endMessage={
                <h1 className="end-msg">We dont have more images to show</h1>
              }
            >
              <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                className="masonry"
              >
                {images?.map((image) => (
                  <ImageCard key={image.id} data={image} />
                ))}
              </Masonry>
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <div className="error">
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
  type ErrorResponse = { errors: string };

  // images fn and var declaration starts
  let images: IAPIResponse[] = [];

  await fetch(
    `https://api.unsplash.com/topics/${params?.slug}/photos/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=30&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IAPIResponse[] | ErrorResponse) => {
      if ((imgData as ErrorResponse).errors) return (images = []);
      images = imgData as IAPIResponse[];
    })
    .catch((err) => console.log(err));
  // images fn and var declaration ends

  // topics fn and var declaration starts
  const topics: ITopicsResponse[] = [];

  await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=20`
  )
    .then((topicsRes) => topicsRes.json())
    .then((topicsRes: ITopicsResponse[] | ErrorResponse) => {
      if ((topicsRes as ErrorResponse).errors) return (topicsRes = []);
      topics.push(...(topicsRes as ITopicsResponse[]));
    })
    .catch((err) => console.log(err));
  // topics fn and var declaration ends

  // topicDetail fn and var declaration starts
  let currentTopic: ICurrentTopicResponse[] = [];

  await fetch(
    `https://api.unsplash.com/topics/${params?.slug}?client_id=${process.env.NEXT_PUBLIC_API_KEY}`
  )
    .then((data) => data.json())
    .then((currentTopicData: ICurrentTopicResponse | ErrorResponse) => {
      if ((currentTopicData as ErrorResponse).errors)
        return (currentTopic = []);

      currentTopic.push(currentTopicData as ICurrentTopicResponse);
    })
    .catch((err) => console.log(err));
  // topicDetail fn and var declaration ends

  if (images === null) return { props: { images: [], topics, notFound: true } };

  return {
    props: { images, topics, currentTopic: currentTopic[0] },
    revalidate: 10 * 60,
  }; // revalidate in seconds
};

// static Paths
export const getStaticPaths: GetStaticPaths = async () => {
  let topics: ITopicsResponse[] = await fetch(
    `https://api.unsplash.com/topics/?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=35`
  ).then((e) => e.json());

  const topicPaths = topics.map(({ slug }) => ({
    params: { slug },
  }));

  return { paths: topicPaths, fallback: false };
};

export default CatagorySlug;
