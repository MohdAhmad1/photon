declare module "react-responsive-masonry" {
  import * as React from "react";

  const Masonry: React.FC<{
    columnsCount?: number;
    gutter?: string;
  }>;

  export const ResponsiveMasonry: React.FC<{
    columnsCountBreakPoints?: Record<number, number>;
  }>;

  export default Masonry;
}
