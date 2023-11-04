import React from 'react';
import { StyledToolbar } from './styles';

export default function Toolbar({
  left,
  right,
}: {
  left?: React.ReactNode[];
  right?: React.ReactNode[];
}) {
  return (
    <StyledToolbar>
      <div>{left}</div>
      <div>{right}</div>
    </StyledToolbar>
  );
}
