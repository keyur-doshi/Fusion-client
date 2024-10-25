import React, { useState } from "react";
import {
  Modal,
  Button,
  Text,
  Group,
  Divider,
  Select,
  TextInput,
  Box,
  Grid,
} from "@mantine/core";
import {
  FileText,
  ThumbsUp,
  ThumbsDown,
  EyeSlash,
} from "@phosphor-icons/react";

function FileActionsModal({ opened, onClose, file, username }) {
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = () => {
    // Handle form submit logic
    console.log("Role:", role);
    console.log("Subject:", subject);
  };

  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      {file ? (
        <>
          <Text
            align="center"
            size="32px"
            weight={700}
            style={{ marginBottom: "30px" }}
          >
            File Actions
          </Text>
          <Grid>
            {/* Left Side - Static Fields */}
            <Grid.Col span={6}>
              <Box>
                <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "blue" }}>File ID:</strong> {file.id}
                </Text>
                <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "blue" }}>Subject:</strong>{" "}
                  {file.description}
                </Text>
                <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "blue" }}>Project ID:</strong>{" "}
                  {file.file_extra_JSON.pid}
                </Text>
                <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "blue" }}>Requestor:</strong>{" "}
                  {file.uploader}
                </Text>
                <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "blue" }}>Date Of Request:</strong>{" "}
                  {new Date(file.upload_date).toLocaleDateString()}
                </Text>
              </Box>

              {/* Buttons under the Left column */}
              <Group position="left" style={{ marginTop: "20px" }}>
                <Button color="green">
                  <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                  Approve
                </Button>
                <Button color="red" onClick={onClose} variant="outline">
                  <ThumbsDown size={26} style={{ marginRight: "3px" }} />
                  Reject
                </Button>
              </Group>
            </Grid.Col>

            {/* Vertical Divider */}
            <Divider orientation="vertical" size="md" />

            {/* Right Side - Interactive Fields */}
            <Grid.Col span={5}>
              <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                Select Recipient
              </Text>
              <Select
                placeholder="Choose a role"
                data={["Dean", "Director", "Administrator"]}
                value={role}
                onChange={setRole}
                style={{ marginBottom: "20px" }}
              />

              <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                Add Remarks
              </Text>
              <TextInput
                placeholder="Enter additional comments for the recipient"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ marginBottom: "20px" }}
              />

              {/* Single Button under the Right column */}
              <Button
                onClick={handleSubmit}
                fullWidth
                style={{ marginTop: "20px" }}
              >
                Forward File
              </Button>
            </Grid.Col>
          </Grid>
        </>
      ) : (
        <Text color="red" size="xl" weight={700} align="center">
          Failed to load project details
        </Text>
      )}
    </Modal>
  );
}

export default FileActionsModal;
