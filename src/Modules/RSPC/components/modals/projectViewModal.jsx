import PropTypes from "prop-types";
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
  Grid,
  GridCol,
} from "@mantine/core";
import { DownloadSimple } from "@phosphor-icons/react";
import axios from "axios";
import { host } from "../../../../routes/globalRoutes";
import {
  fetchStaffRequestsRoute,
  fetchExpenditureRequestsRoute,
} from "../../../../routes/RSPCRoutes";
import { badgeColor } from "../../helpers/badgeColours";

function ProjectViewModal({ opened, onClose, projectData }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);

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
            fetchStaffRequestsRoute(projectData.pid),
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true, // Include credentials if necessary
            },
          );
          console.log("Fetched Staff:", response.data);
          setStaffDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
          setLoading(false);
          setFetched(false);
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
            fetchExpenditureRequestsRoute(projectData.pid),
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            },
          );
          console.log("Fetched Expenditure:", response.data);
          setExpenditureDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
          setLoading(false);
          setFetched(false);
        }
      };
      fetchExpenditure();
    }
  }, [projectData]);

  const staffRows = staffDetails.map((staff, index) => (
    <tr key={index}>
      <td>{staff.person}</td>
      <td>{staff.designation}</td>
      <td>{staff.qualification}</td>
      <td>{staff.dept}</td>
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
        <Container py="xl">
          {" "}
          <Loader size="lg" />
        </Container>
      ) : projectData && Object.keys(projectData).length > 0 && fetched ? (
        <>
          <Group position="apart" style={{ marginBottom: 20 }}>
            <Text size="32px" weight={700}>
              {projectData.name}
            </Text>
            <Badge
              color={badgeColor[projectData.status]}
              size="lg"
              style={{ fontSize: "18px" }}
            >
              {projectData.status}
            </Badge>
          </Group>

          <Grid gutter="xs" style={{ marginBottom: 20 }}>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>
                  Principal Investigator:
                </strong>{" "}
                {projectData.pi_name} ({projectData.pi_id})
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Sponsoring Agency:</strong>{" "}
                {projectData.sponsored_agency}
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Department:</strong>{" "}
                {projectData.dept}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Project Type:</strong>{" "}
                {projectData.type}
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Start Date:</strong>{" "}
                {new Date(projectData.start_date).toLocaleDateString()}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Deadline:</strong>{" "}
                {new Date(projectData.deadline).toLocaleDateString()}
              </Text>
            </GridCol>

            {projectData.finish_date && (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Finish Date:</strong>{" "}
                  {new Date(projectData.finish_date).toLocaleDateString()}
                </Text>
              </GridCol>
            )}

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Total Budget:</strong> ₹
                {projectData.total_budget.toLocaleString()}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Remaining Budget:</strong> ₹
                {projectData.rem_budget.toLocaleString()}
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Category:</strong>{" "}
                {projectData.category}
              </Text>
            </GridCol>
          </Grid>
          <Text size="md" style={{ marginBottom: 20 }}>
            {projectData.description}
          </Text>

          <Divider
            my="lg"
            label={
              <Text size="xl" weight={600}>
                Project Staff
              </Text>
            }
            labelPosition="center"
          />
          <Table highlightOnHover>
            <thead style={{ textAlign: "left" }}>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Qualification</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>{staffRows}</tbody>
          </Table>

          <Divider
            my="lg"
            label={
              <Text size="xl" weight={600}>
                Expenditure Sheet
              </Text>
            }
            labelPosition="center"
          />
          <Table highlightOnHover>
            <thead style={{ textAlign: "left" }}>
              <tr>
                <th>Item</th>
                <th>Cost</th>
                <th>Expenditure Type</th>
                <th>Purchase Method</th>
              </tr>
            </thead>
            <tbody>{expenditureRows}</tbody>
          </Table>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 30,
            }}
          >
            <Button
              component="a"
              color="#15ABFF"
              href={`${host}/${projectData.file}`}
              target="_blank"
              style={{
                marginRight: "3%",
                borderRadius: "8px",
              }}
            >
              <DownloadSimple size={26} style={{ marginRight: "3px" }} />
              Project Agreement File
            </Button>
          </div>
        </>
      ) : (
        <Text color="red" size="xl" weight={700} align="center">
          Failed to load project details
        </Text>
      )}
    </Modal>
  );
}

ProjectViewModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectData: PropTypes.shape({
    pid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    pi_name: PropTypes.string,
    pi_id: PropTypes.string.isRequired,
    sponsored_agency: PropTypes.string.isRequired,
    dept: PropTypes.string,
    type: PropTypes.string,
    start_date: PropTypes.string,
    deadline: PropTypes.string,
    finish_date: PropTypes.string,
    total_budget: PropTypes.number,
    rem_budget: PropTypes.number,
    category: PropTypes.string,
    description: PropTypes.string,
    file: PropTypes.string,
  }).isRequired,
};

export default ProjectViewModal;
