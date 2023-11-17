import { Button, Textfield } from "@insd47/library";

import styles from "./styles.module.scss";
import { MainLayout } from "@/layouts";

export default function Main() {
  return (
    <MainLayout
      toolbarLeft={[
        <div className={styles.search}>
          <Textfield stretch icon="search" size="small" placeholder="검색" />
        </div>,
        <Button size="small" icon="filter" />,
      ]}
      toolbarRight={[
        <Button type="filled" size="small" icon="upload">
          파일 업로드
        </Button>,
      ]}
    ></MainLayout>
  );
}
