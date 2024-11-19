import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Badge,
  Group,
  Loader,
  Container,
  Divider,
  Grid,
  GridCol,
} from "@mantine/core";
import { FileText } from "@phosphor-icons/react";
import axios from "axios";
import { host } from "../../../../routes/globalRoutes";
import { fetchFileRoute } from "../../../../routes/RSPCRoutes";
import { badgeColor } from "../../helpers/badgeColours";

function FileViewModal({ opened, onClose, file, userRole }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);

  const [fileDetails, setFileDetails] = useState({});
  const [senderDetails, setSenderDetails] = useState({});
  useEffect(() => {
    if (userRole === "Professor") {
      if (opened && file) {
        setLoading(true);
        const fetchFile = async () => {
          const token = localStorage.getItem("authToken");
          if (!token) return console.error("No authentication token found!");
          try {
            const response = await axios.get(fetchFileRoute(file), {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            });
            console.log("Fetched File Details:", response.data);
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
    } else if (file) {
      if (userRole === "Admin_Inbox") {
        setFileDetails(file.fileData);
        setSenderDetails({
          sender: file.sender,
          sender_designation: file.sender_designation,
        });
      } else setFileDetails(file);
    }
  }, [file]);

  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {loading ? (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      ) : fileDetails && Object.keys(fileDetails).length > 0 && fetched ? (
        <>
          <Group position="apart" style={{ marginBottom: 10 }}>
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

          <Text size="26px" style={{ marginBottom: 30 }}>
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
            {userRole === "Admin_Inbox" && (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Sender:</strong>{" "}
                  {senderDetails.sender}
                </Text>
              </GridCol>
            )}
            {userRole === "Admin_Inbox" && (
              <GridCol span={6}>
                <Text size="xl">
                  <strong style={{ color: "blue" }}>Sender Designation:</strong>{" "}
                  {senderDetails.sender_designation}
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
            <Button
              component="a"
              color="#15ABFF"
              href={`${host}/${fileDetails.file}`}
              target="_blank"
              style={{
                marginRight: "3%",
                borderRadius: "8px",
              }}
            >
              <FileText size={26} style={{ marginRight: "3px" }} />
              Request Details File
            </Button>
          </div>
        </>
      ) : (
        <Text color="red" size="xl" weight={700} align="center">
          Failed to load request details
        </Text>
      )}
    </Modal>
  );
}

FileViewModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  file: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  userRole: PropTypes.oneOf(["Professor", "Admin_Inbox", "Admin_Processed"])
    .isRequired,
};

export default FileViewModal;
