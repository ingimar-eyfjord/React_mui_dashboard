import { useState,useCallback } from "react";
import HoursCard from "./hours_card.jsx";
import Stack from "@mui/material/Stack";
import moment from "moment";
const HoursEdit = (props) => {
  const [page, setPage] = useState(1);
  const [cardCount, setCardCount] = useState(props.selectedRows.length);
  const [rows, setRows] = useState(props.selectedRows)
  const handleDeleteCard = useCallback(
    (value) => {
      const copy = [...rows]
      const deleteRow = copy.splice(value-1, 1);
      const newRows = copy.filter((row) => row.Transaction_ID !== deleteRow[0].Transaction_ID);
      setPage(value++);
      setRows(newRows)
      setCardCount(newRows.length)
      if (newRows.length === 0) {
        const data = {
          start: moment.utc(props.Date).startOf("day").format(),
          end: moment.utc(props.Date).endOf("day").format(),
        };
        props.getHoursReport(data);
          props.handleClose();
        }
    },
    [rows, props],
  )
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <div style={{ height: "fit-content" }}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        {rows.map((row, index) => {
          if (index === page - 1) {
            return (
              <HoursCard
                handleClose={props.handleClose}
                rowData={row}
                index={index+1}
                handlePageChange={handlePageChange}
                handleDeleteCard={handleDeleteCard}
                page={page}
                cardCount={cardCount}
              />
            );
          }else{
            return null
          }
        })}
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      ></Stack>
    </div>
  );
};

export default HoursEdit;
