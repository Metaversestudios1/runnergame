import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import "jquery-validation";
import { FaAngleDown } from "react-icons/fa6";

const AddObstacle = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const initialState = {
    name: "",
    type: "",
    damage: "",
    photo: null,
  };
  const [data, setData] = useState(initialState);

  const validateObstacleForm = () => {

    // Initialize jQuery validation
    $("#obstacleform").validate({
      rules: {
        name: {
          required: true,
        },
        type: {
          required: true,
        },
        damage: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "Please enter name",
        },
        type: {
          required: "Please enter type",
        },
        damage: {
          required: "Please enter damage",
        },
      },
      errorElement: "div",
      errorPlacement: function (error, element) {
        error.addClass("invalid-feedback");
        error.insertAfter(element);
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-invalid").removeClass("is-valid");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-invalid").addClass("is-valid");
      },
    });

    // Return validation status
    return $("#obstacleform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  console.log(data);
  const handleFileChange = (e) => {
    setData({ ...data, photo: e.target.files[0]});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateObstacleForm()) {
      //setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoader(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "photo" && data.photo) {
          formData.append("photo", data.photo); // Append file
        } else {
          formData.append(key, data[key]); // Append other fields
        }
      });
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/insertobstacles`,
        {
          method: "POST",
          body: formData,
        }
      );
      const response = await res.json();
      if (response.success) {
        toast.success("New Obstacle is added Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/obstacles");
        }, 1500);
      } else {
        setLoader(false);
        setError(response.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="flex items-center ">
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
          <IoIosArrowRoundBack
            onClick={handleGoBack}
            className="bg-[#16144b] text-white rounded-sm text-[40px] cursor-pointer shadow-xl ml-5"
          />
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold mx-2 my-8 px-4">
            Add Obstacle
          </div>
        </div>
      </div>
      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
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
        <div className="w-[70%] m-auto my-10">
          <form id="obstacleform">
            <div className="grid gap-6 mb-6 md:grid-cols-2 items-center">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Name<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  type="text"
                  id="name"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Type
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="type"
                  value={data.type}
                  onChange={handleChange}
                  type="text"
                  id="type"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="damage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Damage
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="damage"
                  value={data.damage}
                  onChange={handleChange}
                  type="number"
                  id="damage"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="photo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Photo<span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="photo"
                  onChange={handleFileChange}
                  type="file"
                  id="photo"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-900  text-[17px] mb-5">{error}</p>}
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white bg-[#16144b] hover:bg-[#16144bea] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              ADD
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddObstacle;

