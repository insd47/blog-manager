import { RouteObject } from "react-router-dom";
import PostsAdd from "./add";
import PostsEdit from "./edit";

const editor: RouteObject[] = [
  {
    path: "add",
    element: <PostsAdd />,
  },
  {
    path: "edit/:id",
    element: <PostsEdit />,
  },
];

export default editor;
