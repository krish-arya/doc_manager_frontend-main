
import { Link } from "react-router-dom";
// reactstrap components
import {
  NavbarBrand,
  Navbar,
  Container
} from "reactstrap";

const AdminNavbar = () => {
  const logoStyle = {
    maxWidth: '15%',  // Ensures logo doesn't exceed the container's width
    height: 'auto'     // Maintains aspect ratio
  };
  return (
    <>
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <Container className="px-4">
          <NavbarBrand to="" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/logo-large.jpg")
                
              }
              style={logoStyle}
            />
          </NavbarBrand>
          
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
