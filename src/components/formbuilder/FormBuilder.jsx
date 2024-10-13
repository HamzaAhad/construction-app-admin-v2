import React, { useState, useEffect, act } from "react";
import { useRouter } from "next/router";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

import FormPreview from "./FormPreview";
import DynamicModal from "./DynamicModal";
import SelectFields from "./SelectFields";
import AddFormComponent from "../categories/AddFormComponent";
import {
  FaHeading,
  FaParagraph,
  FaCheckSquare,
  FaRegDotCircle,
  FaSignature,
  FaQuestion,
  FaImage,
  FaUpload,
  FaPen,
  FaCalendarAlt,
} from "react-icons/fa";

const fieldOptions = [
  {
    type: "headline",
    label: "Headline",
    icon: <FaHeading className="text-2xl" />,
  },
  {
    type: "paragraph",
    label: "Paragraph",
    icon: <FaParagraph className="text-2xl" />,
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <FaCheckSquare className="text-2xl" />,
  },
  {
    type: "radio",
    label: "Radio button",
    icon: <FaRegDotCircle className="text-2xl" />,
  },
  {
    type: "e-sign",
    label: "E-signature",
    icon: <FaSignature className="text-2xl" />,
  },
  {
    type: "question",
    label: "Question",
    icon: <FaQuestion className="text-2xl" />,
  },
  {
    type: "upload-image",
    label: "Upload Image",
    icon: <FaImage className="text-2xl" />,
  },
  {
    type: "uploader",
    label: "Uploader",
    icon: <FaUpload className="text-2xl" />,
  },
  {
    type: "user-e-sign",
    label: "User E-signature",
    icon: <FaPen className="text-2xl" />,
  },
  { type: "date", label: "Date", icon: <FaCalendarAlt className="text-2xl" /> },
];

const FormBuilder = ({ canEdit = true }) => {
  const router = useRouter();
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryId, id } = router.query;
  const [formFields, setFormFields] = useState([]);
  const [jsonFormFields, setJsonFormFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [componentFields, setComponentFields] = useState([]);
  const [activeTab, setActiveTab] = useState("default"); // Default active tab is "custom"

  const [addNameModal, setAddNameModal] = useState(false);
  const [recordId, setRecordId] = useState();
  const [name, setName] = useState("");
  const [formData, setFormData] = useState({
    formName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addField = (field, json) => {
    setFormFields([...formFields, { ...field, id: Date.now() }]);
    setJsonFormFields([...jsonFormFields, { ...json, id: Date.now() }]);
    setIsModalOpen(false);
  };
  const insertComponent = (field, json) => {
    setFormFields([...formFields, { ...field }]);
    setJsonFormFields([...jsonFormFields, { ...json }]);
  };
  const addComponent = (id) => {
    setRecordId(id);
    setAddNameModal(true);
  };

  const handleNameSubmit = async () => {
    const content = formFields.find((field, index) => index === recordId);
    const jsonContent = jsonFormFields.find(
      (field, index) => index === recordId
    );
    const body = { content: content, jsonContent: jsonContent, name: name };
    if (!name || name === "" || name.length < 5) {
      toast.error("Name field is required");
      setAddNameModal(false);
    } else {
      try {
        setLoading(true);
        const response = await apiClient.post("/components", body);
        if (response) {
          setName("");
          toast.success("Component save successfully");
        }
        fetchComponent();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setAddNameModal(false);
        setLoading(false);
      }
    }
  };
  const moveField = (fromIndex, toIndex) => {
    console.log(fromIndex, toIndex);
    const updatedFields = [...formFields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    setFormFields(updatedFields);
    const updatedJsonFields = [...jsonFormFields];
    const [movedJsonField] = updatedJsonFields.splice(fromIndex, 1);
    updatedJsonFields.splice(toIndex, 0, movedJsonField);
    setJsonFormFields(updatedJsonFields);
  };

  const removeField = (index) => {
    console.log(index);
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
    console.log(updatedFields);
    const updatedJsonFields = jsonFormFields.filter((_, i) => i !== index);
    setJsonFormFields(updatedJsonFields);
    console.log(updatedJsonFields);
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleClear = () => {
    setFormFields([]);
    setJsonFormFields([]);
  };

  const fetchComponent = async () => {
    try {
      const components = await apiClient.get("/components");
      const updatedComponents = components.data.map((component) => {
        const contentType = component.content.type; // Assuming content has a 'type' field
        const matchingFieldOption = fieldOptions.find(
          (option) => option.type === contentType
        );

        return {
          ...component,
          icon: matchingFieldOption ? matchingFieldOption.icon : null, // Add icon or null if not found
        };
      });

      setComponentFields(updatedComponents);
    } catch (err) {
      setError(err);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/forms/${id}`);

      const content = response?.data?.content
        ? JSON.parse(response?.data?.content)
        : [];

      const jsonContent = response?.data?.jsonContent
        ? JSON.parse(response?.data?.jsonContent)
        : [];
      setFormFields(content); // Set the fetched data into the state
      setJsonFormFields(jsonContent);
    } catch (err) {
      setError(err); // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Call the fetch function
    fetchComponent();
  }, []);

  const handleSave = async () => {
    try {
      const response = await apiClient.put(`/forms/${id}`, {
        content: JSON.stringify(formFields),
        jsonContent: JSON.stringify(jsonFormFields),
      });
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
      console.log("Server error:", err?.response?.data);
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    }
    console.log("Form Fields:", formFields, jsonFormFields);
  };

  return (
    <div className="flex lg:p-4 gap-4 relative w-[100%]">
      {isModalOpen && (
        <DynamicModal closeModal={closeModal}>{modalContent}</DynamicModal>
      )}
      {canEdit && (
        <div className="absolute top-6 right-1 lg:right-8 flex gap-2">
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors">
            Clear
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors">
            Save
          </button>
        </div>
      )}
      <div className="flex flex-col justify-center items-start lg:space-x-2 w-full lg:flex-row">
        <DndProvider backend={HTML5Backend}>
          <SelectFields
            openModal={openModal}
            addField={addField}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            componentFields={componentFields}
            insertComponent={insertComponent}
            fieldOptions={fieldOptions}
          />

          <FormPreview
            addField={addField}
            openModal={openModal}
            formFields={formFields}
            removeField={removeField}
            moveField={moveField}
            addComponent={addComponent}
          />
        </DndProvider>
      </div>
      <AddFormComponent
        isOpen={addNameModal}
        onClose={() => setAddNameModal(false)}
        name={name}
        setName={setName}
        onSubmit={handleNameSubmit}
        loading={loading}
      />
    </div>
  );
};

export default FormBuilder;
