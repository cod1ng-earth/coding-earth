import React, { useState } from "react";
import axios from "axios";

import { Box, Button, Form, FormField, TextInput } from 'grommet'

import { endpoint } from "../coordinator";

export default props => {
  const [url, setUrl] = useState("");

  const doSubmit = async evt => {
    evt.preventDefault();
    await axios({
      method: "post",
      url: endpoint + "/url",
      data: { url }
    })

    setUrl("");
    return false;
  };

  return (

    <Form onSubmit={evt => doSubmit(evt)}>
      <Box direction="row" margin="xsmall">
        <TextInput
          placeholder="an URL"
          value={url}
          onChange={evt => setUrl(evt.target.value)}
        />
        <Button type="submit" primary label="Add" />

      </Box>
    </Form>
  );
};
