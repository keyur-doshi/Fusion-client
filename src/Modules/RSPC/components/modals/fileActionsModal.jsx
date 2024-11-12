import React, { useEffect, useState } from "react";
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
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { host } from "../../../../routes/globalRoutes";
import {
  FileText,
  ThumbsUp,
  ThumbsDown,
  EyeSlash,
} from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import {
  rspc_admin,
  dean_rspc,
  director,
  designations,
} from "../../helpers/designations";

function FileActionsModal({ opened, onClose, file, username, setActiveTab }) {
  const receiver = { Director: director, "Dean RSPC": dean_rspc };
  const [approveButtonDisabled, setApproveButtonDisabled] = useState(false);
  const [rejectButtonDisabled, setRejectButtonDisabled] = useState(false);
  const [forwardButtonDisabled, setForwardButtonDisabled] = useState(false);
  const [forwardList, setForwardList] = useState([]);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);

  const form = useForm({
    initialValues: {
      recipient: "",
      remarks: "",
    },
    validate: {
      recipient: (value) => (value ? null : "Recipient is required"),
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("file_id", file.fileData.id);
      formData.append("receiver", receiver[values.recipient]);
      formData.append("remarks", values.remarks);
      formData.append(
        "receiver_designation",
        designations[receiver[values.recipient]],
      );
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(
        `${host}/research_procedures/api/forward-file/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      console.log(response.data);
      onClose();
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        setActiveTab("1");
      }, 2500);
    } catch (error) {
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };

  useEffect(() => {
    if (username == rspc_admin) {
      setApproveButtonDisabled(true);
      setRejectButtonDisabled(true);
      setForwardList(["Dean RSPC", "Director"]);
    } else if (username == dean_rspc) {
      setForwardList(["Director"]);
      if (file) {
        if (file.fileData.file_extra_JSON.request_type == "Expenditure") {
          setApproveButtonDisabled(true);
        }
      }
    } else if (username == director) {
      setForwardButtonDisabled(true);
    }
  }, [file]);

  return (
    <>
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
                    <strong style={{ color: "blue" }}>File ID:</strong>{" "}
                    {file.fileData.id}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Subject:</strong>{" "}
                    {file.fileData.description}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Project ID:</strong>{" "}
                    {file.fileData.file_extra_JSON.pid}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Requestor:</strong>{" "}
                    {file.fileData.uploader}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Date Of Request:</strong>{" "}
                    {new Date(file.fileData.upload_date).toLocaleDateString()}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Sent By:</strong>{" "}
                    {file.sender}
                  </Text>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "blue" }}>Sender Designation:</strong>{" "}
                    {file.sender_designation}
                  </Text>
                </Box>

                {/* Buttons under the Left column */}
                <Group position="left" style={{ marginTop: "20px" }}>
                  <Button color="green" disabled={approveButtonDisabled}>
                    <ThumbsUp size={26} style={{ marginRight: "3px" }} />
                    Approve
                  </Button>
                  <Button
                    color="red"
                    onClick={onClose}
                    variant="outline"
                    disabled={rejectButtonDisabled}
                  >
                    <ThumbsDown size={26} style={{ marginRight: "3px" }} />
                    Reject
                  </Button>
                </Group>
              </Grid.Col>

              {/* Vertical Divider */}
              <Divider orientation="vertical" size="md" />

              {/* Right Side - Interactive Fields */}

              <Grid.Col span={5} style={{ paddingLeft: "15px" }}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    Select Recipient
                  </Text>
                  <Select
                    disabled={username === director}
                    placeholder="Choose a role"
                    data={forwardList}
                    {...form.getInputProps("recipient")}
                    style={{ marginBottom: "20px" }}
                  />

                  <Text size="lg" weight={500} style={{ marginBottom: "10px" }}>
                    Add Remarks
                  </Text>
                  <TextInput
                    disabled={username === director}
                    placeholder="Enter additional comments for the recipient"
                    {...form.getInputProps("remarks")}
                    style={{ marginBottom: "20px" }}
                  />

                  {/* Single Button under the Right column */}
                  <Button
                    type="submit"
                    fullWidth
                    style={{ marginTop: "20px" }}
                    disabled={forwardButtonDisabled}
                  >
                    Forward File
                  </Button>
                </form>
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <Text color="red" size="xl" weight={700} align="center">
            Failed to load project details
          </Text>
        )}
      </Modal>

      {(successAlertVisible || failureAlertVisible) && (
        <div className={classes.overlay}>
          <Alert
            variant="filled"
            color={successAlertVisible ? "#85B5D9" : "red"}
            title={
              successAlertVisible
                ? "File Forwarded Successfully"
                : "File Forwarding Failed"
            }
            icon={
              successAlertVisible ? (
                <ThumbsUp size={96} />
              ) : (
                <ThumbsDown size={96} />
              )
            }
            className={classes.alertBox}
          >
            {successAlertVisible
              ? "The file has been successfully forwarded!"
              : "The file could not be forwarded! Please verify the filled details and try again."}
          </Alert>
        </div>
      )}
    </>
  );
}

export default FileActionsModal;
