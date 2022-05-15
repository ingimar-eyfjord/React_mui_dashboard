import moment from "moment-timezone/builds/moment-timezone-with-data";
class ConverterClass {
  ToDBDates(Date) {
    return moment(Date).tz("GMT").format();
  }
  formToJSON(elements) {
    const data = Convert(elements);
    return data;
  }
  toReadableDates(Date) {
    return moment(Date).format("MM-DD-YYYY");
  }
  UniqueArrayByKeyValue(array, key) {
    const unique = array.reduce(function (a, b) {
      function indexOfProperty(a, b) {
        for (var i = 0; i < a.length; i++) {
          if (a[i][key] === b[key]) {
            return i;
          }
        }
        return -1;
      }

      if (indexOfProperty(a, b) < 0) a.push(b);
      return a;
    }, []);
    return unique;
  }


  makeMomentDateWithTime(Date, Time) {
    const format = "HH:mm:ss";
    let time = moment(Time, format);
    let day = moment(Date);
    day.set({
      hour: time.get("hour"),
      minute: time.get("minute"),
      second: time.get("second"),
    });
    return moment(day).format();
  }
  currentMomentTimezone(date) {
    return moment.utc(date).tz(moment.tz.guess());
  }
  getCalendarDates(data) {
    let calendar = [];
    const startDay = moment(data).clone().startOf("month").startOf("week");
    const endDay = moment(data).clone().endOf("month").endOf("week");

    let date = startDay.clone().subtract(1, "day");

    while (date.isBefore(endDay, "day")) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => date.add(1, "day").clone()),
      });
    }
    return calendar;
  }
  dataURItoBlob(dataURI) {
    try {
      // convert base64 to raw binary data held in a string
      var byteString = atob(dataURI.split(",")[1]);
      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      // write the bytes of the string to an ArrayBuffer
      var arrayBuffer = new ArrayBuffer(byteString.length);
      var _ia = new Uint8Array(arrayBuffer);
      for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
      }
      var dataView = new DataView(arrayBuffer);
      var blob = new Blob([dataView.buffer], { type: mimeString });
      return blob;
    } catch {
      return undefined;
    }
  }
}
const isValidElement = (element) => {
  if (element.type === "radio") {
    if (!element.checked === false) {
      return element.name && element.value;
    }
  } else {
    if (element.name !== "") {
      return element.name && element.value;
    } else {
      return;
    }
  }
};
/// Dynamically get form elements name=value and turn it into JSON
const Convert = (elements) =>
  [].reduce.call(
    elements,
    (data, element) => {
      // Make sure the element has the required properties.
      if (isValidElement(element)) {
        data[element.name] = element.value;
      }
      return data;
    },
    {}
  );

// const move = (arr, old_index, new_index) => {
//   while (old_index < 0) {
//     old_index += arr.length;
//   }
//   while (new_index < 0) {
//     new_index += arr.length;
//   }
//   if (new_index >= arr.length) {
//     var k = new_index - arr.length;
//     while (k-- + 1) {
//       arr.push(undefined);
//     }
//   }
//   arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
//   return arr;
// };

export default new ConverterClass();
