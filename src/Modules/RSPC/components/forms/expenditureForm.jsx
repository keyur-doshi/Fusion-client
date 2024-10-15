import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextInput, Select, Radio, NumberInput, Textarea, Paper, Title, Grid, Text } from "@mantine/core";
import { Calendar, FileText, User } from "@phosphor-icons/react";
import classes from '../../styles/formStyle.module.css';

const ExpenditureForm = () => {
    const [purchase, setPurchase] = useState("");
    const [mode, setMode] = useState("");
    const [file, setFile] = useState(null);
    const [item, setItem] = useState("");
    const [lastdate, setLastdate] = useState("");
    const [exptype, setExptype] = useState("");
    const [desc, setDesc] = useState("");
    const [cost, setCost] = useState(0);

    const navigate = useNavigate();
    const handleSubmit=()=>{
        navigate('/research');
    }

    return (
        <Paper padding="lg" shadow="s" className={classes.formContainer}>
            <Title order={2} className={classes.formTitle}>Request Fund Allocation</Title>

            <Grid gutter="xl">

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Expenditure Type</Text>
                    <Radio.Group
                        value={exptype}
                        onChange={setExptype}
                    >
                        <Radio value="tangible" label="Physical Item" />
                        <Radio value="nontangible" label="Non-tangible Resource" />
                    </Radio.Group>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Requirement</Text>
                    <TextInput
                        placeholder="Enter subject of expenditure"
                        value={item}
                        onChange={(event) => setItem(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Estimated Cost</Text>
                    <NumberInput
                        placeholder="Enter estimated cost of expenditure"
                        value={cost}
                        onChange={setCost}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Latest Required By</Text>
                    <input
                        type="date"
                        value={lastdate}
                        onChange={(event) => setLastdate(event.currentTarget.value)}
                        className={classes.dateInput}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Select Mode Of Fulfillment</Text>
                    <Select
                        placeholder="Choose how the requirement is fulfilled"
                        value={mode}
                        onChange={setMode}
                        data={["Online Purchase", "Offline Purchase", "Other"]}
                        icon={<User />}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Acquisition Details</Text>
                    <TextInput
                        placeholder="Enter relevant purchase details (purchase link, vendor contact, etc.) or acquisition information"
                        value={purchase}
                        onChange={(event) => setPurchase(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Requirement Description</Text>
                    <Textarea
                        placeholder="Enter detailed description of why the said subject of expenditure is required in the project for future record-keeping"
                        value={desc}
                        onChange={(event) => setDesc(event.currentTarget.value)}
                    />
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text size="lg" weight={500} className={classes.fieldLabel}>Quotation And Billing</Text>
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

export default ExpenditureForm;