import React from "react";

export const Modal = props => {
  return (
    <div className="modal-wrapper">
      <div className="modal-backdrop"> </div>
      <div className="modal-box"> {props.children} </div>
    </div>
  );
};
