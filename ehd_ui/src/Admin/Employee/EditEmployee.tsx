import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";

import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";

export function EditEmployee(props: any) {
  const [form] = Form.useForm();
  form.setFieldsValue(props.selectedRows[0]);
  const JoiningDate = props.selectedRows[0].joiningDate;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jDate, setIsJdate] = useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const loginEmp = localStorage.getItem("EmployeeId");
  const momentDate = moment(JoiningDate).format("YYYY-MM-DD HH:mm");
  const dayjsDate = dayjs(momentDate);
  const onupdate = (values: any) => {
    const updatedValues = {
      alternateMailId: values.alternateMailId,
      contactNumber: values.contactNumber,
      modifiedBy: loginEmp,
      designation: values.designation,
      employeeId: values.employeeId,
      firstName: values.firstName,
      gender: values.gender,
      joiningDate: values.joiningDate,
      lastName: values.lastName,
      location: values.location,
      officialMailId: values.officialMailId,
      salary: parseInt(values.salary, 10),
    };
    axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      url: "/api/User/AddOrUpdateEmployee",
      data: updatedValues,
    })
      .then((response) => {
        message.success("Record have been updated successfully");
        window.location.reload();
      })
      .catch((error) => {
        message.error(error.response.data);
      });
  };
  const [designations, setDesignations] = useState<Designation[]>([]);
  interface Designation {
    roleId: String;
    roleName: String;
  }
  useEffect(() => {
    const fetchDesignations = async () => {
      const response = await axios.get("/api/Master/GetAllRoles?isActive=true");
      setDesignations(response.data);
    };
    fetchDesignations();
  }, []);

  return (
    <>
      <h2 className="editEmployee">Edit Employee</h2>
      <Form
        name="basic"
        labelCol={{ span: 50 }}
        wrapperCol={{ span: 125 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onupdate}
        form={form}
      >
        <div className="editEmpForm">
          <Form.Item
            label="Employee Id"
            name="employeeId"
            rules={[{ required: true, message: "Please input Employee ID!" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Mail ID"
            name="officialMailId"
            rules={[{ required: true, message: "Please input your Mail!" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Alternate Mail ID"
            name="alternateMailId"
            rules={[
              {
                required: false,
                message: "Please input your Alternate  Mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="editEmpForm">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your First Name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your Last Name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please input Location!" }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="editEmpForm">
          <Form.Item
            label="Contact No"
            name="contactNumber"
            rules={[
              { required: true, message: "Please input your Contact No!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Salary"
            name="salary"
            rules={[{ required: true, message: "Please input your Salary!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            //name="joiningDate"
            label="Joining Date"
            //initialValue={dayjsDate}
            rules={[
              { required: true, message: "Please provide Joining Date!" },
            ]}
            hasFeedback
          >
            <DatePicker
              placeholder="Select Date"
              defaultValue={dayjsDate}
              onChange={(value: any) => {
                setIsJdate(value);
              }}
            />
          </Form.Item>
        </div>
        <div className="editEmpForm1">
          <Form.Item
            label="Designation"
            name="designation"
            rules={[
              { required: true, message: "Please input your Designation !" },
            ]}
          >
            <Select>
              {designations.map((designation) => (
                <Select.Option value={designation.roleId}>
                  {designation.roleName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please input your gender !" }]}
          >
            <Select>
              <Select.Option value="F">Female</Select.Option>
              <Select.Option value="M">Male</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            className="editCancel"
            type="primary"
            onClick={() => setIsModalOpen(false)}
          >
            cancel
          </Button>
          <Button className="editSubmit" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
