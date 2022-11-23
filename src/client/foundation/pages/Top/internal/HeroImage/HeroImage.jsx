import styled from "styled-components";

const Image = styled.img`
  aspect-ratio: 1440 / 1033;
  display: block;
  margin: 0 auto;
  width: 100%;
`;

/**
 * @typedef Props
 * @type {object}
 * @property {string} url
 */

/** @type {React.VFC<Props>} */
export const HeroImage = ({ url }) => {
  return <Image alt="" src={url} />;
};
