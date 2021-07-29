import ImageCard from "components/ImageCard";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";

const DynamicImage = () => {
  const router = useRouter();

  return (
    <AnimatePresence initial={false}>
      <div>
        <motion.div
          className="h-full w-full relative"
          layout
          layoutId={`${router.query.id as string}`}
        >
          <motion.figure
            className="h-full w-full"
            layout
            layoutId={`${router.query.id as string}-image`}
          >
            <Image
              src="https://picsum.photos/id/1001/200/300.webp"
              alt="s"
              layout="responsive"
              width={400}
              height={500}
              // className="h-full object-cover w-full"
            />

            <h1 className="font-black transform bottom-10 left-10 text-4xl rotate-90 absolute">
              --&gt;
            </h1>
          </motion.figure>
        </motion.div>

        <div className="p-12">
          <h1>Explore More</h1>

          {/* <div className="grid gap-8 grid-cols-3">
          {new Array(6).fill(0).map((e, key) => (
            <ImageCard key={key + 7} link={key} />
            ))}
        </div> */}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default DynamicImage;
