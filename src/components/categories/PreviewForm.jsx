import React, { useState } from "react";

import { CardMedia, Box } from "@mui/material";

import Modal from "./GeneralModal";
import PreviewField from "./PreviewField";
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}
const PreviewForm = ({ isOpen, onClose, formFields, event }) => {
  console.log("form fields in previewForm", formFields);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // buttonText="Delete"
      bg="bg-red-500"
      title="Form Preview">
      <form className="overflow-y-auto max-h-[70vh] scrollbar-custom">
        <Box className="h-[200px] mt-5 px-2">
          <CardMedia
            component="img"
            image="/./profile.png"
            alt="Overlay"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {!event &&
          formFields?.map((field, index) => {
            switch (field.type) {
              case "upload-image":
                return (
                  <Box key={index} className="h-[200px] mt-5 px-2">
                    <CardMedia
                      component="img"
                      image={field?.src}
                      alt="Overlay"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                );
              case "headline":
                return (
                  <div key={index} className="font-bold">
                    <div className="text-black text-2xl font-bold p-2">
                      {field.textValue}
                    </div>
                  </div>
                );
              case "paragraph":
                return (
                  <div key={index}>
                    <div className="text-black text-sm font-normal mt-5 p-2">
                      {field.textValue?.replace(/<\/?[^>]+(>|$)/g, "")}
                    </div>
                  </div>
                );
              case "question":
                return (
                  <div key={index} className="mt-5 p-2">
                    <label className="text-black text-sm  font-medium">
                      {field.textValue}
                    </label>

                    {field?.answer ? (
                      <>
                        <br></br>
                        <span className="text-black text-sm">
                          {field.answer}
                        </span>
                      </>
                    ) : (
                      <textarea
                        defaultValue={"Answer"}
                        disabled
                        className="w-full border rounded p-2 my-2"
                      />
                    )}
                  </div>
                );
              case "checkbox":
                return (
                  <div key={index} className="mt-5 p-2">
                    <label className="text-black text-sm font-medium">
                      {field.textValue}
                    </label>
                    <div className="flex flex-col space-y-2">
                      {field?.optionValues?.split(",").map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={
                              field?.answer &&
                              field?.answer[option] &&
                              ["true", true].includes(field?.answer[option])
                            }
                          />
                          <label
                            key={index}
                            className="text-black text-sm font-small">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case "radio":
                return (
                  <div key={index} className="mt-5 p-2">
                    <label className="text-black text-sm font-medium">
                      {field.textValue}
                    </label>
                    <div className="flex flex-col space-y-2">
                      {field?.optionValues?.split(",").map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2">
                          <input
                            type="radio"
                            className="h-4 w-4"
                            checked={field?.answer && field?.answer == option}
                          />
                          <label
                            key={index}
                            className="text-black text-sm font-small">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case "date":
                return (
                  <div key={index} className="mt-5 p-2">
                    <label className="text-black text-sm font-medium capitalize">
                      {field.type}
                    </label>
                    <input
                      disabled
                      value={field?.answer ? field?.answer : "yyyy-mm-dd"}
                      className="w-full border rounded p-2 my-2"
                    />
                  </div>
                );
              case "e-sign":
                return (
                  <div
                    key={index}
                    className="p-2 mt-5 rounded-lg border border-gray-500">
                    <label className="text-black text-sm font-medium">
                      Form creator signature
                    </label>

                    <img
                      src={field?.src}
                      alt="Signature"
                      className="h-28 object-cover"
                    />
                  </div>
                );
              case "user-e-sign":
                return (
                  <div key={index} className="mt-5 p-2">
                    {field?.answer ? (
                      <div className="rounded-lg border border-gray-500 p-2">
                        <label className="text-black text-sm font-medium">
                          {field.textValue}
                        </label>
                        <img
                          src={`data:image/png;base64,${field?.answer}`}
                          alt="Signature"
                          className="h-28 w-full object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-black text-sm font-medium">
                          {field.textValue}
                        </label>
                        <input
                          type="text"
                          defaultValue="Signature"
                          disabled
                          className="w-full border rounded p-2 my-2"
                        />
                      </div>
                    )}
                  </div>
                );

              case "uploader":
                return (
                  <div key={index} className="mt-5 p-2">
                    {field?.answer ? (
                      <div className="rounded-lg border border-gray-500 p-2">
                        <label className="text-black text-sm font-medium">
                          {field.textValue}
                        </label>
                        <Box key={index} className="h-[200px] px-2">
                          <CardMedia
                            component="img"
                            image={field?.answer}
                            alt="Overlay"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      </div>
                    ) : (
                      <div>
                        <label className="text-black text-sm font-medium">
                          {field.textValue}
                        </label>
                        <input
                          type="file"
                          disabled
                          className="w-full border rounded p-2 my-2"
                        />
                      </div>
                    )}
                  </div>
                );
              default:
                return null;
            }
          })}

        {event ? (
          <>
            <div className="font-bold">
              <div className="text-black text-2xl font-bold p-2">
                Basic Information
              </div>
            </div>
            <div className="flex flex-col items-start justify-between px-1">
              <div className="flex justify-start">
                <div className="text-black text-[14px] font-medium px-1">
                  Date{" "}
                </div>
                <div className="text-black text-[14px] px-1">
                  {formFields?.basicInformation?.Date}{" "}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="text-black text-[14px] px-1 font-medium">
                  Time{" "}
                </div>
                <div className="text-black text-[14px] px-1">
                  {formFields?.basicInformation?.Time}{" "}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="text-black text-[14px] px-1 font-medium">
                  Location{" "}
                </div>
                <div className="text-black text-[14px] px-1">
                  {formFields?.basicInformation?.Location}{" "}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="text-black text-[14px] px-1">
                  Describe Location
                </div>
                <div className="text-black text-[14px] px-1 font-medium">
                  {formFields?.basicInformation["Location Description"]}
                </div>
              </div>
            </div>

            {/* <div className="text-black text-2xl font-bold p-2 mt-2">
              Additional Information
            </div>

            <PreviewField
              label="Did the event happen during the execution of a work TASK/ACTIVITY?"
              answer={
                formFields?.additionalInformation[
                  "Did the event happen during the execution of a work TASK/ACTIVITY?"
                ]
              }
            />
            <PreviewField
              label="Were immediate actions taken to mitigate further impacts of the
                event?"
              answer={
                formFields?.additionalInformation[
                  "Were immediate actions taken to mitigate further impacts of the event?"
                ]
              }
            />

            <div className="text-black text-2xl font-bold p-2 mt-2">Assets</div>
            <PreviewField
              label="Was there material damage?"
              answer={formFields?.assets["Was there material damage?"]}
            />
            <PreviewField
              label="Operational equipment or assets were directly involved in the event?"
              answer={
                formFields?.assets[
                  "Operational equipment or assets were directly involved in the event?"
                ]
              }
            />
            <PreviewField
              label="Are you a CPIA coordinator or a member of the CPIA registration group?"
              answer={
                formFields?.assets[
                  "Are you a CPIA coordinator or a member of the CPIA registration group? (Attention: if you are not answer NO)"
                ]
              }
            />

            <div className="text-black text-2xl font-bold p-2 mt-2">
              Environment
            </div>
            <PreviewField
              label="Did the event impact the environment (soil, surface water, air, biodiversity)?"
              answer={
                formFields?.environment[
                  "Did the event impact the environment(soil, surface water, air, biodiversity)?"
                ]
              }
            />
            <PreviewField
              label="Does this event have POTENTIAL to impact the environment (soil, surface water, air, biodiversity)?"
              answer={
                formFields?.environment[
                  "Does this event have POTENTIAL to impact the environment(soil, surface water, air, biodiversity)?"
                ]
              }
            />

            <div className="text-black text-2xl font-bold p-2 mt-2">
              Community
            </div>

            <PreviewField
              label="Was there injury to a community member(not a Al-Muhiba employee / contractor / subcontractor)?"
              answer={
                formFields?.community[
                  "Was there injury to a community member(not a Al-Muhiba employee / contractor / subcontractor)?"
                ]
              }
            />
            <PreviewField
              label="COULD this event have led to a fatality of a community member?"
              answer={
                formFields?.community[
                  "COULD this event have led to a fatality of a community member?"
                ]
              }
            />

            <div className="text-black text-2xl font-bold p-2 mt-2">People</div>

            <PreviewField
              label="COULD this event have injured or lead to health impacts to a Al-Muhiba employee or contractor?"
              answer={
                formFields?.people[
                  "COULD this event have injured or lead to health impacts to a Al-Muhiba employee or contractor?"
                ]
              }
            />
            <PreviewField
              label="Was a Al-Muhiba employee or contractor injured?"
              answer={
                formFields?.people[
                  "Was a Al-Muhiba employee or contractor injured?"
                ]
              }
            />
            <PreviewField
              label="COULD this event have led to a fatality or a life change?"
              answer={
                formFields?.people[
                  "COULD this event have led to a fatality or a life change?"
                ]
              }
            /> */}
            {[
              "additionalInformation",
              "assets",
              "environment",
              "community",
              "people",
            ].map((section) => (
              <div key={section}>
                <div className="text-black capitalize text-2xl font-bold p-2 mt-2">
                  {section.replace(/([A-Z])/g, " $1")}
                </div>
                {formFields?.[section] ? (
                  Object.entries(formFields[section]).map(([label, answer]) => (
                    <PreviewField
                      key={label}
                      label={label}
                      answer={answer || "N/A"}
                    />
                  ))
                ) : (
                  <div className="text-gray-500">
                    No data available for {section}
                  </div>
                )}
              </div>
            ))}

            <div className="text-black text-2xl font-bold p-2 mt-2">
              Event Description
            </div>
            <div className="w-full border rounded p-2 my-2 bg-gray-100 text-black text-sm">
              {formFields?.eventDescription}
            </div>
            {formFields?.eventImages ? (
              <>
                <div className="text-black text-2xl font-bold p-2 mt-2">
                  Event Images
                </div>
                <div className="w-full border rounded p-2 my-2 bg-gray-100 text-black text-sm">
                  {formFields?.eventImages &&
                    Object.values(formFields.eventImages).map(
                      (filename, index) => (
                        <div key={index} className="w-1/4">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${filename}`} // Replace 'your-image-base-url' with the actual URL prefix for your images.
                            alt={`Event Image ${index + 1}`}
                            className="w-full h-auto rounded border"
                          />
                        </div>
                      )
                    )}
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </form>
    </Modal>
  );
};

export default PreviewForm;
