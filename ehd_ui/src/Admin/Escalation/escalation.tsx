import { Button, Card, Col, Divider, Form, List, Modal, Row, Tag, message, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { GoDotFill } from "react-icons/go";

export function Escalation() {

    const [unresolvedCountData, setUnresolvedCountData] = useState<Array<any>>()
    const [reRaisedCountData, setReRaisedCountData] = useState<Array<any>>()
    const [ticketsData, setTicketsData] = useState<Array<any>>()
    const [reRaiseReason, setReRaiseReason] = useState("")
    const [userData, setUserData] = useState<any>()
    const [isConfirmModalOpen, setIsConfirmModelOpen] = useState(false)
    const [isUserInfoModalOpen, setIsUserInfoModelOpen] = useState(false)
    const [isCardSelect, setIsCardSelect] = useState("")
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("")
    const [selectedDepartmentName, setSelectedDepartmentName] = useState("")
    const [selectedTicketId, setSelectedTicketId] = useState("")
    // const [isResolvedCountDataLoading, setIsResolvedCountDataLoading] = useState(false)
    // const [isReRaisedCountDataLoading, setIsReRaisedCountDataLoading] = useState(false)

    const empId = localStorage.getItem("EmployeeId");

    const [confirmForm] = Form.useForm();

    const confirmModalClose = () =>{
        confirmForm.resetFields(['reRaisedReason']);
        setIsConfirmModelOpen(false);
    }

    const getUnresolvedCounts = () => {
        axios({
            method: 'get',
            url: "/api/Master/GetUnresolvedTicketCounts"
        })
        .then((response:any) => {
            setUnresolvedCountData(response.data);
        })
        .catch((error:any) => {
            message.error(error.message);
        })
    }

    const getReRaisedCounts = () => {
        axios({
            method: 'get',
            url: "/api/Master/GetReRaisedTicketCounts"
        })
        .then((response:any) => {
            setReRaisedCountData(response.data);
        })
        .catch((error:any) => {
            message.error(error.message);
        })
    }

    const getUnresolvedTicketsData = (departmentId: string, departmentName: string) => {

        if (isCardSelect !== `Unresolved ${departmentId}`){
            localStorage.setItem('isCardSelect',`Unresolved ${departmentId}`);
            localStorage.setItem('selectedDepartmentId',departmentId);
            localStorage.setItem('selectedDepartmentName',departmentName);
        
            setIsCardSelect(`Unresolved ${departmentId}`);
            setSelectedDepartmentId(departmentId);
            setSelectedDepartmentName(departmentName);
         }
        axios({
            method: 'get',
            url: `/api/Ticket/GetUnresolvedTicketsByDepartmentId?departmentId=${departmentId}`
        })
        .then((response:any) => {
            setTicketsData(response.data);
        })
        .catch((error:any) => {
            message.error(error.message);
        })
    }

    const getReRaisedTicketsData = (departmentId: string, departmentName: string) => {

        if (isCardSelect !== `Re-Raised ${departmentId}`){
            localStorage.setItem('isCardSelect',`Re-Raised ${departmentId}`);
            localStorage.setItem('selectedDepartmentId',departmentId);
            localStorage.setItem('selectedDepartmentName',departmentName);
        
            setIsCardSelect(`Re-Raised ${departmentId}`);
            setSelectedDepartmentId(departmentId);
            setSelectedDepartmentName(departmentName);
        
        }
        axios({
            method: 'get',
            url: `/api/Ticket/GetRepeatedlyReRaisedTicketsByDepartmentId?departmentId=${departmentId}`
        })
        .then((response:any) => {
            setTicketsData(response.data);
            console.log(response.data)
        })
        .catch((error:any) => {
            message.error(error.message);
        })
    }

    const reRaiseTickets = (ticketId:any) => {
        const data = {
            ticketId: ticketId,
            modifiedBy: empId,
            reRaiseReason: reRaiseReason
          }
        axios({
            method: 'put',
            url: `/api/Ticket/UpdateAdminReRaiseStatus`,
            data: data
        })
        .then(() => {
            setIsConfirmModelOpen(false);
            showReRaiseNotification();    
        })
        .catch((error:any) => {
            message.error(error.message);
        })
    }

    const GetEmployeeData = (empId:any) => {
        axios({
            method: 'get',
            url: `/api/User/GetUserByEmployeeId?employeeId=${empId}`
        })
        .then((response:any) => {
            setUserData(response.data);
            console.log(response.data);
            setIsUserInfoModelOpen(true);
        })
        .catch((error:any) => {
            message.error(error.message);
        })
    }

    const handleReRaise = (ticketId:any) => {
        setIsConfirmModelOpen(true);
        setSelectedTicketId(ticketId);
    }

    const showReRaiseNotification = () => {
        notification.success({
            duration: 6,
            placement: 'topRight',
            message: <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#1677ff' }}>Ticket Re-raised Successfully!</span>,
            description: `Ticket has been re-raised successfully for the respective department`
        });
    };

    useEffect(() => {

        getUnresolvedCounts()
        getReRaisedCounts()

        if(localStorage.getItem("selectedDepartmentId") !== null){

            const cardSelect:any = localStorage.getItem("isCardSelect")
            const deptId:any = localStorage.getItem("selectedDepartmentId")
            const deptName:any = localStorage.getItem("selectedDepartmentName")
            setIsCardSelect(cardSelect)
            setSelectedDepartmentId(deptId)
            setSelectedDepartmentName(deptName)
            console.log(deptId +"" + deptName)

            if(cardSelect === "Unresolved "+deptId){
                getUnresolvedTicketsData(deptId,deptName)
            }
            else{
                getReRaisedTicketsData(deptId,deptName)
            }
        }

    },[isConfirmModalOpen===false]);

   

    return (
        <>
            <div className="esc-heading-div">
                <h2 style={{}}>Escalation</h2>
            </div>

            <div className="count-div" style={{ }}>
                <Row gutter={16}>
                <Col span={6}>
                    <Card title="Unresolved tickets" className="count-card"  loading={unresolvedCountData == null }
                    style={{}}>
                    <List
                        itemLayout="vertical"
                        dataSource={unresolvedCountData}
                        className="count-card-list"
                        style={{ }}
                        renderItem={(item:any) => {
                            return(   
                                <Card.Grid onClick={()=>{getUnresolvedTicketsData(item.DepartmentId,item.DepartmentName)}} 
                                className={isCardSelect === `Unresolved ${item.DepartmentId}` ? "count-card-listitem-click" : "count-card-listitem"}>
                                        <Row gutter={24}>
                                            <Col span={20}><span style={{}}>{item.DepartmentName}</span></Col>
                                            <Col span={4}>{item.UnresolvedCount}</Col>
                                        </Row>
                                </Card.Grid>
                            )
                        }}
                    ></List>
                    <br></br>
                </Card>
            </Col>
            <Col span={6}>
            <Card title="Re-raised tickets" className="count-card"  loading={reRaisedCountData == null }
            style={{}}>
                <List
                    itemLayout="horizontal"
                    dataSource={reRaisedCountData}
                    className="count-card-list"
                    style={{ }}
                    renderItem={(item:any) => {
                        return(   
                            <Card.Grid onClick={()=> {getReRaisedTicketsData(item.DepartmentId,item.DepartmentName)}}
                            className={isCardSelect === `Re-Raised ${item.DepartmentId}` ? "count-card-listitem-click" : "count-card-listitem"}>            
                                    <Row gutter={24}>
                                        <Col span={20}><span style={{}}>{item.DepartmentName}</span></Col>
                                        <Col span={4}>{item.ReRaisedCount}</Col>
                                    </Row>
                            </Card.Grid>
                        )
                    }}
                    ></List>
                 <br></br>
            </Card>
            </Col>
            </Row>
            </div>

            <div className="esc-table-div">
                <div style={{}} className="content-card-heading-div">
                <h3>
                    {isCardSelect.split(" ")[0] + " "}
                </h3>
                {isCardSelect ? <GoDotFill /> : ""}
                <h3>
                    { " " + selectedDepartmentName}
                </h3>
                </div>
                <List
                    dataSource={ticketsData}
                    className="content-card-list"
                    renderItem={(ticket:any)=>{
                        return(
                            <List.Item style={{}} className="content-card-listitem">
                                <Card className="content-card" loading={ticketsData?.length === 0 }>
                                    <Row>
                                        <Col span={18}>
                                            <Row align="top" style={{}}>
                                                <span style={{}} className="content-card-ticketissue">{ticket.issue}</span>
                                                <span style={{}} className="content-card-ticketticketid">#{ticket.ticketId}</span>
                                            </Row>
                                            <Row align="middle" style={{}} className="content-card-ticketinfo-row">
                                                <span>Ticket raised by 
                                                    <span style={{}} className="content-card-ticketuser" onClick={()=>{GetEmployeeData(ticket.employeeId)}}><u> {ticket.userName} </u></span>
                                                    On 
                                                    <span style={{}} className="content-card-createddate"> {moment(ticket.createdDate).format("DD/MM/YYYY")} </span>
                                                    to 
                                                    <span style={{}} className="content-card-ticketuser" onClick={()=>{GetEmployeeData(ticket.assigneeId)}}><u> {ticket.assignee} </u></span>
                                                </span>
                                            </Row>
                                            {
                                                ticket.ticketDescription &&
                                                <Divider className="content-card-divider" style={{}} orientation="left" orientationMargin={-5}>
                                                    <span className="content-card-divider-text" style={{}}>more details</span>
                                                </Divider>       
                                            }
                                            <Row align="bottom" className="content-card-ticketdescription-row" style={{}}>
                                                <span>{ticket.ticketDescription}</span>
                                            </Row>
                                            
                                        </Col>
                                        <Col span={3}>
                                            <br></br>
                                            <Button onClick={()=>{handleReRaise(ticket.ticketId)}} className="content-card-reraise-button" style={{}}>Re-raise</Button>
                                        </Col>
                                        <Col span={3}>
                                            <br></br>
                                         { ticket.priority === "Low" 
                                         ? 
                                         <Tag color="green">{ticket.priority}</Tag>
                                         : (ticket.priority === "Medium")  
                                         ?   
                                        <Tag color="orange">{ticket.priority}</Tag>
                                        :
                                        <Tag color="red">{ticket.priority}</Tag>}
                                        </Col>
                                    </Row>
                                    
                                </Card>
                            </List.Item>                              
                        )                       
                    }}
                    >
                </List>               
            </div>

            <Modal open={isConfirmModalOpen} onCancel={confirmModalClose} title="Are you sure to re-raise this ticket?" footer={null}>
                                <br></br>
                                <Form  
                                layout='vertical' 
                                form={confirmForm}>       
                                    <Form.Item>
                                        <TextArea name="reRaisedReason" autoSize={{ minRows: 2, maxRows: 6 }} maxLength={250} placeholder="Enter your reason here" onChange={(e:any)=>{setReRaiseReason(e.target.value)}}>
                                        </TextArea>
                                    </Form.Item>
                                    
                                    <span style={{display:"flex", alignItems:"center", justifyContent:"space-around"}}>
                                    <Form.Item>
                                        <Button style={{}} className="modal-cancel-button" onClick={()=>{setIsConfirmModelOpen(false)}}>Cancel</Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button style={{}} className="modal-reraise-button" htmlType="submit"  onClick={()=>{reRaiseTickets(selectedTicketId)}}>Re-raise</Button>
                                    </Form.Item>
                                    </span>
                                </Form>
                            </Modal>

            <Modal open={isUserInfoModalOpen} onCancel={()=>{setIsUserInfoModelOpen(false)}} title="User Informations" footer={null}>
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
                                    <div>{userData!== undefined && userData.firstName  + ' ' + userData.lastName}</div>
                                    <div>{userData!== undefined && userData.officialMailId}</div>
                                    <div>{userData!== undefined && userData.contactNumber}</div>
                                    <div>{userData!== undefined && userData.location}</div>
                                    </Col>
                                </Row>
            </Modal>        
        </>

    )
}