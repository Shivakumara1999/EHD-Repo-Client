import { BrowserRouter } from "react-router-dom";
import { RoutingComponent } from "./Main/Routing";
import "./style.css";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RoutingComponent />
      </BrowserRouter>
    </div>
  );
}

export default App;
