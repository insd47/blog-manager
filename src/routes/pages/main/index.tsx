import { Button } from "@insd47/library";

import styles from "./styles.module.scss";
import MainLayout from "@/layouts/main";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <MainLayout
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
