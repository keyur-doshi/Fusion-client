import cx from "clsx";
import { useState } from "react";
import { Table, Button, Badge, ScrollArea } from "@mantine/core";
import classes from "../../styles/tableStyle.module.css";
import { DownloadSimple } from "@phosphor-icons/react";

const data = [
  { status: "Pending", subject: "Staff for Spacey", date: "10/10/2024" },
  { status: "Approved", subject: "Funds for Starry", date: "27/09/2024" },
  { status: "Rejected", subject: "Update for Galaxy", date: "31/08/2024" },
];
//This data to come from researchProjects.jsx

const badgeColor = { Pending: "#85B5D9", Approved: "green", Rejected: "red", Approved: "green", Pending: "#85B5D9", Rejected: "red", };

function RequestTable() {
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Badge color={badgeColor[row.status]} size="lg">
          {row.status}
        </Badge>
      </Table.Td>
      <Table.Td>{row.subject}</Table.Td>
      <Table.Td>{row.date}</Table.Td>
      <Table.Td>
        <DownloadSimple size={32} weight="bold" />
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
              <Table.Th className={classes["header-cell"]}>Status</Table.Th>
              <Table.Th className={classes["header-cell"]}> Subject</Table.Th>
              <Table.Th className={classes["header-cell"]}>
                Last Update
              </Table.Th>
              <Table.Th className={classes["header-cell"]}>File</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default RequestTable;
