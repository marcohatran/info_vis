import * as d3 from "d3";

class ClientService {
  static myInstance = null;
  static getInstance() {
    if (ClientService.myInstance == null) {
      ClientService.myInstance = new ClientService();
    }
    return this.myInstance;
  }
  
  plot = async (preprocessing, c) => {
    console.log(preprocessing, c);
    let data = await d3.json("http://127.0.0.1:5000/api/" + preprocessing + "/" + c);
    return data;
  }

}

export default ClientService;
