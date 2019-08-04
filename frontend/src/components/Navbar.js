import React, { useState, useEffect } from 'react';
import { Navbar } from 'react-bulma-components/lib';
import { Control, Input } from 'react-bulma-components/lib/components/form';
import Icon from 'react-bulma-components/lib/components/icon';
import Modal from 'react-bulma-components/lib/components/modal';
import Button from 'react-bulma-components/lib/components/button';

import LoginControl from './LoginControl';
import { UserSession, Person } from "blockstack/lib";

export default ({onSearch}) => {
    const [open, setOpen] = useState(false);
    const [search, onSearchChange] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [profile, setProfile] = useState("");

    useEffect(() => {
        const checkSignedInStatus = () => {
            let userSession = new UserSession();
            if (userSession.isUserSignedIn()) {
                setIsLoggedIn(true);
                // const userData = blockstack.loadUserData();
                // showProfile(userData.profile);
            } else if (userSession.isSignInPending()) {
                userSession.handlePendingSignIn().then(userData => {
                    window.location = window.location.origin;
                    // showProfile(userData.profile);
                });
                setIsLoggedIn(false)
            }
        };
        checkSignedInStatus();
    });


    const showProfile = () => {
        let userSession = new UserSession();
        const userData = userSession.loadUserData();
        let person = new Person(userData.profile);
        return <span><strong>Hi {person.givenName()}!</strong></span>;
    };

    return <Navbar color="primary" active={open}>
        <Navbar.Brand>
            <Navbar.Item renderAs="a" href="#">
                Coding Challenge
            </Navbar.Item>
            <Navbar.Burger
                onClick={() => setOpen(!open)}
            />
        </Navbar.Brand>
        <Navbar.Menu >
            <Navbar.Container position="end">
                <Navbar.Item>
                    <form onSubmit={(evt) => {evt.preventDefault(); onSearch(search);} } >
                        <Control iconLeft>
                            <Input placeholder="Text input" className="is-rounded" onChange={evt => {onSearchChange(evt.target.value)} } value={search} />
                            <Icon align="left" icon="search" />
                        </Control>
                    </form>
                </Navbar.Item>
                <Navbar.Item renderAs="span">
                    { isLoggedIn ? showProfile() : '' }
                </Navbar.Item>
                <Navbar.Item>
                    <div>
                        { !isLoggedIn ?
                            <Button color="primary" onClick={() => setShowModal(true)}>Login</Button> :
                            <LoginControl isLoggedIn={isLoggedIn} />
                        }
                        <Modal
                            show={showModal}
                            closeOnBlur={true}
                            onClose={() => setShowModal(false)}
                        >
                            <Modal.Card>
                                <Modal.Card.Head
                                    showClose={false}
                                >
                                    <Modal.Card.Title >
                                        Login
                                    </Modal.Card.Title>
                                </Modal.Card.Head>
                                <Modal.Card.Body>
                                    <LoginControl isLoggedIn={isLoggedIn} />
                                </Modal.Card.Body>
                            </Modal.Card>
                        </Modal>
                    </div>
                </Navbar.Item>
            </Navbar.Container>
        </Navbar.Menu>
    </Navbar>
}
