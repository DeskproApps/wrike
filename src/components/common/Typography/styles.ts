import { css } from "styled-components";

export const dpNormalize = css`
  p {
    margin-top: 0;
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p:first-child,
  ol:first-child,
  ul:first-child {
    margin-top: 0;
  }

  ol, ul {
    padding-inline-start: 20px;
  }

  img {
    width: 100%;
    height: auto;
  }

  a {
    color: ${({ theme }) => theme.colors.cyan100};
    cursor: pointer;
  }

  a:hover, a:visited, a:active {
    color: ${({ theme }) => theme.colors.cyan80};
  }
`;
