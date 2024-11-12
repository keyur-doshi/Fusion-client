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
    // if (role === "Professor") {
      if (opened && file) {
        // console.log("hello");
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
            setHistoryDetails(response.data);
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
      ) : historyDetails &&
        Object.keys(historyDetails).length > 0 &&
        fetched ? (
        <>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            sx={{
              marginBottom: "20px",
              backgroundColor: "#f0f0f0",
            }}
          >
            {loading ? (
              <Loader size="lg" />
            ) : (
              <>
                <Text fw={700}>Created By: - {messages.file.uploader}</Text>
                <Stack spacing="md">
                  {messages.tracks.map((message, index) => (
                    <Card
                      key={index}
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      my="10px"
                      withBorder
                      sx={{
                        marginBottom: "15px",
                      }}
                    >
                      <Group position="apart" mb="xs">
                        <Text fw={500}>Sent by: {message.current_id}</Text>
                        <Text size="sm" color="dimmed">
                          {message.forward_date}
                        </Text>
                      </Group>
                      <Text fw={500} mb="xs">
                        Received by: {message.receiver_id}
                      </Text>
                      <Text mb="xs">Remarks: {message.remarks}</Text>
                      {message.upload_file && (
                        <Group spacing="xs">
                          <Paperclip size="1rem" />
                          <Text size="sm">Attachment:</Text>
                          <Button
                            variant="light"
                            component="a"
                            href={`${host}/${message.upload_file}`}
                            target="_blank"
                            radius="md"
                            sx={{
                              textOverflow: "ellipsis",
                              maxWidth: "200px",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {message.upload_file.split("/")[2]}
                          </Button>
                        </Group>
                      )}
                    </Card>
                  ))}
                </Stack>
                {request.processed_by_director === 0 ? (
                  <form>
                    <Flex gap="xs">
                      <FileInput
                        label="Upload your file"
                        placeholder="Choose a file"
                        key={form.key("file")}
                        my="sm"
                        {...form.getInputProps("file")}
                      />
                    </Flex>
                    <Flex direction="column" gap="xl">
                      <Textarea
                        placeholder="Remarks"
                        variant="filled"
                        mt="sm"
                        style={{ width: "100%" }}
                        key={form.key("remarks")}
                        {...form.getInputProps("remarks")}
                        backgroundColor="#efefef"
                        cols={50}
                        rows={3}
                      />
                      <Flex direction="column" gap="xs" justify="flex-start">
                        <Select
                          mb="sm"
                          comboboxProps={{ withinPortal: true }}
                          data={designationsList}
                          placeholder="Director(Dir)"
                          label="designation"
                          classNames={classes}
                          key={form.key("designation")}
                          {...form.getInputProps("designation")}
                          required
                        />
                      </Flex>
                    </Flex>
                    <Flex gap="xs" my="10px">
                      <Button
                        size="sm"
                        variant="filled"
                        color="black"
                        type="submit"
                        style={{
                          width: "auto",
                          backgroundColor: "#1E90FF",
                          color: isSuccess ? "black" : "white",
                          border: "none",
                          borderRadius: "20px",
                        }}
                        disabled={isLoading || isSuccess}
                        onClick={() => {
                          handleDirectorApproval("approve");
                        }}
                      >
                        {isLoading ? (
                          <Center>
                            <Loader color="black" size="xs" />
                          </Center>
                        ) : isSuccess ? (
                          <Center>
                            <CheckIcon size="16px" color="black" />
                          </Center>
                        ) : (
                          "Approve File"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="filled"
                        color="black"
                        type="submit"
                        style={{
                          width: "auto",
                          backgroundColor: "#1E90FF",
                          color: isSuccess ? "black" : "white",
                          border: "none",
                          borderRadius: "20px",
                        }}
                        disabled={isLoading || isSuccess}
                        onClick={() => {
                          handleDirectorApproval("reject");
                        }}
                      >
                        {isLoading ? (
                          <Center>
                            <Loader color="black" size="xs" />
                          </Center>
                        ) : isSuccess ? (
                          <Center>
                            <CheckIcon size="16px" color="black" />
                          </Center>
                        ) : (
                          "Reject File"
                        )}
                      </Button>
                    </Flex>
                  </form>
                ) : null}
              </>
            )}
          </Card>
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
