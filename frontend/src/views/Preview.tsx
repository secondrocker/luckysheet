import Luckysheet from '../components/Luckysheet';
import axios from 'axios';
import { useParams } from "react-router-dom";
import ExcelForm from './ExcelForm';
import { useState } from 'react'
export default function(props:any) {
  const {id} = useParams()
  const callback = window.location.href.split('?')[1].split('=')[1];

  const [title,setTitle] = useState('')

  const getTemplate = async () => {
    const res = await axios.get(`http://localhost:4000/templates/show/${id}`,{});
    const excel = res.data.template;
    const data = (await axios.post(callback,{})).data;
    const records = data.records;
    setTitle(data.title)
    let sheets = JSON.parse(excel.content)
    const luckysheet = window.luckysheet;
    sheets.forEach((s,i) => {
      extractSheet(s,records[i])
    })
    luckysheet.destroy;
    luckysheet.create({
      container: 'luckysheet', //luckysheet is the container id
      showinfobar:false,
      lang: 'zh',
      data: sheets,
      title: data.title,
    });
  }
  const extractSheet = (sheet,data) => {
    if(!data) return
    const {sheet_name,records,offset} = data
    if (!records) {
      return
    }
    sheet.name = sheet_name

    for (let i = 0;i < records.length;i ++) {
      const row = records[i];
      for (let j = 0;j < row.length;j ++) {
        sheet.data[offset+i][j] = {v: row[j],m: row[j]}
      }
    }
  }
  const submitContent = (title) => {
    const content = window.luckysheet.getAllSheets()
    let formData = new FormData()
    formData.append('id',id || '')
    formData.append('title', title)
    formData.append('content',JSON.stringify(content))

    axios.post('http://localhost:4000/templates/save',formData).then(res => {
      alert(res.data.id)
    })
  }
  return (
    <div>
      <ExcelForm showSave={false} title={title} submitForm={submitContent}></ExcelForm>
      <Luckysheet render={getTemplate}></Luckysheet>
    </div>
  )
}