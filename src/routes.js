
import SearchDocument from "views/templates/Search.js";

import Upload from "views/templates/Upload.js";
import Login  from "views/templates/Login.js";
import InvoiceViewer from "views/templates/Invoices"

var routes = [
  {
    path: "/search",
    name: "Campaign List",
    icon: "ni ni-tv-2 text-primary",
    component: <SearchDocument />,
    layout: "/admin",
  },
  
  {
    path: "/upload",
    name: "Schedule Campaign",
    icon: "ni ni-tv-2 text-yellow",
    component: <Upload />,
    layout: "/admin",
  },
   {
    path: "/invoices",
    name: "Schedule Campaign",
    icon: "ni ni-tv-2 text-yellow",
    component: <InvoiceViewer />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
 
  
];
export default routes;
