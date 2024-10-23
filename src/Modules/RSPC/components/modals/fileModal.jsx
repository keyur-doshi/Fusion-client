import { useEffect, useState } from "react";
import {
    Modal,
    Button,
    Text,
    Badge,
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

function FileModal({ opened, onClose, file }) {
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(true);

    const [fileDetails, setFileDetails] = useState([]);
    useEffect(() => {
        // console.log(projectData);
        if (opened && file) {
            setLoading(true);
            const fetchFile = async () => {
                const token = localStorage.getItem("authToken");
                if (!token) return console.error("No authentication token found!");
                try {
                    const response = await axios.get(
                        `${host}/research_procedures/api/get-file/?file_id=${file.file_id}`,
                        {
                            headers: {
                                Authorization: `Token ${token}`,
                                "Content-Type": "application/json",
                            },
                            withCredentials: true,  // Include credentials if necessary
                        }
                    );
                    console.log("Fetched File:", response.data);
                    setFileDetails(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error during Axios GET:", error);
                    setLoading(false);
                    setFetched(false);
                }
            };
            fetchFile();
        }
    }, [file]);

    const badgeColor = {
        OnGoing: "#85B5D9",
        Completed: "green",
        Terminated: "red",
        Approved: "green",
        Pending: "#85B5D9",
        Rejected: "red",
    };

    return (
        <Modal opened={opened} onClose={onClose} size="xl">
            {loading ? (
                <Container py="xl"> <
                    Loader size="lg" />
                </Container>

            ) : (file && fetched) ? (
                <>
                    <Group position="apart" style={{ marginBottom: 20 }}>
                        <Text size="32px" weight={700}>{fileDetails.subject}</Text>
                        <Badge color={badgeColor[file.approval]} size="lg" style={{ fontSize: '18px' }}>{file.approval}</Badge>
                    </Group>

                    <Text size="xl" style={{ marginBottom: 20 }}>
                        {fileDetails.description}
                    </Text>
                    <Grid gutter="xs" style={{ marginBottom: 20 }}>
                        <GridCol span={6}>
                            <Text size="xl">
                                <strong style={{ color: 'blue' }}>File Tracking ID:</strong> {fileDetails.id}
                            </Text>
                        </GridCol>
                        <GridCol span={6}>
                            <Text size="xl">
                                <strong style={{ color: 'blue' }}>Source Module:</strong> {fileDetails.src_module}
                            </Text>
                        </GridCol>

                        <GridCol span={6}>
                            <Text size="xl">
                                <strong style={{ color: 'blue' }}>Uploader:</strong> {fileDetails.uploader}
                            </Text>
                        </GridCol>
                        <GridCol span={6}>
                            <Text size="xl">
                                <strong style={{ color: 'blue' }}>Upload Date:</strong> {new Date(fileDetails.upload_date).toLocaleDateString()}
                            </Text>
                        </GridCol>

                        <GridCol span={6}>
                            <Text size="xl">
                                <strong style={{ color: 'blue' }}>Project ID:</strong> {file.pid}
                            </Text>
                        </GridCol>
                        <GridCol span={6}>
                            <Text size="xl">
                                <strong style={{ color: 'blue' }}>Request Type:</strong> {file.request_type}
                            </Text>
                        </GridCol>

                        <GridCol span={6}>
                            <Text size="xl">
                                <strong style={{ color: 'blue' }}>Request ID:</strong> {fileDetails.src_object_id}
                            </Text>
                        </GridCol>
                    </Grid>


                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
                        <Button color="#15ABFF" style={{ marginRight: '3%' }}>
                            <DownloadSimple size={26} style={{ marginRight: "3px" }} />
                            Download File
                        </Button>
                        <Button variant="outline" color="red" onClick={onClose} style={{ marginRight: '3%' }}>
                            <EyeSlash size={26} style={{ marginRight: "3px" }} />
                            Close
                        </Button>
                    </div>
                </>
            ) : (
                <Text color="red" size="xl" weight={700} align="center">Failed to load project details</Text>
            )}
        </Modal>
    );
}

export default FileModal;
