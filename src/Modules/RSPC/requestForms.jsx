import {
  SortAscending,
  CaretCircleLeft,
  CaretCircleRight,
} from "@phosphor-icons/react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Tabs, Button, Flex, Select, Text } from "@mantine/core";
import { useLocation } from "react-router-dom";
import classes from "./styles/researchProjectsStyle.module.css";
import CustomRSPCBreadcrumbs from "./components/RSPCBreadcrumbs.jsx";
import StaffForm from "./components/forms/staffForm.jsx";
import ExpenditureForm from "./components/forms/expenditureForm.jsx";
import CompletionForm from "./components/forms/completionForm.jsx";
import EditForm from "./components/forms/editForm.jsx";
import Notifications from "./components/notifications.jsx";

const categories = ["Most Recent", "Ongoing", "Completed", "Terminated"];

function RequestForms() {
  const [activeTab, setActiveTab] = useState("1");
  const role = useSelector((state) => state.user.role);
  const [sortedBy, setSortedBy] = useState("Most Recent");
  const tabsListRef = useRef(null);
  const location = useLocation();
  const { projectID } = location.state || {};

  const tabItems = [{ title: "Notifications", component: <Notifications /> }];
  if (role === "Professor") {
    tabItems.push(
      { title: "Staff", component: <StaffForm projectID={projectID} /> },
      {
        title: "Expenditure",
        component: <ExpenditureForm projectID={projectID} />,
      },
      {
        title: "Completion",
        component: <CompletionForm projectID={projectID} />,
      },
    );
  } else {
    tabItems.push({
      title: "Edit",
      component: <EditForm projectID={projectID} />,
    });
  }

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  // const notificationsToDisplay =
  //   activeTab === "1" ? announcementsList : notificationsList;

  return (
    <>
      <CustomRSPCBreadcrumbs />
      <Flex justify="space-between" align="center" mt="lg">
        <Flex
          justify="flex-start"
          align="center"
          gap={{ base: "0.5rem", md: "1rem" }}
          mt={{ base: "1rem", md: "1.5rem" }}
          ml={{ md: "lg" }}
        >
          <Button
            onClick={() => handleTabChange("prev")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleLeft
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>

          <div className={classes.fusionTabsContainer} ref={tabsListRef}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    value={`${index}`}
                    key={index}
                    className={
                      activeTab === `${index}`
                        ? classes.fusionActiveRecentTab
                        : ""
                    }
                  >
                    <Flex gap="4px">
                      <Text>{item.title}</Text>
                    </Flex>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>

          <Button
            onClick={() => handleTabChange("next")}
            variant="default"
            p={0}
            style={{ border: "none" }}
          >
            <CaretCircleRight
              className={classes.fusionCaretCircleIcon}
              weight="light"
            />
          </Button>
        </Flex>
        <Flex align="center" mt="md" rowGap="1rem" columnGap="4rem" wrap="wrap">
          <Select
            classNames={{
              option: classes.selectoptions,
              input: classes.selectinputs,
            }}
            variant="filled"
            leftSection={<SortAscending />}
            data={categories}
            value={sortedBy}
            onChange={setSortedBy}
            placeholder="Sort By"
          />
        </Flex>
      </Flex>
      {tabItems[parseInt(activeTab, 10)].component}
    </>
  );
}

export default RequestForms;
