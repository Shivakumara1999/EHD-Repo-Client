import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Flex,
  Form,
  Modal,
  Input,
  Select,
  Checkbox,
} from "antd";

import { Tabs } from "antd";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { notification } from "antd";
import moment from "moment";

const { Option } = Select;
type TableRowSelection<T> = TableProps<T>["rowSelection"];
interface IDepartment {
  key: React.Key;
  departmentId: string;
  departmentName: string;
  createdBy: string;
  createdDate: Date;
}

interface IRoles {
  key: React.Key;
  roleId: string;
  roleName: string;
  createdBy: string;
  createdDate: Date;
  departmentId: string;
}

interface IIssues {
  key: React.Key;
  issueId: string;
  issueName: string;
  createdBy: string;
  createdDate: Date;
  departmentId: string;
}

// interface DataTypeFor

const Configuration = () => {
  

  const [buttonName, setButtonName] = useState("Department");
  const [selectedTab, setSelectedTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [callModal, setCallModal] = useState("departmentmodal");
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<String[]>([]);
  const [selectedRow, setSelectedRow] = useState<IDepartment[]>([]);
  const [canEdit, SetCanEdit] = useState(false);
  const [selectedRowKeysforrole, setSelectedRowKeysforrole] = useState<
    String[]
  >([]);
  const [selectedRowKeysforissues, setSelectedRowKeysforissues] = useState<
    String[]
  >([]);
  const [defaultValues, setDefaultValues] = useState({
    departmentId: "",
    departmentName: "",
  });
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [roles, setRoles] = useState<IRoles[]>([]);
  const [issues, setIssues] = useState<IIssues[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const refreshFunction=()=>{
    setButtonName("Department");
    setSelectedTab('1');
    setIsModalVisible(false);
    setSelectedRowKeys([]);
    setSelectedRow([]);
    SetCanEdit(false);
    setSelectedRowKeysforrole([]);
    setSelectedRowKeysforissues([]);
    setDefaultValues({ departmentId: "", departmentName: "" });
    setDepartments([]);
    setRoles([]);
    setIssues([]);
    setSearchTerm('');
    fetchDataForDepartment();
      fetchDataForRoles();
      fetchDataForIssues();
      setSelectedRowKeys([]);
  }

  const fetchDataForDepartment = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7267/api/Master/GetDepartmentsByActive?isActive=true"
      );
      setDepartments(response.data);
      console.log(response.data, "dataaa");
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDataForRoles = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7267/api/Master/GetAllRoles"
      );
      setRoles(response.data);
      console.log(response.data, "dataaa1111");
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDataForIssues = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7267/api/Master/GetAllIssueTypes"
      );
      setIssues(response.data);
      console.log(response.data, "dataaa1111");
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  useEffect(() => {
    fetchDataForDepartment();
    fetchDataForRoles();
    fetchDataForIssues();
  }, []);
  console.log(departments.length, "department");
  const departmentData: IDepartment[] = [];
  const rolesData: IRoles[] = [];
  const issuesdata: IIssues[] = [];
  for (let i = 0; i < departments.length; i++) {
    departmentData.push({
      key: i,
      departmentId: departments[i].departmentId,
      departmentName: departments[i].departmentName,
      createdBy: departments[i].createdBy,
      createdDate: departments[i].createdDate,
    });
  }
  for (let i = 0; i < roles.length; i++) {
    rolesData.push({
      key: i,
      roleId: roles[i].roleId,
      roleName: roles[i].roleName,
      createdBy: roles[i].createdBy,
      createdDate: roles[i].createdDate,
      departmentId: roles[i].departmentId,
    });
  }
  for (let i = 0; i < issues.length; i++) {
    issuesdata.push({
      key: i,
      issueId: issues[i].issueId,
      issueName: issues[i].issueName,
      createdBy: issues[i].createdBy,
      createdDate: issues[i].createdDate,
      departmentId: issues[i].departmentId,
    });
  }
  const filterData = (data: any[], columnName: string) => {
    return data.filter((item) =>
      item[columnName].toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const openNotification = () => {
    notification.success({
      message: "Success",
      description: canEdit
        ? "Department updated successfully"
        : "Department added successfully",
    });
  };

  const onFinish = async (values: any) => {
    console.log("Received values:", values);

    if (canEdit) {
      var data = { ...values,departmentId:selectedRow[0].departmentId,createdBy:'' ,modifiedBy: "adminn" };
    } else {
      var data = { ...values, createdBy: "adminuser"};
    }
    // Add logic to save department data
    setIsModalVisible(false);
    try {
      if (canEdit) {
        // Update Department API call
        await axios.post(
          "https://localhost:7267/api/Master/AddOrUpdateDepartment",
          data
        );
      } else {
        // Add Department API call
        await axios.post(
          "https://localhost:7267/api/Master/AddOrUpdateDepartment",
          data
        );
      }

      setIsModalVisible(false);
      SetCanEdit(false);
      setDefaultValues({ departmentId: "", departmentName: "" });

      // Display success notification
      openNotification();
      fetchDataForDepartment();
      fetchDataForRoles();
      fetchDataForIssues();
    } catch (error) {
      console.error("Error:", error);
      // Handle error and display an error notification
      notification.error({
        message: "Error",
        description: "Failed to save department. Please try again.",
      });
    }
  };

  const onChange = (key: string) => {
    setSelectedTab(key);
    if (key === "2") {
      setButtonName("Role");
      setCallModal("rolemodal");
    } else if (key === "3") {
      setButtonName("Issue Type");
      setCallModal("issuemodal");
    } else {
      setButtonName("Department");
      setCallModal("departmentmodal");
    }
  };
  const handleActiveClick = async () => {
    // Extract departmentIds from selected rows
    const selectedDepartmentIds = selectedRow.map((row) => row.departmentId);
  
    // Create the object with the desired format
    const requestData ={ id: selectedDepartmentIds };
    console.log(requestData,"dataaaaaaaaaaa")
  
    try {
      // Make the API call
      const response = await axios.put(
        "https://localhost:7267/api/Master/EditDepartmentIsActive?Is_Active=true",
        requestData
      );
  
      // Handle the response as needed
      console.log("API response:", response.data);
  
      // You can also trigger a reload or perform other actions if needed
      // For example:
      // fetchDataForDepartment();
      // fetchDataForRoles();
      // fetchDataForIssues();
      notification.success({
        message: "Success",
        description:'Department status updated succesfully',
      });
    } catch (error) {
      console.error("Error calling API:", error);
      // Handle the error as needed
      notification.error({
        message: "Error",
        description: "Failed to update department status. Please try again.",
      });
    }
  }
  const handleActiveStatusChange = async(value: string)=>{
    if(value === 'Active'){
    try {
        const response = await axios.get(
          "https://localhost:7267/api/Master/GetDepartmentsByActive?isActive=true"
        );
        setDepartments(response.data);
        console.log(response.data, "dataaa");
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }else{
        try {
            const response = await axios.get(
              "https://localhost:7267/api/Master/GetDepartmentsByActive?isActive=false"
            );
            setDepartments(response.data);
            console.log(response.data, "dataaa");
          } catch (error) {
            console.error("Error fetching departments:", error);
          }
    }
  }

  const handleDeactiveClick = async() => {
    const selectedDepartmentIds = selectedRow.map((row) => row.departmentId);
  
    // Create the object with the desired format
    const requestData ={ id: selectedDepartmentIds };
    console.log(requestData,"dataaaaaaaaaaa")
  
    try {
      // Make the API call
      const response = await axios.put(
        "https://localhost:7267/api/Master/EditDepartmentIsActive?Is_Active=false",
        requestData
      );
  
      // Handle the response as needed
      console.log("API response:", response.data);
  
      // You can also trigger a reload or perform other actions if needed
      // For example:
      // fetchDataForDepartment();
      // fetchDataForRoles();
      // fetchDataForIssues();
      notification.success({
        message: "Success",
        description:'Department status updated succesfully',
      });
    } catch (error) {
      console.error("Error calling API:", error);
      // Handle the error as needed
      notification.error({
        message: "Error",
        description: "Failed to update department status. Please try again.",
      });
    }
  };
 

  //   const handleEdit=(record: IDepartment)=> {
  //     setIsModalVisible(true);
  //     console.log(selectedRowKeys,"handleedit")
  //     console.log(record,"recordd")
  //     SetCanEdit(true);
  //     setDefaultValues({departmentId:record.departmentId,departmentName:record.departmentName})
  //     console.log(form.getFieldsValue,"valueeee")
  // }
  const handleEdit = (record: IDepartment) => {
    console.log(record, "recorddd");
    setIsModalVisible(true);
    SetCanEdit(true);
    form.setFieldsValue({
      departmentId: record.departmentId,
      departmentName: record.departmentName,
    });
  };
  const handleRoleEdit = (record: IRoles) => {
    // setIsModalVisible(true);
    console.log(record, "recorddd");
    SetCanEdit(true);
    // form.setFieldsValue({
    //   departmentId: record.departmentId,
    //   departmentName: record.departmentName,
    // });
  };
  
  const handleIssueEdit = (record: IIssues) => {
    // setIsModalVisible(true);
    console.log(record, "recorddd");
    SetCanEdit(true);
    // form.setFieldsValue({
    //   departmentId: record.departmentId,
    //   departmentName: record.departmentName,
    // });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    SetCanEdit(false);
    setDefaultValues({ departmentId: "", departmentName: "" });
    console.log(defaultValues, "defaultValues");
  };
  const handleDepartmentIdKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const isNumberKey = /^[0-9]+$/.test(e.key);
    const isBackspaceKey = e.key === "Backspace";

    if (!isNumberKey && !isBackspaceKey) {
      e.preventDefault();
    }
  };
  const callmodal11 = () => {
    if (callModal == "departmentmodal") {
      setIsModalVisible(true);
      form.resetFields();
    } else if (callModal == "rolemodal") {
      console.log("role is calling");
    } else {
      console.log("issue is calling");
    }
  };

  

  
  const columns1: TableColumnsType<IDepartment> = [
    // {
    //     title: 'Select',
    //     dataIndex: 'select',
    //     width: 50,
    //     render: (_, record) => (
    //       <Checkbox
    //         onChange={(e) => handleCheckboxChange(e, record)}
    //         checked={selectedRowKeys.includes(record.key.toString())}
    //       />
    //     ),
    //   },
    {
      title: "Department ID",
      dataIndex: "departmentId",
    },
    {
      title: "Department Name",
      dataIndex: "departmentName",
    },
    {
      title: "CreatedBy",
      dataIndex: "createdBy",
    },
    {
      title: "CreatedOn",
      dataIndex: "createdDate",
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      render: (_, record) => (
        <span>
          <a
            onClick={() => handleEdit(record)}
            style={{
              pointerEvents:
                selectedRowKeys.length === 1 &&
                selectedRowKeys.includes(record.key.toString())
                  ? "auto"
                  : "none",
            }}
          >
            <EditOutlined />
          </a>
        </span>
      ),
    },
  ];

  const columns2: TableColumnsType<IRoles> = [
    {
      title: "Role ID",
      dataIndex: "roleId",
      
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
      
    },
    {
      title: "CreatedBy",
      dataIndex: "createdBy",
      
    },
    {
      title: "CreatedOn",
      dataIndex: "createdDate",
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
      
    },
    {
      title: "Department",
      dataIndex: "departmentId",
      
    },

    {
      title: "Edit",
      dataIndex: "edit",
      render: (_, record) => (
        <span>
          <a
            onClick={() => handleRoleEdit(record)}
            style={{
              pointerEvents:
                selectedRowKeysforrole.length === 1 &&
                selectedRowKeysforrole.includes(record.key.toString())
                  ? "auto"
                  : "none",
            }}
          >
            <EditOutlined />
          </a>
        </span>
      ),
    },
    // {
    //   title: "Edit",
    //   render: (_, record) => (
    //     <span>
    //       <a onClick={() => handleEdit(record)}>
    //         <EditOutlined />
    //       </a>
    //     </span>
    //   ),
    // },
  ];

  const columns3: TableColumnsType<IIssues> = [
    {
      title: "Issue ID",
      dataIndex: "issueId",
      
    },
    {
      title: "Issue Name",
      dataIndex: "issueName",
      
    },
    {
      title: "Department",
      dataIndex: "departmentId",
      
    },
    {
      title: "CreatedBy",
      dataIndex: "createdBy",
      
    },
    {
      title: "CreatedOn",
      dataIndex: "createDate",
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
      
    },
    {
      title: "Edit",
      dataIndex: "edit",
      render: (_, record) => (
        <span>
          <a
            onClick={() => handleIssueEdit(record)}
            style={{
              pointerEvents:
                selectedRowKeysforissues.length === 1 &&
                selectedRowKeysforissues.includes(record.key.toString())
                  ? "auto"
                  : "none",
            }}
          >
            <EditOutlined />
          </a>
        </span>
      ),
    },
  ];
  return (
    <div className="comonclass">
      <h1>Configuration</h1>
      <div style={{ display: "Flex", justifyContent: "space-between" }}>
        <div style={{ alignItems: "screenLeft" }}>
          <Button type="primary" className="buttonclass" onClick={callmodal11}>
            Add {buttonName}
          </Button>
        </div>
        <div className="searchclass">
        <Input
        placeholder="Search..."
        style={{ marginBottom: 16 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        </div>
        <div style={{ display: "Flex", gap: "10px" }}>
          <Select defaultValue="Active" className="selectclass" onChange={(value) => handleActiveStatusChange(value)}>
            <Option value="Active">Active</Option>
            <Option value="InActive">InActive</Option>
          </Select>
          <Button className="activeclass" onClick={handleActiveClick}>
            Active
          </Button>
          <Button className="deactiveclass" onClick={handleDeactiveClick}>
            Deactive
          </Button>
          <ReloadOutlined
            onClick={() => {
                refreshFunction()
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "15px" }}>
        <Tabs
          className="tabclass"
          onChange={onChange}
          type="card"
          activeKey={selectedTab}
          items={[
            {
              label: "Department",
              key: "1",
              children: (
                <Table
                  columns={columns1}
                  dataSource={filterData(departmentData, "departmentName")}
                  rowSelection={{
                    type: "checkbox",
                    onChange: (_, selectedRows) => {
                        console.log(selectedRows,"valuee")
                      const keys = selectedRows.map((row) =>
                        row.key.toString()
                      );
                      setSelectedRowKeys(keys);
                      setSelectedRow(selectedRows);
                      console.log(selectedRows, "selectedRows");
                    },
                  }}
                />
              ),
            },
            {
              label: "Role",
              key: "2",
              children: (
                <Table
                  columns={columns2}
                  dataSource={filterData(rolesData, "roleName")}
                  rowSelection={{
                    type: "checkbox",
                    onChange: (_, selectedRows) => {
                      const keys = selectedRows.map((row) =>
                        row.key.toString()
                      );
                      setSelectedRowKeysforrole(keys);
                      //   setSelectedRow(selectedRows);
                      console.log(selectedRows, "selectedRows");
                    },
                  }}
                />
              ),
            },
            {
              label: "Issue Type",
              key: "3",
              children: (
                <Table
                  columns={columns3}
                  dataSource={filterData(issuesdata, "issueName")}
                  rowSelection={{
                    type: "checkbox",
                    onChange: (_, selectedRows) => {
                      const keys = selectedRows.map((row) =>
                        row.key.toString()
                      );
                      setSelectedRowKeysforissues(keys);
                      //   setSelectedRow(selectedRows);
                      console.log(selectedRows, "selectedRows");
                    },
                  }}
                />
              ),
            },
          ]}
        />
      </div>
      <Modal
        title={
          <div className="modalTitleStyle">
            {canEdit ? "Edit Department" : "Add Department"}
          </div>
        }
        className="modalclass"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} className="deactiveclass">
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => {
              form.submit();
              console.log("Form values:", form.getFieldsValue());
            }}
            className="activeclass"
          >
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="addDepartment"
          onFinish={onFinish}
          initialValues={
            canEdit ? defaultValues : { departmentId: "", departmentName: "" }
          }
        >

          <Form.Item
            label="Department Name"
            name="departmentName"
            rules={[
              { required: true, message: "Please input the Department Name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Configuration;
