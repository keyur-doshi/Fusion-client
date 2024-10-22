import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Badge,
  Group,
  Table,
  Loader,
  Container,
  Divider,
} from "@mantine/core";
import { FileText, EyeSlash } from "@phosphor-icons/react";
import axios from "axios";
import { host } from "../../../routes/globalRoutes";

function ProjectModal({ opened, onClose, projectData }) {
  const [loading, setLoading] = useState(false);

  const [staffDetails, setStaffDetails] = useState([]);
  useEffect(() => {
    // console.log(projectData);
    if (opened && projectData) {
      setLoading(true);
      const fetchStaff = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No authentication token found!");
        try {
          const response = await axios.get(
            `${host}/research_procedures/api/get-staff/?pid=${projectData.pid}`,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,  // Include credentials if necessary
            }
          );
          console.log("Fetched Staff:", response.data);
          setStaffDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
        }
      };
      fetchStaff();
    }
  }, [projectData]);


  const [expenditureDetails, setExpenditureDetails] = useState([]);
  useEffect(() => {
    if (opened && projectData) {
      setLoading(true);
      const fetchExpenditure = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No authentication token found!");
        try {
          const response = await axios.get(
            `${host}/research_procedures/api/get-expenditure/?pid=${projectData.pid}`,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          console.log("Fetched Expenditure:", response.data);
          setExpenditureDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
        }
      };
      fetchExpenditure();
    }
  }, [projectData]);

  const badgeColor = {
    OnGoing: "#85B5D9",
    Completed: "green",
    Terminated: "red",
    Approved: "green",
    Pending: "#85B5D9",
    Rejected: "red",
  };

  const staffRows = staffDetails.map((staff, index) => (
    <tr key={index}>
      <td>{staff.name}</td>
      <td>{staff.role}</td>
      <td>{staff.contact}</td>
      <td>{staff.department}</td>
    </tr>
  ));
  const expenditureRows = expenditureDetails.map((item, index) => (
    <tr key={index}>
      <td>{item.item}</td>
      <td>{item.cost}</td>
      <td>{item.exptype}</td>
      <td>{item.mode}</td>
    </tr>
  ));


  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {loading ? (
        <Container py="xl"> <
          Loader size="lg" />
        </Container>

      ) : projectData ? (
        <>
          <Group position="apart" style={{ marginBottom: 20 }}>
            <Text size="32px" weight={700}>{projectData.name}</Text>
            <Badge color={badgeColor[projectData.status]} size="lg" style={{ fontSize: '18px' }}>{projectData.status}</Badge>
          </Group>

          <Text size="md" style={{ marginBottom: 20 }}>
            {projectData.description}
          </Text>

          <Divider my="lg" label={<Text size="xl" weight={600}>Project Staff</Text>} labelPosition="center" />
          <Table highlightOnHover>
            <thead style={{ textAlign: 'left' }}>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>{staffRows}</tbody>
          </Table>

          <Divider my="lg" label={<Text size="xl" weight={600}>Expenditure Sheet</Text>} labelPosition="center" />
          <Table highlightOnHover>
            <thead style={{ textAlign: 'left' }}>
              <tr>
                <th>Item</th>
                <th>Cost</th>
                <th>Expenditure Type</th>
                <th>Purchase Method</th>
              </tr>
            </thead>
            <tbody>{expenditureRows}</tbody>
          </Table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
            <Button color="#15ABFF" style={{ marginRight: '3%' }}>
              <FileText size={26} style={{ marginRight: "3px" }} />
              Download Report
            </Button>
            <Button variant="outline" color="red" onClick={onClose} style={{ marginRight: '3%' }}>
              <EyeSlash size={26} style={{ marginRight: "3px" }} />
              Close
            </Button>
          </div>
        </>
      ) : (
        <Text color="red">Failed to load project details.</Text>
      )}
    </Modal>
  );
}

export default ProjectModal;
