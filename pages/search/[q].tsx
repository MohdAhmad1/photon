import { useRef, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";

import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-component";

import ImageCard from "components/ImageCard";
import Topics from "components/Topics";

// types
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ISearchResponse } from "types/SearchResponse";

const Search = ({
  images,
  topics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const catagoriesWrapper = useRef(null);
  const [page, setPage] = useState(2);
  const router = useRouter();

  const nextFunction = () => {
    fetch(
      `https://api.unsplash.com/search/photos?query=${router.query.q}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=24&order_by=popular&page=${page}`
    )
      .then((data) => data.json())
      .then((imgData: ISearchResponse) => {
        images?.results?.push(...imgData.results);
        setPage(page + 1);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div ref={catagoriesWrapper} className="search">
      {images ? (
        <>
          <div className="heading">
            <p>Search results for:</p>
            <h1>{(router.query.q as string).split("-").join(" ")}</h1>
          </div>

          <Topics asLink items={topics} wrapper={catagoriesWrapper} />

          <div className="infinite-scroll-wrapper">
            <InfiniteScroll
              dataLength={images.results.length}
              next={nextFunction}
              scrollThreshold={0.7}
              hasMore={images.total_pages >= page}
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
                {images?.results?.map((image) => (
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

// static stuff

export const getServerSideProps = async ({
  params,
  res,
}: GetServerSidePropsContext) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=540, stale-while-revalidate=59"
  );

  // images fn and var declaration starts
  let images: ISearchResponse = { total: 0, total_pages: 0, results: [] };

  const query = (params!.q as string).split("-").join(" ");

  await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=24&order_by=popular`
  )
    .then((imgRes) => imgRes.json())
    .then((imgRes: ISearchResponse) => {
      images = imgRes;
    })
    .catch((err) => console.log(err));
  // images fn and var declaration starts

  // topics fn and var declaration starts
  let topics: {
    id: string;
    title: string;
  }[] = [];

  images.results.map((img) =>
    img.tags.map((tag) =>
      topics.push({ id: `${img.id}-${tag.title}`, title: tag.title })
    )
  );

  topics = [...new Map(topics.map((item) => [item["title"], item])).values()];
  topics.length = 20;
  // topics fn and var declaration ends

  if (!images) return { props: { images: null, topics } };

  return { props: { images, topics } };
};

export default Search;
