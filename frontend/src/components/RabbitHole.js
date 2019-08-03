import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as RabbitHole } from "./../images/rabbit-hole.svg";
import styled, { keyframes } from "styled-components";

const StyledRabbitHole = styled(RabbitHole)`
  height: 300px;
  width: 300px;
  position: absolute;
  top: 50px;
  right: 100px;
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
