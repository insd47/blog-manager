import { RouterProvider, Outlet, createHashRouter } from "react-router-dom";

import { Drafts } from "./components";
import pages from "./pages";
import externals from "./externals";
import Navigation from "./components/navigation";

import styled from "@emotion/styled";

const StyledBody = styled.div`
  display: flex;
  flex: 1;
`;

export default function Frame() {
  const routes = [
    {
      path: "/",
      element: (
        <>
          <Drafts />
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
      ],
    },
    ...externals,
  ];

  const router = createHashRouter(routes);

  return <RouterProvider router={router} />;
}
