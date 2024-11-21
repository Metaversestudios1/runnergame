import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaAngleDown } from "react-icons/fa6";
import $ from "jquery-validation";
const EditLevel = () => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [collectibles, setCollectibles] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [dropdownCollectiblesOpen, setDropdownCollectiblesOpen] =
    useState(false);
  const [dropdownObstaclesOpen, setDropdownObstaclesOpen] = useState(false);

  const dropdownCollectiblesRef = useRef(null);
  const dropdownObstaclesRef = useRef(null);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const initialState = {
    level_number: "",
    starting_stats: { initial_heart_rate: "", initial_kidney_rate: "", initial_weight: "" , initial_sugar_level:""},

  };

  const [data, setData] = useState(initialState);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/getSingleinitiallevel`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );

    const response = await res.json();
    if (response.success) {
      setData((prevData) => ({
        ...prevData,
        level_number: response.result?.level_number,
        starting_stats: {
          initial_heart_rate: response.result?.starting_stats?.initial_heart_rate,
          initial_kidney_rate: response.result?.starting_stats?.initial_kidney_rate,
          initial_weight: response.result?.starting_stats?.initial_weight,
          initial_sugar_level: response.result?.starting_stats?.initial_sugar_level,
        },
      }));
    }
  };

  const validatelevelform = () => {
    // Initialize jQuery validation
    $("#levelform").validate({
      rules: {
        level_number: {
          required: true,
        },
        starting_stats: {
          required: true,
        },
      },
      messages: {
        level_number: {
          required: "Please enter level number",
        },
        starting_stats: {
          required: "Please enter starting stats",
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
    return $("#levelform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update nested state for starting_stats fields
    if (name.includes("starting_stats")) {
      const [statKey, statName] = name.split(".");
      setData((prevState) => ({
        ...prevState,
        starting_stats: {
          ...prevState.starting_stats,
          [statName]: value,
        },
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatelevelform()) {
      return;
    }

    try {
      setLoader(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/updateinitiallevel`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, data }),
        }
      );

      const response = await res.json();
      if (response.success) {
        toast.success("Setting is updated Successfully!", {
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
          navigate("/initialsetting");
        }, 1500);
      } else {
        setLoader(false);
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCheckboxChange = (id, field) => {
    setData((prevState) => {
      const updatedField = prevState[field];

      if (updatedField.includes(id)) {
        return {
          ...prevState,
          [field]: updatedField.filter((item) => item !== id),
        };
      } else {
        return {
          ...prevState,
          [field]: [...updatedField, id],
        };
      }
    });
  };

  const handleDropdownBlur = (event, field) => {
    const dropdownRef =
      field === "collectibles" ? dropdownCollectiblesRef : dropdownObstaclesRef;
    if (!dropdownRef.current.contains(event.relatedTarget)) {
      field === "collectibles"
        ? setDropdownCollectiblesOpen(false)
        : setDropdownObstaclesOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit Initial setting</div>
        </div>
      </div>

      {loader ? (
        <div className="absolute w-[80%] h-[40%] flex justify-center items-center">
          <div
            className=" flex justify-center h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="w-[70%] m-auto my-10">
          <form id="levelform">
            <div className="grid gap-6 mb-6 items-center">
              <div>
                <label
                  htmlFor="level_number"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Level number
                  <span className="text-red-900 text-lg ">&#x2a;</span>
                </label>
                <input
                  name="level_number"
                  value={data.level_number}
                  onChange={handleChange}
                  type="number"
                  id="level_number"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5 "
                  placeholder="Level number"
                  required
                />
              </div>

              {/* Collectibles Dropdown */}
            

              {/* Starting Stats */}
              <h2 className="font-bold ">Starting stats:</h2>
              <div className="grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="starting_stats.initial_heart_rate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                 Initial Heart Rate
                </label>
                <input
                  name="starting_stats.initial_heart_rate"
                  value={data.starting_stats.initial_heart_rate}
                  onChange={handleChange}
                  type="number"
                  id="starting_stats.initial_heart_rate"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Heart rate"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="starting_stats.initial_kidney_rate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Initial Kidney Rate
                </label>
                <input
                  name="starting_stats.initial_kidney_rate"
                  value={data.starting_stats.initial_kidney_rate}
                  onChange={handleChange}
                  type="number"
                  id="starting_stats.initial_kidney_rate"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Kidney rate"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="starting_stats.initial_sugar_level"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                Initial Sugar level
                </label>
                <input
                  name="starting_stats.initial_sugar_level"
                  value={data.starting_stats.initial_sugar_level}
                  onChange={handleChange}
                  type="text"
                  id="starting_stats.initial_sugar_level"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Sugar level"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="starting_stats.initial_weight"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Initial initial_weight
                </label>
                <input
                  name="starting_stats.initial_weight"
                  value={data.starting_stats.initial_weight}
                  onChange={handleChange}
                  type="number"
                  id="starting_stats.initial_weight"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="initial_weight"
                  required
                />
              </div>
              </div>
              <div className="mt-6 flex justify-start">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 text-white bg-blue-600 rounded-md"
                >
                  UPDATE
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditLevel;
