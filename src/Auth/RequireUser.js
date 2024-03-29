import { useLocation,Navigate,Outlet } from "react-router-dom";

function RequireUser() {
    const user = localStorage.getItem('dtoken')
    const location = useLocation();
  return (
    user ? <Outlet/> : <Navigate to={'/login'} state={{from:location}} replace></Navigate>
  )
}

export default RequireUser