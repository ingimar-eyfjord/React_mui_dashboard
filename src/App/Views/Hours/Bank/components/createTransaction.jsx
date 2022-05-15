import { useState, useEffect, useCallback, useContext } from "react";
import { Number } from "App/components/MUIComponents";
import { DefaultBtn } from "App/components/MUIComponents";
import moment from "moment";
import _ from "lodash";
import Box from "@mui/material/Box";
import GridItem from "App/components/Grid/GridItem.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import SalaryDataService from "services/api_services/salary.service";
import ConverterClass from "App/Functions/converterClass";
import BankDataService from "services/api_services/bank.service";
import { GlobalState } from "context/store";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export default function CreateTransaction() {
  const [Store, setStore] = useContext(GlobalState);

  const [DropDownInputs, setDropDownInputs] = useState({
    debit_month_name: "",
    Supplement: "Normal",
    credit_month_name: "",
  });

  const [Options, SetOptions] = useState({
    SalaryPeriod: [],
    Supplements: [],
  });

  function GetMappedOptions(Data) {
    let MapThis = [];
    Data.forEach((e) => {
      const Values = Object.values(e);
      MapThis.push(Values);
    });
    return MapThis.map((e, index) => {
      return { key: `${index}`, text: `${e}` };
    });
  }
  const [disabledBtn, setDisabledBtn] = useState(false);


  const submitTransaction = useCallback(
    async (e) => {
    
  
  

    e.preventDefault();
    e.persist(e);
    let elements = ConverterClass.formToJSON(e.target.elements);
    elements.User_UUID = Store.UserDetails.UserUUID;
    elements.Hours = parseFloat(elements.Hours);
    elements = _.merge(elements, DropDownInputs);

    if (
      elements.Hours === null ||
      elements.Hours === undefined ||
      elements.Hours === 0 ||
      elements.Hours === "0"
    ) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Please input hours",
          dateTime: moment(),
        },
      });
      return;
    }

    if (
      elements.debit_month_name === null ||
      elements.debit_month_name === undefined
    ) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Please input Debit month",
          dateTime: moment(),
        },
      });
      return;
    }

    if (
      elements.credit_month_name === null ||
      elements.credit_month_name === undefined
    ) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Please input Credit month",
          dateTime: moment(),
        },
      });

      return;
    }
    setDisabledBtn(true);

    try {
      const response = await BankDataService.create(
        elements
      );
      if (response.data.message) {
        setStore({
          Notification: {
            color: "success",
            icon: "check",
            title: "Success",
            content: response.data.message,
            dateTime: moment(),
          },
        });
        setDisabledBtn(false);
        setStore({
          SalaryOverviewOptions: {
            type: Store.SalaryOverviewOptions.type,
            period: Store.SalaryOverviewOptions.period,
          },
        });
        // setPeriod((state) => ({
        //   ...state,
        // }));
      }
    } catch (err) {
      console.log(err)
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: err.response.data.message,
          dateTime: moment(),
        },
      });
      setDisabledBtn(false);
    }

  },
  [Store, DropDownInputs, setStore],
)

  useEffect(() => {
    getMonthOptions();
    // eslint-disable-next-line
  }, []);
  //This callback also gives the neccesary salary period dates to send to the bank endpoint
  const getMonthOptions = useCallback(async () => {
    let SalaryPeriod = await SalaryDataService.find_periods_in_year_name(
      moment().format("YYYY")
    );
    SalaryPeriod = GetMappedOptions(SalaryPeriod.data);
    const Supplements = GetMappedOptions(Store.Options.Type);
    SetOptions({ SalaryPeriod, Supplements });
  }, [Store]);

  return (
    <form style={{ marginTop: "2rem" }} onSubmit={submitTransaction}>
      <GridItem xs={12} sm={12} md={12}>
        <GridContainer>
          <GridItem xs={12} sm={6} md={2}>
            <Number
              PassedStyle={{ width: "100% !important" }}
              IconID={"Clock"}
              InputName={"Hours"}
              label={"Hours"}
              required={true}
              step={0.25}
              maximum={2000}
              minimum={0}
              clear={disabledBtn}
            ></Number>
          </GridItem>

          <Box sx={{ marginRight: 0 }}>
            <FormControl fullWidth>
              <InputLabel id='debit_month_namesdf'>Debit Month</InputLabel>
              <Select
                labelId='debit_month_namesdf'
                id='demo-simple-select'
                value={DropDownInputs.debit_month_name}
                label='Debit Month'
                name={"debit_month_name"}
                onChange={(e) => {
                  setDropDownInputs((DropDownInputs) => ({
                    ...DropDownInputs,
                    debit_month_name: e.target.value,
                  }));
                }}
              >
                <MenuItem value=''></MenuItem>
                {Options.SalaryPeriod.map((e, index) => {
                  return (
                    <MenuItem
                      key={`-${index}-${index}-${e.text}`}
                      value={e.text}
                    >
                      {e.text}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-labelg'>
                Credit Month
              </InputLabel>

              <Select
                labelId='demo-simple-select-labelg'
                id='demo-simple-select'
                value={DropDownInputs.credit_month_name}
                label='Credit Month'
                name={"credit_month_name"}
                onChange={(e) => {
                  setDropDownInputs((DropDownInputs) => ({
                    ...DropDownInputs,
                    credit_month_name: e.target.value,
                  }));
                }}
              >
                <MenuItem value=''></MenuItem>
                {Options.SalaryPeriod.map((e, index) => {
                  return (
                    <MenuItem
                      key={`${index}-${e.text}-${index}`}
                      value={e.text}
                    >
                      {e.text}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Box ml={2}>
            <FormControl fullWidth>
              <InputLabel id='Supplementsdf'>Supplement</InputLabel>
              <Select
                labelId='Supplementsdf'
                id='demo-simple-select'
                value={DropDownInputs.Supplement}
                label='Type'
                name={"Supplement"}
                onChange={(e) => {
                  setDropDownInputs((DropDownInputs) => ({
                    ...DropDownInputs,
                    Supplement: e.target.value,
                  }));
                }}
              >
                {Store.Options.Type.map((e, index) => {
                  return (
                    <MenuItem
                      key={`${index}-${e.Type}-${index}`}
                      value={e.Type}
                    >
                      {e.Type}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <GridItem spacing={2} xs={12} sm={6} md={2.5}>
            <DefaultBtn
              text={"Deffer hours"}
              disabled={disabledBtn}
              BtnType={"submit"}
            ></DefaultBtn>
          </GridItem>
        </GridContainer>
      </GridItem>
    </form>
  );
}
