/* import next */
import React, { useState, useEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
/* import third party */
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import { IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import axios from "axios";
/* import components */
import Animation from "@/components/animations/Animation";

import logo from "../../../public/pollo.json";
import { StepButton } from "@mui/material";
import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const Index = () => {
    const [theme, setTheme] = useState("bg-gradient-custom");
    const [step, setStep] = useState(0);
    const [avatar, setAvatar] = useState();
    const [companyLogo, setLogo] = useState("");
    const [fileUploading, setFileUploading] = useState(false);
    const router = useRouter();

    const handleImageUpload = async (file) => {
        setFileUploading(true);
        setLogo("");
        const formData = new FormData();
        formData.append("file", file);
        const { accessToken } = JSON.parse(
            localStorage.getItem("loggedInUser")
        );
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("response", response);
            setLogo(response?.data?.fileName);
        } catch (err) {
            setAvatar(null);
            console.log("Error while uploading file", err);
        } finally {
            setFileUploading(false);
        }
    };
    const uploadLogo = async () => {
        try {
            console.log(companyLogo);
            const response = await apiClient.put("/users/company", {
                companyLogo: companyLogo,
            });
            console.log("res", response);
            if (response) {
                toast.success("Logo uploaded successfully");
                // handleNext();
            }
        } catch (err) {
            setLogo("");
            setAvatar(null);
            toast.error("Error in uploading Logo");
        }
    };
    useEffect(() => {
        if (companyLogo && companyLogo !== "") {
            uploadLogo();
        }
    }, [companyLogo]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    useEffect(() => {
        // Check if stepSize is in the query parameters
        if (router.query.stepSize) {
            setStep(Number(router.query.stepSize));
        }
    }, [router.query.stepSize]);

    const handleSkip = () => {
        router.push("/dashboard");
    };
    const handleNext = () => {
        if (step === 5) {
            router.push("/dashboard");
        } else {
            setStep((step) => step + 1);
        }
    };

    const handleTryNow = () => {
        let nextStepSize = step + 1;
        console.log("step", step);

        switch (step) {
            case 1:
                router.push(`/import?stepSize=${step}`);
                break;
            case 2:
                router.push(`/sites?stepSize=${step}`);
                break;
            case 3:
                router.push(`/category?stepSize=${step}`);
                break;
            default:
                // Handle any other step or default behavior if needed
                break;
        }
    };

    return (
        <div className="flex relative flex-col lg:flex-row items-center justify-center min-h-screen">
            <Head>
                <title>Setup</title>
                <meta
                    name="description"
                    content="A simple custom form builder"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box
                sx={{
                    position: "relative",
                    // width: "25%",
                    minHeight: "100vh",
                }}
                className={`${theme} w-[100%] lg:w-[25%]`}
            >
                <div className="flex items-center justify-center mt-20 mb-10 h-1">
                    <Animation path={logo} />
                </div>

                <CardMedia
                    component="img"
                    image="/./profile.png"
                    alt="Overlay"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0.34,
                        objectFit: "cover",
                    }}
                />
            </Box>

            <div className="relative py-8 flex items-center justify-center  w-[90%]  lg:w-[75%] lg:min-h-screen lg:max-h-[100vh] lg:overflow-y-auto bg-none lg:bg-[#edf5fa]">
                <div
                    className={`container mx-auto ${
                        step === 0 ? "mt-0" : "mt-40"
                    } p-6 text-center w-[90%] bg-white rounded-lg shadow-lg`}
                >
                    {/* Heading */}
                    <div className="flex justify-start">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                            Getting Started
                        </h1>
                    </div>
                    {/* Image */}
                    {step === 0 ? (
                        <div className="flex flex-col justify-start items-center space-x-4 w-full m-2">
                            <label
                                htmlFor="logo"
                                className={`block font-semibold lg:text-gray-700`}
                            >
                                Your logo is the face of your company. Upload a
                                clear, high-quality logo to showcase your
                                brand&apos;s identity and make your business
                                stand out to customers. A great logo builds
                                trust and sets the tone for your brand.
                                Let&rsquo;s make it memorable!
                            </label>

                            <div className="relative flex justify-start items-center space-x-4">
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt="Avatar"
                                        className={`w-32 h-24 object-contain rounded-3xl`}
                                    />
                                ) : (
                                    <div
                                        className={`w-32 h-24 rounded-3xl  bg-gray-200  flex items-center justify-center`}
                                    >
                                        <span className="text-gray-500">
                                            Upload Image
                                        </span>
                                    </div>
                                )}
                                <input
                                    accept="image/*"
                                    id="avatar-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                <label htmlFor="avatar-upload">
                                    <IconButton
                                        color="primary"
                                        aria-label="upload picture"
                                        component="span"
                                        className="absolute -bottom-2 -right-2"
                                    >
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                            </div>
                        </div>
                    ) : null}
                    {step === 1 ? (
                        <div className="flex justify-center w-full m-2">
                            <CardMedia
                                component="img"
                                image="/./imports.png"
                                alt="Overlay"
                                width={900}
                                height={100}
                                sx={{
                                    width: "700px",
                                    height: "500px",
                                }}
                                className="shadow"
                            />
                        </div>
                    ) : null}
                    {step === 2 ? (
                        <div className="flex justify-center w-full m-2">
                            <CardMedia
                                component="img"
                                image="/./Sites.png"
                                alt="Overlay"
                                sx={{
                                    width: "700px",
                                    height: "370px",
                                }}
                                className="object-contain shadow"
                            />
                        </div>
                    ) : null}
                    {step === 3 ? (
                        <div className="flex justify-center w-full m-2">
                            <CardMedia
                                component="img"
                                image="/./category.png"
                                alt="Overlay"
                                sx={{
                                    width: "700px",
                                    height: "370px",
                                }}
                                className="object-contain shadow"
                            />
                        </div>
                    ) : null}
                    {step === 4 ? (
                        <div className="flex justify-center w-full m-2">
                            <CardMedia
                                component="img"
                                image="/./inspection.png"
                                alt="Overlay"
                                sx={{
                                    width: "600px",
                                    height: "500px",
                                }}
                                className="object-contain shadow"
                            />
                        </div>
                    ) : null}{" "}
                    {step === 5 ? (
                        <div className="flex justify-center w-full m-2">
                            <CardMedia
                                component="img"
                                image="/./events.png"
                                alt="Overlay"
                                sx={{
                                    width: "400px",
                                    height: "400px",
                                }}
                                className="object-contain shadow"
                            />
                        </div>
                    ) : null}
                    {/* Buttons */}
                    <div className="flex gap-4 justify-center space-x-2 pt-5">
                        {step < 5 ? (
                            <button
                                onClick={() => handleSkip()}
                                className=" px-6 py-2 text-gray-900 bg-gray-200 border border-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Skip Setup
                            </button>
                        ) : null}
                        {step < 4 ? (
                            <button
                                onClick={() => handleTryNow()}
                                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                            >
                                Try Now
                            </button>
                        ) : null}
                        <button
                            onClick={() => handleNext()}
                            className="px-6 py-2 text-blue-600 bg-white border border-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                            {step === 5 ? "Finish" : "Next Step"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
