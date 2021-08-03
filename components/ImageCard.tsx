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
}

const ImageCard = ({
  link,
  src,
  alt,
  width,
  height,
  blur_hash,
}: iImageCard) => {
  return (
    <Link href={`/image/${link}`} passHref>
      <a className="rounded-xl p-0.5 w-1/3 overflow-hidden inline-flex">
        <div className="rounded-xl p-1 hover:shadow-lg hover:bg-light-900 dark:hover:bg-dark-200 hover:shadow-dark-900 dark:hover:shadow-light-900">
          <figure className="rounded-lg flex relative overflow-hidden">
            <BlurhashCanvas
              hash={blur_hash}
              punch={1}
              className="h-full w-full inset-0 absolute"
              height={32}
              width={32}
            />

            <Image
              src={`${src}&fm=webp&w=200&fit=max&q=75`}
              alt={alt || "Placeholder Image"}
              width={width}
              height={height}
              className="h-full object-cover w-full"
              unoptimized={true}
              placeholder="empty"
            />
          </figure>
        </div>
      </a>
    </Link>
  );
};

export default ImageCard;
