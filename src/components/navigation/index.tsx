import { Frame, Category, Item, External } from "./components";

export default function Navigation() {
  return (
    <Frame>
      <Category title="요약">
        <Item path="/" title="홈" icon="home" activeIcon="home-f" />
        <Item
          path="/statistics"
          title="통계"
          icon="statistic"
          activeIcon="statistic-f"
        />
      </Category>
      <Category title="관리">
        <Item path="/posts" title="게시물" icon="grid" activeIcon="grid-f" />
        <Item path="/tags" title="태그" icon="tag" activeIcon="tag-f" />
        <Item path="/images" title="이미지" icon="photo" activeIcon="photo-f" />
        <Item path="/meta" title="메타데이터" icon="code" activeIcon="code" />
      </Category>
      <Category title="기타">
        <External
          path="https://blog.insd.dev"
          title="블로그 열기"
          icon="link"
        />
      </Category>
    </Frame>
  );
}
