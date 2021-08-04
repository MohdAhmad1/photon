import { useRef, useState } from "react";
import { useRouter } from "next/dist/client/router";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-component";
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
    <div
      ref={catagoriesWrapper}
      className="flex flex-col min-h-screen-sm w-full items-start overflow-x-hidden"
    >
      {images ? (
        <>
          <Topics items={topics} wrapper={catagoriesWrapper} />

          <h1 className="text-3xl">
            {" "}
            total images {images.total} pages: {images.total_pages}{" "}
          </h1>

          <div className="w-full px-0.5">
            <InfiniteScroll
              dataLength={images.results.length}
              next={nextFunction}
              scrollThreshold={0.7}
              hasMore={images.total_pages >= page}
              loader={
                <h1 className="font-medium text-center mb-2 text-2xl">
                  Loading ...
                </h1>
              }
              className="w-full"
              endMessage={
                <h1 className="font-medium text-center mb-4 text-2xl">
                  We Dont Have More Images to show
                </h1>
              }
            >
              <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                className="w-full overflow-hidden"
              >
                {images?.results?.map((image) => (
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

// static stuff

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
  const topics: { id: string; slug: string; title: string }[] = [];

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
