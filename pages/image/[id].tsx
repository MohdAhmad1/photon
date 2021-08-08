import Image from "next/image";
import { useRef, useState } from "react";

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
import { AnimatePresence, motion } from "framer-motion";
import useOnClickOutside from "components/useOnClickOutside";

const DownloadSVG = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const DynamicImage = ({
  currentImage,
  images,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const wrapper = useRef(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isDropDownActive, setIsDropDownActive] = useState(false);

  useOnClickOutside(dropdownRef, () => setIsDropDownActive(false));

  return (
    <div className="image-page">
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
                src={`${currentImage.urls.raw}&fm=webp&w=1500&fit=max&q=75`}
                alt={currentImage.description || "Placeholder Image"}
                width={currentImage.width}
                height={currentImage.height}
                objectFit="cover"
                unoptimized={true}
              />

              {/* credits */}
              <p className="credits">
                Photo by{" "}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`${currentImage.user.links.html}?utm_source=photon&utm_medium=referral`}
                >
                  {`${currentImage.user.first_name} ${currentImage.user.last_name}`}
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

              {/* download menu */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-130%" }}
                className="dropdown"
                onBlur={() => console.log("blur")}
                ref={dropdownRef}
              >
                <motion.button
                  onClick={() => setIsDropDownActive(!isDropDownActive)}
                  whileTap={{ scale: 0.9 }}
                >
                  <DownloadSVG />
                </motion.button>
                <AnimatePresence>
                  {isDropDownActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        default: { type: "spring" },
                        scale: { type: "spring", stiffness: 350 },
                      }}
                    >
                      {[
                        { w: 640, name: "Small" },
                        { w: 1920, name: "Medium" },
                        { w: 2400, name: "Large" },
                      ].map((imgSrc, index) => (
                        <a
                          target="_blank"
                          rel="noreferrer noopener"
                          href={`${currentImage.links.download}?force=true&w=${imgSrc.w}`}
                          key={`dl-${currentImage.id}-${index}`}
                          onClick={() => setIsDropDownActive(false)}
                        >
                          <span> {imgSrc.name} </span>
                          <span className="text-xs">
                            ({imgSrc.w}x
                            {Math.round(
                              (currentImage.height / currentImage.width) *
                                imgSrc.w
                            )}
                            )
                          </span>
                        </a>
                      ))}
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`${currentImage.links.download}?force=true`}
                        onClick={() => setIsDropDownActive(false)}
                      >
                        <span className="mr-3">Original</span>{" "}
                        <span className="text-xs">
                          ({currentImage.width}x{currentImage.height})
                        </span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </figure>
          </div>

          <div className="w-full" ref={wrapper}>
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
                    <Image
                      src="/loading.gif"
                      loading="eager"
                      width={32}
                      height={32}
                      alt="1"
                    />
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
            </div>{" "}
          </div>
        </>
      ) : null}
    </div>
  );
};

// static Props
export const getServerSideProps = async ({
  query,
  res,
}: GetServerSidePropsContext) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=540, stale-while-revalidate=59"
  );

  // current images fn and var declaration starts
  const currentImage: IPhotoResponse[] = [];

  await fetch(
    `https://api.unsplash.com/photos/${query?.id}?client_id=${process.env.NEXT_PUBLIC_API_KEY}`
  )
    .then((imgRes) => imgRes.json())
    .then((imgData: IPhotoResponse) => {
      currentImage.push(imgData);
    })
    .catch((err) => console.log(err));
  // current images fn and var declaration ends

  // images fn and var declaration starts
  const images: IAPIResponse[] = [];

  const queryTags = currentImage[0].tags.map((tag) => tag.title).join(",");

  await fetch(
    `https://api.unsplash.com/photos/random?query=${queryTags}&client_id=${process.env.NEXT_PUBLIC_API_KEY}&count=30`
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
