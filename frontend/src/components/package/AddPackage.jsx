import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddPackage = () => {
  const initialState = {
    file: null,
version:"" ,
description:"" ,
 };
  const navigate = useNavigate();
  const [data, setData] = useState(initialState);
  const [loader , setLoader] = useState(false);
  const handleFileChange = (e) => {
    setData({ ...data, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!data.file || !data.description) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    setLoader(true)
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("version",  data.version);
    formData.append("description",  data.description);


    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/insertUpdatePackage`,
        {
          method: "POST",
          body: formData,
        }
      );
      const response = await res.json();

      if (response.success) {
        toast.success("New Package is added Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/packages");
        }, 1500);
      } else {
        setLoader(false)
        toast.success("Package updated succesfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error uploading package:", error);
      toast.error(response.message , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  console.log(data);
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
        <div className="flex items-center">
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#16144b] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />
        </div>
        <div className="text-2xl font-bold mx-2 my-8 px-4">Add Package</div>
      </div>
      {loader ? (
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
      ) : (
        <>
          <div className="w-[70%] m-auto my-10">
            <form action="">
              <div className="">
                <label
                  htmlFor="version"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                Version
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="version"
                  value={data.version}
                  onChange={(e) => {
                    setData({ ...data, version: e.target.value });
                  }}
                  type="text"
                  id="version"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Version"
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                Description
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={(e) => {
                    setData({ ...data, description: e.target.value });
                  }}
                  type="text"
                  id="description"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="description"
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Package file
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="file"
                  onChange={handleFileChange}
                  type="file"
                  id="file"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  required
                />
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="text-white bg-[#16144b] hover:bg-[#16144bea] focus:ring-4 focus:outline-none focus:ring-blue-300 my-5 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                ADD
              </button>
            </form>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default AddPackage;
