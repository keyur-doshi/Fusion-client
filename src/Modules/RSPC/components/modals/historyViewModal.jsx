import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Badge,
  Card,
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
import { badgeColor } from "../../helpers/badgeColours";

function HistoryViewModal({ opened, onClose, file, role }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(true);

  const [historyDetails, setHistoryDetails] = useState({});
  useEffect(() => {
    if (opened && file) {
      setLoading(true);
      const fetchFile = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return console.error("No authentication token found!");
        try {
          const response = await axios.get(
            `${host}/research_procedures/api/get-history/?file_id=${file}`,
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            },
          );
          console.log("Fetched File Tracking History:", response.data);
          const sortedHistoryDetails = response.data.sort(
            (a, b) => new Date(a.forward_date) - new Date(b.forward_date),
          );
          setHistoryDetails(sortedHistoryDetails);
          console.log("sorted:", historyDetails);
          setLoading(false);
        } catch (error) {
          console.error("Error during Axios GET:", error);
          setLoading(false);
          setFetched(false);
        }
      };
      fetchFile();
    }
    // } else {
    //   setHistoryDetails(file);
    // }
  }, [file]);

  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {loading ? (
        <Container py="xl">
          <Loader size="lg" />
        </Container>
      ) : historyDetails && Array.isArray(historyDetails) && fetched ? (
        <>
          <Group position="apart" style={{ marginBottom: 30 }}>
            <Text size="32px" weight={700}>
              {historyDetails[0].tracking_extra_JSON["tracker heading"]}
            </Text>
            <Badge
              color={badgeColor[historyDetails[0].tracking_extra_JSON["approval"]]}
              size="lg"
              style={{ fontSize: "18px" }}
            >
              {historyDetails[0].tracking_extra_JSON.approval}
            </Badge>
          </Group>

          <Text fw={700} size="26px" style={{ marginBottom: 10, color: "#15ABFF", textAlign:"center" }}>
            File Tracking History
          </Text>
          <Divider my="sm" size="md" />

          {historyDetails.map((entry, index) => (
            <Card
              key={index}
              shadow="md"
              padding="lg"
              radius="md"
              my="10px"
              withBorder
              sx={{
                marginBottom: "15px",
              }}
            >
              <Group position="apart" mb="xs">
                <Text>
                  Sent by:{" "}
                  <Text fw={700} component="span">
                    {entry.current_id}
                  </Text>
                </Text>
                <Text size="sm" color="dimmed">
                  <Text fw={700} component="span">
                    {new Date(entry.forward_date).toLocaleString()}
                  </Text>
                </Text>
              </Group>
              <Text mb="xs">
                Received by:{" "}
                <Text fw={700} component="span">
                  {entry.tracking_extra_JSON.receiver}
                </Text>
              </Text>
              <Text mb="xs">
                Remarks: {entry.remarks || "No remarks provided"}
              </Text>
              {entry.upload_file && (
                <Group spacing="xs">
                  <Paperclip size="1rem" />
                  <Text size="sm">Attachment:</Text>
                  <Button
                    variant="light"
                    component="a"
                    href={`${host}/${entry.upload_file}`}
                    target="_blank"
                    radius="md"
                    sx={{
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.upload_file.split("/").pop()}
                  </Button>
                </Group>
              )}
            </Card>
          ))}
        </>
      ) : (
        <Text color="red" size="xl" weight={700} align="center">
          Failed to load file tracking history
        </Text>
      )}
    </Modal>
  );
}

export default HistoryViewModal;
