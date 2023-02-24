import React, { useEffect, useState } from 'react';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import axios from "axios"

interface WineData {
  "Alcohol": number;
  "Malic Acid": number;
  "Color intensity": number;
  "Hue": number;
}

const Page= () => {
  const [mapdata, setMapData] = useState<WineData[]>([]);

  useEffect(() => {
    axios.get<WineData[]>("http://localhost:3004/data")
      .then(res => setMapData(res.data))
      .catch(e => console.log(e))
  }, []);

  //Logic for finding average of Malic acid
  let sum = 0;
  let alcohol = 1;
  let arr: number[] = [];
  let arr2: number[] = [1];
  
  for (let i=0; i<mapdata.length; i++) {
    if (mapdata[i].Alcohol === alcohol) {
      sum = sum + mapdata[i]["Malic Acid"]
    } else {
      arr2.push(mapdata[i].Alcohol)
      arr.push(sum)
      console.log(alcohol)
      sum = mapdata[i]["Malic Acid"];
      alcohol = mapdata[i].Alcohol
    }
  }
  
  arr.push(sum)
  console.log(arr)

  const options: EChartsOption = {
    grid: { margin:0 },
    xAxis: {
      type: 'category',
      name:"Color Intensity",
      data: mapdata.map(ele => ele["Color intensity"]),
    },
    yAxis: {
      type: 'value',
      name:"Hue",
    },
    series: [
      {
        data: mapdata.map(ele => ele.Hue),
        type: 'scatter',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };
  
  const options2: EChartsOption = {
    grid: {margin:0 },
    xAxis: {
      type: 'category',
      data: arr2,
      name:"Alcohol"
    },
    yAxis: {
      type: 'value',
      name:"Malic Acid"
    },
    series: [
      {
        data: arr,
        type: 'bar',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return (
    <>
      <ReactECharts option={options} />
      <ReactECharts option={options2} />
    </>
  );
};

export default Page;
