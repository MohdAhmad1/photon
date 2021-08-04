import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BlurhashCanvas } from "react-blurhash";

// types
import { IAPIResponse } from "types/ApiResponse";
import { Result } from "types/SearchResponse";

const ImageCard = ({ data: image }: { data: IAPIResponse | Result }) => {
  const [isDropDownActive, setIsDropDownActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <main
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => (setIsDropDownActive(false), setIsHovered(false))}
      className="rounded-xl w-full p-1 sm:w-1/2 md:w-1/3 hover:bg-light-900 hover:shadow-lg hover:shadow-dark-900 dark:hover:bg-dark-200 dark:hover:shadow-light-900"
    >
      <div className="rounded-xl w-full p-0 relative overflow-hidden">
        {/* the image */}
        <Link href={`/image/${image.id}`} passHref>
          <a className="rounded-xl p-0.5 block overflow-hidden">
            <figure className="rounded-lg flex relative overflow-hidden">
              <BlurhashCanvas
                hash={image.blur_hash}
                punch={1}
                className="h-full w-full inset-0 absolute"
                height={32}
                width={32}
              />
              <Image
                // src={`${image.urls.raw}&fm=webp&w=200&fit=max&q=75`}
                src="https://i.picsum.photos/id/242/200/300.jpg?hmac=_v7qaiV_fwDB3NP9lpirq7rMvS10u8lHjqMYNmmXya4"
                alt={image.alt_description || "Placeholder Image"}
                width={image.width}
                height={image.height}
                className="h-full object-cover w-full"
                unoptimized={true}
                placeholder="empty"
              />
            </figure>
          </a>
        </Link>
        <AnimatePresence>
          {isHovered === true && (
            <>
              {/* credits to photographer and unsplash */}
              <motion.p
                initial={{ y: "150%" }}
                animate={{ y: "0%" }}
                exit={{ y: "150%" }}
                className="rounded-lg bg-opacity-50 bg-light-50 my-3 text-sm py-1 px-2 inset-x-3 bottom-0 text-dark-800 backdrop-filter backdrop-blur-md absolute dark:bg-opacity-30 dark:bg-dark-900 dark:text-true-gray-50"
              >
                Photo by{" "}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`${image.user.links.html}?utm_source=photon&utm_medium=referral`}
                  className="border-b font-medium border-dark-900 text-dark-900 dark:border-light-500 dark:text-light-500 hover:border-transparent"
                >
                  {`${image.user.first_name} ${image.user.last_name}`}
                </a>{" "}
                on{" "}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://unsplash.com/?utm_source=photon&utm_medium=referral"
                  className="border-b font-medium border-dark-900 text-dark-900 dark:border-light-500 dark:text-light-500 hover:border-transparent"
                >
                  Unsplash
                </a>
              </motion.p>

              {/* download menu */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-130%" }}
                className="top-3 right-3 absolute"
                onBlur={() => console.log("blur")}
              >
                <motion.button
                  onClick={() => setIsDropDownActive(!isDropDownActive)}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer flex bg-light-500 rounded-1 p-2 overflow-hidden items-center justify-center dark:bg-dark-200 hover:bg-light-600 dark:hover:bg-dark-100"
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
                      className="rounded-lg flex flex-col bg-light-100 top-full mt-1 w-max p-2 right-0 items-center absolute dark:bg-dark-200"
                    >
                      {[
                        { w: 640, name: "Small" },
                        { w: 1920, name: "Medium" },
                        { w: 2400, name: "Large" },
                      ].map((imgSrc, index) => (
                        <a
                          className="rounded-md flex text-sm w-full py-1 px-1.5 items-center justify-between hover:bg-light-800 dark:hover:bg-dark-400"
                          target="_blank"
                          rel="noreferrer noopener"
                          href={`${image.links.download}?force=true&w=640`}
                          key={`dl-${image.id}-${index}`}
                        >
                          <span> {imgSrc.name} </span>
                          <span className="text-xs">
                            ({imgSrc.w}x
                            {Math.round(
                              (image.height / image.width) * imgSrc.w
                            )}
                            )
                          </span>
                        </a>
                      ))}
                      <a
                        className="rounded-md flex my-0.5 w-full py-1 px-1.5 items-center justify-between hover:bg-light-800 dark:hover:bg-dark-400"
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`${image.links.download}?force=true`}
                      >
                        <span className="mr-1">Original</span>{" "}
                        <span className="text-xs">
                          ({image.width}x{image.height})
                        </span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default ImageCard;
