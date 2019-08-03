import React from "react";
import { ReactComponent as Rabbit } from "./../images/hasi.svg";
import styled, { keyframes } from "styled-components";

const move = keyframes`
0% {
  transform: translate(0px, 0px);

  transform-origin: center;
}
100% {
  transform: translate(100px, 0px);
  transform-origin: center;
}
`;

const moveLegs = keyframes`
0% {
  transform: rotate(-5deg);
  transform-origin: center;
}
100% {
  transform: rotate(10deg);
  transform-origin: center;
}
`;

const StyledRabbit = styled(Rabbit)`
height: 85px;
width: 100px;
position: absolute;
top: 145px;
right: 350px;
z-index: 1000;
  #carrot {
    display: none;
  }

animation: ${move} infinite 2s ease-in;

#upper-right-leg-sitting, #upper-left-leg-sitting, #lower-left-leg-sitting, #lower-right-leg-sitting {
  animation: ${moveLegs} infinite 1s linear;
  }

`;

export default props => {
  return <StyledRabbit />;
};
