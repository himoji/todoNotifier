import {useEffect, useState} from "react";
import "./App.css";
import Work from "./Work.tsx";
import { invoke } from "@tauri-apps/api";
import work from "./Work.tsx";

function App() {
    const initialTauriWork: TauriWork = {
        progress: 0,
        work: {
            name: "Sample Work",
            desc: "This is a description",
            date_start: 12331,
            date_end: 321244
        }
    };

    type Work = {
        name: string;
        desc: string;
        date_start: number;
        date_end: number;
    };

    type TauriWork = {
        work: Work;
        progress: number;
    };

    const [works, setWorks] = useState<TauriWork[]>([])
    const [selectedWork, setSelectedWork] = useState<TauriWork>(initialTauriWork);

    const fetchWorks = async () => {
        try {
            const newWorks: TauriWork[] = await invoke("get_works");
            setWorks(newWorks);
        } catch (err) {
            console.error("Error fetching works:", err);
        }
    };

    const InvokeSetWorks = async () => {
        try {
            await invoke("set_works", {works: works});
        } catch (err) {
            console.error("Error setting works:", err);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDesc = event.target.value;
        setSelectedWork((prevWork) => ({
            ...prevWork,
            work: {
                ...prevWork.work,
                desc: newDesc
            }
        }));
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
                    {works.map((work: TauriWork, index: number) => (
                        <div
                            onClick = {() => {console.log(selectedWork);setSelectedWork(works[index]);}}
                        >
                            <Work
                                key={index}
                                name={work.work.name}
                                details={work.work.desc}
                                progress={`${work.progress}`}
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
              value={selectedWork.work.desc}
              onChange={handleDescChange}
          >
                </textarea>
            </div>
        </div>

    <div className="controls">
        <button onClick={() => InvokeSetWorks()}>Save</button>
        <button>Reset</button>
    </div>
        </>
    );
}

export default App;
