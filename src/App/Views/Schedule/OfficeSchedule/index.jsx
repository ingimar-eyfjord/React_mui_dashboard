import  { useState, useCallback, useContext } from "react";
import CommandBar from "./CommandBar.jsx";
import Schedule from "./Schedule.jsx";
import moment from "moment";
import _ from "lodash";
import { GlobalState } from "context/store";
import People from "./components/people";

export default function OfficeSchedule(props) {
  
  const [Store, setStore] = useContext(GlobalState);
  const [state, setState] = useState({
    filterBy: {
      Team: undefined,
      Location: undefined,
      People: [],
    },
    People: undefined,
    RunTime: 0,
  });

  const Create = useCallback(
    (array) => {
      if (array.length <= 0 || array === undefined) {
        return;
      }
      let item = array.map((e, index) => {
        return (
          <People
            info={e}
            key={e.Email}
          ></People>
        );
      });
      setStore({PeopleInSchedule: item})
    },
    [setStore],
  )
   
  const initial = useCallback(
    async (DaysToFetch) => {
      //? Update runtime to be 1, this will cause the UseEffect that calls this function to stop running to avoid endless rendering
      setState((state) => ({
        ...state,
        RunTime: 1,
      }));
      //? Double check if the DaysToFetch is not empty
      if (DaysToFetch.length !== 0) {
        //? Create a parameter that will fetch data we need from the Schedule table, we want the beginning and end.
        const param = {
          start: moment(DaysToFetch[0]).startOf("day").format(),
          end: moment(DaysToFetch[DaysToFetch.length - 1])
            .endOf("day")
            .format(),
        };
        //? Find the dates from the schedule
        let people = await props.ScheduleDataService.ExportReport(
          param
        );
        Create(_.uniqBy(people, "Email"))
        setState((state) => ({
          ...state,
          People: people,
        }));
      }
    },
    [props, Create]
  );

  const FilteredPersons = useCallback((array) => {
    const people = array.detail;
    let nameArray = [];
    for (const e of people) {
      nameArray.push(e.displayName);
    }
    setState((state) => ({
      ...state,
      filterBy: {
        ...state.filterBy,
        People: nameArray,
      },
    }));
  }, []);
  //? The days have been selected on the schedule, now it's time to create the people cards
  const gotDays = useCallback(
    (DaysToFetchInSchedule) => {
      //? To avoid infinite renders we check the state.Runtime, it's defaulted to 0, we also want the DaysToFetch.. array to be actual dates and not empty.
      if (state.RunTime === 0 && DaysToFetchInSchedule.length !== 0) {
        //? Call this callBack function
        initial(DaysToFetchInSchedule, Store.personas);
      }
    },
    [state, Store, initial]
  );

  return (
    <>
    
      <CommandBar
        GraphInfoService={props.GraphInfoService}
        ConverterClass={props.ConverterClass}
        PeoplePicker={props.PeoplePicker}
        TeamsDataService={props.TeamsDataService}
        TeamsDropDownOptions={props.TeamsDropDownOptions}
        LocationsDataService={props.LocationsDataService}
        LocationDropDownOptions={props.LocationDropDownOptions}
        FilteredPersons={FilteredPersons}
        Bearer={props.Bearer}
        People={state.People}
        filterBy={state.filterBy}
        setState={setState}
      ></CommandBar>
      <Schedule
        setLoggedHours={props.setLoggedHours}
        ConverterClass={props.ConverterClass}
        GraphInfoService={props.GraphInfoService}
        filterBy={state.filterBy}
        gotDays={gotDays}
        People={state.People}
        Bearer={props.Bearer}
        setState={setState}
        ScheduleDataService={props.ScheduleDataService}
      ></Schedule>
    </>
  );
}
