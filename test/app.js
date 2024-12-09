import React from "https://unpkg.com/react@18/umd/react.production.min.js";
import ReactDOM from "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
import Display from "./display.js";

const App = () => {
  return (
    <div>
      <Display />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
