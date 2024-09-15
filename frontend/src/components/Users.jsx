import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";


function Users() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const res = await axios.get(`https://scriptstorm-47.onrender.com/api/v1/user/getusers`,{withCredentials:true});
            const data = await res.data;
            if (data && data.users) {
              setUsers(data.users);
              if (data.users.length < 9) {
                setShowMore(false);
              }
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        if (currentUser.isAdmin) {
          fetchUsers();
        }
      }, [currentUser._id]);


      const handleShowMore = async () => {
        const startIndex = users.length;
        try {
          const res = await axios.get(`https://scriptstorm-47.onrender.com/api/v1/user/getusers?startIndex=${startIndex}`,{withCredentials:true});
          const data = await res.data;
          if (data.users && data.users.length > 0) {
            setUsers((prev) => [...prev, ...data.users]);
            if (data.users.length < 9) {
              setShowMore(false);
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      };

        const handleDeleteUser = async () => {
            try {
                const res = await axios.delete(`https://scriptstorm-47.onrender.com/api/v1/user/delete/${userIdToDelete}`, {withCredentials:true});
                const data =  res.data;
                if (data) {
                    setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
                    setShowModal(false);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
          };
      

    return (
        <div className="p-4 overflow-x-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
          { currentUser.isAdmin &&users.length > 0 ? (
            <>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-200 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-100 dark:hover:bg-gray-700  ${
                        index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/user/${user.slug}`}>
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-24 h-12 object-cover rounded-md shadow-md"
                          />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          className="text-teal-600 dark:text-teal-400 hover:underline"
                          to={`/user/${user.username}`}
                        >
                          {user.username}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500 dark:text-red-400">
                        <span className="cursor-pointer hover:underline" >
                          {user.isAdmin ? (
                      <FaCheck className='text-green-500 text-xl' />
                    ) : (
                      <FaTimes className='text-red-500 text-xl' />
                    )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600 dark:text-teal-400">
                      <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-600 hover:underline cursor-pointer'
                    >
                      <RiDeleteBin6Line className=" text-xl "/>
                    </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="w-full text-teal-500 self-center text-sm py-7"
                >
                  Show more
                </button>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              You have no users yet!
            </p>
          )}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            handleDeleteUser={handleDeleteUser}
            heading={"Are you sure you want to delete this user?"}
          />
        </div>
      );
    }

export default Users