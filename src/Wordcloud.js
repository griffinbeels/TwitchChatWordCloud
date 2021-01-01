import React from "react"
import ReactWordcloud from 'react-wordcloud';

const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "impact",
    fontSizes: [12, 100],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 2,
    rotations: 1,
    rotationAngles: [0, 90],
    scale: "linear",
    spiral: "rectangular",
    transitionDuration: 500,
    enableOptimizations: true,
  };

export function SimpleWordcloud(client) {
  return <ReactWordcloud 
  words={client.words}
  options={options}
   />
}