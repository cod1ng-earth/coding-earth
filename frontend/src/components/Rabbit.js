import React, { useContext } from "react";
import { ReactComponent as Rabbit } from "./../images/hasi.svg";
import { ReactComponent as AppearHole } from "./../images/appear-hole.svg";
import styled, { css, keyframes } from "styled-components";
import { MainContext } from "./../App";

const openHole = keyframes`
0% {
  transform: scaleX(0);
  transform-origin: center;

}

15%
 {
  transform: scaleX(1);
  transform-origin: center;

}

85%
{
 transform: scaleX(1);
 transform-origin: center;

}

100% {  transform: scaleX(0);
  transform-origin: center;

}

`;

// const appendRabbit = keyframes`
// 0% {
// opacity: 0;
//
//
// }
//
// 25%
//  {
// opacity: 0;
//
// }
//
// 75%
// {
// opacity: 1;
//
// }
//
// 100% {
//   opacity: 1;
//
// }
//
// `;

const move = keyframes`
0% {

  transform: translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1);
  transform-origin: center;
}

15% {

  transform: translate(110px, -20px) rotate(0deg) scaleX(1) scaleY(1);
  transform-origin: center;
}

25% {

  transform: translate(180px, 0px) rotate(0deg) scaleX(1) scaleY(1);
  transform-origin: center;
}

100% {

  transform: translate(180px, 0px) rotate(720deg) scaleX(0) scaleY(0);
  transform-origin: center;
}
`;

const moveLegsOne = keyframes`
0% {
  transform: rotate(-5deg);
  transform-origin: center;
}
50% {
  transform: rotate(7deg);
  transform-origin: center;
}

100% {
  transform: rotate(-5deg);
  transform-origin: center;
}
`;

const moveLegsTwo = keyframes`
0% {
  transform: rotate(7deg);
  transform-origin: center;
}
50% {
  transform: rotate(-5deg);
  transform-origin: center;
}

100% {
  transform: rotate(7deg);
  transform-origin: center;
}

`;

const moveTail = keyframes`
0% {
  transform: rotate(-3deg);
  transform-origin: center;
}
100% {
  transform: rotate(3deg);
  transform-origin: center;
}
`;

const moveEars = keyframes`
0% {
  transform: translate(0px, 0px);
  transform-origin: center;
}
50% {
  transform: translate(0px, 30px);
  transform-origin: center;
}

100% {
  transform: translate(0px, 0px);
  transform-origin: center;
}
`;

const moveFace = keyframes`
0% {
  transform: translate(0px, 20px);
  transform-origin: center;
}
50% {
  transform: translate(0px, -10px);
  transform-origin: center;
}

100% {
  transform: translate(0px, 20px);
  transform-origin: center;
}
`;



const moveAnimation = css`
  animation: ${move} 5s linear forwards;

  #upper-right-leg-sitting,
  #lower-left-leg-sitting {
    animation: ${moveLegsOne} 1s linear;
  }

  #upper-left-leg-sitting,
  #lower-right-leg-sitting {
    animation: ${moveLegsTwo} 1s linear;
  }

  #tail {
    animation: ${moveTail}  1s linear;
  }
  #carrot {
  display: block;

}

`;




const StyledRabbit = styled(Rabbit)`
  height: 85px;
  width: 100px;
  position: absolute;
  top: 145px;
  right: 380px;
  z-index: 1000;
  #carrot {
    display: none;
  }


  ${props => (props.running ? moveAnimation : "")};

  #left-ear,
  #right-ear {
    animation: ${moveEars} infinite 1s linear;
  }
  #face,
  #eyes,
  #nose,
  #carrot {
    animation: ${moveFace} infinite 1s linear;
  }




`;



// const StyledHole = styled(AppearHole)`
//   height: 100px;
//   width: 100px;
//   position: absolute;
//   top: 145px;
//   right: 380px;
//   z-index: 1000;
//
//   animation: ${openHole} 1.5s linear forwards;
//
//
//
//
// `;



export default props => {
  const context = useContext(MainContext);

  return <div> <StyledRabbit running={context.rabbitRun} /></div>;
};
