import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { PageHeader } from 'antd';
import 'antd/dist/antd.dark.css';
import './App.css';
import { NotFoundPage } from './pages/NotFoundPage';
import { HomePage } from './pages/HomePage';
import { EditPage } from './pages/EditPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <PageHeader
          className="site-page-header"
          title={<Link to="/" className="header-link">Ally's Enemy List</Link>}
        />
        <Routes>
          <Route index element={<HomePage/>} />
          <Route path="/" element={<HomePage/>} />
          <Route path="/edit" element={<EditPage/>} />
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
