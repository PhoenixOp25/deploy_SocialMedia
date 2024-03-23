import React from 'react';
import { RiCloseLine } from "react-icons/ri";
import "../css/Modal.css";
import { useNavigate } from 'react-router-dom';
function Modal({setModalOpen}) {
    const navigate=useNavigate();
  return (

    <div className='darkBg' onClick={()=>setModalOpen(false)}>
<div className='centered'>
        <div className='modal'>
            {/* Modal header */}
            <div className='modalHeader'>
                <h5 className='heading'>Confirm</h5>
                <button className='closeBtn' onClick={()=>setModalOpen(false)}>
                    <RiCloseLine />
                </button>
            </div>
            {/* Modal content */}
            <div className='modalContent'>
                Are you really want to exit?
            </div>
            {/* Modal actions */}
            <div className='modalActions'>
                <div className='actionsContainer'>
                    <button className='logOutBtn' onClick={()=>{
                        setModalOpen(false);
                        localStorage.clear();
                        navigate("./signup")
                    }}>Log Out</button>
                    <button className='cancelBtn' onClick={()=>setModalOpen(false)}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
    </div>

    
  );
}

export default Modal;
