import cx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Button, Badge, ScrollArea } from "@mantine/core";
import classes from "../../styles/tableStyle.module.css";
import { Eye, FileText, PlusCircle } from "@phosphor-icons/react";
import ProjectModal from "../projectModal";

function ProjectTable({ setActiveTab, projectsData, username}) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  const role = useSelector((state) => state.user.role);

  const navigate = useNavigate();
  const handleRequestClick = (id) => {
    navigate("/research/forms", { state: { projectID: id } });
  };

  const handleAddClick = () => {
    setActiveTab("2");
  };

  const handleViewClick = (row) => {
    setSelectedProject(row);
    setModalOpened(true);
  };

  const badgeColor = {
    OnGoing: "#85B5D9",
    Completed: "green",
    Terminated: "red",
    Approved: "green",
    Pending: "#85B5D9",
    Rejected: "red",
  };

  const rows = projectsData.map((row, index) => (
    (role!=="Professor" || row.pi_id===username) &&
    (<Table.Tr key={index}>
      <Table.Td>
        <Badge color={badgeColor[row.status]} size="lg">
          {row.status}
        </Badge>
      </Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.sponsored_agency}</Table.Td>

      {role === "Professor" && (
        <Table.Td>
          <Button
            onClick={() => handleRequestClick(row.pid)}
            variant="outline"
            color="#15ABFF"
            size="xs"
            style={{ borderRadius: "18px" }}
          >
            <FileText size={26} style={{ marginRight: "3px" }} />
            Request
          </Button>
        </Table.Td>
      )}

      <Table.Td>
        <Button
          onClick={() => handleViewClick(row)}
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "18px" }}
        >
          <Eye size={26} style={{ margin: "3px" }} />
          View
        </Button>
      </Table.Td>
    </Table.Tr>
    )
  ));

  return (
    <div style={{ padding: "3% 5%" }}>
      <ScrollArea
        mah={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th className={classes["header-cell"]}>Status</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Project Name
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Sponsor Agency
              </Table.Th>
              {role === "Professor" && (
                <Table.Th className={classes["header-cell"]}>
                  Request Application
                </Table.Th>
              )}
              <Table.Th className={classes["header-cell"]}>
                Project Info
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      {role === "rspc_admin" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "3%",
            marginRight: "3%",
          }}
        >
          <Button
            onClick={handleAddClick}
            color="green"
            size="s"
            style={{ borderRadius: "18px" }}
          >
            <PlusCircle size={32} style={{ marginRight: "3px" }} />
            Add Project
          </Button>
        </div>
      )}
      <ProjectModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        projectData={selectedProject}
      />
    </div>
  );
}

export default ProjectTable;

//       {/* Modal to display project details */}
//       <Modal
//         opened={opened}
//         onClose={() => setOpened(false)}
//         title="Project Details"
//         centered
//       >
//         {selectedProject && (
//           <div>
//             <Text><strong>Project Name: </strong>{selectedProject.name}</Text>
//             <Text><strong>Status: </strong>{selectedProject.status}</Text>
//             <Text><strong>Agency: </strong>{selectedProject.agency}</Text>
//             {/* Add any additional details required from ProjectForm */}
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default ProjectTable;
