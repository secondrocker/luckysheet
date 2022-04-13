import Luckysheet from '../components/Luckysheet';
import axios from 'axios';
import { useParams } from "react-router-dom";
import ExcelForm from './ExcelForm';
import { useState } from 'react'
export default function(props:any) {
  const {id} = useParams()

  const [title,setTitle] = useState('')

  const getTemplate = async () => {
    const res = await axios.get(`http://localhost:4000/templates/show/${id}`,{});
    const excel = res.data.template;
    setTitle(excel.title)
    let sheets = JSON.parse(excel.content)
    const luckysheet = window.luckysheet;
    luckysheet.destroy;
    luckysheet.create({
      container: 'luckysheet', //luckysheet is the container id
      showinfobar:false,
      lang: 'zh',
      data: sheets,
      title: excel.title,
    });
  }

  const importExcel = () => {
    let content = window.luckysheet.getAllSheets()
    let formData = new FormData()
    formData.append('imported', false)
    formData.append('template_id',id)
    formData.append('content',JSON.stringify(content))
    axios.post('http://localhost:4000/templates/import_excel',formData).then(res => {
      alert(res.data.id)
    })
  }
  return (
    <div>
      <ExcelForm showSave={false} showExport={true} title={title} importExcel={importExcel}></ExcelForm>
      <Luckysheet render={getTemplate}></Luckysheet>
    </div>
  )
}