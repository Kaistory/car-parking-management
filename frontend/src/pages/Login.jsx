import {useState, useContext } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  const [ showPassword, setShowPassword ] = useState(false);
  const { loginUser , loginError, loginInfo, updateLoginInfo, isLoginLoading } = useContext(AuthContext);
  
  return (
    <Form onSubmit= {loginUser} className="login-main">
      <Col className="login-left">
        <img src={Image} alt="" />
      </Col>
      <Col className="login-right">
        <Col className="login-right-container">
          <Col className="login-logo">
            <img src={Logo} alt="" />
          </Col>
          <Col className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <Stack>
              <Form.Control 
                            type="email" 
                            placeholder="Email" 
                            onChange={(e) => updateLoginInfo({
                                ...loginInfo, email: e.target.value
                            })} 
                            className="login-input"
                        />
              <Col className="pass-input-div">
                <Form.Control 
                            type={showPassword ? "text" : "password"}
                            placeholder="Password" 
                            onChange={(e) => updateLoginInfo({
                                ...loginInfo, password: e.target.value
                            })} 
                            className="login-input"
                        />
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
              {
                            loginError?.error && (
                                <Alert variant="danger">
                                  <h5 style={{ color: "red" }}>
                                    {loginError?.message}
                                  </h5>
                                </Alert>
                            )
                        }
              </Col>

              <Col className="login-center-options">
                <Col className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </Col>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </Col>
              <Col className="login-center-buttons">
                <Button variant="primary" type="submit">{isLoginLoading ? "Getting you in..." : "Login"}</Button>
                <Button variant="primary" type="submit">
                  <img src={GoogleSvg} alt="" />
                  Log In with Google
                </Button>
              </Col>
            </Stack>
          </Col>

          <p className="login-bottom-p">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </Col>
      </Col>
    </Form>
  );
};

export default Login;