/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  Select,
  Radio,
  NumberInput,
  Textarea,
  Paper,
  Title,
  Grid,
  Text,
  Alert,
} from "@mantine/core";
import { FileText, User, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import axios from "axios";
import classes from "../../styles/formStyle.module.css";
import { projectEditRoute } from "../../../../routes/RSPCRoutes";

function EditForm({ projectID }) {
  const [file, setFile] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      type: "",
      dept: "",
      category: "",
      sponsored_agency: "",
      total_budget: 0,
      deadline: "",
      description: "",
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      // console.log(values.start_date);
      const formData = new FormData();
      formData.append("pid", projectID);
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      if (file) {
        formData.append("file", file);
      }
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(projectEditRoute, formData, {
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
            Edit Project Details
          </Title>

          <Grid gutter="xl">
            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Title
              </Text>
              <TextInput
                placeholder="Enter name of project"
                {...form.getInputProps("name")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Type
              </Text>
              <Radio.Group {...form.getInputProps("type")}>
                <Radio value="Research" label="Research" />
                <Radio value="Product" label="Product" />
                <Radio value="Consultancy" label="Consultancy" />
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Select Department
              </Text>
              <Select
                placeholder="Choose academic department overlooking the project"
                {...form.getInputProps("dept")}
                data={[
                  "CSE",
                  "ECE",
                  "ME",
                  "SM",
                  "Des",
                  "NS",
                  "LA",
                  "None Of The Above",
                ]}
                icon={<User />}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Category
              </Text>
              <Radio.Group {...form.getInputProps("category")}>
                <Radio value="Government" label="Government" />
                <Radio value="Private" label="Private Entity" />
                <Radio value="IIITDMJ" label="Institute" />
                <Radio value="Other" label="Other" />
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Sponsor Agency
              </Text>
              <TextInput
                placeholder="Enter name of sponsoring agency"
                {...form.getInputProps("sponsored_agency")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Extra Project Budget Added (in INR)
              </Text>
              <NumberInput
                placeholder="Enter total budget available for project"
                {...form.getInputProps("total_budget")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Deadline
              </Text>
              <input
                type="date"
                {...form.getInputProps("deadline")}
                className={classes.dateInput}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Description
              </Text>
              <Textarea
                placeholder="Enter detailed description of the project for future record-keeping"
                {...form.getInputProps("description")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Agreement
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
                ? "Form Submission Successful"
                : "Form Submission Failed"
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
              ? "The form has been successfully submitted! The project details have been successfully updated!"
              : "The form details could not be saved! Please verify the filled details and submit the form again."}
          </Alert>
        </div>
      )}
    </>
  );
}

EditForm.propTypes = {
  projectID: PropTypes.number.isRequired,
};

export default EditForm;
