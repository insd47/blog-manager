import styled from "@emotion/styled";

export const StyledToolbar = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 54px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.box.border[2] + ""};
  padding: 0 16px;
  align-items: center;
  column-gap: 12px;

  & > div:nth-of-type(1) {
    display: flex;
    flex-shrink: 0;
    column-gap: 12px;
    flex: 1;
  }

  & > div:nth-of-type(2) {
    display: flex;
    column-gap: 12px;
    flex-shrink: 0;
  }
`;
