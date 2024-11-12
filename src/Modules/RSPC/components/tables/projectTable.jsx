import cx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Button, Badge, ScrollArea, Text } from "@mantine/core";
import classes from "../../styles/tableStyle.module.css";
import { Eye, FileText, PlusCircle } from "@phosphor-icons/react";
import ProjectModal from "../modals/projectModal";
import { rspc_admin_designation } from "../../helpers/designations";
import { badgeColor } from "../../helpers/badgeColours";

function ProjectTable({ setActiveTab, projectsData, username }) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);

  const role = useSelector((state) => state.user.role);

  const navigate = useNavigate();
  const handleRequestClick = (id) => {
    navigate("/research/forms", { state: { projectID: id } });
  };

  const handleAddClick = () => {
    setActiveTab("3");
  };

  const handleViewClick = (row) => {
    setSelectedProject(row);
    setModalOpened(true);
  };

  const rows = projectsData.map(
    (row, index) =>
      (role !== "Professor" || row.pi_id === username) && (
        <Table.Tr key={index}>
          <Table.Td>
            <Badge color={badgeColor[row.status]} size="lg">
              {row.status}
            </Badge>
          </Table.Td>
          <Table.Td>{row.name}</Table.Td>
          <Table.Td>{row.pi_name}</Table.Td>
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
      ),
  );

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
                Project Lead
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
          {projectsData ? (
            <Table.Tbody>{rows}</Table.Tbody>
          ) : (
            <Text color="red" size="xl" weight={700} align="center">
              Unable to load project details
            </Text>
          )}
        </Table>
      </ScrollArea>
      {role === rspc_admin_designation && (
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
