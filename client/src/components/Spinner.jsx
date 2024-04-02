import React from "react";
import gif from "../assets/spinner-loading.gif";

export default function Spinner({ height, width }) {
  if (!height) height = 25;
  if (!width) width = 25;
  return (
    <div>
      <img src={gif} width={width} height={height} />
    </div>
  );
}
