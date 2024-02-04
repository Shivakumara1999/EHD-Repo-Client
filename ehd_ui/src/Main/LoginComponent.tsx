import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contextAuth } from "./GlobalState";
import { ForgotPassword } from "./Forgotpassword";

export function Login() {
  const [AddProjectForm] = Form.useForm();
  const navigate = useNavigate();
  const [role, setRole] = useContext<any>(contextAuth);
  setRole(localStorage.getItem("role"));
  const Login = (values: any) => {
    axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      url: "/api/Account/LoginCandidate",
      data: values,
    })
      .then((r: any) => {
        const token = r.data;
        sessionStorage.setItem("token", token);
        const decodedToken: any = jwtDecode(token);
        localStorage.setItem("OfficialMailId", decodedToken.OfficialMailId);
        localStorage.setItem("EmployeeId", decodedToken.EmployeeId);
        localStorage.setItem("role", decodedToken.RoleId);
        localStorage.setItem("DepartmentId", decodedToken.DepartmentId);
        localStorage.setItem("DepartmentName", decodedToken.DepartmentName);
        console.log(localStorage.getItem("DepartmentName"));
        console.log(localStorage.getItem("DepartmentId"));
        setRole(decodedToken.RoleId);
        if (decodedToken.RoleId === "R01") {
          navigate("/admin/dashboard");
        } else if (decodedToken.RoleId === "R02") {
          navigate("/user/overview");
        } else if (decodedToken.RoleId === "R03") {
          navigate("/ticketing/overviewIt");
        } else if (decodedToken.RoleId === "R04") {
          navigate("/ticketing/overviewPy");
        } else if (decodedToken.RoleId === "R05") {
          navigate("/ticketing/overviewFc");
        } else if (decodedToken.RoleId === "R06") {
          navigate("/ticketing");
        } else if (decodedToken.RoleId === "R07") {
          navigate("/ticketing");
        } else {
          alert("You are not Registered");
        }
      })
      .catch((error: any) => {
        message.error(error.response.data);
        AddProjectForm.resetFields();
      });
  };

  return (
    <>
      <div className="main-container">
        <div className="logo"></div>
      </div>
      <div className=" login">
        <h1 className="EHD">Joy Help Desk</h1>
        <Form onFinish={Login} form={AddProjectForm}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
            name="officialMailId"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              className="input-field"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="input-field"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Login
            </Button>
          </Form.Item>
        </Form>
        <ForgotPassword />
      </div>
    </>
  );
}
