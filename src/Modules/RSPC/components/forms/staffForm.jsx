import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {Button, TextInput, Select, Radio, NumberInput, Textarea, Paper, Title, Grid, Text} from "@mantine/core";
import { Calendar, FileText, User } from "@phosphor-icons/react";
import classes from '../../styles/formStyle.module.css';

const StaffForm = () => {
    const [uname, setUname] = useState("");
    const [dept, setDept] = useState("");
    const [file, setFile] = useState(null);
    const [person, setPerson] = useState("");
    const [deadline, setDeadline] = useState("");
    const [startdate, setStartdate] = useState("");
    const [qualification, setQualification] = useState("");
    const [description, setDescription] = useState("");
    const [stipend, setStipend] = useState(0);
    const [designation, setDesignation] = useState(0);

    const navigate = useNavigate();
    const handleSubmit=()=>{
        navigate('/research');
    }

    return (
        <Paper padding="lg" shadow="s" className={classes.formContainer}>
            <Title order={2} className={classes.formTitle}>Request Researcher Allocation</Title>

            <Grid gutter="xl">
                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Full Name</Text>
                    <TextInput
                        placeholder="Enter name of requested person"
                        value={person}
                        onChange={(event) => setPerson(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Fusion Username</Text>
                    <TextInput
                        placeholder="Enter Fusion username of requested person"
                        value={uname}
                        onChange={(event) => setUname(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Select Department</Text>
                    <Select
                        placeholder="Choose academic department"
                        value={dept}
                        onChange={setDept}
                        data={["CSE", "ECE", "ME", "SM", "Des", "NS", "LA", "None Of The Above"]}
                        icon={<User />}
                    />
                </Grid.Col>
                
                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Qualification</Text>
                    <Radio.Group
                        value={qualification}
                        onChange={setQualification}
                    >
                        <Radio value="mtech" label="MTech Student" />
                        <Radio value="phd" label="PhD Student" />
                        <Radio value="prof" label="Teaching Faculty" />
                        <Radio value="oth" label="Other Supporting Staff" />
                    </Radio.Group>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Designation</Text>
                    <Radio.Group
                        value={designation}
                        onChange={setDesignation}
                    >
                        <Radio value="co-pi" label="Co-Project Investigator" />
                        <Radio value="scholar" label="Research Scholar" />
                        <Radio value="asst" label="Research Assistant" />
                        <Radio value="support" label="Supporting Staff" />
                        <Radio value="student" label="Student Intern" />
                    </Radio.Group>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Monthly Stipend</Text>
                    <NumberInput
                        placeholder="Enter discussed stipend"
                        value={stipend}
                        onChange={setStipend}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Start Date Of Tenure</Text>
                    <input
                        type="date"
                        value={startdate}
                        onChange={(event) => setStartdate(event.currentTarget.value)}
                        className={classes.dateInput}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>End Date Of Tenure</Text>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(event) => setDeadline(event.currentTarget.value)}
                        className={classes.dateInput}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Requirement Description</Text>
                    <Textarea
                        placeholder="Enter detailed description of why the said person is required in the project for future record-keeping"
                        value={description}
                        onChange={(event) => setDescription(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Professional Profile</Text>
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

export default StaffForm;