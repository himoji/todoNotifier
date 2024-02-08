import { useState } from "react";
import "./App.css";
import {invoke} from "@tauri-apps/api";

function App() {
    // const [greetMsg, setGreetMsg] = useState([]);
    // const [name, setName] = useState("");
    // const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [start_time, setStartTime] = useState("");
    const [start_time_sec, setStartTimeSec] = useState(1);
    const [duration, setDuration] = useState("");
    const [duration_sec, setDurationSec] = useState(1);
    const [data, setData] = useState({ name: "", desc: "", duration: 1, start_time: 1 });

//     async function greet() {
// // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//         setGreetMsg([...greetMsg, await invoke("greet", { name })]);
//     }
//
//     async function get_file_names() {
//         setFiles(await invoke("get_files"));
//     }

    async function hh_mm_to_i64(string: String, for_what: String) {
        try {

            console.log("str: ", string);
            const result = await invoke("hh_mm_to_i64", { hh_mm: string });
            console.log(result);
            if (for_what==="start_time") {
                // @ts-ignore
                setStartTimeSec(result);}
            else if (for_what==="duration") {
                // @ts-ignore
                setDurationSec(result);}
        } catch (error) {
            console.error(error);
            // Handle the error as needed
            throw error; // Optional: rethrow the error if you want to handle it in the calling function
        }
    }

    async function create_work() {
        try {
            const zxc = await invoke("new_work", { name, desc, duration: duration_sec, start_time: start_time_sec });
            console.log("sds", zxc);
            return zxc
        } catch (err) {
            console.error(err);
            // Handle the error as needed
            throw err; // Optional: rethrow the error if you want to handle it in the calling function
        }
    }
    async function save_work() {
        try {
            await invoke("save_work_to_file", { name, desc, duration: duration_sec, start_time: start_time_sec });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return (
        <div style={{
            display: "flex",
            alignContent:"center",
            flexWrap: "wrap",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{justifySelf: "center"}}>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                    alignContent: "space-between",
                    alignItems: "flex-start",
                    justifyContent: "space-between",

                }}>
                    <div>
                        <label>Name: {name}</label>
                        <br/>
                        <input type="text" name="name" id="name" onChange={(e) => {
                            e.preventDefault();
                            setName(e.target.value)
                        }}/>
                    </div>
                    <div>
                        <label>Description: {desc}</label>
                        <br/>
                        <input type="text" name="desc" id="desc" onChange={(e) => {
                            e.preventDefault();
                            setDesc(e.target.value)
                        }}/>
                    </div>
                    <div>
                        <label>Start time: {start_time}</label>
                        <br/>
                        <input type="time" name="start_time" id="start_time" defaultValue={"00:00"} onChange={(e) => {
                            e.preventDefault();
                            setStartTime(e.target.value)
                        }}/>
                    </div>
                    <div>
                        <label>Duration: {duration}, {duration_sec}sec</label>
                        <br/>
                        <input type="time" name="duration" id="duration" defaultValue={"00:00"} onChange={(e) => {
                            e.preventDefault();
                            setDuration(e.target.value);

                        }}/>
                    </div>
                    <div>
                        <button type="submit" onClick={() => {

                            hh_mm_to_i64(start_time, "start_time");
                            hh_mm_to_i64(duration, "duration");
                            console.log(start_time_sec, duration_sec, "asd");
                        }}>Time to sec
                        </button>
                        <button type="submit" onClick={async () => {
                            const zxc = await create_work();
                            // @ts-ignore
                            setData(zxc);
                        }}>Create work
                        </button>
                        <button type="submit" onClick={() => {

                            console.log("name: ", data.name, "desc: ", data.desc, "start_time: ", data.start_time, "duration: ", data.duration)
                        }}>log data
                        </button>
                        <button type="submit" onClick={() => {
                            save_work();
                        }}>save
                        </button>
                    </div>
                    <div>
                        <br/>
                        {data.name} <br/>
                        {data.desc} <br/>
                        {data.start_time} <br/>
                        {data.duration} <br/>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default App;