import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "../../pages/Home/AddEditNotes"; // ✅ Correct import path
import Modal from "react-modal";

// Fix: move setAppElement inside useEffect
const Home = () => {
  const [openAddEditModal, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  return (
    <>
      <button
        //className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
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
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Add/Edit Note Modal"
        className="w-[40%] max-h-[75vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModel({ isShown: false, type: "add", data: null })
          }
          getAllNotes={() => {}}
          showToastMsg={() => {}} // Fix: was an object before
        />
      </Modal>
    </>
  );
};

export default Home;  