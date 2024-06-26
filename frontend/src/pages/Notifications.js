import React from "react";
import Layout from "../components/Layout";
import { Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { setUser } from "../redux/userSlice";
function Notifications() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const markAllSeen = async (req, res) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/mark-all-notification-as-seen",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const deleteAllSeen = async (req, res) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="flex flex-row">
        <i className="fa-regular fa-bell fa-lg pt-3 pr-2"></i>
        <h1 className="page-title">Notifications</h1>
      </div>

      <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor bg-blue-600 p-2 rounded-md text-white font-semibold hover:bg-blue-700 active:bg-blue-500" onClick={() => markAllSeen()}>
              Mark all as seen
            </h1>
          </div>
          {user?.unseenNotifications.map((notification) => (
            <div
              className="card p-2 mt-2.5 cursor-pointer rounded-md shadow-md hover:shadow-lg"
              onClick={() => navigate(notification.onclickPath)}
            >
              <div className="card-txt">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="seen" key={1}>
          <div className="d-flex justify-content-end">
            <h1 className="anchor bg-red-600 p-2 rounded-md text-white font-semibold hover:bg-red-700 active:bg-red-500" onClick={() => deleteAllSeen()}>
              Delete All
            </h1>
          </div>
          {user?.seenNotifications.map((notification) => (
            <div
              className="bg-white p-2 mt-2.5 cursor-pointer rounded-md shadow-md hover:shadow-lg"
              onClick={() => navigate(notification.onclickPath)}
            >
              <div className="card-txt">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}

export default Notifications;
