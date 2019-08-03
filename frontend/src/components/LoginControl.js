import React, { Component } from 'react';
import Button from "react-bulma-components/lib/components/button";
import * as blockstack from 'blockstack';
import GitHubLogin from 'react-github-login';

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
                    clientId={process.env.REACT_APP_GITHUB_CLIENT_ID} 
                    buttonText="Login in with GitHub"
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