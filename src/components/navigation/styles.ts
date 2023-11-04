import styled from "@emotion/styled";
import { ResizableBox } from "react-resizable";

export const StyledNavigation = styled(ResizableBox)`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  max-width: calc(100vw - 160px);
  height: 100% !important;
  position: relative;
  z-index: 5;
  background-color: ${({ theme }) => theme.colors.box.foreground[2] + ""};
  padding-top: 40px;

  & a {
    text-decoration: none;
    color: inherit;
  }
`;

export const StyledHandle = styled.div<{
  isResizing?: boolean;
}>`
  position: absolute;
  z-index: 1;

  height: 100%;
  width: 12px;
  top: 0;
  right: -6px;

  cursor: col-resize;

  &:after {
    content: "";
    width: 1px;
    position: absolute;
    top: 0;
    left: 5px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.box.border[2] + ""};
    transition: background-color 0.1s;

    ${({ isResizing, theme }) =>
      isResizing &&
      `background-color: ${theme.colors.text.passive[2]} !important;`}
  }

  &:hover:after {
    background-color: ${({ theme }) => theme.colors.text.passive[3] + ""};
  }
`;

export const StyledCategories = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  row-gap: 10px;
  margin-bottom: 30px;

  & > p {
    margin: 0 12px;
    color: ${({ theme }) => theme.colors.text.passive[1] + ""};
  }

  & > ul {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    list-style: none;
  }
`;

export const StyledItem = styled.li<{
  isActive?: boolean;
}>`
  display: flex;
  height: 36px;
  box-sizing: border-box;

  align-items: center;
  padding: 0 12px;
  column-gap: 12px;
  border-radius: ${({ theme }) => theme.variables.radius[4]};
  background-color: ${({ theme, isActive }) =>
    isActive && theme.colors.box.filled[1] + " !important"};

  transition: background-color 0.07s;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: ${({ theme }) => theme.colors.box.filled[2] + ""};
  }

  & > i {
    transition: color 0.15s;

    color: ${({ theme, isActive }) =>
      !isActive && theme.colors.text.passive[1] + ""};
  }
`;

export const StyledBottom = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 10px 20px 10px;
`;

export const StyledProfiles = styled.button<{
  isActive?: boolean;
}>`
  border: none;
  display: flex;
  height: 36px;
  box-sizing: border-box;
  align-items: center;
  padding: 0 12px;
  column-gap: 12px;
  border-radius: ${({ theme }) => theme.variables.radius[4]};
  background-color: transparent;
  transition: background-color 0.07s;
  color: inherit;
  outline: none;

  background-color: ${({ theme, isActive }) =>
    isActive && theme.colors.box.filled[1] + " !important"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.box.filled[2] + ""};
  }

  & > img {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    object-fit: cover;
    background-color: ${({ theme }) => theme.colors.box.filled[2] + ""};
  }

  & > span {
    flex: 1;
    display: flex;
  }

  & > i {
    transition: color 0.15s;

    color: ${({ theme, isActive }) =>
      !isActive && theme.colors.text.passive[1] + ""};
  }
`;
