import React from "react";
import ScheduleSendOutlinedIcon from "@mui/icons-material/ScheduleSendOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
const Hours = React.lazy(() => import("App/Views/Hours/"));
const Settings = React.lazy(() => import("App/Views/Profile"));
const Schedule = React.lazy(() => import("App/Views/Schedule/"));
const Dashboard = React.lazy(() => import("App/Views/Dashboard"));
const Admins = React.lazy(() => import("App/Views/Admins/"));
const routes = [
  [
    {
      parent: "Dashboard",
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <DashboardIcon fontSize='small'></DashboardIcon>,
      route: "/Dashboard",
      subroute: "/Dashboard",
      component: <Dashboard />,
    },
  ],
  [
    {
      parent: "Settings",
      type: "collapse",
      name: "Profile",
      key: "/Profile",
      icon: <PersonIcon fontSize='small'></PersonIcon>,
      route: "/Profile",
      subroute: "/Profile",
      component: <Settings />,
    },
  ],
  [
    {
      type: "divider",
    },
  ],

  [
    {
      parent: "Hours",
      type: "collapse",
      name: "Log Hours",
      key: "logHours",
      icon: (
        <PlaylistAddOutlinedIcon fontSize='small'></PlaylistAddOutlinedIcon>
      ),
      route: "/Hours/log",
      subroute: "/Hours/:subPath",
      component: <Hours />,
    },
    {
      parent: "Hours",
      type: "collapse",
      name: "See Hours",
      key: "See Hours",
      icon: (
        <AccountBalanceWalletOutlinedIcon fontSize='small'></AccountBalanceWalletOutlinedIcon>
      ),
      route: "/Hours",
      subroute: "/Hours",
      component: <Hours />,
    },
    {
      parent: "Hours",
      type: "collapse",
      name: "Salary",
      key: "/Hours/salary",
      icon: (
        <AccountBalanceOutlinedIcon fontSize='small'></AccountBalanceOutlinedIcon>
      ),
      route: "/Hours/salary",
      subroute: "/Hours/:subPath",
      component: <Hours />,
    },
  ],
  [
    {
      type: "divider",
    },
  ],
  [
    {
      parent: "Schedule",
      type: "collapse",
      name: "Add to schedule",
      key: "/Schedule/log",
      icon: (
        <PlaylistAddOutlinedIcon fontSize='small'></PlaylistAddOutlinedIcon>
      ),
      route: "/Schedule/log",
      subroute: "/Schedule/:subPath",
      component: <Schedule />,
    },
    {
      parent: "Schedule",
      type: "collapse",
      name: "Your Schedule",
      key: "/Schedule",
      route: "/Schedule",
      subroute: "/Schedule",
      icon: <DateRangeOutlinedIcon fontSize='small'></DateRangeOutlinedIcon>,
      component: <Schedule />,
    },
    {
      parent: "Schedule",
      type: "collapse",
      name: "Overall Schedule",
      key: "/Schedule/D1",
      icon: (
        <ScheduleSendOutlinedIcon fontSize='small'></ScheduleSendOutlinedIcon>
      ),
      route: "/Schedule/D1",
      subroute: "/Schedule/:subPath",
      component: <Schedule />,
    },
  ],
  [
    {
      type: "divider",
    },
  ],

  [
    {
      parent: "Admins",
      type: "collapse",
      name: "Dashboard",
      key: "/Admins",
      icon: <DashboardIcon fontSize='small'></DashboardIcon>,
      route: "/Admins",
      subroute: "/Admins",
      component: <Admins />,
    },

    {
      parent: "Admins",
      type: "collapse",
      name: "Announcements",
      key: "/Admins/announcements",
      icon: (
        <AnnouncementOutlinedIcon fontSize='small'></AnnouncementOutlinedIcon>
      ),
      route: `/Admins/announcements`,
      subroute: "/Admins/:subPath",
      component: <Admins />,
    },
    {
      type: "divider",
    },
    {
      parent: "Admins",
      type: "collapse",
      name: "Import schedules",
      key: "/Admins/schedules/import",
      icon: <FileUploadOutlinedIcon fontSize='small'></FileUploadOutlinedIcon>,
      route: `/Admins/schedules/import`,
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },

    {
      parent: "Admins",
      type: "collapse",
      name: "Export reports",
      key: "/Admins/export/reports",
      icon: (
        <FileDownloadOutlinedIcon fontSize='small'></FileDownloadOutlinedIcon>
      ),
      route: "/Admins/export/reports",
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },

    {
      type: "divider",
    },
    {
      parent: "Admins",
      type: "collapse",
      name: "Edit schedules",
      key: "/Admins/schedules/edit",
      icon: (
        <ModeEditOutlineOutlinedIcon fontSize='small'></ModeEditOutlineOutlinedIcon>
      ),
      route: "/Admins/schedules/edit",
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },
    {
      parent: "Admins",
      type: "collapse",
      name: "Edit hours",
      key: "/Admins/hours/edit",
      icon: (
        <ModeEditOutlineOutlinedIcon fontSize='small'></ModeEditOutlineOutlinedIcon>
      ),
      route: "/Admins/hours/edit",
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },
    {
      parent: "Admins",
      type: "collapse",
      name: "Log hours",
      key: "/Admins/hours/log",
      icon: (
        <PlaylistAddOutlinedIcon fontSize='small'></PlaylistAddOutlinedIcon>
      ),
      route: "/Admins/hours/log",
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },
    {
      type: "divider",
    },
    {
      parent: "Admins",
      type: "collapse",
      name: "Salary overview",
      key: "/Admins/salary/overview",
      icon: (
        <PlaylistAddOutlinedIcon fontSize='small'>
          table_view
        </PlaylistAddOutlinedIcon>
      ),
      route: `/Admins/salary/overview`,
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },
    {
      parent: "Admins",
      type: "collapse",
      name: "Salary periods",
      key: "/Admins/salary/periods",
      icon: <PaidIcon fontSize='small'></PaidIcon>,
      route: `/Admins/salary/periods`,
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },

    {
      type: "divider",
    },
    {
      parent: "Admins",
      type: "collapse",
      name: "Assign departments",
      key: "/Admins/assignments/departments",
      icon: <TaskAltOutlinedIcon fontSize='small'></TaskAltOutlinedIcon>,
      route: "/Admins/assignments/departments",
      subroute: "/Admins/:subPath/:secondPath",
      component: <Admins />,
    },
    // {
    //   parent: "Admins",
    //   type: "collapse",
    //   name: "Assign users",
    //   key: "/Admins/assignments/users",
    //   icon: <TaskAltOutlinedIcon fontSize='small'></TaskAltOutlinedIcon>,
    //   route: "/Admins/assignments/users",
    //   subroute: "/Admins/:subPath/:secondPath",
    //   component: <Admins />,
    // },
    {
      type: "divider",
    },
  ],
];

export default routes;
