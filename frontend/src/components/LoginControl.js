import React, { Component } from 'react';
import Button from "react-bulma-components/lib/components/button";
import * as blockstack from 'blockstack';

export default class LoginControl extends Component {
    constructor(props) {
        super(props)

        let isLoggedIn = this.checkSignedInStatus();

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
            button = <Button type="primary" onClick={this.handleSignOut}>Logout</Button>;
        } else {
            button = <Button type="primary" onClick={this.handleSignIn}>Login with Blockstack</Button>;
        }
        return (
            <div>
                {button}
            </div> 
        )
    }
}