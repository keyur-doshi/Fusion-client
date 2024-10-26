import cx from "clsx";
import { useState, useEffect } from "react";
import {
  Table,
  Container,
  Text,
  Loader,
  Button,
  Badge,
  ScrollArea,
} from "@mantine/core";
import classes from "../../styles/tableStyle.module.css";
import { DownloadSimple, Eye } from "@phosphor-icons/react";
import { host } from "../../../../routes/globalRoutes";
import axios from "axios";
import FileViewModal from "../modals/fileViewModal";

const badgeColor = {
  OnGoing: "#85B5D9",
  Completed: "green",
  Terminated: "red",
  Approved: "green",
  Pending: "#85B5D9",
  Rejected: "red",
};

function RequestTable({ username }) {
  const [scrolled, setScrolled] = useState(false);
  const [PIDs, setPIDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);

  const [selectedFileID, setSelectedFileID] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const handleViewClick = (file) => {
    setSelectedFileID(file);
    setModalOpened(true);
  };

  useEffect(() => {
    setLoading(true);
    const fetchPIDs = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No authentication token found!");
      try {
        const response = await axios.get(
          `${host}/research_procedures/api/get-PIDs/?lead_id=${username}`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        console.log("Fetched PIDs:", response.data);
        setPIDs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error during Axios GET:", error);
        setLoading(false);
        setFetched(false);
      }
    };
    fetchPIDs();
  }, [username]);

  const [expenditureRequests, setExpenditureRequests] = useState([]);
  const [staffRequests, setStaffRequests] = useState([]);
  useEffect(() => {
    if (PIDs.length > 0) {
      setLoading(true);
      const fetchRequestsData = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No authentication token found!");

        try {
          const fetchExpenditurePromises = PIDs.map((pid) =>
            axios.get(
              `${host}/research_procedures/api/get-expenditure/?pid=${pid}`,
              {
                headers: {
                  Authorization: `Token ${token}`,
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              },
            ),
          );

          const fetchStaffPromises = PIDs.map((pid) =>
            axios.get(`${host}/research_procedures/api/get-staff/?pid=${pid}`, {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }),
          );
          const expenditureResponses = await Promise.all(
            fetchExpenditurePromises,
          );
          const staffResponses = await Promise.all(fetchStaffPromises);

          setExpenditureRequests(
            expenditureResponses.map((response) => response.data).flat(),
          );
          setStaffRequests(
            staffResponses.map((response) => response.data).flat(),
          );
          setLoading(false);
        } catch (error) {
          console.error("Error during fetching details:", error);
          setLoading(false);
          setFetched(false);
        }
      };

      fetchRequestsData();
    }
  }, [PIDs]);

  useEffect(() => {
    console.log(staffRequests);
  }, [staffRequests]);

  const expenditureRows = expenditureRequests.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Badge color={badgeColor[row.approval]} size="lg">
          {row.approval}
        </Badge>
      </Table.Td>
      <Table.Td>{row.pid}</Table.Td>
      <Table.Td>{row.item}</Table.Td>
      <Table.Td>Expenditure</Table.Td>
      <Table.Td>{row.date}</Table.Td>
      <Table.Td>
        <Button
          onClick={() => handleViewClick(row.file_id)}
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "18px" }}
        >
          <Eye size={26} style={{ margin: "3px" }} />
          View
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const staffRows = staffRequests.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Badge color={badgeColor[row.approval]} size="lg">
          {row.approval}
        </Badge>
      </Table.Td>
      <Table.Td>{row.pid}</Table.Td>
      <Table.Td>{row.person}</Table.Td>
      <Table.Td>Staff</Table.Td>
      <Table.Td>{row.date}</Table.Td>
      <Table.Td>
        <Button
          onClick={() => handleViewClick(row.file_id)}
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "18px" }}
        >
          <Eye size={26} style={{ margin: "3px" }} />
          View
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
              <Table.Th className={classes["header-cell"]}>Status</Table.Th>
              <Table.Th className={classes["header-cell"]}>Project ID</Table.Th>
              <Table.Th className={classes["header-cell"]}> Subject</Table.Th>
              <Table.Th className={classes["header-cell"]}>Type</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Last Update
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>File</Table.Th>
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
            <>
              {expenditureRows}
              {staffRows}
            </>
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
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        file={selectedFileID}
        role="Professor"
      />
    </div>
  );
}

export default RequestTable;
