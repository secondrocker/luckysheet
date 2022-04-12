import { Table,Button,message } from 'antd';
import {Excel} from './types';
import 'antd/dist/antd.css';
import axios from 'axios';
import React from 'react';


class List extends React.Component {
  columns = [
    {title: 'excel名称', dataIndex: 'title'},
    {title: '创建人', dataIndex: 'created_by'},
    {title: '操作', render: (text,record,index) => {
      return (
        <div>
          <Button style={{marginLeft: '10px'}} onClick={(() => { this.goToEdit(record.key) })}>编辑</Button>
          <Button style={{marginLeft: '10px'}} onClick={(() => { this.deleteRecord(record.key) })}>删除</Button>
        </div>
      )}
    }
  ]
  async getRecords(page = 1,per_page = 10){
    const res = await axios.get('http://localhost:4000/templates')
    this.setState({...this.state,records: res.data.records});
  }

  deleteRecord(id) {
    axios.delete(`http://localhost:4000/templates/${id}`,{}).then(res => {
      if (res.data.success) {
        message.success('删除成功!');
        this.getRecords();
      }
    })
  }

  goToEdit(id: string) {
    window.open(`/edit/${id}`)
  }
  constructor(props: any) {
    super(props)
    this.getRecords.bind(this)
    this.deleteRecord.bind(this)
    this.state = {
      records: []
    }
  }

  // shouldComponentUpdate() {
  //   return false
  // }

  componentDidMount () {
    this.getRecords()
  }
  render() {
    return (
      <div>
        <div style={{paddingLeft:"40px",paddingTop:"15px"}}>
          <Button type="primary" onClick={ () => this.goToEdit("0") }>新增</Button>
        </div>
        <Table dataSource={this.state.records} columns={this.columns}></Table>
      </div>
    )
  }
}

export default List
// export default function(){
//   const [records, setRecords] = useState<Excel[]>([]);

//   const goToEdit = (id: number) => {
//     window.open(`/edit/${id}`)
//   }

//   const columns = [
//     {title: 'excel名称', dataIndex: 'title'},
//     {title: '创建人', dataIndex: 'created_by'},
//     {title: '操作', render: (text,record,index) => {
//       return (
//         <div>
//           <Button style={{marginLeft: '10px'}} onClick={(() => { goToEdit(record.key) })}>编辑</Button>
//         </div>
//       )}
//     }
//   ]
//   const getRecords = async (page = 1,per_page = 10) => {
//     const res = await axios.get('http://localhost:4000/templates')
//     setRecords(res.data.records);
//   }
//   React.useEffect(()=>{
//     getRecords()
//   })

//   return (
//     <Table dataSource={records} columns={columns}></Table>
//   )
// }