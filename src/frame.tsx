import {
  RouterProvider,
  Outlet,
  createHashRouter,
  RouteObject,
} from "react-router-dom";

import { Tabs } from "./components";
import pages from "./routes/pages";
import externals from "./routes/externals";
import editor from "./routes/editor";
import Navigation from "./components/navigation";

import styled from "@emotion/styled";
import { useEffect } from "react";

const StyledBody = styled.div`
  display: flex;
  flex: 1;
`;

export default function Frame() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: (
        <>
          <Tabs />
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: (
            <StyledBody>
              <Navigation />
              <Outlet />
            </StyledBody>
          ),
          children: pages,
        },
        {
          path: "/editor",
          element: (
            <StyledBody>
              <Outlet />
            </StyledBody>
          ),
          children: editor,
        },
      ],
    },
    ...externals,
  ];

  useEffect(() => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    return () =>
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
  }, []);

  const router = createHashRouter(routes);

  return <RouterProvider router={router} />;
}
