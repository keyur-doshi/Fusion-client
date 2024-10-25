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
import { FileText, EyeSlash, DownloadSimple } from "@phosphor-icons/react";
import axios from "axios";
import { host } from "../../../../routes/globalRoutes";

function FileViewModal({ opened, onClose, file, role }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);

  const [fileDetails, setFileDetails] = useState({});
  useEffect(() => {
    if (role === "Professor") {
      if (opened && file) {
        setLoading(true);
        const fetchFile = async () => {
          const token = localStorage.getItem("authToken");
          if (!token) return console.error("No authentication token found!");
          try {
            const response = await axios.get(
              `${host}/research_procedures/api/get-file/?file_id=${file}`,
              {
                headers: {
                  Authorization: `Token ${token}`,
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              },
            );
            console.log("Fetched File:", response.data);
            setFileDetails(response.data);
            setLoading(false);
          } catch (error) {
            console.error("Error during Axios GET:", error);
            setLoading(false);
            setFetched(false);
          }
        };
        fetchFile();
      }
    } else {
      setFileDetails(file);
    }
  }, [file]);

  const badgeColor = {
    OnGoing: "#85B5D9",
    Completed: "green",
    Terminated: "red",
    Approved: "green",
    Pending: "#85B5D9",
    Rejected: "red",
  };

  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {loading ? (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      ) : fileDetails && Object.keys(fileDetails).length > 0 && fetched ? (
        <>
          <Group position="apart" style={{ marginBottom: 20 }}>
            <Text size="32px" weight={700}>
              {fileDetails.subject}
            </Text>
            <Badge
              color={badgeColor[fileDetails.file_extra_JSON.approval]}
              size="lg"
              style={{ fontSize: "18px" }}
            >
              {fileDetails.file_extra_JSON.approval}
            </Badge>
          </Group>

          <Text size="26px" style={{ marginBottom: 20 }}>
            {fileDetails.description}
          </Text>
          <Grid gutter="xs" style={{ marginBottom: 20 }}>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>File ID:</strong>{" "}
                {fileDetails.id}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Project ID:</strong>{" "}
                {fileDetails.file_extra_JSON.pid}
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Requestor:</strong>{" "}
                {fileDetails.uploader}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Date Of Request:</strong>{" "}
                {new Date(fileDetails.upload_date).toLocaleDateString()}
              </Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Request ID:</strong>{" "}
                {fileDetails.src_object_id}
              </Text>
            </GridCol>
            <GridCol span={6}>
              <Text size="xl">
                <strong style={{ color: "blue" }}>Request Type:</strong>{" "}
                {fileDetails.file_extra_JSON.request_type}
              </Text>
            </GridCol>
            {role !== "Professor" && (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Sender:</strong>{" "}
                  {fileDetails.sent_by_user}
                </Text>
              </GridCol>
            )}
            {role !== "Professor" && (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Sender Designation:</strong>{" "}
                  {fileDetails.sent_by_designation}
                </Text>
              </GridCol>
            )}
          </Grid>
          <Divider
            my="lg"
            label={
              <Text size="xl" weight={600}>
                Request Details
              </Text>
            }
            labelPosition="center"
          />
          <Grid gutter="xs" style={{ marginBottom: 20 }}>
            {fileDetails.file_extra_JSON.request_type === "Expenditure" ? (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Item Cost:</strong> ₹
                  {fileDetails.file_extra_JSON.cost}
                </Text>
              </GridCol>
            ) : (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Designation:</strong>{" "}
                  {fileDetails.file_extra_JSON.designation}
                </Text>
              </GridCol>
            )}
            {fileDetails.file_extra_JSON.request_type === "Expenditure" ? (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Last Required By:</strong>{" "}
                  {new Date(
                    fileDetails.file_extra_JSON.lastdate,
                  ).toLocaleDateString()}
                </Text>
              </GridCol>
            ) : (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Stipend:</strong> ₹
                  {fileDetails.file_extra_JSON.stipend}
                </Text>
              </GridCol>
            )}
            {fileDetails.file_extra_JSON.request_type === "Expenditure" ? (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Expenditure Type:</strong>{" "}
                  {fileDetails.file_extra_JSON.exptype}
                </Text>
              </GridCol>
            ) : (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Qualification:</strong>{" "}
                  {fileDetails.file_extra_JSON.qualification}
                </Text>
              </GridCol>
            )}
            {fileDetails.file_extra_JSON.request_type === "Expenditure" ? (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Mode Of Purchase:</strong>{" "}
                  {fileDetails.file_extra_JSON.mode}
                </Text>
              </GridCol>
            ) : (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Department:</strong>{" "}
                  {fileDetails.file_extra_JSON.dept}
                </Text>
              </GridCol>
            )}
            {fileDetails.file_extra_JSON.request_type === "Expenditure" ? (
              <GridCol span={12}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>
                    Part Of Institute Inventory:
                  </strong>{" "}
                  {fileDetails.file_extra_JSON.inventory}
                </Text>
              </GridCol>
            ) : (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Start Date:</strong>{" "}
                  {new Date(
                    fileDetails.file_extra_JSON.startdate,
                  ).toLocaleDateString()}
                </Text>
              </GridCol>
            )}
            {fileDetails.file_extra_JSON.request_type === "Staff" && (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>End Date:</strong>{" "}
                  {new Date(
                    fileDetails.file_extra_JSON.lastdate,
                  ).toLocaleDateString()}
                </Text>
              </GridCol>
            )}
            {fileDetails.file_extra_JSON.request_type === "Staff" && (
              <GridCol span={12}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Employee Fusion ID:</strong>{" "}
                  {fileDetails.file_extra_JSON.uname}
                </Text>
              </GridCol>
            )}
            <Text size="md" style={{ marginBottom: 20 }}>
              {fileDetails.file_extra_JSON.desc}
            </Text>
          </Grid>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 30,
            }}
          >
            <Button color="#15ABFF" style={{ marginRight: "3%" }}>
              <DownloadSimple size={26} style={{ marginRight: "3px" }} />
              Download File
            </Button>
            <Button
              variant="outline"
              color="red"
              onClick={onClose}
              style={{ marginRight: "3%" }}
            >
              <EyeSlash size={26} style={{ marginRight: "3px" }} />
              Close
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

export default FileViewModal;
