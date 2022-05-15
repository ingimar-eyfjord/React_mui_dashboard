import { useState, useCallback, useEffect } from "react";
import salaryService from "services/api_services/salary.service";
import Period from "./periods";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import moment from 'moment'
import CardHeader from "App/components/Card/CardHeader.js";

export default function SalaryPeriod() {

  const [periods, setPeriods] = useState();
  const [Uis, setUis] = useState(<div></div>);

  const getSalaryPeriod = useCallback(async (year) => {
    const periods = await salaryService.find_periods_in_year(year)
    setPeriods(periods.data);
  }, []);

  useEffect(() => {
    const year = moment().format("YYYY");
    getSalaryPeriod(year);
  }, [getSalaryPeriod]);



  const removeUIBecDelete = useCallback(
    (id) => {
      const copy = [...periods]
      copy.forEach((item, index, object) => {
        if (item.id === id) {
          object.splice(index, 1);
        }
        setPeriods(copy);
      })
    },
    [periods],
  )
  useEffect(() => {
    if (periods === undefined) {
      return
    }
    const UIs = periods.map((e, index) => {
      return <Period removeUIBecDelete={removeUIBecDelete} className="grid-item" key={index} Data={e}></Period>
    });
    setUis(UIs);
  }, [periods, removeUIBecDelete]);

  return (

    <div style={{ width: "50%" }}>
      <CardHeader style={{ marginBottom: "1rem" }}>
      <h3>See or change salary periods</h3>
      </CardHeader>
      <ResponsiveMasonry
        className="cardInterfaceContainer"
        columnsCountBreakPoints={{ 750: 1, 1200: 2 }}
      >
        <Masonry className="DashboardContainer">
          {Uis}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
