import { Button, Textfield } from "@insd47/library";

import styles from "./styles.module.scss";
import { MainLayout } from "@/layouts";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <MainLayout
      toolbarLeft={[
        <div className={styles.search}>
          <Textfield
            stretch
            size="small"
            icon="search"
            placeholder="id, 제목, 태그 등"
          />
        </div>,
        <Button size="small" icon="tag" />,
      ]}
      toolbarRight={[
        <Button size="small" icon="upload" />,
        <Link to="/editor/add">
          <Button type="filled" size="small" icon="plus">
            새 게시물
          </Button>
        </Link>,
      ]}
    ></MainLayout>
  );
}
