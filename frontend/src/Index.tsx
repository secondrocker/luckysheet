import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import List from './views/List'
import Edit from './views/Edit'
import Preview from './views/Preview'
import ImportExcel from './views/ImportExcel'
import Home from './views/Home'

function App() {
  return (
    <BrowserRouter>
      <div>
        <ul>
          <li><Link to="/list">List</Link></li>
          <li><Link to="/">home</Link></li>
        </ul>
      </div>
      <Routes>
        <Route path="/list" element={ <List/> }>
        </Route>
        <Route path="/edit/:id" element={ <Edit/> }>
        </Route>
        <Route path="/" element={ <Home /> }>
        </Route>
        <Route path="preview/:id" element={ <Preview /> }>
        </Route>
        <Route path="import_excel/:id" element={ <ImportExcel /> }>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
