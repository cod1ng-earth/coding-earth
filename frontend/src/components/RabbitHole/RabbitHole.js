import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as RabbitHole } from "./images/rabbit-hole.svg";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
0% {
  transform: scale(0);
  opacity: 1;
  transform-origin: center;
}
100% {
  transform: scale(4.5);
  opacity: 0;
  transform-origin: center;
}
`;

const rotation = keyframes`
0% {
    transform: rotate(0deg);
    transform-origin: center;
}
100% {
    transform: rotate(360deg);
    transform-origin: center;
}
`;

const StyledRabbitHole = styled(RabbitHole)`
  width: 80px;
  position: absolute;
  top: -20px;
  right: 10px;
  #outer-sparkle {
    animation: ${rotation} infinite 25s linear;
  }
  #spiral {
    animation: ${rotation} infinite 5s linear;
  }
  #inner-sparkle {
    animation: ${rotation} infinite 9s linear;
  }
  #weed {
    animation: ${rotation} infinite 15s linear;
  }
`;

export default props => {
  return (
    <div className="">
      <Link to="/rabbithole">
        <StyledRabbitHole />
      </Link>
    </div>
  );
};
