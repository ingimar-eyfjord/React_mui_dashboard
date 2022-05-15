
import GraphInfoService from "services/graph_services/graph.service.js"

class Functions {
async changeUserImage(ImageFile, Bearer) {
    if (ImageFile === undefined) {
      return "no image selected."
    } else {
      try {
      const change = await GraphInfoService.ChangeImage(Bearer, ImageFile);
      if (change.status === 200) {
        return "Image uploaded, it can take a few minutes to take effect."
      }
      } catch (error) {
        return error;
      }
      // code below from older version of the application, this is used if you want to manually change the image right away (front-end)
        // const reader = new FileReader();
        // reader.onloadend = function () {
        //   code to update image, image could be state object
        // };
        // reader.readAsDataURL(ImageFile);
    }
  }

 
  
  distanceInKmBetweenEarthCoordinates(lat1, lon1) {
    let lat2 = 55.652358
    let lon2 = 12.519486
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
  }

}
export default new Functions();