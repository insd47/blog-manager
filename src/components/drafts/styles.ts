import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

export const StyledTrafficLights = styled.div`
  box-sizing: border-box;
  flex-shrink: 0;
  width: 92px;
  border-right: 1px solid ${({ theme }) => theme.colors.box.border[2] + ""};
`;

export const StyledDrafts = styled.div`
  box-sizing: border-box;
  display: flex;
  height: 42px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.box.border[2] + ""};
  -webkit-app-region: drag;
`;

export const StyledSmallButton = styled.div<
  PropsWithChildren<{
    isActive?: boolean;
  }>
>`
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  width: 48px;
  height: 42px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.passive[1] + ""};
  transition: background-color 0.07s;
  -webkit-app-region: no-drag;
  border-right: 1px solid ${({ theme }) => theme.colors.box.border[2] + ""};
  position: relative;
  z-index: 5;

  &:hover {
    background-color: ${({ theme }) => theme.colors.box.foreground[1] + ""};
  }

  ${({ isActive, theme }) =>
    isActive &&
    `background-color: ${theme.colors.box.foreground[2] + " !important"};
    color: ${theme.colors.text.main + ""};`}
`;

export const StyledTabList = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex: 1;
`;

export const StyledTab = styled.div<{
  isActive?: boolean;
}>`
  height: 42px;
  box-sizing: border-box;
  position: relative;
  border-right: 1px solid ${({ theme }) => theme.colors.box.border[2] + ""};
  display: flex;
  align-items: center;
  padding-left: 16px;
  color: ${({ theme }) => theme.colors.text.passive[1] + ""};
  max-width: 220px;
  min-width: 54px;
  transition: background-color 0.15s;
  overflow: hidden;

  & span {
    display: flex;
    flex-shrink: 0;
    white-space: nowrap;
    word-break: break-all;

    &:after {
      content: "";
      display: flex;
      width: 48px;
    }
  }

  & button {
    opacity: 0;

    background-color: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text.passive[1] + ""};
    padding: 2px;
    display: flex;
    transition: color 0.15s;

    &:hover {
      color: ${({ theme }) => theme.colors.text.main + ""};
    }

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity 0.15s;
    z-index: 3;
    right: 11px;
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    transition: opacity 0.15s;
  }

  &:before {
    width: 24px;
    z-index: 1;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.colors.box.background + " 75%"}
    );
  }

  &:after {
    z-index: 2;
    opacity: 0;
    width: 48px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.colors.box.foreground[1] + " 50%"}
    );
  }

  -webkit-app-region: no-drag;

  &:hover {
    background-color: ${({ theme }) => theme.colors.box.foreground[1] + ""};

    & button,
    &:after {
      opacity: 1;
    }
  }

  ${({ isActive, theme }) =>
    isActive &&
    `background-color: ${theme.colors.box.foreground[2] + " !important"};
    color: ${theme.colors.text.main + ""};`}
`;

export const StyledPlusButton = styled.button``;
