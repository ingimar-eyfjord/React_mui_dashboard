import React, { useState, useEffect, useCallback, useContext } from "react";
import TablesData from "./tables.json";
import { GlobalState } from "context/store";

function NewTables(props) {
  const [TableElements, setTableElements] = useState([]);
  const [Store] = useContext(GlobalState);

  const ClickMe = useCallback(
    (event) => {
      event.persist();
      let id = "";
      if (event.target === "text" || event.target === "circle" || event.target === "path") {
        id = event.target.parentElement.id;
      } else {
        id = event.target.id;
      }
      props.NotifyParent(id.slice(2, id.length));
    },
    [props]
  );

  const SetTables = useCallback(async () => {
    if (props?.booked !== undefined) {
      if (props?.booked.length > 0) {
        TablesData.Tables.forEach((t) => {
          t.booked = "Free";
          props.booked.forEach((e) => {
            if (e.Table === t.id) {
              t.booked = "Booked";
            }
          });
        });
      }
    }
    if (props?.booked?.length === 0) {
      TablesData.Tables.forEach((t) => {
        t.booked = "Free";
      });
    }
    const tableMap = TablesData.Tables.map((e, index) => (
      <g
        onClick={ClickMe}
        className={Store.table === e.id.slice(2, e.id.length) ? "selectedTable" : "notSelected"}
        data-booked={e.booked}
        id={e.id}
        key={index}
      >
        <path d={e.children.path.d} id={e.children.path.id} fill="#313d50" />
        <text
          className={e.children.text.className}
          fill="#fff"
          style={{
            whiteSpace: "pre",
            pointerEvents: "none",
          }}
          fontFamily="Arial"
          fontSize={9.93}
          fontWeight="bold"
          letterSpacing="0em"
        >
          <tspan x={e.children.text.x} y={e.children.text.y}>
            {e.children.text.children.TextInside}
          </tspan>
        </text>
      </g>
    ));
    setTableElements(tableMap);
  }, [props, Store.table, ClickMe]);

  useEffect(() => {
    SetTables();
  }, [SetTables]);

  return (
    <div className="svg-container">
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
        viewBox="0 0 500 500" 
        className="SVGTables"> 
        {TableElements}
      </svg>
    </div>
  );
}

export default NewTables;
