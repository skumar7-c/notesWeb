import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData = {}, type = "add", getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState("");
/*
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data?.note) {
        showToastMessage("Note Added Successfully", "add");
        getAllNotes();
        onClose();
      } else {
        throw new Error("Note not returned from API");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add note");
    }
  };
*/
const addNewNote = async () => {
  try {
    const response = await axiosInstance.post("/add-note", {
      title,
      content,
      tags,
    });

    console.log("Add Note Response:", response.data);  // Add this

    if (response.data?.note) {
      showToastMessage("Note Added Successfully", "add");
      getAllNotes();
      onClose();
    } else {
      throw new Error("Note not returned from API");
    }
  } catch (err) {
    setError(err?.response?.data?.message || "Failed to add note");
  }
};

  const editNote = async () => {
    const noteId = noteData._id;
    if (!noteId) return setError("Note ID missing for edit");

    try {
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });

      if (response.data?.note) {
        showToastMessage("Note Updated Successfully", "update");
        getAllNotes();
        onClose();
      } else {
        throw new Error("Note not returned from API");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update note");
    }
  };

  const handleAddNote = () => {
    if (!title.trim()) return setError("Please enter the title");
    if (!content.trim()) return setError("Please enter the content");

    setError("");
    type === "edit" ? editNote() : addNewNote();
  };

  return (
    <div className="relative p-4 bg-white rounded shadow-md">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="What's on your mind today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded"
          placeholder="Content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-sm pt-4">{error}</p>}

      <button
              //className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"

        className="bg-blue-600 text-white px-5 py-3 mt-5 rounded hover:bg-blue-700 transition"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
