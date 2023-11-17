import Main from "./main";
import Statistics from "./statistics";
import Posts from "./posts";
import Tags from "./tags";
import Images from "./images";
import Meta from "./meta";
import { RouteObject } from "react-router-dom";

const pages: RouteObject[] = [
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/statistics",
    element: <Statistics />,
  },
  {
    path: "/posts",
    element: <Posts />,
  },
  {
    path: "/tags",
    element: <Tags />,
  },
  {
    path: "/images",
    element: <Images />,
  },
  {
    path: "/meta",
    element: <Meta />,
  },
];

export default pages;
