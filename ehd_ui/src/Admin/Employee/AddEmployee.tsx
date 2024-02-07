import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const AddEmployee = () => {
  const [form] = Form.useForm();
  const [jDate, setIsJdate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onFinish = (values: any) => {
    const AddValues = {
      alternateMailId: values.alternateMailId,
      contactNumber: values.contactNumber,
      createdBy: "Admin",
      designationId: values.designationId,
      employeeId: values.employeeId,
      firstName: values.firstName,
      gender: values.gender,
      joiningDate: values.joiningDate,
      lastName: values.lastName,
      location: values.location,
      officialMailId: values.officialMailId,
      salary: parseInt(values.salary, 10),
    };

    console.log(AddValues);
    axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/api/User/AddOrUpdateEmployee",
      data: AddValues,
    })
      .then((r: any) => {
        message.success("Your record have been added successfully");
        setIsModalOpen(false);
        form.resetFields(); 
      })
      .catch((error: any) => {
        message.error(error.response.data);
      });
  };
  const [designations, setDesignations] = useState<Designation[]>([]);

  interface Designation {
    designationId: String;
    designation: String;
  }

  useEffect(() => {
    const fetchDesignations = async () => {
      const response = await axios.get("/api/Master/GetAllDesignations");
      setDesignations(response.data);
    };
    fetchDesignations();
  }, []);

  return (
    <>
      <Button className="addbtn"  id="idp" type="primary" onClick={showModal}>
        Add Employee
      </Button>
      <Modal
        title="Add Employee"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width={900}
        className="addEmployeeModel"
      >
        <Form
          name="basic"
          labelCol={{ span: 50 }}
          wrapperCol={{ span: 125 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onFinish}
          form={form}
        >
          <div className="addEmpForm">
            <Form.Item
              label="Employee Id"
              name="employeeId"
              rules={[{ required: true, message: "Please input Employee ID!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mail ID"
              name="officialMailId"
              rules={[{ required: true, message: "Please input your Mail!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Alternate Mail ID" name="alternateMailId">
              <Input />
            </Form.Item>
          </div>
          <div className="addEmpForm">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your First Name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName">
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
          <div className="addEmpForm">
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
              name="joiningDate"
              label="Joining Date"
              //initialValue={dayjsDate}
              rules={[
                { required: true, message: "Please provide Joining Date!" },
              ]}
              hasFeedback
            >
              <DatePicker
                placeholder="Select Date"
                onChange={(value: any) => {
                  setIsJdate(value);
                }}
              />
            </Form.Item>
          </div>
          <div className="addEmpForm2">
          <Form.Item
  label="Designation"
  name="designationId"  // Match the property name with the one in AddValues
  rules={[
    { required: true, message: "Please input your Designation!" },
  ]}
  valuePropName="value"
>
<Select
  className="selectdesignation"
  onChange={(value) => {
    form.setFields([
      { name: 'designationId', value: parseInt(value) },
    ]);
  }}
>
  {designations.map((designationtitle) => (
    <Select.Option
      key={designationtitle.designationId.toString()}
      value={designationtitle.designationId.toString()}
    >
      {designationtitle.designation}
    </Select.Option>
  ))}
</Select>

</Form.Item>



            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                { required: true, message: "Please input your gender !" },
              ]}
            >
              <Select className="selectgender">
                <Select.Option className="selectgender" value="F">
                  Female
                </Select.Option>
                <Select.Option value="M">Male</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <Button className="addSubmit" type="primary" htmlType="submit">
              Submit
            </Button>
            <Button
                className="addCancel"
                type="primary"
                onClick={() => {
                    setIsModalOpen(false);  
                    form.resetFields();     
                }}
                >
              cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddEmployee;
