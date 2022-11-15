import React from "react";

/**
 * @typedef Props
 * @property {string} src
 * @property {number} width
 * @property {number} height
 */

/** @type {React.VFC<Props>} */
export const TrimmedImage = ({ src, type="thumbnail" }) => {
  const thumbnail = src.replace(/(races|players)/, `$1/${type}`)
  return <img src={thumbnail} />;
};
