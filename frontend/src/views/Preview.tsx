import Luckysheet from '../components/Luckysheet';
import axios from 'axios';
import ExcelForm from './ExcelForm';
import { useState } from 'react'

export default function() {
  const {id} = useParams()
  const [title,setTitle] = useState('')

  const getTemplate = async () => {
    const res = await axios.get(`http://localhost:4000/templates/show/${id}`,{})
    const excel = res.data.template
    setTitle(excel.title)
    const luckysheet = window.luckysheet;
    luckysheet.destroy;
    luckysheet.create({
      container: 'luckysheet', //luckysheet is the container id
      showinfobar:false,
      lang: 'zh',
      data: JSON.parse(excel.content),
      title: excel.title,
    });
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
      <ExcelForm title={title} submitForm={submitContent}></ExcelForm>
      <Luckysheet render={getTemplate}></Luckysheet>
    </div>
  )
}