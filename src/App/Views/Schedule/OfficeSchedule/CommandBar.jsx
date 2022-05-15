//? This component is the command bar on top of the office schedule. It will control the schedule
//? It has Components from the main components folder in the source folder that are passed down from the app.js
//?
import { useState, useContext, useCallback } from "react";
import { PeoplePickerComp } from "App/components/MGTComponents";
import GridItem from "App/components/Grid/GridItem.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { GlobalState } from "context/store";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import MenuItem from "@mui/material/MenuItem";
export default function CommandBar(props) {
  const [Store] = useContext(GlobalState);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const [SelectedTeam, setSelectedTeam] = useState(
    Store.UserDetails.Department
  );
  const [TeamName, setTeamName] = useState("");

  const PropsFunc = useCallback(
    (selectedOption, placeHolder, target) => {
      if (selectedOption.target.name === "All") {
        selectedOption = undefined;
      }
      if (selectedOption.target.name === "Team") {
        function deepFind(arr, search) {
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
        }
        let right = deepFind(Store.Options.Departments, function (obj) {
          return obj.id === selectedOption.target.value;
        });
        if (right === null) {
          right = Object.values(Store.Options.Departments).filter((x) => {
            return x.id === selectedOption.target.value;
          });
        }
        setSelectedTeam(right);
        setTeamName(right?.title);
        props.setState((state) => ({
          ...state,
          filterBy: {
            ...state.filterBy,
            Team: selectedOption.target.value,
          },
        }));
        
      } else {
        props.setState((state) => ({
          ...state,
          filterBy: {
            ...state.filterBy,
            Location: selectedOption.target.value,
          },
        }));
      }
    },
    [Store, props]
  );

  const handleChange = (event) => {
    if(event.value === ''){
      setTeamName('')
      props.setState((state) => ({
        ...state,
        filterBy: {
          ...state.filterBy,
          Team: undefined,
        },
      }));
    }
    return;
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={4} style={{ marginBottom: "1rem" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Filter by Team</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Filter by Team"
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            value={TeamName}
            onChange={e => {handleChange(e.target)}}
          >
            <MenuItem value={""}>Clear filter</MenuItem>
            {Object.values(Store.Options.Departments).map((e, index) => {
              let value = []
              function mapSubDep(subs) {
                if (subs.SubDepartments) {
                  var deepResult = subs.SubDepartments.map((t) => mapSubDep(t));
                  if (deepResult) {
                    return deepResult;
                  }
                }
                return (
                  <MenuItem
                    style={{ display: "none" }}
                    key={subs.id}
                    value={subs.title}
                  >
                    {subs.title}
                  </MenuItem>
                );
              }
              if(index === 0){
                value.push(<MenuItem
                  style={{ display: "none" }}
                  key={e.id}
                  value={e.title}
                >
                  {e.title}
                </MenuItem>);
                 if (e.SubDepartments) {
                  e.SubDepartments.forEach(e=>{
                    value.push(<MenuItem
                      style={{ display: "none" }}
                      key={e.id}
                      value={e.title}
                    >
                      {e.title}
                    </MenuItem>);
                  })
                  value.push(mapSubDep(e));
                }
              }
              return value
            })}
            <TeamsDropDownOptions
              passedSelected={SelectedTeam.id}
              TeamsDataService={props.TeamsDataService}
              PropsFunc={PropsFunc}
              label={"Filter by Team"}
              name={"Team"}
              required={false}
            />
          </Select>
        </FormControl>
      </GridItem>
      <GridItem xs={12} sm={12} md={4} style={{ marginBottom: "1rem" }}>
        <props.LocationDropDownOptions
          LocationsDataService={props.LocationsDataService}
          PropsFunc={PropsFunc}
          label={"Filter by locations"}
          name={"Location"}
          required={false}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <div style={{ marginBottom: "1rem" }} className="flexColumn">
          <PeoplePickerComp
            whichPassDown={"user"}
            id="PeoplePicker"
            passedDown={props.FilteredPersons}
          ></PeoplePickerComp>
        </div>
      </GridItem>
    </GridContainer>
  );
}
