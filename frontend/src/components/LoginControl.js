import React, { Component } from 'react';
import Button from "react-bulma-components/lib/components/button";
import * as blockstack from 'blockstack';
import GitHubLogin from 'react-github-login';
import { githubClientId } from '..';

export default class LoginControl extends Component {
    constructor(props) {
        super(props)

        let isLoggedIn = this.checkSignedInStatus();

        props.onLoggedInChanged(isLoggedIn);

        this.state = {
            isLoggedIn,
        }

        this.handleSignIn = this.handleSignIn.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    checkSignedInStatus() {
        if (blockstack.isUserSignedIn()) {
            return true;
        } else if (blockstack.isSignInPending()) {
            blockstack.handlePendingSignIn().then(function(userData) {
                window.location = window.location.origin;
            })
            return false;
        }
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
        console.log(githubClientId)
        let button;
        if (this.state.isLoggedIn) {
            button = <Button color="primary" onClick={this.handleSignOut}>Logout</Button>;
        } else {
            button = <div className="login-buttons">
                <Button className="login-button" color="info" onClick={this.handleSignIn}>
                    Login with Blockstack
                </Button>
                <GitHubLogin 
                    className="login-button" 
                    clientId={githubClientId} 
                    buttonText="Login in with GitHub"
                    redirectUri="https://patricia-3bw4nzq-ulyecw4ca3wk6.eu-2.platformsh.site"
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