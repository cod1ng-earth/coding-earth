import React, { useState } from "react";
import axios from "axios";

import { Box, Button, Form, TextInput } from 'grommet'

import { endpoint } from "../../coordinator";

export default ({ onSubmitted }) => {
  const [url, setUrl] = useState("");

  const doSubmit = async evt => {
    evt.preventDefault();
    onSubmitted(url)

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
          placeholder="any URL"
          value={url}
          onChange={evt => setUrl(evt.target.value)}
        />
        <Button type="submit" primary label="Add" margin={{ left: "small" }} />

      </Box>
    </Form>
  );
};
