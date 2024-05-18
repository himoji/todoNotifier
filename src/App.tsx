import {useEffect, useState} from "react";
import "./App.css";
import Work from "./Work.tsx";
import { invoke } from "@tauri-apps/api";

function App() {
    const [works, setWorks] = useState<TauriWork[]>([])

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

    const fetchWorks = async () => {
        try {
            const newWorks: TauriWork[] = await invoke("get_works");
            setWorks(newWorks);
        } catch (err) {
            console.error("Error fetching works:", err);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

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
                        <Work
                            key={index}
                            name={work.work.name}
                            details={work.work.desc}
                            progress={`${work.progress}`}
                        />
                    ))}
                </div>
                <div
                    className="body"
                    style={{
                        height: "100%",
                    }}
                >
          <textarea name="" id="" className="textArea">
            zxc
          </textarea>
                </div>
            </div>

            <div className="controls">
                <button>Save</button>
                <button>Reset</button>
            </div>
        </>
    );
}

export default App;
