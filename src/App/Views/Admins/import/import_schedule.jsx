import { useState, useEffect, useCallback} from "react";
import * as XLSX from "xlsx";
import converterClass from "App/Functions/converterClass";
import Row from "./row";
import Head from "./head";
import { PrimaryBtn } from "App/components/MUIComponents";
import { DefaultBtn } from "App/components/MUIComponents";
import ScheduleDataService from "services/api_services/schedule.service";
import { PeoplePickerComp } from "App/components/MGTComponents";
// import handleDrop from "App/Functions/importXLSX"
export default function ImportSchedule(props) {
  const [dataToImport, SetDataToImport] = useState([]);
  const [dataHeaders, setDataHeaders] = useState();
  const [dataToShow, setDataToShow] = useState();
  const [cnfBtn, setConfirmBtn] = useState();
  const [selectedPerson, setPerson] = useState(undefined)
  const [fileValue, setFileValue] = useState(undefined)
  //   drop_dom_element.addEventListener('drop', handleDrop, false);
  function handleDrop(e) {
    e.preventDefault();
    e.persist(e);
    if(e.target.files === undefined){
      return
    }
    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: "array", cellDates: true, cellNF: false, cellText: false });
      let array = [];
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        array.push(rowObject);
      });
      array.forEach((e) => {
        e.forEach((t, index) => {
          const start = converterClass.currentMomentTimezone(t.Date_start_time);
          const end = converterClass.currentMomentTimezone(t.Date_end_time);
          if (!start.isValid()) {
            alert(`Not valid start date at line ${index + 1}`);
            return;
          }
          if (!end.isValid()) {
            alert(`Not valid end date at line ${index + 1}`);
            return;
          }
          t.Date_end_time = end.format();
          t.Date_start_time = start.format();
        });
      });
      SetDataToImport(array);
      setFileValue(Math.random().toString(36).substr(2, 9))
    };
    try{
      reader.readAsArrayBuffer(f);
    }catch{
      alert("there was an error try again")
    }
  }
const submitImportToDatabase = useCallback(
  async () => {
    if (dataToImport.length > 0) {
      if(selectedPerson === undefined){
        alert("select person first")
        return;
      }
    }
    dataToImport[0].forEach(e=>{
      if (!e.Break) {
        e.Break = 0
      }
      if (!e.Table_number) {
        e.Table_number = null
      }
      e.User = selectedPerson.displayName
      e.User_UUID = selectedPerson.id
      if(selectedPerson.mail !== undefined){
        e.Email = selectedPerson.mail
      }
      if(selectedPerson.mail === undefined){
        if(selectedPerson.scoredEmailAddresses !== undefined){
          if(selectedPerson.scoredEmailAddresses.length > 0){
            e.Email = selectedPerson.scoredEmailAddresses[0].address
          }
        }else{
          e.Email = selectedPerson.imAddress.substr(0, selectedPerson.imAddress.indexOf(':'));
        } 
      }

    })
     const importThings = await ScheduleDataService.Import(dataToImport);
     if(importThings === "error"){
      alert("Something went wrong, make sure you are following the right structure as seen in the information about this component")
     }else{
       alert(`successfully imported the schedule for ${selectedPerson.displayName}`)
     }
  },
  [dataToImport, selectedPerson],
)

  function removeEverything(){
    SetDataToImport([]);
    setDataHeaders();
    setDataToShow();
    setConfirmBtn();
    setPerson(undefined)
  }

  useEffect(() => {
    if (dataToImport.length > 0) {
      const th = dataToImport[0].map((e, index) => (index < 1 ? <Head key={index} data={e}></Head> : ""));
      const td = dataToImport[0].map((e, index) => <Row key={index} data={e}></Row>);
      const ConfirmBtn = (
        <>
        <PrimaryBtn
          style={{marginBottom: "1rem"}}
          text={"Confirm and submit"}
          onClickFunction={submitImportToDatabase}
          disabled={false}
        ></PrimaryBtn>
        <DefaultBtn
        text={"Cancel"}
        onClickFunction={removeEverything}
        disabled={false}
    ></DefaultBtn>
    </>
      );
      setDataHeaders(th);
      setDataToShow(td);
      setConfirmBtn(ConfirmBtn);
    }
  }, [dataToImport,submitImportToDatabase]);
  useEffect(() => {
    if (dataToImport.length > 0) {
      const ConfirmBtn = (
        <>
        <PrimaryBtn
          style={{marginBottom: "1rem"}}
          text={"Confirm and submit"}
          onClickFunction={submitImportToDatabase}
          disabled={false}
        ></PrimaryBtn>
        <DefaultBtn
        text={"Cancel"}
        onClickFunction={removeEverything}
        disabled={false}
    ></DefaultBtn>
    </>
      );
      setConfirmBtn(ConfirmBtn);
    }
  }, [selectedPerson, submitImportToDatabase, dataToImport.length]);

  function selected(value){
    if(value.detail.length > 0){
     const person = value.detail[0]
      setPerson(person)
    }else{
      setPerson(undefined)
    }
  }
 
  return (
    <>
    <p className="ManualLabel">Select person</p>
      <PeoplePickerComp passedDown={selected} mode={'single'}></PeoplePickerComp>
      <div className="forUploadButton">
      <label className="ms-Button" htmlFor="uploadFile"></label>
      <input
        id={'uploadFile'}
        onChange={(e) => {
          handleDrop(e);
        }}
        type="file"
        placeholder="upload file"
        key={fileValue}
        />

        </div>
      <table className="Edit_Table_Container">
        {dataHeaders}
        {dataToShow}
      </table>
      {cnfBtn}
    </>
  );
}
