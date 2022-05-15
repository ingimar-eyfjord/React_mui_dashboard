import React, { useState, useContext, useEffect, useCallback } from "react";
import { Person, PersonViewType } from "@microsoft/mgt-react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import ChartistGraph from "react-chartist";
import SimpleBar from "simplebar-react";
import ChooseTableModal from "App/components/Modals/chooseTable";
import "simplebar/dist/simplebar.min.css";
import { GlobalState } from "context/store";
import Functions from "App/Functions/functions";
import { DropDown } from "./MUIComponents";
import moment from "moment";
import salaryService from "services/api_services/salary.service.js";
import bankService from "services/api_services/bank.service.js";
import ScheduleDataService from "services/api_services/schedule.service";
import Chartist from "chartist";
import HoursDataService from "services/api_services/hours.service";
import { DefaultBtn } from "./MUIComponents";
import { orderBy } from "lodash";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Modal from "@mui/material/Modal";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { makeStyles } from "@material-ui/styles";
import styles from "App/components/classes";
import CustomTable from "App/components/Table/Table";
import { PersonWithDetails } from "App/components/MGTComponents";
import TokenService from "services/api_services/token.service";

const useStyles = makeStyles(styles);

export function ControlledRadioButtonsGroup(props) {
  const [value, setValue] = useState(
    props.currentState ? props.currentState : "Home Office"
  );

  const handleChange = (event) => {
    setValue(event.target.value);
    if (event.target.value === "Office") {
      props.officeClicked(true, event.target.value);
    } else {
      props.officeClicked(false, event.target.value);
    }
  };

  return (
    <FormControl style={{ width: "100%" }} component='fieldset'>
      <FormLabel component='legend'>Location</FormLabel>
      <RadioGroup
        aria-label='Location'
        name='controlled-radio-buttons-group'
        value={value}
        onChange={handleChange}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "90%",
            flexWrap: "wrap",
          }}
        >
          <input type='hidden' name='Location' value={value} />
          <FormControlLabel
            value={"Office"}
            control={<Radio onClick={() => props.officeClicked(true)} />}
            label={"Office"}
          />
          <FormControlLabel
            value={"Home Office"}
            control={<Radio onClick={() => props.officeClicked(false)} />}
            label={"Home Office"}
          />
          <FormControlLabel
            value={"Business Trip"}
            control={<Radio onClick={() => props.officeClicked(false)} />}
            label={"Business Trip"}
          />
          <FormControlLabel
            value={"Vacation"}
            control={<Radio onClick={() => props.officeClicked(false)} />}
            label={"Vacation"}
          />
          <FormControlLabel
            value={"Office reserved"}
            control={<Radio onClick={() => props.officeClicked(false)} />}
            label={"Office reserved"}
          />
        </div>
      </RadioGroup>
    </FormControl>
  );
}

