import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar";
import Profile from "../components/Profile";
import Post from "../components/Post";
import Users from "../components/Users";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComponent";

function Dashboard() {
  const location = useLocation();
  const [tab , setTab] = useState('');

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab')
   
    if (tabFromURL) {
      setTab(tabFromURL)
    }
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
       <Sidebar/>
      </div>
      {tab === 'profile' && <Profile/>}
      {tab === 'posts' && <Post />}
      {tab === 'users' && <Users />}
      {tab === 'comments' && <DashComments />}
      {tab === 'dash' && <DashboardComp />}
    </div>
  )
}

export default Dashboard