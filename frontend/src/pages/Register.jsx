import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Alert, Button, Form, Col, Stack } from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError(null);
    if (registerInfo.password !== registerInfo.confirmPassword) {
      setRegisterError({ error: true, message: "Mật khẩu không khớp" });
      return;
    }
    setIsRegisterLoading(true);
    // TODO: Gửi request đăng ký và gửi OTP về email
    setTimeout(() => {
      setIsRegisterLoading(false);
      setShowOtp(true); // Hiện form nhập OTP
    }, 1500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError(null);
    setIsOtpLoading(true);
    // TODO: Xác thực OTP ở đây
    setTimeout(() => {
      setIsOtpLoading(false);
      if (otp === "123456") {
        // Giả lập OTP đúng
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        setOtpError("Mã OTP không đúng. Vui lòng thử lại.");
      }
    }, 1000);
  };

  return (
    <Form onSubmit={showOtp ? handleOtpSubmit : handleRegister} className="login-main">
      <Col className="login-left">
        <img src={Image} alt="" />
      </Col>
      <Col className="login-right">
        <Col className="login-right-container">
          <Col className="login-logo">
            <img src={Logo} alt="" />
          </Col>
          <Col className="login-center">
            {!showOtp ? (
              <>
                <h2>Tạo tài khoản của bạn</h2>
                <p>Vui lòng điền thông tin chi tiết</p>
                <Stack>
                  <Form.Control
                    type="text"
                    placeholder="Tên người dùng"
                    value={registerInfo.username}
                    onChange={(e) =>
                      setRegisterInfo({ ...registerInfo, username: e.target.value })
                    }
                    className="login-input"
                    required
                  />
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={registerInfo.email}
                    onChange={(e) =>
                      setRegisterInfo({ ...registerInfo, email: e.target.value })
                    }
                    className="login-input"
                    required
                  />
                  <Col className="pass-input-div">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={registerInfo.password}
                      onChange={(e) =>
                        setRegisterInfo({ ...registerInfo, password: e.target.value })
                      }
                      className="login-input"
                      required
                    />
                    {showPassword ? (
                      <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                    ) : (
                      <FaEye onClick={() => setShowPassword(!showPassword)} />
                    )}
                  </Col>
                  <Col className="pass-input-div">
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu"
                      value={registerInfo.confirmPassword}
                      onChange={(e) =>
                        setRegisterInfo({
                          ...registerInfo,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="login-input"
                      required
                    />
                    {showConfirm ? (
                      <FaEyeSlash onClick={() => setShowConfirm(!showConfirm)} />
                    ) : (
                      <FaEye onClick={() => setShowConfirm(!showConfirm)} />
                    )}
                    {registerError?.error && (
                      <Alert variant="danger">
                        <h5 style={{ color: "red" }}>{registerError?.message}</h5>
                      </Alert>
                    )}
                  </Col>
                  <Col className="login-center-buttons">
                    <Button variant="primary" type="submit">
                      {isRegisterLoading ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </Col>
                </Stack>
              </>
            ) : (
              <>
                <h2>Nhập mã OTP</h2>
                <p>Chúng tôi đã gửi mã xác minh đến email của bạn.</p>
                <Stack>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="login-input"
                    required
                  />
                  {otpError && (
                    <Alert variant="danger">
                      <h5 style={{ color: "red" }}>{otpError}</h5>
                    </Alert>
                  )}
                  <Col className="login-center-buttons">
                    <Button variant="primary" type="submit">
                      {isOtpLoading ? "Đang xác minh..." : "Xác minh"}
                    </Button>
                  </Col>
                </Stack>
              </>
            )}
          </Col>
          <p className="login-bottom-p">
            {showOtp ? (
              <>
                Không nhận được mã? <a href="#">Gửi lại</a>
              </>
            ) : (
              <>
                Đã có tài khoản? <a href="#" onClick={e => {
                    e.preventDefault();
                    navigate("/login");
                  }}>Đăng nhập</a>
              </>
            )}
          </p>
        </Col>
      </Col>
    </Form>
  );
};

export default Register;