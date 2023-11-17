import login from "./login";
import Settings from "./settings";

const externals = [
  {
    path: "login",
    children: login,
  },
  {
    path: "settings",
    element: <Settings />,
  },
];

export default externals;
