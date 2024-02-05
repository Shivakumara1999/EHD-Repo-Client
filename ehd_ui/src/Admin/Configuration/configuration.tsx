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
// import moment from "moment";

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
  departmentName: string;
}

interface IIssues {
  key: React.Key;
  issueId: string;
  issueName: string;
  createdBy: string;
  createdDate: Date;
  departmentName: string;
}


const Configuration = () => {
  const [buttonName, setButtonName] = useState("Department");
  const [selectedTab, setSelectedTab] = useState("1");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [callModal, setCallModal] = useState("departmentmodal");
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<String[]>([]);
  const [selectedRow, setSelectedRow] = useState<IDepartment[]>([]);
  const [canEdit, SetCanEdit] = useState(false);
  const [canEditRole, SetCanEditRole] = useState(false);
  const [canEditIssue, SetCanEditIssue] = useState(false);
  const [Roleid, setRoleid] = useState("");
  const [IssueDept, setIssueDept] = useState("");
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
  const CreatedBy = localStorage.getItem("CreatedBy");
  const modifiedBy = localStorage.getItem("CreatedBy");
  const [defaultroleValues, setDefaultroleValues] = useState({
    roleId: "",
    roleName: "",
  });

  const [defaulissueValues, setDefaultissueValues] = useState({
    Issueid: "",
    Issuetype: "",
  });

  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [roles, setRoles] = useState<IRoles[]>([]);
  const [issues, setIssues] = useState<IIssues[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const refreshFunction = () => {
    // setButtonName("Department");
    // setSelectedTab("1");
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
    setSearchTerm("");
    fetchDataForDepartment();
    fetchDataForRoles();
    fetchDataForIssues();
  };

  const fetchDataForDepartment = async () => {
    try {
      const response = await axios.get(
        `/api/Master/GetDepartmentsByActive?isActive=true`
      );
      setDepartments(response.data);
      
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDataForRoles = async () => {
    try {
      const response = await axios.get("/api/Master/GetAllRoles?isActive=true");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDataForIssues = async () => {
    try {
      const response = await axios.get(
        "/api/Master/GetAllIssueTypes?isActive=true"
      );
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  useEffect(() => {
    fetchDataForDepartment();
    fetchDataForRoles();
    fetchDataForIssues();
  }, []);
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
      departmentName: roles[i].departmentName,
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
      departmentName: issues[i].departmentName,
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

  const openNotificationRole = () => {
    notification.success({
      message: "Success",
      description: canEditRole
        ? "Role updated successfully"
        : "Role added successfully",
    });
  };

  const openNotificationIssue = () => {
    notification.success({
      message: "Success",
      description: canEditIssue
        ? "Issue updated successfully"
        : "Issue added successfully",
    });
  };

  const onFinish = async (values: any) => {
    if (canEdit) {
      var data = {
        ...values,
        departmentId: selectedRow[0].departmentId,
        createdBy: "",
        modifiedBy: "adminn",
      };
    } else {
      var data = { ...values };
    }
    // Add logic to save department data
    setIsModalVisible(false);
    try {
      if (canEdit) {
        // Update Department API call
        await axios.post(`/api/Master/AddOrUpdateDepartment?id=${modifiedBy}`, data);
        
      } else {
        // Add Department API call
        await axios.post(`/api/Master/AddOrUpdateDepartment?id=${CreatedBy}`, data);
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
      setCallModal("showRoleModal");
    } else if (key === "3") {
      setButtonName("Issue Type");
      setCallModal("issuemodal");
    } else {
      setButtonName("Department");
      setCallModal("departmentmodal");
    }
  };

  // const handleActiveStatusChange = async(value: string)=>{
  //   if(value === 'Active'){
  //   try {
  //       const response = await axios.get(
  //         "/api/Master/GetDepartmentsByActive?isActive=true"
  //       );
  //       setDepartments(response.data);
  //       console.log(response.data, "dataaa");
  //     } catch (error) {
  //       console.error("Error fetching departments:", error);
  //     }
  //   }else{
  //       try {
  //           const response = await axios.get(
  //             "/api/Master/GetDepartmentsByActive?isActive=false"
  //           );
  //           setDepartments(response.data);
  //           console.log(response.data, "dataaa");
  //         } catch (error) {
  //           console.error("Error fetching departments:", error);
  //         }
  //   }
  // }

  const handleActiveStatusChange = async (value: string) => {
    try {
      let departmentsResponse;
      let rolesResponse;
      let issuesResponse;

      if (value === "Active") {
        departmentsResponse = await axios.get(
          "/api/Master/GetDepartmentsByActive?isActive=true"
        );
        rolesResponse = await axios.get(
          "/api/Master/GetAllRoles?isActive=true"
        );
        issuesResponse = await axios.get(
          "/api/Master/GetAllIssueTypes?isActive=true"
        );
      } else {
        departmentsResponse = await axios.get(
          "/api/Master/GetDepartmentsByActive?isActive=false"
        );
        rolesResponse = await axios.get(
          "/api/Master/GetAllRoles?isActive=false"
        );
        issuesResponse = await axios.get(
          "/api/Master/GetAllIssueTypes?isActive=false"
        );
      }

      setDepartments(departmentsResponse.data);
      setRoles(rolesResponse.data);
      setIssues(issuesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleActiveClick = async () => {
    // Extract departmentIds from selected rows
    const selectedDepartmentIds = selectedRow.map((row) => row.departmentId);

    // Create the object with the desired format
    const requestData = { id: selectedDepartmentIds };

    try {
      // Update Department IsActive status
      const departmentResponse = await axios.put(
        "/api/Master/EditDepartmentIsActive?Is_Active=true",
        requestData
      );

      // You can also trigger a reload or perform other actions if needed
      // For example:
      // fetchDataForDepartment();
      // fetchDataForRoles();
      // fetchDataForIssues();

      // Notify success
      notification.success({
        message: "Success",
        description: "Department status updated successfully",
      });
    } catch (error) {
      // Handle the error as needed
      console.error(error);

      // Notify error
      notification.error({
        message: "Error",
        description: "Failed to update status. Please try again.",
      });
    }
  };

  

  const handleDeactiveClick = async () => {
    const selectedDepartmentIds = selectedRow.map((row) => row.departmentId);

    // Create the object with the desired format
    const requestData = { id: selectedDepartmentIds };

    try {
      // Make the API call
      const response = await axios.put(
        "/api/Master/EditDepartmentIsActive?Is_Active=false",
        requestData
      );
      notification.success({
        message: "Success",
        description: "Department status updated succesfully",
      });
    } catch (error) {
      // Handle the error as needed
      notification.error({
        message: "Error",
        description: "Failed to update department status. Please try again.",
      });
    }
  };

  const handleEdit = (record: IDepartment) => {
    setIsModalVisible(true);
    SetCanEdit(true);
    form.setFieldsValue({
      departmentId: record.departmentId,
      departmentName: record.departmentName,
    });
  };
  const handleRoleEdit = (record: IRoles) => {
    setRoleModalVisible(true);
    SetCanEditRole(true);
    setRoleid(record.roleId);
    form.setFieldsValue({
      roleId: record.roleId,
      roleName: record.roleName,
      departmentId: record.departmentId,
    });
  };

  const handleIssueEdit = (record: IIssues) => {
    setIssueModalVisible(true);
    SetCanEditIssue(true);
    form.setFieldsValue({
      departmentId: record.departmentName,
      Issueid: record.issueId,
      issueName: record.issueName,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    SetCanEdit(false);
    setDefaultValues({ departmentId: "", departmentName: "" });
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
    } else if (callModal == "showRoleModal") {
      setRoleModalVisible(true);
    } else {
      setIssueModalVisible(true);
    }
  };

  const handleRoleCancel = () => {
    setRoleModalVisible(false);
    SetCanEditRole(false);
    form.setFieldsValue({
      roleId: "",
      roleName: "",
      departmentId: "",
    });
  };
  const handleIssueCancel = () => {
    setIssueModalVisible(false);
    SetCanEditIssue(false);
  };

  const onFinishRole = async (values: any) => {
    if (canEditRole) {
      var data = {
        ...values,
        roleId: Roleid,
        createdBy: "",
        modifiedBy: "adminn",
      };
    } else {
      var data = { ...values};
    }
    setRoleModalVisible(false);
    try {
      if (canEditRole) {
        await axios.post(`/api/Master/AddorUpdateRoles?id=${modifiedBy}`, data);
        
      } else {
        await axios.post(`/api/Master/AddorUpdateRoles?id=${CreatedBy}`, data);
      }

      setRoleModalVisible(false);
      SetCanEditRole(false);
      setDefaultroleValues({ roleId: "", roleName: "" });
      form.setFieldsValue({
        roleId: "",
        roleName: "",
        departmentId: "",
      });
      openNotificationRole();
      fetchDataForDepartment();
      fetchDataForRoles();
      fetchDataForIssues();
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Failed to save role. Please try again.",
      });
    }
  };

  const onFinishIssue = async (values: any) => {
    if (canEditIssue) {
      var data = { ...values, departmentId: IssueDept, employeeId: "E001" };
      var dataArray1 = {
        departmentId: data.departmentId, // replace with the actual value for departmentId
        issueId: data.Issueid,
        issueName: data.issueName,
        employeeId: data.employeeId,
      };
      try {
        await axios.put(
          "/api/Master/UpdateIssueTypes/UpdateIssueType",
          dataArray1
        );

        setIssueModalVisible(false);
        SetCanEditIssue(false);
        setDefaultissueValues({ Issueid: "", Issuetype: "" });
        openNotificationIssue();
        fetchDataForDepartment();
        fetchDataForRoles();
        fetchDataForIssues();
      } catch (error) {
        console.error("Error:", error);
        notification.error({
          message: "Error",
          description: "Failed to save role. Please try again.",
        });
      }
    } else {
      var data = { ...values, issueId: 0, employeeId: "E001" };

      var dataArray = [
        {
          departmentId: data.departmentId, // replace with the actual value for departmentId
          issueId: data.issueId,
          issueName: data.issueName,
          employeeId: data.employeeId,
        },
      ];

      setIssueModalVisible(false);
      try {
        if (canEditIssue) {
          await axios.post("/api/Master/AddIssueTypes", dataArray);
        } else {
          await axios.post("/api/Master/AddIssueTypes", dataArray);
        }

        setIssueModalVisible(false);
        SetCanEditIssue(false);
        setDefaultissueValues({ Issueid: "", Issuetype: "" });
        openNotificationIssue();
        fetchDataForDepartment();
        fetchDataForRoles();
        fetchDataForIssues();
      } catch (error) {
        console.error("Error:", error);
        notification.error({
          message: "Error",
          description: "Failed to save role. Please try again.",
        });
      }
    }
  };
  const handleAddIssueClick = () => {
    setIssueModalVisible(true);
    form.resetFields(); // Reset issue form fields if needed
  };
  const setIssueDepartment = (value: any) => {
    setIssueDept(value);
  };

  const columns1: TableColumnsType<IDepartment> = [
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
      dataIndex: "departmentName",
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
    <>
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
            placeholder="Search"
            style={{ marginBottom: 16 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "Flex", gap: "10px" }}>
          <Select
            defaultValue="Active"
            className="selectclass"
            onChange={(value) => handleActiveStatusChange(value)}
          >
            <Option value="Active">Active</Option>
            <Option value="InActive">InActive</Option>
          </Select>
          <Button className="activeclass" onClick={handleActiveClick}>
            Activate
          </Button>
          <Button className="deactiveclass" onClick={handleDeactiveClick}>
            Deactivate
          </Button>
          <ReloadOutlined
            onClick={() => {
              refreshFunction();
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
                      const keys = selectedRows.map((row) =>
                        row.key.toString()
                      );
                      setSelectedRowKeys(keys);
                      setSelectedRow(selectedRows);
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
                      setSelectedRow(selectedRows);
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
                    },
                  }}
                />
              ),
            },
          ]}
        />
      </div>

      {/* Department */}
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

      {/* Role */}
      <Modal
        title={
          <div className="modalTitleStyle">
            {canEditRole ? "Edit Role" : "Add Role"}
          </div>
        }
        className="modalclass"
        open={roleModalVisible}
        onCancel={handleRoleCancel}
        footer={[
          <Button
            key="cancel"
            onClick={handleRoleCancel}
            className="deactiveclass"
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => {
              form.submit();
              console.log("Role Form values:", form.getFieldsValue());
            }}
            className="activeclass"
          >
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="addRole"
          onFinish={onFinishRole}
          initialValues={
            canEditRole ? defaultroleValues : { roleId: "", roleName: "" }
          }
        >
          <Form.Item
            label="Role Name"
            name="roleName"
            rules={[{ required: true, message: "Please input the Role Name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Assign Department"
            name="departmentId"
            rules={[
              { required: true, message: "Please select the department!" },
            ]}
          >
            <Select>
              {departments.map((department) => (
                <Option
                  key={department.departmentId}
                  value={department.departmentId}
                >
                  {department.departmentName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Issue Type */}
      <Modal
        title={
          <div className="modalTitleStyle">
            {canEditIssue ? "Edit Issue" : "Add Issue"}
          </div>
        }
        className="modalclass"
        open={issueModalVisible}
        onCancel={handleIssueCancel}
        footer={[
          <Button
            key="cancel"
            onClick={handleIssueCancel}
            className="deactiveclass"
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => {
              form.submit();
              console.log("Issue Form values:", form.getFieldsValue());
            }}
            className="activeclass"
          >
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="addIssueType"
          onFinish={onFinishIssue}
          initialValues={
            canEditIssue ? defaulissueValues : { Issueid: "", issueName: "" }
          }
        >
          {canEditIssue && (
            <Form.Item label="Issue Type ID" name="Issueid" rules={[
              { required: true, message: "" },
            ]}>
              <Input readOnly />
            </Form.Item>
          )}
          <Form.Item
            label="Assign Department Name"
            name="departmentId"
            rules={[
              { required: true, message: "Please select the department!" },
            ]}
          >
            <Select onChange={setIssueDepartment}>
              {departments.map((department) => (
                <Option
                  key={department.departmentId}
                  value={department.departmentId}
                >
                  {department.departmentName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Issue Name"
            name="issueName"
            rules={[
              { required: true, message: "Please input the Issue Name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </>
  );
};
export default Configuration;
