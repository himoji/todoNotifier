import "./App.css";
import React from "react";

interface WorkProps {
    progress: string;
    name: string;
    details: string;
}

const Work: React.FC<WorkProps> = ({ progress, details, name }) => {
    return (
        <div className="work">
            <div className="name">
                <label htmlFor="nameInput" className="nameLabel">
                    Name:
                </label>
                <span
                    id="nameInput"
                    role="textbox"
                    tabIndex={0}
                    className="nameSpan"
                    aria-label="Name"
                    aria-required="true"
                >
          {name}
        </span>
            </div>

            <div className="divider" title={progress} role="separator">
                <div
                    className="dividerLine"
                    title={`Progress: ${progress}`}
                    style={{
                        width: `${progress}%`,
                    }}
                ></div>
            </div>

            <div className="details">
                <span className="detailsSpan">{details}</span>
            </div>
        </div>
    );
};

export default Work;
