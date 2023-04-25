import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<div>HOME</div>} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
