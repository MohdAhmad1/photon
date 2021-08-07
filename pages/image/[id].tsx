import Image from "next/image";
import { useRef } from "react";
import { BlurhashCanvas } from "react-blurhash";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-component";
import ImageCard from "components/ImageCard";
import Topics from "components/Topics";

// types
import type { IPhotoResponse } from "types/PhotoResponse";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { IAPIResponse } from "types/ApiResponse";

const DynamicImage = ({
  currentImage,
  images,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const wrapper = useRef(null);

  return (
    <div className="image-page" ref={wrapper}>
      {currentImage ? (
        <>
          <div className="image">
            <figure>
              <BlurhashCanvas
                hash={currentImage.blur_hash}
                punch={1}
                className="h-full w-full inset-0 absolute"
                height={32}
                width={32}
              />
              <Image
                src={`${currentImage.urls.raw}&fm=webp&w=200&fit=max&q=75`}
                alt={currentImage.description || "Placeholder Image"}
                width={currentImage.width}
                height={currentImage.height}
                objectFit="cover"
                unoptimized={true}
              />
            </figure>
          </div>

          <h1 className="heading">Explore More</h1>

          <Topics items={currentImage.tags} wrapper={wrapper} asLink={true} />

          <div className="infinite-scroll-wrapper">
            <InfiniteScroll
              dataLength={30}
              next={() => null}
              scrollThreshold={0.7}
              hasMore={false}
              loader={
                <h1 className="loading-msg">
                  <Image src="/loading.gif" width={32} height={32} alt="1" />
                  <span> Loading </span>
                </h1>
              }
              className="infinite-scroll"
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
      ) : null}
    </div>
  );
};

// static Props
export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  // current images fn and var declaration starts
  const currentImage: IPhotoResponse[] = [];

  await fetch(
    `https://api.unsplash.com/photos/${query?.id}?client_id=${process.env.NEXT_PUBLIC_API_KEY}`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IPhotoResponse) => {
      currentImage.push(imgData);
    });
  // current images fn and var declaration ends

  // images fn and var declaration starts
  const images: IAPIResponse[] = [];

  await fetch(
    `https://api.unsplash.com/topics/${currentImage[0].topics[0].slug}/photos?client_id=${process.env.NEXT_PUBLIC_API_KEY}&per_page=30`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IAPIResponse[]) => {
      images.push(...imgData);
    })
    .catch((err) => console.log(err));

  // images fn and var declaration ends

  if (currentImage.length === 0)
    return { props: { currentImage: null, images: null } };

  return { props: { currentImage: currentImage[0], images } };
};

export default DynamicImage;
