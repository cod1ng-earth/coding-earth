import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as RabbitHole } from "./../images/rabbit-hole.svg";
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

const StyledRabbitHole = styled(RabbitHole)`
  height: 300px;
  width: 300px;
  position: absolute;
  top: 50px;
  right: 100px;
  #outer-sparkle {
    animation: ${pulse} infinite 4s linear;
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
