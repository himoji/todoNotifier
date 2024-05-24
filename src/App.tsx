import React, {useEffect, useState} from "react";
import "./App.css";
import Work from "./Work.tsx";
import { invoke } from "@tauri-apps/api";

function App() {
    const initialWork: Work = {
        name: "Sample Work",
        desc: "This is a description",
        date_start: 12331,
        date_end: 321244,
        index: "a"
    };

    type Work = {
        name: string;
        desc: string;
        date_start: number;
        date_end: number;
        index: string
    };


    const [works, setWorks] = useState<Work[]>([])
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
            const updatedWorks = [...works, selectedWork];

            await invoke("set_works_sync", { works: updatedWorks });
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

    };

    const HandleResetButton = () => {
        const updatedWork = { ...selectedWork, desc: "" };
        setSelectedWork(updatedWork);

    };

    const getProgress = (work: Work): number => {
        let date = new Date();
        let now = Math.ceil(date.getTime()/1000);

        console.log(now);

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
            <div
                className="main"
                style={{
                    display: "flex",
                }}
            >
                <div className="list">
                    {works.map((work: Work, index: number) => (
                        <div
                            onClick = {() => {setSelectedWork(works[index]);console.log(selectedWork)}}
                        >
                            <Work
                                key={work.index}
                                name={work.name}
                                details={work.desc}
                                progress={`${getProgress(work)}`}
                            />
                        </div>
                    ))}
                </div>
                <div
                    className="body"
                    style={{
                        height: "100%",
                    }}
                >
          <textarea
              name="description"
              id="description"
              className="textArea"
              value={selectedWork.desc}
              onChange={handleDescChange}
          >
                </textarea>
            </div>
        </div>

            <div className="controls">
                <button onClick={() => InvokeSetWorks()}>Save</button>
                <button onClick={() => HandleResetButton()}>Reset</button>
                <button onClick={() => fetchWorks()}>Sync</button>
            </div>
        </>
    );
}

export default App;
