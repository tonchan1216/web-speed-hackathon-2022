import React from "react";

/**
 * @typedef Props
 * @property {string} src
 * @property {number} width
 * @property {number} height
 */

/** @type {React.VFC<Props>} */
export const TrimmedImage = ({ height, src, type="thumbnail", width }) => {
  const thumbnail = src.replace(/(races|players)/, `$1/${type}`)
  return <img height={height} src={thumbnail} width={width} />;
};
