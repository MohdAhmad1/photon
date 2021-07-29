import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlurhashCanvas } from "react-blurhash";

interface iImageCard {
  link: number | string;
  src: string;
  alt: string;
  width: number;
  height: number;
  layout?: "fixed" | "responsive" | "intrinsic";
  blur_hash: string;
  diff?: boolean;
}

const ImageCard = ({
  link,
  src,
  alt,
  width,
  height,
  blur_hash,
  diff,
}: iImageCard) => {
  return (
    <Link href={`/image/${link}`} passHref>
      <a className="rounded-xl m-0.5 p-1 overflow-hidden inline-flex hover:shadow-lg hover:bg-light-900 dark:hover:bg-dark-200 hover:shadow-dark-900 dark:hover:shadow-light-900">
        <figure className="rounded-lg flex relative overflow-hidden">
          <BlurhashCanvas
            hash={blur_hash}
            punch={1}
            className="h-full w-full inset-0 absolute"
          />

          <Image
            // src={src}
            src={
              diff
                ? "https://picsum.photos/id/10/200/300"
                : "https://picsum.photos/id/236/200/300"
            }
            alt={alt || "Placeholder Image"}
            width={width}
            height={height}
            className="h-full object-cover w-full"
          />
        </figure>
      </a>
    </Link>
  );
};

export default ImageCard;
