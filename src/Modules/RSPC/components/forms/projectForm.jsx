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
import { Calendar, FileText, User, ThumbsUp, ThumbsDown } from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import { useForm } from "@mantine/form";
import axios from "axios";
import { host } from "../../../../routes/globalRoutes";
import { profIDs } from "../../helpers/professors";

const ProjectForm = ({ setActiveTab }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      type: "",
      pi_name: "",
      pi_id: "",
      dept: "",
      category: "",
      sponsored_agency: "",
      total_budget: 0,
      start_date: "",
      deadline: "",
      description: "",
    },
    validate: {
      name: (value) => (value ? null : "Project title is required"),
      type: (value) => (value ? null : "Project type is required"),
      pi_name: (value) => (value ? null : "Project investigator is required"),
      pi_id: (value) => (value ? null : "Fusion ID of the project investigator is required"),
      dept: (value) => (value ? null : "Department is required"),
      category: (value) => (value ? null : "Project category is required"),
      sponsored_agency: (value) => (value ? null : "Project sponsor agency is required"),
      total_budget: (value) => (value > 0 ? null : "Budget must be greater than 0"),
      start_date: (value) => (console.log(isNaN((new Date(value)).getTime()))),
      // deadline: (value) => (value==="" ? "Project deadline is required" : null),
    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      // console.log(values.start_date);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("pi_name", values.pi_name);
      formData.append("pi_id", values.pi_id);
      formData.append("dept", values.dept);
      formData.append("category", values.category);
      formData.append("sponsored_agency", values.sponsored_agency);
      formData.append("total_budget", values.total_budget);
      formData.append("rem_budget", values.total_budget);
      formData.append("start_date", values.start_date);
      formData.append("deadline", values.deadline);
      formData.append("finish_date", "");
      formData.append("status", "OnGoing");
      formData.append("description", values.description);
      if (file) {
        formData.append("file", file);
      }
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const response = await axios.post(
        `${host}/research_procedures/api/add-project/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
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
            Add New Project
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
                Project Investigator
              </Text>
              <TextInput
                placeholder="Enter name of project lead"
                {...form.getInputProps("pi_name")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Fusion ID Of Project Investigator
              </Text>
              <Select
                placeholder="Choose Fusion username of professor"
                {...form.getInputProps("pi_id")}
                data={profIDs}
                icon={<User />}
              />
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
                Project Budget (in INR)
              </Text>
              <NumberInput
                placeholder="Enter total budget available for project"
                {...form.getInputProps("total_budget")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Text size="lg" weight={500} className={classes.fieldLabel}>
                Project Initiation Date
              </Text>
              <input
                type="date"
                {...form.getInputProps("start_date")}
                className={classes.dateInput}
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
                  style={{ borderRadius: "18px" }}
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
              style={{ borderRadius: "18px" }}
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
            title={successAlertVisible ? "Form Submission Successful" : "Form Submission Failed"}
            icon={successAlertVisible ? <ThumbsUp size={96} /> : <ThumbsDown size={96} />}
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
};

export default ProjectForm;
