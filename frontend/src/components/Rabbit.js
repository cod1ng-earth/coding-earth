import React from "react";
import { ReactComponent as Rabbit } from "./../images/hasi.svg";
import styled, { keyframes } from "styled-components";

const pulse = keyframes``;

const StyledRabbit = styled(Rabbit)`
height: 85px;
width: 100px;
position: absolute;
top: 145px;
left: 100px;
  #carrot {
    display: none;
  }
`;

export default props => {
  return <StyledRabbit />;
};
