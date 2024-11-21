import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdEye } from "react-icons/io";
const Impact = () => {
  const [impact, setImpact] = useState([]);
  const [noData, setNoData] = useState(false);
  const [loader, setLoader] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    setLoader(true);

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/getAllimpact?page=${page}&limit=${pageSize}&search=${search}`
      );
      const response = await res.json();
      console.log(response);
      if (response.success) {
        setNoData(false);
        if (response.result.length === 0) {
          setNoData(true);
        }
        setImpact(response.result);
        setCount(response.count);
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
      "Are you sure, you want to delete the Impact"
    );
    if (permissionOfDelete) {
      let impactOne = impact.length === 1;
      if (count === 1) {
        impactOne = false;
      }
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/deleteimpact`,
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
        toast.success("Impact is deleted Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (impactOne) {
          setPage(page - 1);
        } else {
          fetchData();
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearch(value);
      setPage(1);
    }
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
        <div className="text-2xl font-bold mx-2 my-8 px-4">Impact List</div>
      </div>
      <div className="flex justify-between">
        <NavLink to="/impact/addimpact">
          <button className="bg-[#16144b] text-white p-3 m-5 text-sm rounded-lg">
            Add New
          </button>
        </NavLink>
        <div className={`flex items-center`}>
          <input
            placeholder="Search "
            value={search}
            onChange={handleChange}
            type="text"
            name="search"
            className={`text-black border-[1px] rounded-lg bg-white p-2 m-5`}
          />
        </div>
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
      {impact.length !== 0 && (
        <div className="relative overflow-x-auto m-5 mb-0">
          <table className="w-full text-sm text-left rtl:text-right border-2 border-gray-300">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sr no.
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Obstacles
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Collectibles
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Heart health
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Kidney health
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Sugar level
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Weight
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Visual indicator
                </th>
                <th scope="col" className="px-6 py-3 border-2 border-gray-300">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {impact.map((item, index) => {
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
                    {(item?.obstacles).length!==0 ? item?.obstacles : "N/A"}
                    </th>

                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-2 border-gray-300"
                    >
                      {(item?.collectibles).length!==0 ? item?.collectibles : "N/A"}
                    </th>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.type}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.effects?.heartHealth}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.effects?.kidneyHealth}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.effects?.sugarLevel}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.effects?.weight}
                    </td>
                    <td className="px-6 py-4 border-2 border-gray-300">
                      {item?.visualIndicator}
                    </td>
                    <td className=" p-5   border-2  border-gray-300">
                      <div className="flex items-center">
                        <NavLink to={`/impact/editimpact/${item?._id}`}>
                          <CiEdit className="text-2xl cursor-pointer text-blue-900" />
                        </NavLink>
                        <MdDelete onClick={(e)=>{handleDelete(e, item._id)}} className="text-2xl cursor-pointer text-blue-900" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {noData && (
        <div className="text-center text-xl">
          Currently! There are no impacts in the storage.
        </div>
      )}
      {impact.length !== 0 && (
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
                impact.length < pageSize || startIndex + pageSize >= count
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

export default Impact;
