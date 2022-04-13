import { Form,Input,Button,Upload,Checkbox } from 'antd'
import 'antd/dist/antd.css';
import { Excel } from './types'
import LuckyExcel from 'luckyexcel'
import excelExport from '../export_excel'
import { useState } from 'react';
import axios from 'axios';

interface EditProps {
  title: string;
  importUrl?: string;
  showSave: boolean;
  showExport?: boolean;
  submitForm?(title: string,import_url: string): void;
  importExcel?(): void
}
export default function(props: EditProps){
  const onFinish = (values) => {
    console.log(values)
    if(props.submitForm) props.submitForm(values['title'],values['import_url'])
  }

  const processFile = (event) => {
    LuckyExcel.transformExcelToLucky(event.target.files[0], function(exportJson, luckysheetfile){
      luckysheet.destroy();
      const title = exportJson.info.name.replace(/\.xlsx$/g,'')

      form.setFieldsValue({ title: title});
      luckysheet.create({
        container: 'luckysheet', //luckysheet is the container id
        showinfobar:false,
        lang: 'zh',
        data:exportJson.sheets,
        title: title,
      })
    })
  }

  const [form] = Form.useForm();
  // let form = { title: props.title});
  form.setFieldsValue({ title: props.title});
  if(props.importUrl) {
    form.setFieldsValue({import_url: props.importUrl})
  }
  const saveAs = (obj, fileName) => {
    var tmpa = document.createElement("a");
    tmpa.download = fileName || "download";
    tmpa.href = URL.createObjectURL(obj);
    tmpa.click();
    setTimeout(function () {
        URL.revokeObjectURL(obj);
    }, 100);
  }

  const exportJSON = () => {
    let allSheetData = window.luckysheet.getAllSheets()
    excelExport(allSheetData).then(s => {
      saveAs(new Blob([s], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),`${props.title || '文档'}.xlsx`)
    })

  }

  const btnImportExcel = () => {
    if(props.importExcel) props.importExcel()
  }


  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item name={['title']} label="excel文件名">
        <Input readOnly={!props.showSave} placeholder="请输入文件名" />
      </Form.Item>
      {
        props.showSave ? (
          <div style={{display: "flex"}}>
            <Form.Item name={['import_url']} label="导入地址">
              <Input placeholder='请输入导入地址' />
            </Form.Item>
            <Form.Item>
              <input style={{fontSize: "14px"}} type="file" accept=".xlsx" onChange={processFile} />
            </Form.Item>
            <Form.Item >
              <Button type="primary" htmlType="submit">保存</Button>
            </Form.Item>
          </div>
        ) : ''
      },
      {
        props.showExport ? (
          <Form.Item>
            <Button type="primary" onClick={btnImportExcel}>导入</Button>
          </Form.Item>
        ) :  (
          <Form.Item>
            <Button type="primary" onClick={exportJSON}>导出</Button>
          </Form.Item>
        )
      }
    </Form>
  )
}