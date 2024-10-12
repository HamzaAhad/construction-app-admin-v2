import React, { useState, useEffect } from "react";

import { CardMedia, Box, CircularProgress, Typography } from "@mui/material";

import Modal from "@/components/categories/GeneralModal";

import apiClient from "@/helpers/interceptor";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ViewModal = ({ isOpen, onClose, recordId }) => {
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [actions, setActions] = useState([]);
  const router = useRouter();
  const currentRoute = router.route;
  const trimmedRoute = currentRoute.replace(/^\//, "");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/${trimmedRoute}/${recordId}`);
      const jsonData = JSON.parse(JSON.stringify(response?.data));

      if (["issues", "events"].includes(trimmedRoute)) {
        setActions(jsonData?.actions || []);
      } else if (trimmedRoute == "tickets") {
        setImages(jsonData?.images);
        setDescription(jsonData?.description);
      }
      // Set the fetched data into the state
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [recordId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // buttonText="Delete"

      bg="bg-red-500"
      title="Preview Close Action">
      <form className="overflow-y-auto max-h-[70vh] scrollbar-custom">
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}>
            <CircularProgress size={80} thickness={4.5} />
            <Typography
              variant="h6"
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}>
              Fetching {trimmedRoute}
            </Typography>
          </div>
        ) : (
          <>
            {trimmedRoute === "tickets" ? (
              <>
                <Box className="h-[20px] mt-5 px-2">
                  <h1 className="text-black font-bold">Action Image : </h1>
                </Box>

                {images?.map((image, index) => (
                  <Box className="h-[200px] mt-5 px-2" key={index}>
                    <CardMedia
                      component="img"
                      image={decodeURI(
                        `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image}`
                      )}
                      alt={`Overlay ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
                <Box className="h-[50px] mt-5 px-2">
                  <h1 className="text-black font-bold">
                    Action Description :{" "}
                  </h1>
                  <label className="text-black text-sm font-medium">
                    {description}
                  </label>
                </Box>
              </>
            ) : (
              actions.map((action, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <h1 className="text-black text-2xl font-bold p-2 mt-2">
                    Action {index + 1}
                  </h1>
                  <p className="text-black p-2 font-bold">
                    Description{" "}
                    <span className="text-gray-800 font-normal">
                      {action.description}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {action.images &&
                      action.images.length > 0 &&
                      action?.images?.map((img, i) => (
                        <img
                          key={i}
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                          alt={`Action ${index + 1} Image ${i + 1}`}
                          className="w-[90%] object-cover rounded mx-auto"
                        />
                      ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </form>
    </Modal>
  );
};

export default ViewModal;
