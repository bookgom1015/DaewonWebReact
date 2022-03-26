import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        const token = localStorage.getItem('token');
        
        return (
            <header>
                <Navbar className='navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3' light>
                    <Container>
                        <NavbarBrand>대원강업</NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className='mr-2' />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                            {token != null &&
                            <ul className='navbar-nav flex-glow'>
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary" to="/">홈으로</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary" to="/chart">차트보기</NavLink>
                                </NavItem>
                                {this.props.isAdmin &&
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary" to="/admin">관리자</NavLink>
                                </NavItem>
                                }
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary" to="/logout">로그아웃</NavLink>
                                </NavItem>
                            </ul>
                            }
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}