  import React, { useEffect, useState } from "react";
  import { Button, Form, Input, Modal, Rate, Table, message } from "antd";
  import axios from "axios";
  import type { TableColumnsType } from "antd";
  import moment from "moment";
  import {
    InfoCircleOutlined,
    MessageFilled,
    MessageOutlined,
    RedoOutlined,
    RollbackOutlined,
  } from "@ant-design/icons";
  import TextArea from "antd/es/input/TextArea";

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
    rejectedReason: string | null;
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
    const [selectedTicketId, setSelectedTicketId] = useState<DataType | null>(
      null
    );
    const empID = localStorage.getItem("EmployeeId");

    const [feedbackRating, setFeedbackRating] = useState<number>(0);
    const [feedbackModalVisible, setFeedbackModalVisible] =
      useState<boolean>(false);
    const [feedbackComments, setFeedbackComments] = useState<string>("");
    const [reRaiseModalVisible, setReRaiseModalVisible] = useState(false);
    const [reRaiseReason, setReRaiseReason] = useState("");

    // ... (existing functions)

    const handleFeedbackSubmit = () => {
      // Validate if a rating is provided
      if (feedbackRating === 0) {
        message.error("Please provide a rating before submitting feedback.");
        return;
      }

      // Perform the POST request using Axios
      const feedbackData = {
        // ticketId: selectedAssignee?.ticketId, // Add the appropriate ticket ID
        rating: feedbackRating,
        comments: feedbackComments,
      };

      axios
        .post("/api/Feedback/SubmitFeedback", feedbackData)
        .then((response) => {
          // Handle successful feedback submission
          message.success("Feedback submitted successfully");
          setFeedbackModalVisible(false);
          // Optionally, you can update the data or re-fetch it after feedback submission
          // fetchData();
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
          message.error("Failed to submit feedback. Please try again.");
        });
    };
    const getStatusDotClass = (status: string | null | undefined) => {
      switch (status) {
        case "Initiated":
          return "blink_me green-dot";
        case "Rejected":
          return "blink_me red-dot";
        case "Resolved":
          return "blink_me yellow-dot";
        // case "Pending":
        //   return "blink_me gray-dot";
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
              rejectedReason: ticketData.rejectedReason || null,

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
    const handleReRaiseSubmit = () => {
      if (!reRaiseReason) {
        message.error("Please enter a reason for re-raising the ticket.");
        return;
      }

      const ticketId = selectedTicketId?.ticketId;

      if (ticketId) {
        axios
          .put(`/api/Ticket/UpdateTicket?ticketId=${ticketId}`, {
            reRaiseReason: reRaiseReason,
          })
          .then((response) => {
            message.success("Ticket re-raised successfully");
            setReRaiseModalVisible(false);
            setReRaiseReason("");
            // Optionally, you can update the data or re-fetch it after re-raising the ticket
            // fetchData();
          })
          .catch((error) => {
            console.error("Error re-raising ticket:", error);
            message.error("Failed to re-raise ticket. Please try again.");
          });
      }
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

    const showRejectedReason = (rejectedReason: string | null) => {
      if (rejectedReason) {
        Modal.info({
          title: "Rejected Reason",
          content: (
            <div>
              <p>{rejectedReason}</p>
            </div>
          ),
        });
      } else {
        message.warning("Rejected reason not available.");
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
        render: (assignee: any, record: any) => {
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
            {record.statusName === "Rejected" ? (
              <>
                <span className={getStatusDotClass(record.statusName)} />
                {text}
                <MessageFilled
                  style={{ marginLeft: 8, color: "blue", cursor: "pointer" }}
                  onClick={() => showRejectedReason(record.rejectedReason)}
                />
              </>
            ) : (
              <span className={getStatusDotClass((text = "Pending"))}>
                <p className="status_pending">Pending</p>
              </span>
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
        render: (text: string, record: any) =>
          record.statusName === "Rejected" ? (
            <Button
              type="link"
              icon={<RollbackOutlined />}
              onClick={() => {
                setReRaiseModalVisible(true);
                setSelectedTicketId(record);
              }}
            >
              Re-raise
            </Button>
          ) : null,
      },

      {
        title: (
          <span style={{ color: "navy", fontWeight: "bold" }}>Feedback</span>
        ),
        dataIndex: "feedbackRating",
        key: "feedbackRating",
        width: 150,
        render: (_, record: any) => (
          <>
            <Rate
              count={3}
              value={record.feedbackRating || 0}
              onChange={(value) => {
                setFeedbackRating(value);
                setFeedbackModalVisible(true);
              }}
            />
            <Modal
              title="Submit Feedback"
              visible={feedbackModalVisible}
              onOk={handleFeedbackSubmit}
              onCancel={() => setFeedbackModalVisible(false)}
            >
              <Form>
                <Form.Item label="Comments">
                  <TextArea
                    rows={4}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                  />
                </Form.Item>
              </Form>
            </Modal>
          </>
        ),
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
            title="Re-raise Ticket"
            visible={reRaiseModalVisible}
            onOk={handleReRaiseSubmit}
            onCancel={() => {
              setReRaiseModalVisible(false);
              setReRaiseReason("");
            }}
          >
            <Form>
              <Form.Item label="Reason for Re-raise">
                <TextArea
                  rows={4}
                  value={reRaiseReason}
                  onChange={(e) => setReRaiseReason(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Assignee Information"
            visible={assigneeModalVisible}
            onCancel={() => setAssigneeModalVisible(false)}
            footer={null}
          >
            {selectedAssignee && (
              <div>
                <p className="AssigneinfoModl">
                  Official Mail ID: {selectedAssignee.officialMailId}
                </p>
                <p className="AssigneinfoModl">
                  First Name: {selectedAssignee.firstName}
                </p>
                <p className="AssigneinfoModl">
                  Contact Number: {selectedAssignee.contactNumber}
                </p>
              </div>
            )}
          </Modal>
        </div>
      </div>
    );
  };
  export default Viewhistory;
