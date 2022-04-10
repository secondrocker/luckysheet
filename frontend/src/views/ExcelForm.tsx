import { Form,Input,Button,Upload } from 'antd'
import 'antd/dist/antd.css';
import { Excel } from './types'
import LuckyExcel from 'luckyexcel'

interface EditProps {
  title: string;
  submitForm(excel: Excel): void;
}
export default function(props: EditProps){
  const onFinish = (values) => {
    console.log(values)
    props.submitForm(values['title'])
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

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item name={['title']} label="excel文件名">
        <Input placeholder="请输入文件名" />
      </Form.Item>
      <Form.Item>
        <input style={{fontSize: "14px"}} type="file" accept=".xlsx" onChange={processFile} />
      </Form.Item>
      <Form.Item >
        <Button type="primary" htmlType="submit">保存</Button>
      </Form.Item>
    </Form>
  )
}