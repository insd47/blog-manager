import { Icon, IconType, ContextMenuItem } from "@insd47/library";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import defaultProfile from "@/assets/images/default-profile.png";
import { ContextMenu } from "@insd47/library";
import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

import {
  StyledBottom,
  StyledCategories,
  StyledHandle,
  StyledItem,
  StyledNavigation,
  StyledProfiles,
} from "./styles";
import { useTheme } from "@emotion/react";

export const Frame: React.FC<PropsWithChildren> = ({ children }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  const profileRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (profileRef.current) {
      const { x, y, width } = profileRef.current?.getBoundingClientRect();

      setContextMenuPos({
        x: x + width,
        y: y,
      });
    }
  }, []);

  const { colors, change, mode, system } = useTheme();
  console.log(system, mode);

  const contextMenuItems: ContextMenuItem[] = [
    {
      type: "content",
      icon: "user",
      name: "me@insd.dev",
      color: colors.text.passive[1] + "",
    },
    {
      type: "seperator",
    },
    {
      type: "submenu",
      icon: "star",
      name: "테마",
      items: [
        {
          type: "action",
          icon: "sun",
          name: "밝음",
          onClick: () => {
            change("light");
          },
          checked: !system && mode === "light",
        },
        {
          type: "action",
          icon: "moon",
          name: "어두움",
          onClick: () => {
            change("dark");
          },
          checked: !system && mode === "dark",
        },
        {
          type: "action",
          icon: "reload",
          name: "시스템 설정 사용",
          onClick: () => {
            change("system");
          },
          checked: system,
        },
      ],
    },
    {
      type: "action",
      icon: "pin",
      name: "항상 위에 표시",
      checked: isAlwaysOnTop,
      onClick: () => {
        setIsAlwaysOnTop(!isAlwaysOnTop);
        appWindow.setAlwaysOnTop(!isAlwaysOnTop);
      },
    },
    {
      type: "seperator",
    },
    {
      type: "action",
      icon: "settings",
      name: "설정",
    },
    {
      type: "seperator",
    },
    {
      type: "action",
      icon: "logout",
      name: "로그아웃",
      onClick: () => {
        invoke("api_user_logout");
      },
    },
  ];
  return (
    <StyledNavigation
      width={240}
      height={0}
      minConstraints={[180, 0]}
      maxConstraints={[
        Math.min(window.innerWidth - 180, window.innerWidth / 3),
        0,
      ]}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={() => setIsResizing(false)}
      handle={<StyledHandle isResizing={isResizing} />}
      children={
        <>
          {children}
          <StyledBottom>
            <StyledProfiles
              ref={profileRef}
              onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
            >
              <img alt="profile" src={defaultProfile} />
              <span>인성</span>
              <Icon size={16} type="arrow-2-right" />
            </StyledProfiles>
            <ContextMenu
              items={contextMenuItems}
              open={isContextMenuOpen}
              onClose={() => {
                setIsContextMenuOpen(false);
              }}
              {...contextMenuPos}
            />
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
