import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Login from './pages/login';
import Register from './pages/register';

const LoginTransition: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <TransitionGroup style={{ height: '100%' }}>
      <CSSTransition key={location.pathname} classNames='fade' timeout={380}>
        {outlet}
      </CSSTransition>
    </TransitionGroup>
  );
};

const login = [
  {
    path: '',
    element: <LoginTransition />,
    children: [
      {
        path: '',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
];

export default login;
