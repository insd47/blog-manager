import { Icon, IconType } from "@insd47/library";
import React, { PropsWithChildren, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import defaultProfile from "@/assets/images/default-profile.png";

import {
  StyledBottom,
  StyledCategories,
  StyledHandle,
  StyledItem,
  StyledNavigation,
  StyledProfiles,
} from "./styles";

export const Frame: React.FC<PropsWithChildren> = ({ children }) => {
  const [isResizing, setIsResizing] = useState(false);

  return (
    <StyledNavigation
      width={240}
      height={0}
      minConstraints={[160, 0]}
      maxConstraints={[window.innerWidth - 160, 0]}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={() => setIsResizing(false)}
      handle={<StyledHandle isResizing={isResizing} />}
      children={
        <>
          {children}
          <StyledBottom>
            <StyledProfiles>
              <img alt="profile" src={defaultProfile} />
              <span>인성</span>
              <Icon size={16} type="arrow-2-right" />
            </StyledProfiles>
          </StyledBottom>
        </>
      }
    />
  );
};

export const Category: React.FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <StyledCategories>
      <p>{title}</p>
      <ul>{children}</ul>
    </StyledCategories>
  );
};

export const Item = ({
  title,
  icon,
  activeIcon,
  path,
}: {
  title: string;
  icon: IconType;
  activeIcon: IconType;
  path: string;
}) => {
  const { pathname } = useLocation();

  const isActive =
    path === "/" ? path === pathname : pathname.slice(0, path.length) === path;

  return (
    <Link to={path}>
      <StyledItem isActive={isActive}>
        <Icon type={isActive ? activeIcon : icon} size={16} />
        <span>{title}</span>
      </StyledItem>
    </Link>
  );
};

export const External = ({
  title,
  icon,
  path,
}: {
  title: string;
  icon: IconType;
  path: string;
}) => {
  return (
    <StyledItem>
      <Icon type={icon} size={16} />
      <span>{title}</span>
    </StyledItem>
  );
};
