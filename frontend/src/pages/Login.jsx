import {useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const [ showPassword, setShowPassword ] = useState(false);
  const { loginUser , loginError, loginInfo, updateLoginInfo, isLoginLoading } = useContext(AuthContext);
  
  return (
    <Form className="login-main">
      <Col className="login-left">
        <img src={Image} alt="" />
      </Col>
      <Col className="login-right">
        <Col className="login-right-container">
          <Col className="login-logo">
            <img src={Logo} alt="" />
          </Col>
          <Col className="login-center">
            <h2>Chào mừng trở lại!</h2>
            <p>Vui lòng nhập thông tin của bạn</p>
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
                            placeholder="Mật khẩu" 
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
                    Ghi nhớ trong 30 ngày
                  </label>
                </Col>
                <a href="#" className="forgot-pass-link">
                  Quên mật khẩu?
                </a>
              </Col>
              <Col className="login-center-buttons">
                <Button variant="primary" type="submit" onClick={loginUser}>{isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}</Button>
                <Button variant="primary" type="submit" onClick={(e) => {}}>
                  <img src={GoogleSvg} alt="" />
                  Đăng nhập với Google
                </Button>
              </Col>
            </Stack>
          </Col>

          <p className="login-bottom-p">
            Chưa có tài khoản? <a href="#"onClick={e => {
                    e.preventDefault();
                    navigate("/register");
                  }}>Đăng ký</a>
          </p>
        </Col>
      </Col>
    </Form>
  );
};

export default Login;