import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table } from "antd";
import axios from "axios";
import type { TableColumnsType } from "antd";
import moment from "moment";
import { RedoOutlined, RollbackOutlined } from "@ant-design/icons";

interface DataType {
  key: React.Key;
  ticketId: string;
  ticketDescription: string;
  resolvedDate: string | null;
  departmentName: string;
  issueName: string;
  statusName: string;
  feedbackType: string | null;
  assignee: string | null;
  dueDate: string;
  createdDate: string;
}

interface AssigneeInfo {
  officialMailId: string;
  firstName: string;
  contactNumber: string;
}

const Viewhistory: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [assigneeModalVisible, setAssigneeModalVisible] =
    useState<boolean>(false);
  const [selectedAssignee, setSelectedAssignee] = useState<AssigneeInfo | null>(
    null
  );
  const empID = localStorage.getItem("EmployeeId");
  const getStatusDotClass = (status: string | null | undefined) => {
    switch (status) {
      case "Initiated":
        return "blink_me green-dot";
      case "Rejected":
        return "blink_me red-dot";
      case "Resolved":
        return "blink_me yellow-dot";
      default:
        return "blink_me gray-dot";
    }
  };

  useEffect(() => {
    axios
      .get(`/api/Ticket/GetTicketDetails?id=${empID}`)
      .then((response) => {
        const ticketDataArray = response.data; // Assuming the API returns an array
        const formattedData: DataType[] = ticketDataArray.map(
          (ticketData: any) => ({
            key: ticketData.ticketId,
            ticketId: ticketData.ticketId,
            ticketDescription: ticketData.ticketDescription,
            resolvedDate: ticketData.resolvedDate,
            departmentName: ticketData.departmentName,
            issueName: ticketData.issueName,
            statusName: ticketData.statusName || null,
            feedbackType: ticketData.feedbackType,
            assignee: ticketData.assignee,
            assigneeId: ticketData.assigneeId,

            dueDate: moment(ticketData.dueDate).format("YYYY-MM-DD"),
            createdDate: moment(ticketData.createdDate).format("YYYY-MM-DD"),
          })
        );
        setData(formattedData);
        const assigneeIds = ticketDataArray.map(
          (ticketData: any) => ticketData.assigneeId
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleRefresh = () => {
    setSearchTerm("");
    //   fetchData();
  };

  const filterData = (
    data: any[],
    searchTerm: string,
    columnNames: string[]
  ) => {
    return data.filter((item) =>
      columnNames.some((columnName) =>
        item[columnName]
          ? item[columnName]
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          : false
      )
    );
  };
  const showAssigneeModal = (assigneeId: string | null) => {
    // Fetch employee information when modal is opened
    if (assigneeId) {
      axios
        .get(`/api/User/GetUserByEmployeeId?employeeId=${assigneeId}`)
        .then((response) => {
          const employeeInfo = response.data;

          // Update the modal content with the retrieved employee information
          setSelectedAssignee((prevAssignee) => ({
            ...prevAssignee,
            firstName: employeeInfo.firstName,
            officialMailId: employeeInfo.officialMailId,
            contactNumber: employeeInfo.contactNumber,
          }));
        })
        .catch((error) => {
          console.error("Error fetching employee information:", error);
        });

      setAssigneeModalVisible(true);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>Ticket ID</span>
      ),
      dataIndex: "ticketId",
      key: "ticketId",
      width: 120,
      fixed: "left",
      render: (text, record) => (
        <span style={{ fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>
          Department Name
        </span>
      ),
      dataIndex: "departmentName",
      key: "departmentName",
      width: 160,
      fixed: "left",
    },
    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>Issue Type</span>
      ),
      dataIndex: "issueName",
      key: "issueName",
      width: 150,
    },

    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>Description</span>
      ),
      dataIndex: "ticketDescription",
      key: "ticketDescription",
      width: 150,
    },
    // {
    //   title: (
    //     <span style={{ color: "navy", fontWeight: "bold" }}>Assignee</span>
    //   ),
    //   dataIndex: "assignee",
    //   key: "assignee",
    //   width: 150,
    // },
    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>Assignee</span>
      ),
      dataIndex: "assignee",
      key: "assignee",
      width: 150,
      render: (assignee: any, record:any) => {
        console.log(assignee, "assigneeInfo");
        return (
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
            }}
            onClick={() => showAssigneeModal(record.assigneeId)}
          >
            {assignee || "Not Yet Assigned"}
          </span>
        );
      },
    },

    {
      title: <span style={{ color: "navy", fontWeight: "bold" }}>Status</span>,
      dataIndex: "statusName",
      key: "statusName",
      width: 150,
      filters: [
        { text: "Resolved", value: "Resolved" },
        { text: "Rejected", value: "Rejected" },
        { text: "Initiated", value: "Initiated" },
        { text: "Pending", value: "Pending" },
      ],
      onFilter: (value, record) => record.statusName === value,
      render: (text, record) => (
        <div>
          {record.statusName ? (
            <>
              <span className={getStatusDotClass(record.statusName)} />
              {text}
            </>
          ) : (
            "Pending"
          )}
        </div>
      ),
    },

    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>Created On</span>
      ),
      dataIndex: "createdDate",
      key: "createdDate",
      width: 150,
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: <span style={{ color: "navy", fontWeight: "bold" }}>Due On</span>,
      dataIndex: "dueDate",
      key: "dueDate",
      width: 150,
      render: (text: string) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>Resolved On</span>
      ),
      dataIndex: "resolvedDate",
      key: "resolvedDate",
      width: 150,
      render: (text: string | null) =>
        text ? moment(text).format("YYYY-MM-DD") : "",
    },
    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>
          Re-raise Ticket
        </span>
      ),
      dataIndex: "reraiseticket",
      key: "reraiseticket",
      width: 150,
      render: (text: string, record: DataType) => (
        <Button
          type="link"
          icon={<RollbackOutlined />}
          // onClick={() => handleReRaiseTicket(record)}
        >
          Re-raise
        </Button>
      ),
    },
    {
      title: (
        <span style={{ color: "navy", fontWeight: "bold" }}>Feedback</span>
      ),
      dataIndex: "feedbackType",
      key: "feedbackType",
      width: 150,
    },
  ];

  return (
    <div>
      <h1 className="head">TICKET HISTORY</h1>
      <div className="searchs">
        <div>
          <Input
            placeholder="Search..."
            style={{ marginBottom: 16 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button icon={<RedoOutlined />} onClick={handleRefresh} />
      </div>
      <Table
        columns={columns}
        dataSource={filterData(data, searchTerm, [
          "departmentName",
          "ticketId",
          "createdDate",
          "assignee",
        ])}
        scroll={{ x: 1500, y: 600 }}
      />

      <div>
        <Modal
          title="Assignee Information"
          visible={assigneeModalVisible}
          onCancel={() => setAssigneeModalVisible(false)}
          footer={null}
        >
          {selectedAssignee && (
            <div>
              <p>Official Mail ID: {selectedAssignee.officialMailId}</p>
              <p>First Name: {selectedAssignee.firstName}</p>
              <p>Contact Number: {selectedAssignee.contactNumber}</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
export default Viewhistory;
