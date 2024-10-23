import cx from "clsx";
import { useState, useEffect } from "react";
import { Table, Button, Badge, ScrollArea, Text, Loader, Container } from "@mantine/core";
import classes from "../../styles/tableStyle.module.css";
import { Eye, FileText } from "@phosphor-icons/react";
import { host } from "../../../../routes/globalRoutes";
import axios from "axios";
import FileModal from "../modals/fileModal";

const data = [
  { author: "PKP", subject: "Staff for Spacey", date: "10/10/2024" },
  { author: "Jain", subject: "Funds for Starry", date: "27/09/2024" },
  { author: "Gupta", subject: "Update for Galaxy", date: "31/08/2024" },
];
//This data to come from researchProjects.jsx

function InboxTable({username}) {
  const [scrolled, setScrolled] = useState(false);
  const [inboxData, setInboxData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched,setFetched]=useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchInbox = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(
          `${host}/research_procedures/api/get-inbox/?holder=${username}`,
          {
            headers: {
              Authorization: `Token ${token}`,  
              "Content-Type": "application/json",  
            },
            withCredentials: true,  // Include credentials if necessary
          }
        );
        console.log("Fetched Inbox:", response.data);
        setInboxData(response.data);  // Store the fetched projects data
        setLoading(false);
      } catch (error) {
        console.error("Error during Axios GET:", error);
        setLoading(false);
        setFetched(false);
      }
    };
    fetchInbox();
  }, []);

  const handleViewClick = (file) => {
    setSelectedFile(file);
    setModalOpened(true);
  };

  const rows = inboxData.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.requestor}</Table.Td>
      <Table.Td>{row.pid}</Table.Td>
      <Table.Td>{row.request_type}</Table.Td>
      <Table.Td>{row.subject}</Table.Td>
      <Table.Td>{row.date}</Table.Td>

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
              <Table.Th className={classes["header-cell"]}>Request Author</Table.Th>
              <Table.Th className={classes["header-cell"]}>Project ID</Table.Th>
              <Table.Th className={classes["header-cell"]}>Request Type</Table.Th>
              <Table.Th className={classes["header-cell"]}>Subject</Table.Th>
              <Table.Th className={classes["header-cell"]}>Date Received</Table.Th>
              <Table.Th className={classes["header-cell"]}>File</Table.Th>
              <Table.Th className={classes["header-cell"]}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {loading ? (
            <Container py="xl">
              <Loader size="lg" />
            </Container>

          ) : fetched ? (
            <Table.Tbody>{rows}</Table.Tbody>
          ) : (
            <Text color="red" size="xl" weight={700} align="center">Failed to load project details</Text>
          )}
        </Table>
      </ScrollArea>
      <FileModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        file={selectedFile}
      />
    </div>
  );
}

export default InboxTable;
