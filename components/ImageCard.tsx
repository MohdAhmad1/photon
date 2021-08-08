import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { BlurhashCanvas } from "react-blurhash";

// types
import { IAPIResponse } from "types/ApiResponse";
import { Result } from "types/SearchResponse";

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

const ImageCard = ({ data: image }: { data: IAPIResponse | Result }) => {
  const [isDropDownActive, setIsDropDownActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <main
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => (setIsDropDownActive(false), setIsHovered(false))}
      className="img-card-main"
    >
      <div className="wrapper">
        {/* the image */}
        <Link href={`/image/${image.id}`} passHref>
          <a className="image-link">
            <figure>
              <BlurhashCanvas
                hash={image.blur_hash}
                punch={1}
                className="h-full w-full inset-0 absolute"
                height={32}
                width={32}
              />

              <Image
                src={`${image.urls.raw}&fm=webp&w=700&fit=max&q=75`}
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
            <div className="offcanvas-link-wrapper">
              {/* credits to photographer and unsplash */}
              <motion.p
                initial={{ y: "150%" }}
                animate={{ y: "0%" }}
                exit={{ y: "150%" }}
                className="credits"
              >
                Photo by{" "}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`${image.user.links.html}?utm_source=photon&utm_medium=referral`}
                  onClick={() => setIsDropDownActive(false)}
                >
                  {`${image.user.first_name} ${image.user.last_name}`}
                </a>{" "}
                on{" "}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://unsplash.com/?utm_source=photon&utm_medium=referral"
                  onClick={() => setIsDropDownActive(false)}
                >
                  Unsplash
                </a>
              </motion.p>

              {/* download menu */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-130%" }}
                className="dropdown"
                onBlur={() => console.log("blur")}
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
                          href={`${image.links.download}?force=true&w=${imgSrc.w}`}
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
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`${image.links.download}?force=true`}
                      >
                        <span className="mr-3">Original</span>{" "}
                        <span className="text-xs">
                          ({image.width}x{image.height})
                        </span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default ImageCard;
