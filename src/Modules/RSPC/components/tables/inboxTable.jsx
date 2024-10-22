import cx from "clsx";
import { useState } from "react";
import { Table, Button, Badge, ScrollArea } from "@mantine/core";
import classes from "../../styles/tableStyle.module.css";
import { DownloadSimple, FileText } from "@phosphor-icons/react";

const data = [
  { author: "PKP", subject: "Staff for Spacey", date: "10/10/2024" },
  { author: "Jain", subject: "Funds for Starry", date: "27/09/2024" },
  { author: "Gupta", subject: "Update for Galaxy", date: "31/08/2024" },
];
//This data to come from researchProjects.jsx

function InboxTable() {
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.author}</Table.Td>
      <Table.Td>{row.subject}</Table.Td>
      <Table.Td>{row.date}</Table.Td>
      <Table.Td>
        <DownloadSimple size={32} weight="bold" />
      </Table.Td>
      <Table.Td>
        <Button
          variant="outline"
          color="#15ABFF"
          size="xs"
          style={{ borderRadius: "18px" }}
        >
          <FileText size={26} style={{ marginRight: "3px" }} />
          File Tracking
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ padding: "3% 5%" }}>
      <ScrollArea
        h={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th className={classes["header-cell"]}>
                Request Author
              </Table.Th>
              <Table.Th className={classes["header-cell"]}> Subject</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Date Received
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>File</Table.Th>
              <Table.Th className={classes["header-cell"]}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default InboxTable;
