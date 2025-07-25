import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/Toastmessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/image/add-notes.svg";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [toastData, setToastData] = useState({
    isShown: false,
    message: "",
    type: "",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, SetIsSearch] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (NoteDetail) => {
    setOpenAddEditModel({ isShown: true, data: NoteDetail, type: "edit" });
  };

  const setShowToastMsg = (message, type) => {
    setToastData({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setToastData({
      isShown: false,
      message: "",
      type: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data?.notes) {
        setAllNotes(response.data.notes);
      }
    } catch {
      console.log("An unexpected error occurred.");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        setShowToastMsg("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch {
      console.log("An unexpected error occurred.");
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data?.notes) {
        SetIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        { isPinned: !noteData.isPinned }
      );
      if (response.data?.note) {
        setShowToastMsg("Note Updated Successfully", "update");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    SetIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        showSearch={true}
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={AddNotesImg}
            message="Start creating your first note! Click the Add button to jot down your thoughts, ideas, and reminders. Let's get started!"
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
onClick={() =>
          setOpenAddEditModel({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModel({ isShown: false, type: "", data: null })
        }
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        className="w-[40%] max-h-[75vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModel({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToastMessage={setShowToastMsg}
        />
      </Modal>

      <Toast
        isShown={toastData.isShown}
        message={toastData.message}
        type={toastData.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
