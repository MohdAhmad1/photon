import Link from "next/link";
import { motion } from "framer-motion";

// types
import type { MutableRefObject } from "react";
import type { Tag } from "types/PhotoResponse";
import type { ITopicsResponse } from "types/TopicsResponse";

interface ITopicsProps {
  items: ITopicsResponse[] | Tag[] | null;
  wrapper: MutableRefObject<null>;
  asLink?: boolean;
}

const Topics = ({ items: topics, wrapper }: ITopicsProps) => {
  return (
    <motion.div
      key="tags"
      drag="x"
      dragPropagation
      dragConstraints={wrapper}
      dragTransition={{ power: 0.035 }}
      className="topics"
    >
      {topics?.map((topic, index) => (
        <div key={(topic as ITopicsResponse)?.id || `${topic.title}-${index}`}>
          <Link
            href={
              (topic as ITopicsResponse).slug
                ? `/category/${(topic as ITopicsResponse)?.slug}`
                : `/search/${topic.title?.split(" ").join("-")}`
            }
            passHref
          >
            <motion.a draggable={false}>{topic.title}</motion.a>
          </Link>
        </div>
      ))}
    </motion.div>
  );
};

export default Topics;

//  - DONT GO HERE
