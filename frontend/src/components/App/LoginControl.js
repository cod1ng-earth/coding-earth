import React, { Component } from 'react';
import Button from "react-bulma-components/lib/components/button";
import * as blockstack from 'blockstack';
import GitHubLogin from 'react-github-login';
import { githubClientId } from '../..';
import axios from 'axios';
import { endpoint } from "../../coordinator";

export default class LoginControl extends Component {
    constructor(props) {
        super(props)

        this.handleSignIn = this.handleSignIn.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    handleSignIn(event) {
        event.preventDefault();
        blockstack.redirectToSignIn()
    }

    handleSignOut(event) {
        event.preventDefault();
        blockstack.signUserOut(window.location.origin)
    }

    render() {
        let button;
        if (this.props.isLoggedIn) {
            button = <Button color="primary" onClick={this.handleSignOut}>Logout</Button>;
        } else {
            button = <div className="login-buttons">
                <Button className="login-button" color="info" onClick={this.handleSignIn}>
                    Login with Blockstack
                </Button>
                <GitHubLogin
                    className="login-button"
                    clientId={githubClientId}
                    // redirectUri="https://patricia-3bw4nzq-ulyecw4ca3wk6.eu-2.platformsh.site"
                    redirectUri="http://localhost:3000"
                    buttonText="Login in with GitHub"
                    onSuccess={(res) => {
                        axios({
                            method: 'post',
                            url: endpoint + "/github",
                            data: { code: res.code },
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8',
                                "Access-Control-Allow-Origin": "*",
                            }
                        });
                    }}
                    onFailure={(res) => console.log(res)}
                />
            </div>;
        }
        return (
            <div>
                {button}
            </div>
        )
    }
}
