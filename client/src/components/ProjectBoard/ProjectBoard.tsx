import React from 'react';

import "./ProjectBoard.scss";

export default function ProjectBoard() {
    return (
        <div className="board">
            <form id="id-form">
                <input type="text" placeholder="Project Name" />
                <button className="submit-button">
                    Add +
                </button>
            </form>
        </div>
    )
}