export function TableBooking(props) {
  const [booked, setBooked] = useState(undefined);
  const [times, setTimes] = useState(undefined);

  const FindDate = useCallback(
    async (date) => {
      const param = {
        start: moment(date).startOf("day").format(),
        end: moment(date).endOf("day").format(),
      };

      setTimes({
        start: moment(date).startOf("day").format("HH:mm"),
        end: moment(date).endOf("day").format("HH:mm"),
      });
      //? Find the dates from the schedule
      let people = await props.ScheduleDataService.ExportReport(param);
      let NewArray = [];
      if (people?.length > 0) {
        for (const e of people) {
          if (e.Table_number !== null) {
            NewArray.push(e);
          }
        }
      }
      setBooked(NewArray);
    },
    [props.ScheduleDataService]
  );

  function calendarChooseDate(date) {
    FindDate(date);
  }
  useEffect(() => {
    const date = moment();
    FindDate(date);
  }, [FindDate]);

  const [value] = React.useState(new Date());

  return (
    <SimpleBar autoHide={false} style={{ height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", padding: "2rem" }}>
          <MobileDatePicker
            label='Choose date'
            inputFormat='dd/MM/yyyy'
            value={value}
            onChange={(newValue) => {
              calendarChooseDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        <div style={{ width: "95%" }}>
          <Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <ChooseTableModal
              times={times}
              handleModal={props.handleClose}
              selectedDate={value}
            ></ChooseTableModal>
          </Modal>

          <TablesWithBookings
            ConverterClass={props.ConverterClass}
            scheduled={booked}
          ></TablesWithBookings>
        </div>
      </div>
    </SimpleBar>
  );
}
export function TeamsDropDownOptions({ PropsFunc, name, passedSelected }) {
  const [Store] = useContext(GlobalState);

  const handleSelect = (event, nodeIds) => {
    event.target.name = name;
    event.target.value = nodeIds[0];
    PropsFunc(event, name, event.target);
  };
  let defExpand = [
    Object.values(Store.Options.Departments)[0].id,
    Store.UserDetails.Department.parentId,
  ];

  const deepFind = useCallback((arr, search) => {
    for (var obj of Object.values(arr)) {
      if (search(obj)) {
        return obj;
      }
      if (obj.SubDepartments) {
        var deepResult = deepFind(obj.SubDepartments, search);
        if (deepResult) {
          return deepResult;
        }
      }
    }
    return null;
  }, []);

  if (passedSelected) {
    let right = deepFind(Store.Options.Departments, function (obj) {
      return obj.id === passedSelected;
    });
    if (right === null) {
      right = Object.values(Store.Options.Departments).filter((x) => {
        return x.id === passedSelected;
      });
    }
    defExpand[1] = right.parentId;
  }

  return (
    <TreeView
      aria-label='file system navigator'
      defaultCollapseIcon={<ExpandMoreIcon fontSize='medium' />}
      defaultExpandIcon={<ChevronRightIcon fontSize='medium' />}
      defaultExpanded={defExpand}
      defaultSelected={
        passedSelected ? passedSelected : Store.UserDetails.Department.id
      }
      onNodeSelect={handleSelect}
      multiSelect
      sx={{
        height: "auto",
        flexGrow: 1,
        maxWidth: 400,
        width: "fit-content",
        overflowY: "auto",
      }}
    >
      <TreeItem
        fontSize='small'
        nodeId={Object.values(Store.Options.Departments)[0].id}
        label='HQ'
      >
        {Store.Options.Departments.HQ.SubDepartments.map((e, index) => {
          return (
            <TreeItem
              fontSize='small'
              id={e.id}
              key={index}
              nodeId={e.id}
              label={e.title}
            >
              {e.SubDepartments
                ? e.SubDepartments.map((e, index2) => {
                    return (
                      <TreeItem
                        fontSize='small'
                        id={e.id}
                        key={index2}
                        nodeId={e.id}
                        label={e.title}
                        name={name}
                        value={e.id}
                      />
                    );
                  })
                : null}
            </TreeItem>
          );
        })}
      </TreeItem>
    </TreeView>
  );
}

export function ProjectHours() {
  const [Tasks, setTask] = useState(0);
  const [Store] = useContext(GlobalState);

  // var delays = 80,
  //   durations = 500;
  const delays2 = 80;
  const durations2 = 500;

  const getHours = useCallback(
    async (dates) => {
      const param = {
        start: dates.start,
        end: dates.end,
        uuid: Store.UserDetails.UserUUID,
      };
      let getHours = await HoursDataService.ExportHoursForPerson(param);

      let grouped4 = [];
      getHours.data.forEach(function (a) {
        if (!this[a.Hour.Project]) {
          this[a.Hour.Project] = {
            Project: a.Hour.Project,
            Hours: 0,
          };
          grouped4.push(this[a.Hour.Project]);
        }
        for (const e of a.Ledgers) {
          this[a.Hour.Project].Hours =
            parseFloat(this[a.Hour.Project].Hours) + parseFloat(e.Hours);
        }
      }, Object.create(null));

      //       return;

      let labels = [];
      let series = [];
      for (const e of Object.values(grouped4)) {
        const arr = Object.values(e);
        labels.push(arr[0]);
        series.push(arr[1]);
      }

      const emailsSubscriptionChart = {
        data: {
          labels: labels,
          series: [series],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          low: 0,
          high: Math.max(...series),
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 5,
            left: 0,
          },
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
              display: true,
              drawOnChartArea: true,
              drawTicks: false,
              borderDash: [5, 5],
            },
            ticks: {
              display: true,
              padding: 10,
              color: "#9ca2b7",
              font: {
                size: 11,
                // family: typography.fontFamily,
                style: "normal",
                lineHeight: 2,
              },
            },
          },
          x: {
            grid: {
              drawBorder: false,
              display: false,
              drawOnChartArea: true,
              drawTicks: true,
            },
            ticks: {
              display: true,
              color: "#9ca2b7",
              padding: 10,
              font: {
                size: 11,
                // family: typography.fontFamily,
                style: "normal",
                lineHeight: 2,
              },
            },
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
        animation: {
          draw: function (data) {
            if (data.type === "bar") {
              data.element.animate({
                opacity: {
                  begin: (data.index + 1) * delays2,
                  dur: durations2,
                  from: 0,
                  to: 1,
                  easing: "ease",
                },
              });
            }
          },
        },
      };
      setTask(emailsSubscriptionChart);
    },
    [Store]
  );

  const getDates = useCallback(async () => {
    const thisPeriod = await salaryService.get_current_period();
    getHours({
      start: thisPeriod.data[0]?.Date_start,
      end: thisPeriod.data[0]?.Date_end,
    });
  }, [getHours]);

  useEffect(() => {
    // eslint-disable-next-line
    getDates();
  }, []);

  return (
    <ChartistGraph
      className='ct-chart'
      data={Tasks.data}
      type='Bar'
      options={Tasks.options}
      responsiveOptions={Tasks.responsiveOptions}
      listener={Tasks.animation}
    />
  );
}

export function TasksHours() {
  const [Tasks, setTask] = useState(0);
  const [Store] = useContext(GlobalState);
  const thisMonth = moment().format("MMMM-YYYY");

  const getHours = useCallback(
    async (dates) => {
      const delays2 = 80;
      const durations2 = 500;
      const param = {
        start: dates.start,
        end: dates.end,
        uuid: Store.UserDetails.UserUUID,
      };

      let getHours = await HoursDataService.ExportHoursForPerson(param);
      let grouped4 = [];

      getHours.data.forEach(function (a) {
        if (!this[a.Hour.Task]) {
          this[a.Hour.Task] = {
            Task: a.Hour.Task,
            Hours: 0,
          };
          grouped4.push(this[a.Hour.Task]);
        }
        for (const e of a.Ledgers) {
          this[a.Hour.Task].Hours =
            parseFloat(this[a.Hour.Task].Hours) + parseFloat(e.Hours);
        }
      }, Object.create(null));

      let labels = [];
      let series = [];
      for (const e of Object.values(grouped4)) {
        const arr = Object.values(e);
        labels.push(arr[0]);
        series.push(arr[1]);
      }

      const emailsSubscriptionChart = {
        data: {
          labels: labels,
          series: [series],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: Math.max(...series),
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
          scales: {
            y: {
              grid: {
                drawBorder: false,
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5],
              },
              ticks: {
                display: true,
                padding: 10,
                color: "#9ca2b7",
                font: {
                  size: 11,
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
            x: {
              grid: {
                drawBorder: false,
                display: false,
                drawOnChartArea: true,
                drawTicks: true,
              },
              ticks: {
                display: true,
                color: "#9ca2b7",
                padding: 10,
                font: {
                  size: 11,
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
        animation: {
          draw: function (data) {
            if (data.type === "bar") {
              data.element.animate({
                opacity: {
                  begin: (data.index + 1) * delays2,
                  dur: durations2,
                  from: 0,
                  to: 1,
                  easing: "ease",
                },
              });
            }
          },
        },
      };
      setTask(emailsSubscriptionChart);
    },
    [Store]
  );

  const getDates = useCallback(async () => {
    const thisPeriod = await salaryService.find_period_by_month(thisMonth);
    getHours({
      start: thisPeriod.data[0]?.Date_start,
      end: thisPeriod.data[0]?.Date_end,
    });
  }, [getHours, thisMonth]);

  useEffect(() => {
    getDates();
  }, []);

  return (
    <>
      <ChartistGraph
        className='ct-chart citrineChart'
        data={Tasks.data}
        type='Bar'
        options={Tasks.options}
        responsiveOptions={Tasks.responsiveOptions}
        listener={Tasks.animation}
      />
      {/* icon, title, description, height, chart */}
      {/* <VerticalBarChart title={"Hello"} height={50} description={"random"} chart={tryy} ></VerticalBarChart> */}
    </>
  );
}

export function TreeNation() {
  const [Tasks, setTask] = useState(0);
  const [Store] = useContext(GlobalState);

  const getHours = useCallback(async () => {
    const delays = 80;
    const durations = 500;

    const param = {
      start: moment().startOf("month").startOf("day").format(),
      end: moment().endOf("month").endOf("day").format(),
      uuid: Store.UserDetails.UserUUID,
    };

    let getHours = await HoursDataService.ExportHoursForPerson(param);

    let grouped4 = [];
    getHours.data.forEach(function (a) {
      if (!this[a.Hour.Date]) {
        this[a.Hour.Date] = {
          Date: a.Hour.Date,
          Meetings: 0,
        };
        grouped4.push(this[a.Hour.Date]);
      }
      this[a.Hour.Date].Meetings =
        parseFloat(this[a.Hour.Date].Meetings) + parseFloat(a.Hour.Meetings);
    }, Object.create(null));
    grouped4 = orderBy(
      grouped4,
      function (o) {
        return new moment(o.Date);
      },
      ["asc"]
    );

    let labels = [];
    let series = [];
    for (const e of Object.values(grouped4)) {
      const arr = Object.values(e);
      labels.push(arr[0]);
      series.push(arr[1]);
    }
    const dailySalesChart = {
      data: {
        labels: labels,
        series: [[...series]],
      },
      options: {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0,
        }),
        low: 0,
        high: Math.max(...series) + 5,
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      // for animation
      animation: {
        draw: function (data) {
          if (data.type === "line" || data.type === "area") {
            data.element.animate({
              d: {
                begin: 600,
                dur: 700,
                from: data.path
                  .clone()
                  .scale(1, 0)
                  .translate(0, data.chartRect.height())
                  .stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint,
              },
            });
          } else if (data.type === "point") {
            data.element.animate({
              opacity: {
                begin: (data.index + 1) * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: "ease",
              },
            });
          }
        },
      },
    };
    setTask(dailySalesChart);
  }, [Store]);

  useEffect(() => {
    getHours();
  }, [getHours]);

  return (
    <ChartistGraph
      className='ct-chart'
      data={Tasks.data}
      type='Line'
      options={Tasks.options}
      listener={Tasks.animation}
    />
  );
}


export function TablesWithBookings(props) {
  const [Booked, setBooked] = useState();
  const [Tables, setTables] = useState();
  const CheckIfBooked = useCallback(() => {
    let booked = [];
    if (props.scheduled !== undefined) {
      for (const e of props.scheduled) {
        console.log(e)
        booked.push({
          Table: `tb${e.Table_number}`,
          BookedFrom: moment(e.Date_start_time? e.Date_start_time : e.BookedFrom).format("HH:mm"),
          BookedTo: moment(e.Date_end_time? e.Date_end_time : e.BookedTo).format("HH:mm"),
          User: e.User,
          email: e.Email,
          date: new Date(),
        });
      }
    }
    setBooked(booked);
  }, [props]);

  useEffect(() => {
    CheckIfBooked();
  }, [props, CheckIfBooked]);

  useEffect(() => {
    if (Booked !== undefined) {
      const BookedTable = Booked.map((e, index) => {
        return [
          e.Table.substring(2, 8),
          <PersonWithDetails
            multi={true}
            user={e.User}
            email={e.email}
          ></PersonWithDetails>,
          e.BookedFrom,
          e.BookedTo,
        ];
      });
      setTables(BookedTable);
    }
  }, [Booked]);

  const tableHead = ["Table nr", "Booked by", "Start", "End"];
  const tableHeaderColor = "red";

  return (
    <SimpleBar style={{ height: "100%" }} autoHide={false}>
      {Tables && (
        <Stack
          style={{ height: "100%", overflow: "hidden !important" }}
          tokens={{ childrenGap: 20 }}
        >
          <CustomTable
            tableHeaderColor={tableHeaderColor}
            tableHead={tableHead}
            tableData={Tables}
          ></CustomTable>
        </Stack>
      )}
    </SimpleBar>
  );
}

export function ScheduledHours() {
  const classes = useStyles();
  const [hours, setHours] = useState();

  const getHours = useCallback(async () => {
    const param = {
      start: moment().add("month").startOf("month").startOf("day").format(),
      end: moment().add("month").endOf("month").endOf("day").format(),
      UserUUID: TokenService.getUserID()
    };
    let getHours = await ScheduleDataService.GetByDayAndUser(param);
    let amount = 0;
    getHours.data.forEach((e) => {
      amount = parseFloat(amount) + parseFloat(e.Hours);
    });
    setHours(parseFloat(amount));
  }, []);

  useEffect(() => {
        getHours();
  }, [getHours]);

  return <h3 className={classes.cardTitle}>{!hours ? 0 : hours.toFixed(2)}</h3>;
}




export function PersonaCard() {
  const [File, StoreFile] = useState();
  const [Feedback, setFeedback] = useState();
  async function changeImage() {
    const status = await Functions.changeUserImage(
      File
    );
    StoreFile(undefined);
    setFeedback(status);
  }

  // const personDetails = {
  //   displayName: ,
  //   mail: Store.UserDetails.UserEmail,
  //   line2Property: Store.UserDetails.EmplyUser.jobTitle,
  // };
  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <div className='personlarge'>
        <Stack direction='row' spacing={4}>
          <Person
            // personDetails={personDetails}
            personQuery='me'
            view={PersonViewType.avatar}
            showPresence={false}
            fetchImage={true}
          ></Person>
        </Stack>
      </div>

      <Stack className='UploadImageContainer'>
        <label htmlFor='avatar'>Update image</label>
        <input
          type='file'
          id='avatar'
          name='avatar'
          accept='image/png, image/jpeg'
          onChange={(e) => {
            StoreFile(e.target.files[0]);
          }}
        />

        {File && <div>File: {File.name}</div>}
        {Feedback && <div style={{ marginBottom: "1rem" }}>{Feedback}</div>}
        {File && (
          <DefaultBtn
            text={"Confirm upload"}
            BtnType={"button"}
            onClickFunction={changeImage}
          />
        )}
      </Stack>
    </Stack>
  );
}



export function LocationDropDownOptions({
  required,
  PropsFunc,
  placeHolder,
  label,
  LocationsDataService,
}) {
  const OptionsTemplate = {
    Locations: ["option1", "option2"],
  };
  const [Options, SetOptions] = useState(OptionsTemplate);

  const getTasksOptions = useCallback(async () => {
    let Locations = await LocationsDataService.getAll();
    Locations = GetMappedOptions(Locations);
    SetOptions({ Locations });
  }, [LocationsDataService]);

  useEffect(() => {
    getTasksOptions();
  }, [getTasksOptions]);

  function GetMappedOptions(Data) {
    let MapThis = [];
    Data.forEach((e) => {
      const Values = Object.values(e);

      Values.forEach((t) => {
        if (isNaN(t)) {
          MapThis.push(t);
        }
      });
    });
    // added all option to the dropdown , hardcoded
    MapThis.push("All");
    return MapThis.map((e, index) => {
      return { key: `${index}`, text: `${e}` };
    });
  }

  return (
    <DropDown
      PropsFunc={PropsFunc}
      placeHolder={placeHolder}
      label={label}
      required={required}
      options={Options.Locations}
    ></DropDown>
  );
}

export function HoursLogged() {
  const [Store] = useContext(GlobalState);
  const [hours, setHours] = useState(0);

  const classes = useStyles();

  const getDates = useCallback(async () => {
    let type = Store.SalaryOverviewOptions.type;
    let period = Store.SalaryOverviewOptions.period;
    const param = {
      period_id: undefined,
      user_uuid: Store.UserDetails.UserUUID,
      filter: type,
    };

    if (period) {
      param.period_id = period.id;
    } else {
      const thisPeriod = await salaryService.get_current_period();
      param.period_id = thisPeriod.data[0].id;
    }
    if (param.period_id === undefined) {
      return <h3 className={classes.cardTitle}>0</h3>;
    }
    const getHours = await HoursDataService.getHoursInSalaryPeriod(param);
    if (getHours.data.length === 0) {
      setHours(0);
    } else {
      try {
        setHours(parseFloat(getHours.data[0]["Hours"]));
      } catch (err) {
        setHours(parseFloat(0));
      }
    }
  }, [Store, classes]);

  useEffect(() => {
    getDates();
  }, [
    Store.SalaryOverviewOptions.period,
    Store.SalaryOverviewOptions.type,
  ]);

  return <h3 className={classes.cardTitle}>{hours.toFixed(2)}</h3>;
}
export function DefferedHours() {
  const [Store] = useContext(GlobalState);
  const classes = useStyles();
  const [hours, setHours] = useState(0);
  const getDates = useCallback(async () => {
    let type = Store.SalaryOverviewOptions.type;
    let period = Store.SalaryOverviewOptions.period;
    const param = {
      period_id: undefined,
      user_uuid: Store.UserDetails.UserUUID,
      filter: type,
    };
    if (period) {
      param.period_id = period.id;
    } else {
      const thisPeriod = await salaryService.get_current_period();
      param.period_id = thisPeriod.data[0].id;
    }
    if (param.period_id === undefined) {
      return <h3 className={classes.cardTitle}>0</h3>;
    }
    let getHours = await bankService.getDebitHours(param);
    if (getHours.data.length === 0) {
      setHours(0);
    } else {
      try {
        setHours(parseFloat(getHours.data[0].Hours));
      } catch (err) {
        setHours(parseFloat(0));
      }
    }
  }, [Store, classes]);

  // if (props.successMessage) {
  //   getDates();
  // }

  useEffect(() => {
    getDates();
  }, [Store.SalaryOverviewOptions]);

  return <h3 className={classes.cardTitle}>{hours.toFixed(2)}</h3>;
}

export function CreditHours() {
  const [Store] = useContext(GlobalState);
  const [hours, setHours] = useState(0);
  const classes = useStyles();
  const getDates = useCallback(async () => {
    let type = Store.SalaryOverviewOptions.type;
    let period = Store.SalaryOverviewOptions.period;
    const param = {
      period_id: undefined,
      user_uuid: Store.UserDetails.UserUUID,
      debit: false,
      credit: true,
      filter: type,
    };
    if (period) {
      param.period_id = period.id;
    } else {
      const thisPeriod = await salaryService.get_current_period();
      param.period_id = thisPeriod.data[0].id;
    }
    if (param.period_id === undefined) {
      return <h3 className={classes.cardTitle}>0</h3>;
    }
    let getHours = await bankService.getCreditHours(param);
    try {
      setHours(parseFloat(getHours.data.Hours));
    } catch (err) {
      setHours(parseFloat(0));
    }
  }, [Store, classes]);

  useEffect(() => {
    getDates();
  }, [Store.SalaryOverviewOptions]);

  return <h3 className={classes.cardTitle}>{hours.toFixed(2)}</h3>;
}

export function NetHours(props) {
  const [Store] = useContext(GlobalState);
  const [hours, setHours] = useState(0);
  const classes = useStyles();

  const getDates = useCallback(async () => {
    let type = Store.SalaryOverviewOptions.type;
    let period = Store.SalaryOverviewOptions.period;
    const param = {
      period_id: period.id,
      user_uuid: Store.UserDetails.UserUUID,
      filter: type,
    };
    if (period.id !== undefined) {
      param.period_id = period.id;
    } else {
      const thisPeriod = await salaryService.get_current_period();
      param.period_id = thisPeriod.data[0].id;
    }
    let getHours = await bankService.getNetHoursInSalaryPeriod(param);
    try {
      if (getHours.data.Hours === null) {
        setHours(0);
      } else {
        setHours(parseFloat(getHours.data.Hours));
      }
    } catch (err) {
      setHours(parseFloat(0));
    }
  }, [Store]);

  useEffect(() => {
    getDates();
    // eslint-disable-next-line
  }, [Store.SalaryOverviewOptions]);
  return <h3 className={classes.cardTitle}>{hours.toFixed(2)}</h3>;
}
