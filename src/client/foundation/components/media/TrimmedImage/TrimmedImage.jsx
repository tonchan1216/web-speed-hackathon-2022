import React from "react";
import styled from "styled-components";

const Wrapper = styled.img`
  aspect-ratio: ${(props) => (props.type == "live" ? "16 / 9" : "1 / 1")};
  height: auto;
  max-width: 100%;
`;

/**
 * @typedef Props
 * @property {string} src
 * @property {string} type
 * @property {number} width
 * @property {number} height
 */

/** @type {React.VFC<Props>} */
export const TrimmedImage = ({ height, src, type = "thumbnail", width }) => {
  const thumbnail = src.replace(/(races|players)/, `$1/${type}`);
  const webp = thumbnail.replace(/(.*)\.jpg/, `$1.webp`);
  return <Wrapper height={height} src={webp} type={type} width={width} />;
};
