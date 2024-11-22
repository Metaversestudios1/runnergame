import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaAngleDown } from "react-icons/fa6";
import $ from "jquery-validation";
const EditImpact = () => {
  const [loader, setLoader] = useState(false);
  const [dropdownCollectiblesOpen, setDropdownCollectiblesOpen] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState("Obstacle"); // Default selection
  const [dropdownObstaclesOpen, setDropdownObstaclesOpen] = useState(false);
  const [collectibles, setCollectibles] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const dropdownCollectiblesRef = useRef(null);
  const dropdownObstaclesRef = useRef(null);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const initialState = {
    obstacles: [],
    collectibles: [],
    type: "",
    effects: {
      heartHealth: "",
      kidneyHealth: "",
      sugarLevel: "",
      weight: "",
    },
    visualIndicator: "",
  };

  const [data, setData] = useState(initialState);
  console.log(selectedOption);
  useEffect(() => {
    if (selectedOption === "Obstacle") {
      fetchObstacleData();
    } else if (selectedOption === "Collectible") {
      fetchCollectibleData();
    }
  }, [selectedOption]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/getSingleimpact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );

    const response = await res.json();
    if (response.success) {
      setData(response.result);
      if (response.result.obstacles.length!==0) {
        setSelectedOption("Obstacle");
      } else if (response.result.collectibles.length!==0) {
        setSelectedOption("Collectible");
      }
    }
  };
  console.log(selectedOption)
  const fetchCollectibleData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/getAllCollectible`
    );
    const response = await res.json();
    if (response.success) {
      setCollectibles(response.result);
    }
  };

  const fetchObstacleData = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/getAllobstacles`
    );
    const response = await res.json();
    if (response.success) {
      setObstacles(response.result);
    }
  };
  const validateimpactform = () => {
    // Initialize jQuery validation
    $("#impactform").validate({
      rules: {
        obstacles: {
          required: true,
        },
        collectibles: {
          required: true,
        },
        type: {
          required: true,
        },
        effects: {
          required: true,
        },
        visualIndicator: {
          required: true,
        },
      },
      messages: {
        obstacles: {
          required: "Select obstacles",
        },
        collectibles: {
          required: "Select collectibles",
        },
        type: {
          required: "Please enter type",
        },
        effects: {
          required: "Please enter the values",
        },
        visualIndicator: {
          required: "Select visual indicator",
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
    return $("#impactform").valid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("effects")) {
      const [effectKey, effectName] = name.split(".");

      setData((prevState) => ({
        ...prevState,
        effects: {
          ...prevState.effects,
          [effectName]: value,
        },
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateimpactform()) {
      return;
    }

    try {
      setLoader(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/updateimpact`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, data }),
        }
      );

      const response = await res.json();
      console.log(response);
      if (response.success) {
        toast.success("Impact is updated Successfully!", {
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
          navigate("/impact");
        }, 1500);
      } else {
        setLoader(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };
  console.log(data);
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
          <div className="text-2xl font-bold mx-2 my-8 px-4">Edit impact</div>
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
          <form id="impactform">
            <div className="grid grid-cols-2 gap-6 mb-6 items-center">
              <div>
                <label>
                  <input
                    type="radio"
                    value="Collectible"
                    checked={selectedOption === "Collectible"}
                    onChange={handleRadioChange}
                  />
                  Collectible
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Obstacle"
                    checked={selectedOption === "Obstacle"}
                    onChange={handleRadioChange}
                  />
                  Obstacle
                </label>
              </div>

              <div>
                <label
                  htmlFor="collectibles"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Collectibles
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setDropdownCollectiblesOpen(!dropdownCollectiblesOpen)
                    }
                    disabled={selectedOption === "Obstacle"}
                    onBlur={(e) => handleDropdownBlur(e, "collectibles")}
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black w-full p-2.5 flex justify-between items-center"
                  >
                    Select Collectibles
                    <FaAngleDown className="text-end" />
                  </button>
                  {dropdownCollectiblesOpen && (
                    <div
                      ref={dropdownCollectiblesRef}
                      className="absolute top-full left-0 bg-white border border-gray-300 rounded-sm shadow-lg w-full"
                    >
                      {collectibles.map((item) => (
                        <div
                          key={item._id}
                          className="p-2 bg-gray-200 text-gray-900 text-sm focus:ring-blue-500 focus:border-black block w-full"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <input
                            type="checkbox"
                            id={`collectible-${item._id}`}
                            value={item._id}
                            checked={data.collectibles.includes(item._id)}
                            onChange={() =>
                              handleCheckboxChange(item._id, "collectibles")
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`collectible-${item._id}`}
                            className="text-gray-900 text-sm"
                          >
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="obstacles"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Obstacles
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setDropdownObstaclesOpen(!dropdownObstaclesOpen)
                    }
                    disabled={selectedOption === "Collectible"}
                    onBlur={(e) => handleDropdownBlur(e, "obstacles")}
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black w-full p-2.5 flex justify-between items-center"
                  >
                    Select Obstacles
                    <FaAngleDown className="text-end" />
                  </button>
                  {dropdownObstaclesOpen && (
                    <div
                      ref={dropdownObstaclesRef}
                      className="absolute top-full left-0 bg-white border border-gray-300 rounded-sm shadow-lg w-full"
                    >
                      {obstacles.map((item) => (
                        <div
                          key={item._id}
                          className="p-2 bg-gray-200 text-gray-900 text-sm focus:ring-blue-500 focus:border-black block w-full"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <input
                            type="checkbox"
                            id={`obstacle-${item._id}`}
                            value={item._id}
                            checked={data.obstacles.includes(item._id)}
                            onChange={() =>
                              handleCheckboxChange(item._id, "obstacles")
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`obstacle-${item._id}`}
                            className="text-gray-900 text-sm"
                          >
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Type
                </label>
                <input
                  name="type"
                  value={data.type}
                  onChange={handleChange}
                  type="text"
                  id="type"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Type"
                  required
                />
              </div>
              <div className="">
                <label
                  htmlFor="visualIndicator"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Visual Indicator
                </label>
                <select
                  name="visualIndicator"
                  value={data.visualIndicator}
                  onChange={handleChange}
                  className="bg-gray-200 border text-gray-900 text-sm rounded-lg p-2.5 w-full"
                >
                  <option value="">Select a visual Indicator.</option>

                  <option value="Red">Red</option>
                  <option value="Green">Green</option>
                </select>
              </div>
              {/* Starting Stats */}
            </div>
            <h2 className="font-bold my-2">Effects:</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="effects.heartHealth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Heart Health
                </label>
                <input
                  name="effects.heartHealth"
                  value={data.effects.heartHealth}
                  onChange={handleChange}
                  type="number"
                  id="effects.initial_heart_rate"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Heart health"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="effects.kidneyHealth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Kidney Health
                </label>
                <input
                  name="effects.kidneyHealth"
                  value={data.effects.kidneyHealth}
                  onChange={handleChange}
                  type="number"
                  id="effects.kidneyHealth"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Kidney health"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="effects.sugarLevel"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Sugar Level
                </label>
                <input
                  name="effects.sugarLevel"
                  value={data.effects.sugarLevel}
                  onChange={handleChange}
                  type="text"
                  id="effects.sugarLevel"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="Sugar level"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="effects.weight"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Weight
                </label>
                <input
                  name="effects.weight"
                  value={data.effects.weight}
                  onChange={handleChange}
                  type="number"
                  id="effects.weight"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-black block w-full p-2.5"
                  placeholder="weight"
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
          </form>
        </div>
      )}
    </>
  );
};

export default EditImpact;
