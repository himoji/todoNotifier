import React, { useEffect, useState } from "react";
import "./App.css";
import Work from "./Work";
import { invoke } from "@tauri-apps/api/tauri";

type Work = {
    name: string;
    desc: string;
    date_start: number;
    date_end: number;
    index: string;
};

const initialWork: Work = {
    name: "Sample Work",
    desc: "This is a description",
    date_start: 12331,
    date_end: 321244,
    index: "a",
};

function App() {
    const [works, setWorks] = useState<Work[]>([]);
    const [selectedWork, setSelectedWork] = useState<Work>(initialWork);

    const fetchWorks = async () => {
        try {
            const newWorks: Work[] = await invoke("get_works_sync");
            setWorks(newWorks);
        } catch (err) {
            console.error("Error fetching works:", err);
        }
    };

    const InvokeSetWorks = async () => {
        try {
            // Update the work in the works array
            const updatedWorks = works.map(work =>
                work.index === selectedWork.index ? selectedWork : work
            );

            await invoke("set_works_sync", { works: updatedWorks });
            setWorks(updatedWorks); // Update the local state with the updated works
        } catch (err) {
            console.error("Error setting works:", err);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDesc = event.target.value;
        const updatedWork = { ...selectedWork, desc: newDesc };
        setSelectedWork(updatedWork);

        // Update the work in the works array
        setWorks(works.map(work => work.index === updatedWork.index ? updatedWork : work));
    };

    const HandleResetButton = () => {
        const updatedWork = { ...selectedWork, desc: "" };
        setSelectedWork(updatedWork);

        // Update the work in the works array
        setWorks(works.map(work => work.index === updatedWork.index ? updatedWork : work));
    };

    const getProgress = (work: Work): number => {
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
                        <div key={work.index} onClick={() => setSelectedWork(work)}>
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
                <button onClick={InvokeSetWorks}>Save</button>
                <button onClick={HandleResetButton}>Reset</button>
                <button onClick={fetchWorks}>Sync</button>
            </div>
        </>
    );
}

export default App;
