import React from "react";
import { ReactComponent as Rabbit } from "./../images/hasi.svg";
import styled, { keyframes } from "styled-components";

const pulse = keyframes``;

const StyledRabbit = styled(Rabbit)`
  height: 100px;
  width: 100px;
  position: absolute;
  top: 70px;
  left: 400px;
  #upper-left-leg-sitting,
  #upper-right-leg-sitting,
  #lower-right-leg-sitting,
  #lower-left-leg-sitting,
  #carrot,
  #tail {
    display: none;
  }
`;

export default props => {
  return <StyledRabbit />;
};
