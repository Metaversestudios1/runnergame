import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { CiEdit } from "react-icons/ci";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoader(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/getAllPackages`
      );
      const response = await res.json();
      console.log(response)
      if (response.success) {
        setNoData(false);
        if (response.data.length === 0) {
          console.log("true")
          setNoData(true);
        }
        setPackages(response.data);
        setCount(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };
  const handleDelete = async (e, id) => {
    e.preventDefault();
    const permissionOfDelete = window.confirm(
      "Are you sure, you want to delete the employee"
    );
    if (permissionOfDelete) {
      let employeeOne = employees.length === 1;
      if (count === 1) {
        employeeOne = false;
      }
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/deleteEmployee`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const response = await res.json();
      if (response.success) {
        toast.success("Employee is deleted Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (employeeOne) {
          setPage(page - 1);
        } else {
          fetchData();
        }
      }
    }
  };

  const handleRemainingDays = (expireFullDate) => {
    if(!expireFullDate) {
      return "N/A"
    }
    const currentDate = new Date();
    const expireDate = new Date(expireFullDate);

    const remainingTime = expireDate - currentDate; // Difference in milliseconds

    if (remainingTime <= 0) {
        return "Expired";
    }

    const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24)); // Convert ms to days

    if (remainingDays > 0) {
        return `${remainingDays} day(s) remaining`;
    }
    const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours
    if (remainingHours > 0) {
        return `${remainingHours} hour(s) remaining`;
    }

    const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
    return `${remainingMinutes} minute(s) remaining`;
};


  const startIndex = (page - 1) * pageSize;
  return (
    <div className="relative">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex items-center">
        <div className="text-2xl font-bold mx-2 my-8 px-4">Packages List</div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/addpackage">
          <button className="bg-[#16144b] text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>
        
      </div>
      {loader && (
        <div className="absolute h-full w-full  flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
      {packages.length !== 0 && (
        <div className="relative overflow-x-auto m-5 mb-0">
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Remaining days to expire
                </th>
               {/* <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>*/}
              </tr>
            </thead>

            <tbody>
              {packages.map((item, index) => {
                return (
                  <tr className="bg-white" key={item._id}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {startIndex + index + 1}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {item?.description}
                    </th>

                  
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {handleRemainingDays(item?.expiresAt)}
                    </td>

                    {/*<td className=" p-5   border-2  border-gray-300">
                      <div className="flex items-center">
                        <NavLink to={`/obstacles/editobstacle/${item?._id}`}>
                          <CiEdit className="text-2xl cursor-pointer text-blue-900" />
                        </NavLink>
                      </div>
                    </td>*/}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {noData && (
        <div className="text-center text-xl">
          Currently! There are no packages install in the game.
        </div>
      )}
      {packages.length !== 0 && (
        <div className="flex flex-col items-center my-10">
          <span className="text-sm text-black">
            Showing{" "}
            <span className="font-semibold text-black">{startIndex + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-black">
              {Math.min(startIndex + pageSize, count)}
            </span>{" "}
            of <span className="font-semibold text-black">{count}</span> Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <button
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
              onClick={() => setPage(page + 1)}
              disabled={
                packages.length < pageSize || startIndex + pageSize >= count
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
