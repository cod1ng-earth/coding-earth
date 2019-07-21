import React, { useState } from 'react';


import { Navbar } from 'react-bulma-components/lib';
import { Control, Input } from 'react-bulma-components/lib/components/form';
import Icon from 'react-bulma-components/lib/components/icon';

export default ({onSearch}) => {
    const [open, setOpen] = useState(false);
    const [search, onSearchChange] = useState("");

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
            </Navbar.Container>
        </Navbar.Menu>


    </Navbar>
}
