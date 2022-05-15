import { useState, useEffect, useContext, useCallback } from "react";
import CardElementController from "./CardElementControl.jsx";
import moment from "moment";
import _ from "lodash";
import { GlobalState } from "context/store";
import ScheduleDataService from "services/api_services/schedule.service";

export default function DaysAdded(props) {
  console.log(props)
  const [Store, setStore] = useContext(GlobalState);
  const [days, setDays] = useState();

  const SubmitDayController = useCallback(
    (e) => {
      e.preventDefault();
      e.persist(e);
      const elements = props.ConverterClass.formToJSON(e.target.elements);
      delete elements.ChoiceGroup22;
      elements.Date_start_time = props.ConverterClass.makeMomentDateWithTime(
        elements.day,
        elements.start
      );
      elements.Date_end_time = props.ConverterClass.makeMomentDateWithTime(
        elements.day,
        elements.end
      );
      const duration = moment.duration(
        moment(elements.Date_end_time).diff(moment(elements.Date_start_time))
      );
      elements.User = Store.UserDetails.UserName;
      //!create teams in graphData
      elements.Team = props.team;
      if (elements.Team === undefined) {
        setStore({
          Notification: {
            color: "error",
            icon: "warning",
            title: "Failed",
            content: "Please select your team first",
            dateTime: moment(),
          },
        });
        return;
      }

      elements.Email = Store.UserDetails.UserEmail;
      elements.Hours = parseFloat(duration.asHours()).toFixed(2);
      elements.Location = props.location;
      elements.Table_number = parseInt(Store.table);
      if (elements.Location !== "Office") {
        elements.Table_number = null;
      }
      elements.User_UUID = Store.UserDetails.UserUUID;
      if (elements.Break === "true") {
        elements.Hours = parseFloat(elements.Hours - 0.5).toFixed(2);
      }
      elements.Break === "true" ? (elements.Break = 1) : (elements.Break = 0);

      ScheduleDataService.create(elements)
        .then((response) => {
          if (response.request.statusText === "OK") {
            setStore({
              Notification: {
                color: "success",
                icon: "check",
                title: "Success",
                content: response.data.message,
                dateTime: moment(),
              },
            });

            props.POSTDay(e);
          }
        })
        .catch((e) => {
          setStore({
            Notification: {
              color: "error",
              icon: "warning",
              title: "Failed",
              content: e.response.data.message,
              dateTime: moment(),
            },
          });
        });
    },
    [Store, props, setStore]
  );

  // Make copy because of .reverse() statement down there, we don't want to mutate the original

  const createCards = useCallback(() => {
    let days = [...props.chosenDays];
    days = _.orderBy(
      days,
      (o) => {
        return moment(o.Date);
      },
      ["asc"]
    );
    const cardElements = days
      .reverse()
      .map((e, index) => (
        <CardElementController
          ConverterClass={props.ConverterClass}
          DefaultBtn={props.DefaultBtn}
          PrimaryBtn={props.PrimaryBtn}
          RadioGroup={props.RadioGroup}
          ResetForm={props.ResetForm}
          SubmitDay={SubmitDayController}
          key={index}
          E={e}
          location={props.location}
        ></CardElementController>
      ));
    setDays(cardElements);
  }, [props, setDays, SubmitDayController]);

  useEffect(() => {
    createCards();
    // eslint-disable-next-line 
  }, [props.chosenDays]);

  return <div className="DaysFormCardContainer">{days}</div>;
}
