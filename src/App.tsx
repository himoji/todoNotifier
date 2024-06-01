import React, { useEffect, useState } from "react";
import "./App.css";
import Work from "./Work";
import { invoke } from "@tauri-apps/api/tauri";

type WorkType = {
    name: string;
    desc: string;
    date_start: number;
    date_end: number;
    index: string;
};

const initialWork: WorkType = {
    name: "Sample Work",
    desc: "This is a description",
    date_start: 12331,
    date_end: 321244,
    index: "a",
};

function App() {
    const [works, setWorks] = useState<WorkType[]>([]);
    const [selectedWork, setSelectedWork] = useState<WorkType>(initialWork);

    const fetchWorks = async () => {
        try {
            const newWorks: WorkType[] = await invoke("get_works_sync");
            setWorks(newWorks);
        } catch (err) {
            console.error("Error fetching works:", err);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleWorkClick = (work: WorkType) => {
        setSelectedWork(work);
    };

    const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDesc = event.target.value;
        setSelectedWork(prevWork => ({ ...prevWork, desc: newDesc }));
    };

    const InvokeEditWorks = async () => {
        try {
            await invoke("edit_work_sync", { work: selectedWork, desc: selectedWork.desc });
            // Refresh works after edit
            fetchWorks();
        } catch (err) {
            console.error("Error editing works:", err);
        }
    };

    const HandleResetButton = () => {
        setSelectedWork(initialWork);
    };

    const getProgress = (work: WorkType): number => {
        const now = Math.ceil(Date.now() / 1000);
        const startTime = work.date_start;
        const endTime = work.date_end;

        if (startTime >= endTime) {
            return -1;
        }

        if (now < startTime) {
            return 0;
        }

        if (now > endTime) {
            return 100;
        }

        return Math.ceil(((now - startTime) / (endTime - startTime)) * 100);
    };

    return (
        <>
            <div className="main" style={{ display: "flex" }}>
                <div className="list">
                    {works.map((work) => (
                        <div key={work.index} onClick={() => handleWorkClick(work)}>
                            <Work
                                name={work.name}
                                details={work.desc}
                                progress={`${getProgress(work)}`}
                            />
                        </div>
                    ))}
                </div>
                <div className="body" style={{ height: "100%" }}>
                    <textarea
                        name="description"
                        id="description"
                        className="textArea"
                        value={selectedWork.desc}
                        onChange={handleDescChange}
                    />
                </div>
            </div>
            <div className="controls">
                <button onClick={InvokeEditWorks}>Save</button>
                <button onClick={HandleResetButton}>Reset</button>
                <button onClick={fetchWorks}>Sync</button>
            </div>
        </>
    );
}

export default App;
