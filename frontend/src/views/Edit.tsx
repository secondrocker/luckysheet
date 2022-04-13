import Luckysheet from '../components/Luckysheet';
import axios from 'axios';
import { useParams } from "react-router-dom";
import ExcelForm from './ExcelForm';
import { useState } from 'react'

export default function() {
  const {id} = useParams()
  const [title,setTitle] = useState('')
  const [importUrl,setImportUrl] = useState('')
  const getTemplate = async () => {
    const res = await axios.get(`http://localhost:4000/templates/show/${id}`,{})
    const excel = res.data.template
    setTitle(excel.title)
    setImportUrl(excel.import_url)
    const luckysheet = window.luckysheet;
    luckysheet.destroy;
    let config = {
      container: 'luckysheet', //luckysheet is the container id
      showinfobar:false,
      lang: 'zh',
      title: excel.title,
    }
    if(excel.content) {
      config = {...config,data: JSON.parse(excel.content)}
    }
    luckysheet.create(config);
  }
  const submitContent = (title,import_url) => {
    const content = window.luckysheet.getAllSheets()
    let formData = new FormData()
    formData.append('id',id || '')
    formData.append('title', title)
    formData.append('import_url',import_url)
    formData.append('content',JSON.stringify(content))

    axios.post('http://localhost:4000/templates/save',formData).then(res => {
      alert(res.data.id)
    })
  }

  return (
    <div>
      <ExcelForm showSave={true} title={title} importUrl={importUrl}  submitForm={submitContent}></ExcelForm>
      <Luckysheet render={getTemplate}></Luckysheet>
    </div>
  )
}