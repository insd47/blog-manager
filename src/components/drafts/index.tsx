import { Icon } from "@insd47/library";
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
import { useLocation } from "react-router-dom";
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

export default function Drafts() {
  const { pathname } = useLocation();

  const [platform, setPlatform] = useState<TauriPlatform>("darwin");

  const init = async () => setPlatform(await tauriPlatform());
  useEffect(() => {
    init();
  }, []);

  const draftURL = "/posts/add";
  const isDraft = pathname.slice(0, draftURL.length) === draftURL;

  return (
    <StyledDrafts>
      {platform === "darwin" && <StyledTrafficLights data-tauri-drag-region />}
      <StyledSmallButton isActive={!isDraft}>
        <Icon type={!isDraft ? "grid-f" : "grid"} size={18} />
      </StyledSmallButton>
      <StyledTabList>
        <Tab title="NextJS를 이용하여 부대찌개 깔끔하게 잘 끓이는 법" />
        <Tab title="제목 없음 1" />
        <Tab title="제목 없음 2" />
        <Tab title="제목 없음 3" />
        <Tab title="제목 없음 4" />
        <Tab title="제목 없음 5" />
        <StyledSmallButton style={{ width: 42 }}>
          <Icon type="plus" size={18} />
        </StyledSmallButton>
        <div data-tauri-drag-region style={{ flex: 1 }} />
      </StyledTabList>
    </StyledDrafts>
  );
}
