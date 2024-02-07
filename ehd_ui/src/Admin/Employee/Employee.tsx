import {
  Button,
  Divider,
  Input,
  Modal,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditFilled, RedoOutlined, ReloadOutlined } from "@ant-design/icons";
import AddEmployee from "./AddEmployee";

interface DataType {
  key: React.Key;
  employeeId: string;
  firstName: string;
  lastName: string;
  gender: string;
  officialMailId: string;
  alternateMailId: string;
  contactNumber: string;
  location: string;
  joiningDate: string;
  salary: number;
  designation: string;
  isActive: boolean;
}

interface RolesData {
  roleId: string;
  roleName: string;
}

const EmployeeComponent: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(true);
  const [rowdata, setrowdata] = useState<boolean | null>(null);
  const [data, setData] = useState<Array<any>>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [row, setrow] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); //edit
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [isRoleAssignmentVisible, setIsRoleAssignmentVisible] = useState(false); //roles
  const [roles, setRoles] = useState<RolesData[]>([]);
  const [isActivateButtonDisabled, setIsActivateButtonDisabled] =
    useState(true);
  const [isDeactiveButtonDisabled, setIsDeactiveButtonDisabled] =
    useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { Option } = Select;

  const showModal = () => {
    setIsRoleAssignmentVisible(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancelModels = () => {
    setIsRoleAssignmentVisible(false);
  };

  const refreshFunction = () => {
    setSelectedOption(true);
    setrowdata(null);
    setData([]);
    setSelectedRowKeys([]);
    setrow([]);
    setIsModalOpen(false);
    setSearchTerm("");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [selectedOption]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await axios.get("/api/Master/GetAllRoleNames");
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    confirmRoleAssignment();
    fetchData();
  }, []);

  const filterData = data.filter((f) => {
    const lowerCaseValues = {
      firstName: f.firstName.toLowerCase(),
      lastName: f.lastName.toLowerCase(),
      officialMailId: f.officialMailId.toLowerCase(),
      alternateMailId: f.alternateMailId.toLowerCase(),
      contactNumber: f.contactNumber.toLowerCase(),
      location: f.location.toLowerCase(),
      joiningDate: f.joiningDate.toLowerCase(),
      salary: f.salary.toString().toLowerCase(),
      roleName: f.roleName.toLowerCase(),
    };

    return Object.values(lowerCaseValues).some((value) =>
      value.includes(searchTerm.toLowerCase())
    );
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/User/GetAllEmployeesIsActive?status=${selectedOption}`
      );
      console.log("Response data:", response.data);
      if (Array.isArray(response.data)) {
        const filteredData = response.data.filter(
          (record: DataType) => record.isActive === selectedOption
        );
        setData(filteredData);
      } else {
        console.error("Invalid response data format. Expected an array.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ActivateandDeactivate = async (value: boolean) => {
    try {
      await axios.put(`/api/User/UpdateEmployeeIsActive?Is_Active=${value}`, {
        id: selectedRowKeys,
      });
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOptionChange = (value: boolean) => {
    setrowdata(value);
    setSelectedOption(value);
    setSelectedRowKeys([]);
    setrow([]);
  };

  const handleAssignRole = async (value: string, record: DataType) => {
    setSelectedRole(value);
    setSelectedRecord(record);
    setIsRoleAssignmentVisible(true);
  };

  const confirmRoleAssignment = async () => {
    setIsRoleAssignmentVisible(false);
    if (selectedRecord && selectedRole) {
      try {
        const response = await axios.put(
          `/api/User/UpdateEmployeeRole?employeeId=${selectedRecord.employeeId}`,
          { roleId: selectedRole }
        );
      } catch (error) {
        console.error("Error assigning role:", error);
      }
    }
  };

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setrow(selectedRowKeys);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Employee ID",
      key: "employeeId",
      dataIndex: "employeeId",
      width: 120,
      fixed: "left",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      width: 160,
      fixed: "left",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      width: 150,
    },
    {
      title: "Official Mail ID",
      dataIndex: "officialMailId",
      width: 150,
    },
    {
      title: "Alternate Mail ID",
      dataIndex: "alternateMailId",
      width: 150,
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      width: 150,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      width: 150,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 150,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      width: 150,
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "roleName",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: boolean) => (isActive ? "Active" : "Inactive"),
      width: 150,
    },
    {
      title: "Edit",
      key: "actions",
      width: 150,
      render: (text: any, record: any) => {
        return (
          <div>
            <Button
              type="primary"
              onClick={showModal}
              disabled={
                selectedRowKeys.length !== 1 ||
                record.employeeId !== selectedRowKeys[0]
              }
            >
              <EditFilled />
            </Button>
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Roles",
      dataIndex: "role",
      width: 150,
      render: (record: RolesData, data: DataType) => (
        <div>
          <div>
            <div>
              <Select
                defaultValue="Assign Role"
                className="selectRoles"
                onChange={(value) => handleAssignRole(value, data)}
                onSelect={showModal}
                disabled={
                  selectedRowKeys.length !== 1 ||
                  data.employeeId !== selectedRowKeys[0]
                }
              >
                {roles.map((roletitle) => (
                  <Select.Option
                    key={roletitle.roleId}
                    value={roletitle.roleId}
                  >
                    {roletitle.roleName}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{color:"rgb(79 64 185)",marginLeft:"2%"}}>Employees</h2>
      <div className="btn">
        <div>
          <AddEmployee />
        </div>
        <div>
          <div className="searchfeild">
            <Input
              placeholder="Search..."
              style={{ marginBottom: 16 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="btns">
          <div>
            <Select
              className="selectdrop"
              value={selectedOption}
              onChange={(value: boolean) => handleOptionChange(value)}
            >
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </div>
          <div className="activatebtn">
            <Button
              className="btnss"
              type="primary"
              disabled={
                !selectedRowKeys.length ||
                (selectedOption === true && isActivateButtonDisabled)
              }
              onClick={() => ActivateandDeactivate(true)}
            >
              Activate
            </Button>
            <Button
              type="primary"
              danger
              className="deactive"
              disabled={
                !selectedRowKeys.length ||
                (selectedOption === false && isDeactiveButtonDisabled)
              }
              onClick={() => ActivateandDeactivate(false)}
            >
              Deactivate
            </Button>
            <div className="refreshbtn">
              
              <Button style={{marginLeft:"8%",marginTop:"-15%"}} icon={<RedoOutlined />} onClick={refreshFunction} />
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
      <Modal
        title="Roles"
        open={isRoleAssignmentVisible}
        onOk={confirmRoleAssignment}
        onCancel={handleCancelModels}
      >
        Are you sure to assign this role?
      </Modal>
      <Table
        rowSelection={{
          onChange: handleRowSelectionChange,
          selectedRowKeys: selectedRowKeys,
        }}
        rowKey={(record: any) => record.employeeId}
        columns={columns}
        dataSource={filterData}
        scroll={{ x: 1500, y: 600 }}
      />
    </div>
  );
};

export default EmployeeComponent;
