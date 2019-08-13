import React, { useState, useContext } from "react";
import axios from "axios";
import { MainContext } from "./../App";

import {
  Field,
  Control,
  Input
} from "react-bulma-components/lib/components/form";
import Button from "react-bulma-components/lib/components/button";
import { endpoint } from "../coordinator";

export default props => {
  const [url, setUrl] = useState("");
  const context = useContext(MainContext);

  const doSubmit = async evt => {
    evt.preventDefault();
    await axios({
      method: "post",
      url: endpoint + "/url",
      data: { url }
    })

    setUrl("");

    context.changeRabbitRun(); 
    return false;
  };

  return (
    <form onSubmit={evt => doSubmit(evt)}>
      <Field kind="addons">
        <Control>
          <Input
            placeholder="an URL"
            value={url}
            onChange={evt => setUrl(evt.target.value)}
          />
        </Control>
        <Control>
          <Button renderAs="button" color="primary">
            Add
          </Button>
        </Control>
      </Field>
    </form>
  );
};
