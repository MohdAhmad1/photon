import { motion } from "framer-motion";
import Link from "next/link";

import type { MutableRefObject } from "react";

interface ITopicsProps {
  items: { id: string; slug: string; title: string }[] | null;
  wrapper: MutableRefObject<null>;
}

const Topics = ({ items: topics, wrapper }: ITopicsProps) => {
  return (
    <motion.div
      key="tags"
      drag="x"
      dragPropagation
      dragConstraints={wrapper}
      dragTransition={{ power: 0.035 }}
      className="rounded-lg cursor-move flex my-2"
    >
      {topics?.map((topic) => (
        <div key={topic.id}>
          <Link href={`/category/${topic.slug}`} passHref>
            <span className="rounded-lg cursor-pointer bg-light-500 mx-2 w-max py-2 px-4 transition-all duration-150 inline-block dark:bg-dark-200 dark:hover:bg-dark-100 hover:bg-light-700">
              #{topic.title}
            </span>
          </Link>
        </div>
      ))}
    </motion.div>
  );
};

export default Topics;
