import { Icon, useRightClickMenu } from "@insd47/library";
import {
  Platform as TauriPlatform,
  platform as tauriPlatform,
} from "@tauri-apps/api/os";

import {
  StyledDrafts,
  StyledSmallButton,
  StyledTab,
  StyledTabList,
  StyledTrafficLights,
} from "./styles";

import type { TabProps } from "./types";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Tab = ({ title, isActive }: TabProps) => {
  return (
    <StyledTab isActive={isActive}>
      <span>{title}</span>
      <button>
        <Icon type="exit" size={14} />
      </button>
    </StyledTab>
  );
};

export default function Tabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [platform, setPlatform] = useState<TauriPlatform>("darwin");

  const init = async () => setPlatform(await tauriPlatform());
  useEffect(() => {
    init();
  }, []);

  const editorURL = "/editor/add";
  const isDraft = pathname.slice(0, editorURL.length) === editorURL;

  const [plusMenu, plusRef] = useRightClickMenu<HTMLDivElement>([
    {
      type: "action",
      icon: "plus",
      name: "새 게시물",
    },
    { type: "seperator" },
    {
      type: "action",
      icon: "upload",
      name: ".md 파일 불러오기",
    },
  ]);

  return (
    <StyledDrafts>
      {platform === "darwin" && <StyledTrafficLights data-tauri-drag-region />}
      <StyledSmallButton onClick={() => navigate("/")} isActive={!isDraft}>
        <Icon type={!isDraft ? "home-f" : "home"} size={18} />
      </StyledSmallButton>
      <StyledTabList>
        <Tab title="NextJS를 이용하여 부대찌개 깔끔하게 잘 끓이는 법" />
        <Tab title="제목 없음 1" />
        <Tab title="제목 없음 2" />
        <Tab title="제목 없음 3" />
        <Tab title="제목 없음 4" />
        <Tab title="제목 없음 5" />
        <StyledSmallButton ref={plusRef} style={{ width: 42 }}>
          <Icon type="plus" size={18} />
          {plusMenu}
        </StyledSmallButton>
        <div data-tauri-drag-region style={{ flex: 1 }} />
      </StyledTabList>
    </StyledDrafts>
  );
}
