/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Title, Grid, Text, Alert } from "@mantine/core";
import { FileText, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import { endProjectRoute } from "../../../../routes/RSPCRoutes";
import { rspc_admin } from "../../helpers/designations";

function CompletionForm({ projectID }) {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);

  const form = useForm({
    initialValues: {
      enddate: "",
    },
    validate: {
      enddate: (value) =>
        value === "" ? "Project completion date is required" : null,
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");
    try {
      const formData = new FormData();
      formData.append("enddate", values.enddate);
      formData.append("pid", projectID);
      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(endProjectRoute(rspc_admin), formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data);
      setSuccessAlertVisible(true);
      setTimeout(() => {
        setSuccessAlertVisible(false);
        navigate("/research");
      }, 2500);
    } catch (error) {
      console.error("Error during Axios POST:", error);
      setFailureAlertVisible(true);
      setTimeout(() => {
        setFailureAlertVisible(false);
      }, 2500);
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper padding="lg" shadow="s" className={classes.formContainer}>
          <Title order={2} className={classes.formTitle}>
            Project Completion Submission
          </Title>

          <Grid gutter="xl">
            <Grid.Col span={12}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Date Of Project Completion
                <span style={{ color: "red" }}> *</span>
              </Text>
              <input
                type="date"
                {...form.getInputProps("enddate")}
                className={classes.dateInput}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Report <span style={{ color: "red" }}>*</span>
              </Text>
              <div className={classes.fileInputContainer}>
                <Button
                  variant="outline"
                  color="#15ABFF"
                  size="md"
                  component="label"
                  className={classes.fileInputButton}
                  style={{ borderRadius: "8px" }}
                >
                  <FileText size={26} style={{ marginRight: "3px" }} />
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={(event) => setFile(event.currentTarget.files[0])}
                  />
                </Button>
                {file && <span className={classes.fileName}>{file.name}</span>}
              </div>
            </Grid.Col>
          </Grid>

          <div className={classes.submitButtonContainer}>
            <Button
              size="lg"
              type="submit"
              color="cyan"
              style={{ borderRadius: "8px" }}
            >
              Submit
            </Button>
          </div>
        </Paper>
      </form>

      {(successAlertVisible || failureAlertVisible) && (
        <div className={classes.overlay}>
          <Alert
            variant="filled"
            color={successAlertVisible ? "#85B5D9" : "red"}
            title={
              successAlertVisible
                ? "Project Completion Submission Successful"
                : "Project Completion Submission Failed"
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
              ? "The form has been successfully submitted! Your request will be processed soon!"
              : "The form details could not be saved! Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

CompletionForm.propTypes = {
  projectID: PropTypes.number.isRequired,
};

export default CompletionForm;
