import moment from "moment";
import GridItem from "./gridItem.jsx";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles(styles);

export default function CalendarGrid({
  days,
  filterBy,
  People,
  Bearer,
  GraphInfoService,
  ConverterClass,
}) {
  const classes = useStyles();

  if (People.data) {
    if (People?.data.length <= 0) {
      return <div>Nothing scheduled</div>;
    }
  } else {
    return (
      <div className="CalendarGridContainer">
        <div className="dayHeaders">
          {days
            .slice(0)
            .reverse()
            .map((e, index) => {
              let RightDayPeople = [];
              for (const t of People) {
                if (moment(t.Date_end_time).isSame(moment(e), "day")) {
                  RightDayPeople.push(t);
                }
              }
              if (filterBy.Team !== undefined) {
                RightDayPeople = RightDayPeople.filter(
                  (e) => e.Team === filterBy.Team
                );
              }
              if (filterBy.Location !== undefined) {
                RightDayPeople = RightDayPeople.filter(
                  (e) => e.Location === filterBy.Location
                );
              }
              if (
                filterBy.Location !== undefined &&
                filterBy.Team !== undefined
              ) {
                RightDayPeople = RightDayPeople.filter(
                  (e) =>
                    e.Location === filterBy.Location && e.Team === filterBy.Team
                );
              }
              if (filterBy.People.length > 0) {
                // personCopy = Persons.filter(e => { if (filterBy.People.includes(e.User)) { return e } })
                let array = [];
                for (const e of filterBy.People) {
                  for (const t of RightDayPeople) {
                    if (e === t.User) {
                      array.push(t);
                    }
                  }
                }
                RightDayPeople = array;
              }

              let Hours = 0;
              RightDayPeople.forEach((e) => {
                Hours = parseFloat(Hours) + parseFloat(e.Hours);
              });
              return (
                <div className="OfficeOneDay" key={index}>
                  <div className={"CalendarH3"}>
                    <h5
                      style={{ textAlign: "center" }}
                      className={classes.cardTitle}
                    >
                      {moment(e).format("dd")}
                      <br></br>
                    </h5>
                    <h6
                      style={{ textAlign: "center" }}
                      className={classes.cardTitle}
                    >
                      {moment(e).format("DD")}
                    </h6>
                  </div>
                  <GridItem
                    ConverterClass={ConverterClass}
                    GraphInfoService={GraphInfoService}
                    People={RightDayPeople}
                    Bearer={Bearer}
                    filterBy={filterBy}
                    days={days}
                    key={index}
                    day={e}
                  ></GridItem>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
