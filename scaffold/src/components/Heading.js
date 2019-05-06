import React from 'react';
import styled from 'styled-components';

const StyledHeading = styled.h1`
  font-family: 'ZCOOL KuaiLe', cursive;
  font-style: normal;
`;

const Heading = ({ level, ...rest }) => {
    return (
        <StyledHeading
            as={`h${level}`}
            {...rest}
        />
    )
};

Heading.defaultProps = {
    level: 1
};

export default Heading;