

// reactstrap components
import {
  Button,
  Card,
  
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const login_form ={
    backgroundColor:"lightsteelblue"
  }
  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await login(username, password);
            navigate('/admin/search');
        } catch (error) {
            console.error('Failed to login', error);
        }
    };
  return (
    <>
      <Col lg="5" md="7">
        <Card className="shadow border-0" style={login_form}>
          
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text mb-4">
              <large>Sign in with credentials</large>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        
      </Col>
    </>
  );
};

export default Login;
