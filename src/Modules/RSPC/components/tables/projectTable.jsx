import PropTypes from "prop-types";
import cx from "clsx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Button, Badge, ScrollArea, Text } from "@mantine/core";
import {
  Eye,
  FileText,
  PlusCircle,
  FlagCheckered,
} from "@phosphor-icons/react";
import classes from "../../styles/tableStyle.module.css";
import ProjectViewModal from "../modals/projectViewModal";
import ProjectActionModal from "../modals/projectActionModal";
import { rspc_admin, rspc_admin_designation } from "../../helpers/designations";
import { badgeColor } from "../../helpers/badgeColours";

function ProjectTable({ setActiveTab, projectsData, username }) {
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [actionModalOpened, setActionModalOpened] = useState(false);

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
    setViewModalOpened(true);
  };

  const handleActionClick = (row) => {
    setSelectedProject(row);
    setActionModalOpened(true);
  };

  const rows = projectsData.map(
    (row, index) =>
      (role !== "Professor" || row.pi_id === username) && (
        <Table.Tr key={index}>
          <Table.Td className={classes["row-content"]}>
            <Badge color={badgeColor[row.status]} size="lg">
              {row.status}
            </Badge>
          </Table.Td>
          <Table.Td className={classes["row-content"]}>{row.name}</Table.Td>
          <Table.Td className={classes["row-content"]}>{row.pid}</Table.Td>
          <Table.Td className={classes["row-content"]}>
            {row.sponsored_agency}
          </Table.Td>

          {role === "Professor" && (
            <Table.Td className={classes["row-content"]}>
              <Button
                onClick={() => handleRequestClick(row.pid)}
                variant="outline"
                color="#15ABFF"
                size="xs"
                disabled={row.status !== "OnGoing"}
                style={{ borderRadius: "8px" }}
              >
                <FileText size={26} style={{ marginRight: "3px" }} />
                Request
              </Button>
            </Table.Td>
          )}

          {username === rspc_admin && (
            <Table.Td className={classes["row-content"]}>
              <Button
                onClick={() => handleActionClick(row)}
                variant="outline"
                color="#15ABFF"
                size="xs"
                disabled={row.status !== "OnGoing"}
                style={{ borderRadius: "8px" }}
              >
                <FlagCheckered size={26} style={{ marginRight: "3px" }} />
                Action
              </Button>
            </Table.Td>
          )}

          <Table.Td className={classes["row-content"]}>
            <Button
              onClick={() => handleViewClick(row)}
              variant="outline"
              color="#15ABFF"
              size="xs"
              style={{ borderRadius: "8px" }}
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
              <Table.Th className={classes["header-cell"]}>Project ID</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Sponsor Agency
              </Table.Th>
              {role === "Professor" && (
                <Table.Th className={classes["header-cell"]}>
                  Request Application
                </Table.Th>
              )}
              {username === rspc_admin && (
                <Table.Th className={classes["header-cell"]}>
                  Action Centre
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
            style={{ borderRadius: "8px", padding: "7px 18px" }}
          >
            <PlusCircle size={26} style={{ marginRight: "3px" }} />
            Add Project
          </Button>
        </div>
      )}
      <ProjectViewModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        projectData={selectedProject}
      />
      <ProjectActionModal
        opened={actionModalOpened}
        onClose={() => setActionModalOpened(false)}
        projectData={selectedProject}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

ProjectTable.propTypes = {
  projectsData: PropTypes.arrayOf(
    PropTypes.shape({
      pid: PropTypes.number,
    }),
  ),
  setActiveTab: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default ProjectTable;
