
/*eslint-disable*/
import React from "react";
import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import "../../views/styles/sidebar.css"

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Dropdown, 
} from "reactstrap";

var ps;

const Sidebar = (props) => {
  const logoStyle = {
    maxHeight: '6.5em', 
    // backgroundColor:'#E5E5E5' 
       
  };
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
  const [collapseOpen, setCollapseOpen] = useState();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }
  const navbar_background = {
    backgroundColor:"#004251"
  }
  const nav_text_color = {
    color:"white"
  }
 return (
    <Navbar
      className="navbar-vertical fixed-left"
      expand="md"
      id="sidenav-main"
      style={navbar_background}
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-2" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
              style={logoStyle}
            />
          </NavbarBrand>
        ) : null}
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Navigation */}
          <Nav navbar>
            <NavItem>
              <NavLink
                to='/admin/search'
                tag={NavLinkRRD}
                style={nav_text_color}
              >
                <i className="ni ni-collection text-red" />
                Search
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to='/admin/upload'
                tag={NavLinkRRD}
                style={nav_text_color}
              >
                <i className="ni ni-send text-pink" />
                Upload Documents
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to='/logout'
                tag={NavLinkRRD}
                style={nav_text_color}
              >
                <i className="ni ni-lock-circle-open text-yellow" />
                Logout
              </NavLink>
            </NavItem>
            {/* Invoices moved to bottom with dropdown */}
            <NavItem>
              <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle nav caret style={nav_text_color}>
                  <i className="ni ni-single-copy-04" />
                  Invoices
                </DropdownToggle>
                <DropdownMenu style={{ ...navbar_background, marginLeft: '10px' }} className="custom-dropdown">
                  <DropdownItem
                    tag={NavLinkRRD}
                    to="/admin/invoices"
                    style={nav_text_color}
                  >
                    <i className="ni ni-fat-add" />
                    Generate Invoice
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
