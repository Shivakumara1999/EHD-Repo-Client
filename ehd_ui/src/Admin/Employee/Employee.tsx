import { Button, Divider, Modal, Select, Table, TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditFilled, ReloadOutlined } from "@ant-design/icons";
import { EditEmployee } from "./EditEmployee";

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

const EmployeeComponent: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(true);
  const [rowdata, setrowdata] = useState<boolean | null>(null);
  const [data, setData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [row, setrow] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const refreshFunction = () => {
    setSelectedOption(true);
    setrowdata(null);
    setData([]);
    setSelectedRowKeys([]);
    setrow([]);
    setIsModalOpen(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [selectedOption]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/User/GetAllEmployeesIsActive", {
        params: { isActive: selectedOption },
      });

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

  const Activeuser = async () => {
    try {
      const response = await axios.put(
        "/api/User/UpdateEmployeeIsActive?Is_Active=true",
        {
          id: selectedRowKeys,
        }
      );
      setData(response.data);
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const Inactiveuser = async () => {
    try {
      const response = await axios.put(
        "/api/User/UpdateEmployeeIsActive?Is_Active=false",
        {
          id: selectedRowKeys,
        }
      );
      setData(response.data);
      fetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setrow(selectedRowKeys);
  };

  const handleOptionChange = (value: boolean) => {
    if (value == false) {
      setrowdata(true);
    } else {
      setrowdata(false);
    }
    setSelectedOption(value);
    setSelectedRowKeys([]); // Clear selected rows when option changes
    setrow([]);
  };

  const handleActivateDeactivate = (isActive: boolean) => {
    // return selectedRowKeys.some((e:any)=>{
    //   return e.status ==false;
    // })
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Employee ID",
      key: "employeeId",
      dataIndex: "employeeId",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Official Mail ID",
      dataIndex: "officialMailId",
    },
    {
      title: "Alternate Mail ID",
      dataIndex: "alternateMailId",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Salary",
      dataIndex: "salary",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
    },
    {
      title: "Role",
      dataIndex: "designation",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: boolean) => (isActive ? "true" : "false"),
    },
    {
      title: "Edit",
      key: "actions",
      render: (text: any, record: any) => {
        return (
          <div
            style={{
              visibility:
                selectedRowKeys.length === 1 &&
                record.employee_Id === selectedRowKeys[0]
                  ? "hidden"
                  : "visible",
              display: "flex",
            }}
          >
            <Button
              style={{
                background:
                  "-webkit-linear-gradient(45deg, rgba(9, 0, 159, 0.3), rgba(0, 255, 149, 0.3) 95%)",
                color: "black",
                fontWeight: "bold",
              }}
              type="primary"
              onClick={showModal}
            >
              <EditFilled />
            </Button>
          </div>
        );
      },
      align: "center",
    },
  ];

  return (
    <div>
      <Button>Add Employee</Button>
      <ReloadOutlined
        onClick={() => {
          refreshFunction();
        }}
      />
      <div style={{ display: "flex", float: "right" }}>
        <Button
          type="primary"
          disabled={selectedOption == true ? true : false}
          onClick={Activeuser}
        >
          Activate
        </Button>
        <Button
          type="primary"
          disabled={selectedOption == true ? false : true}
          onClick={Inactiveuser}
        >
          Deactivate
        </Button>
      </div>
      <Select
        value={selectedOption}
        onChange={(value: boolean) => handleOptionChange(value)}
        style={{
          width: 110,
          borderRadius: 3,
          padding: 3,
          background:
            "-webkit-linear-gradient(45deg, rgba(9, 0, 159, 0.9), rgba(0, 255, 149, 0.5) 105%)",
          color: "black",
          fontWeight: "bold",
        }}
        dropdownStyle={{
          background:
            "-webkit-linear-gradient(45deg, rgba(9, 0, 159, 0.3), rgba(0, 255, 149, 0.3) 95%)",
          color: "black",
          fontWeight: "bold",
        }}
      >
        <Select.Option value={true}>Active</Select.Option>
        <Select.Option value={false}>Inactive</Select.Option>
      </Select>
      <Divider />
      <Modal
        className="editEmployee"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
        width={1000}
        onOk={handleOk}
      >
        <EditEmployee selectedRowKeys={selectedRowKeys} selectedRows={row} />
      </Modal>
      <Table
        rowSelection={{
          onChange: handleRowSelectionChange,
          selectedRowKeys: selectedRowKeys,
        }}
        rowKey={(record: any) => record.employeeId}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default EmployeeComponent;
