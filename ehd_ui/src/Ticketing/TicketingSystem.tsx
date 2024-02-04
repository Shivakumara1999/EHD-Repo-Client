import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import Meta from "antd/es/card/Meta";
import Search from "antd/es/input/Search";
import axios from "axios";

const { Option } = Select;

interface Ticket {
  ticketId: string;
  userName: string | null;
  userEmail: string | null;
  contactNumber: string | null;
  location: string | null;
  ticketDescription: string;
  department: string;
  issue: string;
  priority: string;
  status: string | null;
  reRaiseStatus: boolean;
  reRaiseCount: number | null;
  statusMessage: string | null;
  createdDate: string;
  ticketDate: string;
  employeeId: string | null;
  assignee: string | null;
  assigneeId: string | null;
  reason: string;
  departmentName: string;
  departmentId: string;
}

interface Count {
  totalTicketsCount: number;
  activeTicketsCount: number;
  overDueTicketsCount: number;
  closedTicketsCount: number;
  rejectedTicketsCount: number;
  reRaisedTicketsCount: number;
}

const ITDepart: React.FC = () => {
  const [tableData, setData] = useState<Array<any>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<Array<any>>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [rejectDescription, setRejectDescription] = useState<string>("");
  const [highlightTextArea, setHighlightTextArea] = useState<boolean>(false);
  const [selectedOptionOnCancel, setSelectedOptionOnCancel] = useState<
    string | null
  >(null);
  const [popconfirmTitle, setPopconfirmTitle] = useState<string>("");
  const [isRejectDescriptionValid, setIsRejectDescriptionValid] =
    useState<boolean>(false);
  const [department, setDepartment] = useState<string>("");
  const [highlightDepartmentDropdown, setHighlightDepartmentDropdown] =
    useState<boolean>(false);
  const [resolveVisible, setResolveVisible] = useState(false);
  const [resolveDescription, setResolveDescription] = useState("");
  const [highlightResolveDescription, setHighlightResolveDescription] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmAcceptVisible, setConfirmAcceptVisible] = useState(false);
  const [confirmRejectVisible, setConfirmRejectVisible] = useState(false);
  const [confirmIrrelevantVisible, setConfirmIrrelevantVisible] =
    useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmResolvedVisible, setConfirmResolvedVisible] = useState(false);
  const [resolvedDetails, setResolvedDetails] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [Deparmentid, setDeparmentid] = useState("");
  const [departments, setDepartments] = useState<Ticket[]>([]);
  const [counts, setCounts] = useState<Count>();
  const [userData, setUserData] = useState<any>();
  const [isUserInfoModalOpen, setIsUserInfoModelOpen] = useState(false);

  const departmentId = localStorage.getItem("DepartmentId") || "";
  console.log("ticket"+departmentId);

  const getCategoryName = () => {
    switch (selectedCategory) {
      case "Active":
        return "Active Tickets";
      case "Due":
        return "Due Tickets";
      case "Closed":
        return "Closed Tickets";
      case "ReRaised":
        return "Re-Raised Tickets";
      case "Rejected":
        return "Rejected Tickets";
      default:
        return " ";
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const getActiveData = () => {
    axios
      .get(`/api/Ticket/GetAllActiveTickets?departmentId=${departmentId}`)
      .then((response) => {
        setActiveData(response.data);
      })
      .catch((error) => {
        message.error("Failed to fetch data");
      });
  };

  const getDueData = () => {
    axios
      .get(`/api/Ticket/GetAllOverDueTickets?departmentId=${departmentId}`)
      .then((response) => {
        setActiveData(response.data);
      })
      .catch((error) => {
        message.error("Failed to fetch data");
      });
  };
  const getClosedData = () => {
    axios
      .get(`/api/Ticket/GetAllClosedTickets?departmentId=${departmentId}`)
      .then((response) => {
        setActiveData(response.data);
      })
      .catch((error) => {
        message.error("Failed to fetch data");
      });
  };
  const getReraisedData = () => {
    axios
      .get(`/api/Ticket/GetAllReRaisedTickets?departmentId=${departmentId}`)
      .then((response) => {
        setActiveData(response.data);
      })
      .catch((error) => {
        message.error("Failed to fetch data");
      });
  };
  const getRejectedData = () => {
    axios
      .get(`/api/Ticket/GetAllRejectedTickets?departmentId=${departmentId}`)
      .then((response) => {
        setActiveData(response.data);
      })
      .catch((error) => {
        message.error("Failed to fetch data");
      });
  };

  const renderMeta = (ticket: any) => {
    const createdDate = new Date(ticket.createdDate);
    const currentDate = new Date();

    console.log("createdDate:", createdDate);
    console.log("currentDate:", currentDate);

    const timeDifference = currentDate.getTime() - createdDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);

    let formattedCreatedDate = "";

    if (secondsDifference <= 60) {
      formattedCreatedDate =
        secondsDifference === 1
          ? "1 second ago"
          : `${secondsDifference} seconds ago`;
    } else if (minutesDifference < 60) {
      formattedCreatedDate =
        minutesDifference === 1
          ? "1 minute ago"
          : `${minutesDifference} minutes ago`;
    } else if (hoursDifference < 24) {
      formattedCreatedDate =
        hoursDifference === 1 ? "1 hour ago" : `${hoursDifference} hours ago`;
    } else {
      const day = createdDate.getDate();
      const month = createdDate.getMonth() + 1;
      const year = createdDate.getFullYear();
      formattedCreatedDate = `${day}/${month}/${year}`;
    }

    const dueDate = new Date(ticket.ticketDate);
    let formattedDueDate = "";

    if (dueDate > currentDate) {
      const timeDifference = dueDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      formattedDueDate = `${daysDifference} day${
        daysDifference > 1 ? "s" : ""
      } `;
    } else {
      const day = dueDate.getDate();
      const month = dueDate.getMonth() + 1;
      const year = dueDate.getFullYear();
      formattedDueDate = `${day}/${month}/${year}`;
    }

    const handleUserClick = async (employeeId: string) => {
      axios({
        method: "get",
        url: `/api/User/GetUserByEmployeeId?employeeId=${employeeId}`,
      })
        .then((response: any) => {
          setUserData(response.data);
          console.log(userData);
          setIsUserInfoModelOpen(true);
        })
        .catch((error: any) => {
          message.error(error.message);
        });
    };

    return (
      <Meta
        title={
          <>
            {ticket.issue}{" "}
            <span style={{ color: "grey" }}>#{ticket.ticketId}</span>
          </>
        }
        description={
          <>
            <a href="#!" onClick={() => handleUserClick(ticket.employeeId)}>
              {ticket.userName}
            </a>{" "}
            • <span style={{ fontWeight: "bold" }}>Created </span>:{" "}
            <span style={{ fontWeight: "bold" }}>{formattedCreatedDate}</span> •{" "}
            <span style={{ fontWeight: "bold" }}>Due in</span>:{" "}
            <span style={{ fontWeight: "bold" }}>{formattedDueDate}</span>
            <p>
              <span style={{ color: "black", fontWeight: "bold" }}>
                {ticket.ticketDescription}
              </span>
            </p>
          </>
        }
      />
    );
  };

  const UpdateStatus = (
    ticketId: string,
    assigneeId: string,
    reason: string,
    status: string
  ) => {
    let statusId;
    switch (status) {
      case "Accept":
        statusId = 1;
        break;
      case "Reject":
        statusId = 2;
        break;
      case "Resolved":
        statusId = 3;
        break;
      default:
        break;
    }
    console.log(selectedTicketId);
    const data = {
      ticketId: selectedTicketId,
      statusId: statusId,
      assigneeId: assigneeId,
      reason: reason,
    };
    axios({
      method: "put",
      // headers: {
      //     'Authorization': `Bearer ${authToken}`
      // },https://localhost:7267
      url: `/api/Ticket/UpdateTicketStatus`,
      data: data,
    })
      .then((response: any) => {
        setData(response.data);
      })
      .catch((error: any) => {
        message.error(error.message);
      });
  };

  const handleAccept = () => {
    setConfirmAcceptVisible(false);
    let assigneeId = "E0002"; // ONCE LOGIN DONE, CAPTURE THE VALUE FROM TOKEN, NOW IT IS STATIC VALUE
    UpdateStatus(selectedTicketId, assigneeId, "", "Accept");
    if (!selectedTicketId) {
      message.error("No ticket or action selected");
      return;
    }
  };

  const handleTicketSelection = (ticketId: any) => {
    console.log(ticketId, "ticketId");
    setSelectedTicketId(ticketId);
  };

  const handleReject = () => {
    let assigneeId = "E0002"; // ONCE LOGIN DONE, CAPTURE THE VALUE FROM TOKEN, NOW IT IS STATIC VALUE
    UpdateStatus(selectedTicketId, assigneeId, rejectReason, "Reject");
    setConfirmRejectVisible(false);
    if (!selectedTicketId) {
      message.error("No ticket or action selected");
      return;
    }
  };

  const handleResolved = () => {
    setConfirmResolvedVisible(true);
  };

  const handleResolvedOk = () => {
    let assigneeId = "E0002"; // ONCE LOGIN DONE, CAPTURE THE VALUE FROM TOKEN, NOW IT IS STATIC VALUE
    UpdateStatus(selectedTicketId, assigneeId, resolvedDetails, "Resolved");
    setConfirmResolvedVisible(false);
    if (!selectedTicketId) {
      message.error("No ticket or action selected");
      return;
    }
  };

  const handleResolvedCancel = () => {
    setConfirmResolvedVisible(false);
  };

  const getData = () => {
    axios({
      method: "get",
      // headers: {
      //     'Authorization': `Bearer ${authToken}`
      // },
      url: `/api/Master/GetAllDepartments`,
    })
      .then((response: any) => {
        setDepartments(response.data);
      })
      .catch((error: any) => {
        message.error(error.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleIrrelevant = (department: string) => {
    setDeparmentid(department);
  };

  const updateDepartment = (ticketId: string, departmentId: any) => {
    const data = {
      ticketId: selectedTicketId,
      departmentId: Deparmentid,
    };
    axios({
      method: "put",
      // headers: {
      //     'Authorization': `Bearer ${authToken}`
      // },
      url: `/api/Ticket/UpdateTicketDepartment`,
      data: data,
    })
      .then((response: any) => {
        setData(response.data);
      })
      .catch((error: any) => {
        message.error(error.message);
      });
  };

  const GetAllTicketsCount = () => {
    axios
      .get(`/api/Ticket/GetCount?departmentId=${departmentId}`)
      .then((response: any) => {
        console.log(response.data);
        setCounts(response.data);
        message.success("Tickets Fetched Successfully");
      })
      .catch((error) => {
        message.error(error.message);
        console.log("Error While Fetching Tickets");
      });
  };

  useEffect(() => {
    GetAllTicketsCount();
  }, []);

  return (
    <>
      <div className="div">
        <h1 className="heading">Ticketing System</h1>
        <Search placeholder="Search here" className="search" />
      </div>
      <div className="card-container">
        {/* Card 1: Total */}
        <Card hoverable className="custom-card">
          <Meta
            title={
              <>
                <div className="dot-title-container1">
                  <span className="dot1" />
                  <span className="card-title1">Total</span>
                </div>
                <br />
                <span className="card-value">{counts?.totalTicketsCount}</span>
                <br />
              </>
            }
          />
        </Card>

        {/* Card 2: Active */}
        <Card
          hoverable
          className={`custom-card ${
            selectedCategory === "Active" ? "selected" : ""
          }`}
          onClick={() => handleCategoryClick("Active")}
        >
          <Meta
            title={
              <>
                <div className="dot-title-container2">
                  <span className="dot2" />
                  <span className="card-title2">Active</span>
                </div>
                <br />
                <span className="card-value">{counts?.activeTicketsCount}</span>
                <br />
                <a href="#!" onClick={getActiveData} className="view-details">
                  View Details
                </a>
              </>
            }
          />
        </Card>

        {/* Card 3: Due */}
        <Card
          hoverable
          className={`custom-card ${
            selectedCategory === "Due" ? "selected" : ""
          }`}
          onClick={() => handleCategoryClick("Due")}
        >
          <Meta
            title={
              <>
                <div className="dot-title-container3">
                  <span className="dot3" />
                  <span className="card-title3">Due</span>
                </div>
                <br />
                <span className="card-value">
                  {counts?.overDueTicketsCount}
                </span>
                <br />
                <a href="#!" onClick={getDueData} className="view-details">
                  View Details
                </a>
              </>
            }
          />
        </Card>

        {/* Card 4: Closed */}
        <Card
          hoverable
          className={`custom-card ${
            selectedCategory === "Closed" ? "selected" : ""
          }`}
          onClick={() => handleCategoryClick("Closed")}
        >
          <Meta
            title={
              <>
                <div className="dot-title-container4">
                  <span className="dot4" />
                  <span className="card-title4">Closed</span>
                </div>
                <br />
                <span className="card-value">{counts?.closedTicketsCount}</span>
                <br />
                <a href="#!" onClick={getClosedData} className="view-details">
                  View Details
                </a>
              </>
            }
          />
        </Card>

        {/* Card 5: Re-Raised */}
        <Card
          hoverable
          className={`custom-card ${
            selectedCategory === "ReRaised" ? "selected" : ""
          }`}
          onClick={() => handleCategoryClick("ReRaised")}
        >
          <Meta
            title={
              <>
                <div className="dot-title-container5">
                  <span className="dot5" />
                  <span className="card-title5">Re-Raised</span>
                </div>
                <br />
                <span className="card-value">
                  {counts?.reRaisedTicketsCount}
                </span>
                <br />
                <a href="#!" onClick={getReraisedData} className="view-details">
                  View Details
                </a>
              </>
            }
          />
        </Card>

        {/* Card 6: Rejected */}
        <Card
          hoverable
          className={`custom-card ${
            selectedCategory === "Rejected" ? "selected" : ""
          }`}
          onClick={() => handleCategoryClick("Rejected")}
        >
          <Meta
            title={
              <>
                <div className="dot-title-container6">
                  <span className="dot6" />
                  <span className="card-title6">Rejected</span>
                </div>
                <br />
                <span className="card-value">
                  {counts?.rejectedTicketsCount}
                </span>
                <br />
                <a href="#!" onClick={getRejectedData} className="view-details">
                  View Details
                </a>
              </>
            }
          />
        </Card>
      </div>

      <h2>{getCategoryName()}</h2>
      {selectedCategory && (
        <div
          style={{
            height: "300px",
            overflowX: "auto",
            overflowY: "auto",
            marginTop: "16px",
          }}
        >
          {activeData.map((ticket: any, index: number) => (
            <Card
              key={index}
              style={{ width: "100%", padding: "16px", marginBottom: "16px" }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="ticket-card">{renderMeta(ticket)}</div>

                <div className="middle-content">
                  <Select
                    onSelect={() => {
                      handleTicketSelection(ticket.ticketId);
                    }}
                    className="dropdown"
                    defaultValue="Acknowledge"
                    onChange={(value) => {
                      switch (value) {
                        case "1": // Accept
                          setConfirmAcceptVisible(true);
                          break;
                        case "2": // Reject
                          setConfirmRejectVisible(true);
                          break;
                        case "3": // Irrelevant
                          setConfirmResolvedVisible(true);
                          break;
                        case "4": // Irrelevant
                          setConfirmIrrelevantVisible(true);
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    <Option className="option1" value="1">
                      Accept
                    </Option>
                    <Option className="option2" value="2">
                      Reject
                    </Option>
                    <Option className="option3" value="4">
                      Irrelevant
                    </Option>
                  </Select>
                </div>
                <div className="right-content">
                  <Button
                    className="right-content-btn"
                    onClick={() => {
                      handleTicketSelection(ticket.ticketId);
                      handleResolved();
                    }}
                    value="3"
                  >
                    Resolved?
                  </Button>
                </div>
                <p>{ticket.priority}</p>
                <Modal
                  className="modal"
                  title="Are you sure you want to accept the ticket?"
                  visible={confirmAcceptVisible}
                  onOk={handleAccept}
                  onCancel={() => setConfirmAcceptVisible(false)}
                >
                  <p>Press OK to accept the ticket.</p>
                </Modal>

                <Modal
                  className="modal"
                  title="Reason for Rejection"
                  visible={confirmRejectVisible}
                  onOk={handleReject}
                  onCancel={() => setConfirmRejectVisible(false)}
                >
                  <Input.TextArea
                    placeholder="Enter reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </Modal>

                <Modal
                  className="modal"
                  title="Select Department"
                  visible={confirmIrrelevantVisible}
                  onOk={() => {
                    updateDepartment(ticket, departmentId);
                    setConfirmIrrelevantVisible(false);
                  }}
                  onCancel={() => setConfirmIrrelevantVisible(false)}
                >
                  <Select defaultValue="Department" onChange={handleIrrelevant}>
                    {/* // */}
                    {departments
                      .filter(
                        (department) => department.departmentId !== departmentId
                      )
                      .map((department, index) => (
                        <Option key={index} value={department.departmentId}>
                          {department.departmentName}
                        </Option>
                      ))}
                  </Select>
                </Modal>

                <Modal
                  className="modal"
                  title="Is the issue resolved?"
                  visible={confirmResolvedVisible}
                  onOk={handleResolvedOk}
                  onCancel={handleResolvedCancel}
                >
                  <p>Further details if any?</p>
                  <Input.TextArea
                    value={resolvedDetails}
                    onChange={(e) => setResolvedDetails(e.target.value)}
                  />
                </Modal>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* User Info Modal */}
      <Modal
        open={isUserInfoModalOpen}
        onCancel={() => {
          setIsUserInfoModelOpen(false);
        }}
        title="User Informations"
        footer={null}
      >
        <Row>
          <Col span={8}>
            <div>User Name</div>
            <div>User Mail</div>
            <div>Contact Number</div>
            <div>Location</div>
          </Col>
          <Col span={2}>
            <div> : </div>
            <div> : </div>
            <div> : </div>
            <div> : </div>
          </Col>
          <Col span={14}>
            <div>
              {userData !== undefined &&
                userData.firstName + " " + userData.lastName}
            </div>
            <div>{userData !== undefined && userData.officialMailId}</div>
            <div>{userData !== undefined && userData.contactNumber}</div>
            <div>{userData !== undefined && userData.Location}</div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ITDepart;
