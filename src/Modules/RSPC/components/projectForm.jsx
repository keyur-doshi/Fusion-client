import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {Button, TextInput, Select, Radio, NumberInput, Textarea, Paper, Title, Grid, Text} from "@mantine/core";
import { Calendar, FileText, User } from "@phosphor-icons/react";
import classes from '../styles/formStyle.module.css';

const ProjectForm = ({setActiveTab}) => {
    const [lead, setLead] = useState("");
    const [uname, setUname] = useState("");
    const [file, setFile] = useState(null);
    const [project, setProject] = useState("");
    const [deadline, setDeadline] = useState("");
    const [dept, setDept] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(0);
    const [agency, setAgency] = useState("");
    const [startdate, setStartdate] = useState("");
    const [budget, setBudget] = useState("");
    const [type, setType] = useState("");

    const navigate = useNavigate();
    const handleSubmit=()=>{
        setActiveTab("0");
    }

    return (
        <Paper padding="lg" shadow="s" className={classes.formContainer}>
            <Title order={2} className={classes.formTitle}>Add New Project</Title>

            <Grid gutter="xl">
                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Title</Text>
                    <TextInput
                        placeholder="Enter name of project"
                        value={project}
                        onChange={(event) => setProject(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Type</Text>
                    <Radio.Group
                        value={type}
                        onChange={setType}
                    >
                        <Radio value="research" label="Research" />
                        <Radio value="product" label="Product" />
                        <Radio value="consultancy" label="Consultancy" />
                    </Radio.Group>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Investigator</Text>
                    <TextInput
                        placeholder="Enter name of project lead"
                        value={lead}
                        onChange={(event) => setLead(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Select Fusion ID</Text>
                    <Select
                        placeholder="Choose Fusion ID of lead project investigator"
                        value={uname}
                        onChange={setUname}
                        data={["pkjain", "pkhanna", "agupta"]}
                        icon={<User />}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Select Department</Text>
                    <Select
                        placeholder="Choose academic department overlooking the project"
                        value={dept}
                        onChange={setDept}
                        data={["CSE", "ECE", "ME", "SM", "Des", "NS", "LA", "None Of The Above"]}
                        icon={<User />}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Category</Text>
                    <Radio.Group
                        value={category}
                        onChange={setCategory}
                    >
                        <Radio value="govt" label="Government" />
                        <Radio value="private" label="Private Entity" />
                        <Radio value="iiit" label="Institute" />
                        <Radio value="oth" label="Other" />
                    </Radio.Group>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Sponsor Agency</Text>
                    <TextInput
                        placeholder="Enter name of sponsoring agency"
                        value={agency}
                        onChange={(event) => setAgency(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Budget</Text>
                    <NumberInput
                        placeholder="Enter total budget available for project"
                        value={budget}
                        onChange={setBudget}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Initiation Date</Text>
                    <input
                        type="date"
                        value={startdate}
                        onChange={(event) => setStartdate(event.currentTarget.value)}
                        className={classes.dateInput}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Deadline</Text>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(event) => setDeadline(event.currentTarget.value)}
                        className={classes.dateInput}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Description</Text>
                    <Textarea
                        placeholder="Enter detailed description of the project for future record-keeping"
                        value={description}
                        onChange={(event) => setDescription(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Project Agreement</Text>
                    <div className={classes.fileInputContainer}>
                        <Button variant="outline" color="#15ABFF" size="md" component="label" className={classes.fileInputButton} style={{ borderRadius: '18px' }}>
                            <FileText size={26} style={{ marginRight: '3px' }} />
                            Choose File
                            <input type="file" hidden onChange={(event) => setFile(event.currentTarget.files[0])} />
                        </Button>
                        {file && <span className={classes.fileName}>{file.name}</span>}
                    </div>
                </Grid.Col>
            </Grid>

            <div className={classes.submitButtonContainer}>
                <Button onClick={handleSubmit} size="lg" type="submit" color="cyan" style={{ borderRadius: '18px' }}>Submit</Button>
            </div>

        </Paper>
    );
};

export default ProjectForm;
