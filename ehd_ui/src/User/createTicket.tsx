import { Button, Card, notification } from "antd";
import React, { useState, useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import axios, { AxiosResponse } from "axios";

interface Department {
  departmentId: string;
  departmentName: string;
  createdDate: string;
  modifiedDate: null | string;
  createdBy: null | string;
  modifiedBy: null | string;
  isActive: boolean;
}

interface IssueType {
  issueid: string;
  issueName: string;
  createdDate: string;
  modifiedDate: null | string;
  createdBy: null | string;
  modifiedBy: null | string;
  isActive: boolean;
}
interface PriorityType {
  priorityId: string;
  priorityName: string;
  // createdDate: string;
  // modifiedDate: null | string;
  // createdBy: null | string;
  // modifiedBy: null | string;
  // isActive: boolean;
}
const CreateTicket: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState("Select Department");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [issueType, setIssueType] = useState("Select Issue Type");
  const [priorityType, setPriorityType] = useState("Select Priority Type");
  const [descriptionRequired, setDescriptionRequired] = useState(false);
  const [ticketDescription, setticketDescription] = useState("");
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [priorityTypes, setPriorityTypes] = useState<PriorityType[]>([]);
  const [dynamicOption, setDynamicOption] = useState("");

  const empID = localStorage.getItem("EmployeeId");

  useEffect(() => {
    axios
      .get("/api/Master/GetActivePriority")
      .then((response: AxiosResponse<PriorityType[]>) => {
        setPriorityTypes(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching priority types:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/Master/GetActiveDepartments")

      .then((response: AxiosResponse<Department[]>) => {
        setDepartments(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching department data:", error);
      });
  }, []);

  useEffect(() => {
    if (department !== "Select Department") {
      const selectedDepartment = departments.find(
        (dep) => dep.departmentName === department
      );

      if (selectedDepartment) {
        setSelectedDepartmentId(selectedDepartment.departmentId);
      }
    }
  }, [department, departments]);

  useEffect(() => {
    if (selectedDepartmentId) {
      axios
        .get(
          ` /api/Ticket/GetIssueTypeByDepartmentId?departmentId=${selectedDepartmentId}`
        )
        .then((response: AxiosResponse<IssueType[]>) => {
          setIssueTypes(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching issue types:", error);
        });
    }
  }, [selectedDepartmentId]);

  const handleSubmit = () => {
    // Check if all required fields are selected
    if (
      department === "Select Department" ||
      (issueType !== "Other" && issueType === "Select Issue Type") ||
      priorityType === "Select Priority Type" ||
      (descriptionRequired && ticketDescription === "")
    ) {
      console.error("Please fill in all required fields");
      return;
    }

    let selectedIssueId: string | null = null;

    if (issueType !== "Other") {
      const selectedIssue = issueTypes.find(
        (issue) => issue.issueName === issueType
      );
      if (!selectedIssue) {
        console.error("Selected issue not found");
        return;
      }
      selectedIssueId = selectedIssue.issueid;
    }

    const payload = {
      departmentId: selectedDepartmentId,
      issueId: selectedIssueId,
      priorityId: priorityTypes.find(
        (priority) => priority.priorityName === priorityType
      )?.priorityId,
      ticketDescription,
      createdBy: empID,
      employeeId: empID, // Assuming empID is required for the API
    };

    axios
      .post("/api/Ticket/CreateTicket", payload)
      .then((response) => {
        console.log("Ticket created successfully:", response.data);
        handleClear();

        // Show success notification
        notification.success({
          message: "Ticket Submitted Successfully",
          description:
            "Your ticket has been submitted successfully and will get resolved soon.",
        });

        // Auto-dismiss notification after 3 seconds
        setTimeout(() => {
          notification.destroy();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error creating ticket:", error);
        // Handle error or show user-friendly message
      });
  };
  const handleIssueTypeChange = (selectedIssueType: string) => {
    if (selectedIssueType === "Other") {
      setDynamicOption("Your Dynamic Option");
    } else {
      setDynamicOption("");
    }

    setIssueType(selectedIssueType);
    setDescriptionRequired(selectedIssueType === "Other");
  };

  const handleClear = () => {
    setDepartment("Select Department");
    setIssueType("Select Issue Type");
    setPriorityType("Select Priority Type");
    setticketDescription("");
  };

  return (
    <div className="ticket_form">
      <div>
        <h1 className="head">CREATE TICKET</h1>
      </div>
      <div className="drop">
        <Card style={{ width: 320 }}>
          <h2 className="headings">Department Name</h2>
          <label>
            <select
              className="dropdown"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Select Department" disabled>
                Select Department
              </option>
              {departments.map((dep) => (
                <option key={dep.departmentId} value={dep.departmentName}>
                  {dep.departmentName}
                </option>
              ))}
            </select>
          </label>
        </Card>
        <Card style={{ width: 320 }}>
          <h2 className="headings">Issue Type</h2>
          <label>
            <select
              className="dropdown"
              value={issueType}
              onChange={(e) => handleIssueTypeChange(e.target.value)}
            >
              <option value="Select Issue Type" disabled>
                Select Issue Type
              </option>
              {issueTypes.map((issue) => (
                <option key={issue.issueid} value={issue.issueName}>
                  {issue.issueName}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </label>
        </Card>

        <Card style={{ width: 320 }}>
          <h2 className="headings">Select Priority</h2>
          <label>
            <select
              className="dropdown"
              value={priorityType}
              onChange={(e) => setPriorityType(e.target.value)}
            >
              <option value="Select Priority Type" disabled>
                Select Priority Type
              </option>
              {priorityTypes.map((priority) => (
                <option key={priority.priorityId} value={priority.priorityName}>
                  {priority.priorityName}
                </option>
              ))}
            </select>
          </label>
        </Card>
      </div>
      <div>
        <Card className="descriptioncard">
          <div>
            <h2 className="headings">
              Description{" "}
              {descriptionRequired && <span style={{ color: "red" }}>*</span>}
            </h2>
            <TextArea
              rows={4}
              placeholder="Enter description"
              value={ticketDescription}
              onChange={(e) => setticketDescription(e.target.value)}
            />
            <br />
            <br />
          </div>
        </Card>
        <div className="subclrbutton">
          <div>
            <Button type="primary" onClick={handleSubmit}>
              Submit Ticket
            </Button>
          </div>
          <div>
            <Button type="primary" danger onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
