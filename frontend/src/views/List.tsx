import { Table,Button } from 'antd';
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
        </div>
      )}
    }
  ]
  async getRecords(page = 1,per_page = 10){
    const res = await axios.get('http://localhost:4000/templates')
    this.setState({...this.state,records: res.data.records});
  }

  goToEdit(id: number) {
    window.open(`/edit/${id}`)
  }
  constructor(props: any) {
    super(props)
    this.getRecords.bind(this)
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
      <Table dataSource={this.state.records} columns={this.columns}></Table>
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