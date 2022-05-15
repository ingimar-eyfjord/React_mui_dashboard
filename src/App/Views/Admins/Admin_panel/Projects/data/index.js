/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useEffect, useState } from "react";

// @mui material components
import MDBox from "App/components/MDBox";
import MDTypography from "App/components/MDTypography";
import MDAvatar from "App/components/MDAvatar";
import MDProgress from "App/components/MDProgress";
import {
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import HoursDataService from "services/api_services/hours.service";
import moment from "moment";

export default function Data() {
  const [projectData, setProjectData] = useState([
    { Project: undefined, Hours: 0, Email: undefined, Users: [] },
  ]);
  useEffect(() => {
    init();
    async function init() {
      const param = {
        start: moment().startOf("month").startOf("day"),
        end: moment().endOf("month").endOf("day"),
      };
      const report = await HoursDataService.ExportReport(param);
      console.log(report)
      let RowData = [];

      report.data.Hour.forEach(function (a) {
        if (!this[a.Project]) {
          this[a.Project] = {
            Project: a.Project,
            Hours: 0,
            Users: [],
          };
          RowData.push(this[a.Project]);
        }
        console.log(a.UserHours)
        const user = report.data.AzureUsers.filter((e) => {
          return (
            e.id === a["Account id debit"] || e.id === a["Account id credit"]
          );
        });
        this[a.Project].Users.push({
          email: a.Email,
          name: user[0]?.displayName,
        });
        this[a.Project].Hours = a.UserHours ? parseFloat(this[a.Project].Hours) + parseFloat(a.UserHours) :parseFloat(this[a.Project].Hours) + 0 ;
      }, Object.create(null));

      RowData.forEach(function (a) {
        const uniquePeopleStrings = new Set(a.Users.map(JSON.stringify));
        const uniquePeopleStringsArray = Array.from(uniquePeopleStrings);
        a.Users = uniquePeopleStringsArray.map(JSON.parse);
      });
      setProjectData(RowData);
    }
  }, []);

  const avatars = (members) => {
    return members.map((e) => (
      e.email && (

      <Person
        view={PersonViewType.avatar}
        showPresence={true}
        personCardInteraction={PersonCardInteraction.hover}
        personQuery={e.email}
     ></Person>
     )
    ));
  };
  const Company = ({ image, name }) => (
    <MDBox display='flex' alignItems='center' lineHeight={1}>
      <MDAvatar src={image} name={name} size='sm' />
      <MDTypography variant='button' fontWeight='medium' ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      {
        Header: "Project",
        accessor: "Project",
        width: "45%",
        align: "left",
      },
      {
        Header: "consultants",
        accessor: "consultants",
        width: "10%",
        align: "left",
      },
      { Header: "hours", accessor: "hours", align: "center" },
      { Header: "completion", accessor: "completion", align: "center" },
    ],

    rows: projectData.map((e) => {
      return {
        Project: <Company image={logoXD} name={e.Project} />,
        consultants: (
          <MDBox display='flex' sx={{maxWidth: "10vw", flexWrap: "wrap"}} py={1}>
            {avatars(e.Users)}
          </MDBox>
        ),
        hours: (
          <MDTypography variant='caption' color='text' fontWeight='medium'>
            {e.Hours}
          </MDTypography>
        ),
        completion: (
          <MDBox width='8rem' textAlign='left'>
            <MDProgress
              value={60}
              color='info'
              variant='gradient'
              label={false}
            />
          </MDBox>
        ),
      };
    }),
  };
}
