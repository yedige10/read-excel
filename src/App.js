import React, { useState, useEffect } from "react";
import { read, utils, writeFile } from "xlsx";
function App() {
  const [data, setdata] = useState([]);
  const [byStatus, setByStatus] = useState({});
  const [busyMoney, setBusyMoney] = useState(0);
  const limitMoney = 150000;
  
  const readfile = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          setdata(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    const result = {};
    data.forEach((element, index) => {
      if(element.seller_status){
        result[element.seller_status] =
        (result[element.seller_status] ?? 0) + element.price + element.full_fillment;
        if(element.seller_status != "Выплачено"){
          setBusyMoney(prev => prev + element.price + element.full_fillment)
        }
      }        
    });
    setByStatus(result);
  }, [data]);

  return (
    <div style={{ marginTop: "30px" }}>
      <input type="file" onChange={readfile} accept=".xlsx" />
      {Object.keys(byStatus).map((key, index) => {
        return (
          <div key={index}>
            <h2>
              {key}: {byStatus[key]}
            </h2>

            <hr />
          </div>
        );
      })}
      <div>
        <h2>Свободные деньги: {limitMoney - busyMoney}</h2>
      </div>
    </div>
  );
}

export default App;
