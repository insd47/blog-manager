import React, { PropsWithChildren } from 'react';

import styles from './styles.module.scss';
import Toolbar from '../../components/toolbar';

const MainLayout: React.FC<
  PropsWithChildren<{
    toolbarLeft?: React.ReactNode[];
    toolbarRight?: React.ReactNode[];
  }>
> = ({ children, toolbarLeft, toolbarRight }) => {
  return (
    <main className={styles.main}>
      <Toolbar left={toolbarLeft} right={toolbarRight} />
      <div>{children}</div>
    </main>
  );
};

export default MainLayout;
