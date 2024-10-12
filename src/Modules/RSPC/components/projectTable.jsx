import cx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Badge, ScrollArea } from '@mantine/core';
import classes from '../styles/tableStyle.module.css';
import { Eye, FileText, PlusCircle } from "@phosphor-icons/react";

const data = [
  { status: 'OnGoing', name: 'Spacey', agency: 'kpr_agency' },
  { status: 'Completed', name: 'Starry', agency: 'pkr_agency' },
  { status: 'Terminated', name: 'Galaxy', agency: 'rpk_agency' },
  { status: 'OnGoing', name: 'Spacey', agency: 'kpr_agency' },
];
//This data to come from researchProjects.jsx

const statusColor = { OnGoing: '#85B5D9', Completed: 'green', Terminated: 'red' };

function ProjectTable({setActiveTab}) {
  const [scrolled, setScrolled] = useState(false);

  const role = useSelector(state => state.user.role);
  const username = useSelector(state => state.user.username);

  const navigate = useNavigate();
  const handleRequestClick = () => {
    navigate('/research/forms');
  };

const handleAddClick=()=>{
    setActiveTab("2");
}

  const rows = data.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Badge color={statusColor[row.status]} size="lg">
          {row.status}
        </Badge>
      </Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.agency}</Table.Td>

      {role === 'Professor' && (
        <Table.Td>
        <Button onClick={handleRequestClick} variant="outline" color="#15ABFF" size="xs" style={{ borderRadius: '18px' }}>
          <FileText size={26} style={{ marginRight: '3px' }} />
          Request
        </Button>
      </Table.Td>
      )}

      <Table.Td>
        <Button variant="outline" color="#15ABFF" size="xs" style={{ borderRadius: '18px' }} >
          <Eye size={26} style={{ margin: '3px' }} />
          View
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div style={{ padding: '3% 5%' }}>
      <ScrollArea mah={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table highlightOnHover >
          <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
              <Table.Th className={classes['header-cell']}>Status</Table.Th>
              <Table.Th className={classes['header-cell']}>Project Name</Table.Th>
              <Table.Th className={classes['header-cell']}>Sponsor Agency</Table.Th>
              {role === 'Professor' && (<Table.Th className={classes['header-cell']}>Request Application</Table.Th>)}
              <Table.Th className={classes['header-cell']}>Project Info</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      {role === 'rspc_admin' && (
         <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3%', marginRight:'3%' }}>
        <Button onClick={handleAddClick} color="green" size="s" style={{borderRadius: '18px' }}>
          <PlusCircle size={32} style={{ marginRight: '3px' }}/> 
          Add Project
        </Button>
        </div>
      )}
    </div>
  );
}

export default ProjectTable;