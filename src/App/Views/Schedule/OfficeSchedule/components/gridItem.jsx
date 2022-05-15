import { useEffect, useState, useCallback, useContext, cloneElement } from "react";
// import People from "./people";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
// import _ from "lodash";
import { GlobalState } from "context/store";

export default function GridItem(props) {
  const [page, setpage] = useState(0);
  const [Persons, setPersons] = useState([]);
  // eslint-disable-next-line
  const [Filtered, setFiltered] = useState(true);
  const [Store] = useContext(GlobalState);
  const Create = useCallback(
    (array) => {
      if (array.length <= 0 || array === undefined) {
        return;
      }
      let item = array.map((e, index) => {
        return ( 
         Store.PeopleInSchedule.find(obj => {
           return obj.key === e.Email
          })
        );
      });
      let c = item.map( (el,key) => cloneElement(el, {key} ));
      return c;
    },
    [Store.PeopleInSchedule],
  )
  const incrementCount = () => {
    setpage(page + 1);
  };
;

  useEffect(() => {
    const items = Create(props.People);
    setPersons(items);
  }, [props, page, Create]);

  return (
    <SimpleBar style={{ maxHeight: "100%", zIndex:0 }} autoHide={false} className='CalendarGridItem'>
      <Stack spacing={2} style={{height: "65vh",zIndex:5}}>
        {Filtered === false ? (
          <Button
            onClick={incrementCount}
            style={{ margin: "auto", marginTop: "1rem" }}
            variant='outlined'
          >
            Load more...
          </Button>
        ) : null}
        {Persons}
        {Filtered === false ? (
          <Button
            onClick={incrementCount}
            style={{ margin: "auto", marginTop: "1rem" }}
            variant='outlined'
          >
            Load more...
          </Button>
        ) : null}
      </Stack>
    </SimpleBar>
  );
}
