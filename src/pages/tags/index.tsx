import { Button } from "@insd47/library";

import styles from "./styles.module.scss";
import { MainLayout } from "@/layouts";

export default function Main() {
  return (
    <MainLayout
      toolbarRight={[
        <Button type="filled" size="small" icon="plus">
          새 태그
        </Button>,
      ]}
    ></MainLayout>
  );
}
