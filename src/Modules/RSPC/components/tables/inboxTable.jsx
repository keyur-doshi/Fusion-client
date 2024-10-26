import cx from "clsx";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Badge,
  ScrollArea,
  Text,
  Loader,
  Container,
} from "@mantine/core";
import classes from "../../styles/tableStyle.module.css";
import { Eye, FileText } from "@phosphor-icons/react";
import { host } from "../../../../routes/globalRoutes";
import axios from "axios";
import FileViewModal from "../modals/fileViewModal";
import FileActionsModal from "../modals/fileActionsModal";
import { designations, rspc_admin } from "../../helpers/designations";

const data = [
  { author: "PKP", subject: "Staff for Spacey", date: "10/10/2024" },
  { author: "Jain", subject: "Funds for Starry", date: "27/09/2024" },
  { author: "Gupta", subject: "Update for Galaxy", date: "31/08/2024" },
];
//This data to come from researchProjects.jsx

function InboxTable({ username }) {
  const [scrolled, setScrolled] = useState(false);
  const [inboxData, setInboxData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [actionsModalOpened, setActionsModalOpened] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchInbox = async () => {
      console.log(designations[username]);
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(
          `${host}/research_procedures/api/get-inbox/?username=${username}&designation=${designations[username]}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include credentials if necessary
          },
        );
        console.log("Fetched Inbox:", response.data);
        setInboxData(response.data); // Store the fetched projects data
        setLoading(false);
      } catch (error) {
        console.error("Error during Axios GET:", error);
        setLoading(false);
        setFetched(false);
      }
    };
    fetchInbox();
  }, [username]);

  const handleViewClick = (file) => {
    setSelectedFile(file);
    setViewModalOpened(true);
  };

  const handleActionsClick = (file) => {
    setSelectedFile(file);
    setActionsModalOpened(true);
  };

  const rows = inboxData.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.uploader}</Table.Td>
      <Table.Td>{row.file_extra_JSON.pid}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>{new Date(row.upload_date).toLocaleDateString()}</Table.Td>

      <Table.Td>
        <Button
          onClick={() => handleViewClick(row)}
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "18px" }}
        >
          <Eye size={26} style={{ margin: "3px" }} />
          View
        </Button>
      </Table.Td>

      <Table.Td>
        <Button
          onClick={() => handleActionsClick(row)}
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "18px" }}
        >
          <FileText size={26} style={{ marginRight: "3px" }} />
          File Tracking
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ padding: "3% 5%" }}>
      <ScrollArea
        h={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th className={classes["header-cell"]}>
                Request Author
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>Project ID</Table.Th>
              <Table.Th className={classes["header-cell"]}>Subject</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Date Received
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>File</Table.Th>
              <Table.Th className={classes["header-cell"]}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan="6">
                <Container py="xl">
                  <Loader size="lg" />
                </Container>
              </Table.Td>
            </Table.Tr>
          ) : fetched ? (
            <>{rows}</>
          ) : (
            <Table.Tr>
                <Table.Td colSpan="6" align="center">
                  <Text color="red" size="xl" weight={700} align="center">
                    Failed to load project details
                  </Text>
                </Table.Td>
              </Table.Tr>
          )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      <FileViewModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        file={selectedFile}
        role="Admin"
      />
      <FileActionsModal
        opened={actionsModalOpened}
        onClose={() => setActionsModalOpened(false)}
        file={selectedFile}
        username={username}
      />
    </div>
  );
}

export default InboxTable;
