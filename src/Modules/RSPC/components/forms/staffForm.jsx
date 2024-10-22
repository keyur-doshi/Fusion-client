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
} from "@mantine/core";
import { FileText, User } from "@phosphor-icons/react";
import classes from "../../styles/formStyle.module.css";
import { useForm } from "@mantine/form";
import axios from "axios";
import { host } from "../../../../routes/globalRoutes";

const StaffForm = ({ projectID }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      person: "",
      uname: "",
      dept: "",
      qualification: "",
      designation: "",
      stipend: 0,
      startdate: "",
      lastdate: "",
      description: "",
    },
    validate: {
      person: (value) =>
        value.trim() === "" ? "Full name is required" : null,
      uname: (value) =>
        value.trim() === "" ? "Fusion username is required" : null,
      dept: (value) =>
        value === "" ? "Department is required" : null,
      qualification: (value) =>
        value === "" ? "Qualification is required" : null,
      designation: (value) =>
        value === "" ? "Designation is required" : null,
      stipend: (value) =>
        value < 0 ? "Stipend must not be negative" : null,
      lastdate: (value, values) =>
        value !== '' && values.startdate!='' && value < values.startdate ? 'End date cannot be before start date' : null,

    },
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No authentication token found!");

    try {
      const formData = new FormData();
      formData.append("person", values.person);
      formData.append("uname", values.uname);
      formData.append("dept", values.dept);
      formData.append("qualification", values.qualification);
      formData.append("designation", values.designation);
      formData.append("stipend", values.stipend);
      formData.append("startdate", values.startdate);
      formData.append("lastdate", values.lastdate);
      formData.append("description", values.description);
      formData.append("pid", projectID);
      formData.append("approval","Pending");
      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        `${host}/research_procedures/api/create-staff/`,
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
      navigate("/research");
    } catch (error) {
      console.error("Error during Axios POST:", error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Paper padding="lg" shadow="s" className={classes.formContainer}>
        <Title order={2} className={classes.formTitle}>
          Request Researcher Allocation
        </Title>

        <Grid gutter="xl">
          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Full Name
            </Text>
            <TextInput
              placeholder="Enter name of requested person"
              {...form.getInputProps("person")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Fusion Username
            </Text>
            <TextInput
              placeholder="Enter Fusion username of requested person"
              {...form.getInputProps("uname")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Select Department
            </Text>
            <Select
              placeholder="Choose academic department"
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
              Qualification
            </Text>
            <Radio.Group {...form.getInputProps("qualification")}>
              <Radio value="MTech" label="MTech Student" />
              <Radio value="PhD" label="PhD Student" />
              <Radio value="Professor" label="Teaching Faculty" />
              <Radio value="Other" label="Other Supporting Staff" />
            </Radio.Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Designation
            </Text>
            <Radio.Group {...form.getInputProps("designation")}>
              <Radio value="Co-Project Investigator" label="Co-Project Investigator" />
              <Radio value="Research Scholar" label="Research Scholar" />
              <Radio value="Research Assistant" label="Research Assistant" />
              <Radio value="Supporting Staff" label="Supporting Staff" />
              <Radio value="Student Intern" label="Student Intern" />
            </Radio.Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Monthly Stipend (in INR)
            </Text>
            <NumberInput
              placeholder="Enter discussed stipend"
              {...form.getInputProps("stipend")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Start Date Of Tenure
            </Text>
            <input
              type="date"
              {...form.getInputProps("startdate")}
              className={classes.dateInput}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              End Date Of Tenure
            </Text>
            <input
              type="date"
              {...form.getInputProps("lastdate")}
              className={classes.dateInput}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Requirement Description
            </Text>
            <Textarea
              placeholder="Enter detailed description of why the said person is required in the project for future record-keeping"
              {...form.getInputProps("description")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Text size="lg" weight={500} className={classes.fieldLabel}>
              Professional Profile
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
          <Button size="lg" type="submit" color="cyan" style={{ borderRadius: "18px" }}>
            Submit
          </Button>
        </div>
      </Paper>
    </form>
  );
};

export default StaffForm;
