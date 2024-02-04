import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import { useState } from "react";

export function ForgotPassword() {
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleFPCancel = () => {
    setShowForgotPasswordModal(false);
    setOtpSent(false);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const encodedEmail = encodeURIComponent(email);
  const handleSendOTP = async () => {
    try {
      await axios.post(`/api/Account/OtpGeneration?email=${encodedEmail}`);
      setOtpSent(true);
      message.success("OTP sent successfully");
    } catch (error: any) {
      message.error(error.response.data);
    }
  };

  const handleSetNewPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        message.error("Passwords do not match");
        return;
      }

      await axios.post("/api/Account/VerifyOTP/VerifyOTP", {
        officialMailId: email,
        newPassword: confirmPassword,
        otp: otp,
      });

      Modal.success({
        title: "Success",
        content: "Your password has been reset successfully",
        onOk: handleFPCancel,
      });
    } catch (error: any) {
      message.error(error.response.data);
      handleFPCancel();
    }
  };

  return (
    <div>
      <Button
        className="forgotPassw"
        type="link"
        onClick={handleForgotPasswordClick}
      >
        Forgot Password?
      </Button>

      <Modal
        title="Forgot Password"
        open={showForgotPasswordModal}
        onCancel={handleFPCancel}
        footer={[
          <Button key="cancel" onClick={handleFPCancel}>
            Cancel
          </Button>,
          otpSent ? (
            <Button
              key="set-password"
              type="primary"
              onClick={handleSetNewPassword}
            >
              Set New Password
            </Button>
          ) : (
            <Button key="send-otp" type="primary" onClick={handleSendOTP}>
              Send OTP
            </Button>
          ),
        ]}
      >
        <Form>
          {otpSent ? (
            <>
              <Form.Item
                label="OTP"
                name="otp"
                rules={[
                  {
                    required: true,
                    message: "Please enter the OTP you received",
                  },
                  {
                    pattern: /^\d{4}$/,
                    message: "Please enter a 4-digit OTP",
                  },
                ]}
              >
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter a new password",
                  },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long",
                  },
                ]}
              >
                <Input.Password
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password",
                  },
                ]}
              >
                <Input.Password
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              label="Email"
              name="officialMailId"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                style={{
                  height: 40,
                  justifyContent: "center",
                  display: "flex",
                  borderRadius: "5px",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
