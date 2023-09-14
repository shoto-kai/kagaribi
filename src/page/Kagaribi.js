import React, { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import firebase from "firebase/app";
import { storage } from "../firebase";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

import axios from "axios";

import CampFire from '../components/CampFire'
import { SlArrowUp } from "react-icons/sl"

function Kagaribi() {
    const [fireLevel, setFireLevel] = useState(0) // 0~9が入る



    //録音機能
    const renderFlagRef = useRef(false);
    const [isRecording, setIsRecording] = useState(false);
    //const [blobData, setBlobData] = useState(null);
    //const [wavFile, setWavFile] = useState(null);
    const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
        {
            audio: true,
            blobPropertyBag: {
                type: "audio/wav",
            },
        }
    );

    useEffect(() => {
        if (renderFlagRef.current) {
            console.log("effectOK");
        } else {
            renderFlagRef.current = true;
        }
    }, [mediaBlobUrl]);

    const getBlobFromBlobURL = async () => {
        console.log(mediaBlobUrl)
        try {
            const response = await axios.get(mediaBlobUrl, {
                responseType: 'blob' // レスポンスのデータ型をblobに指定
            });

            // Blobデータを取得し、stateにセットします。
            //await setBlobData(response.data);
            return response.data;
        } catch (error) {
            console.error('Blobデータの取得エラー:', error);
            return null;
        }
    }

    const getWavfromBlob = (blobData) => {
        //setWavFile(new File([blobData], 'audio.wav', { type: 'audio/wav' }));
        var mywav = new File([blobData], 'audio.wav', { type: 'audio/wav' });
        return mywav;
    };

    //保存のメインファンクション
    const onStartOrStop = async () => {
        if (!isRecording) {
            startRecording();
            setIsRecording(true);
        }
        else {
            await stopRecording();
            await setIsRecording(false);
        }
    };

    //以下は再生処理
    /*
    const playWavFile = async() => {
        var listenblob =  await getBlobFromBlobURL();
        var listenwav = await getWavfromBlob(listenblob);
        console.log(listenblob);
        const audio = await new Audio(URL.createObjectURL(listenwav));
        await audio.play();
    }
    */

    //以下は保存処理
    const saveWavFile = async () => {
        const myblob = await getBlobFromBlobURL();
        const mywav = await getWavfromBlob(myblob);
        const myaudio = await new Audio(URL.createObjectURL(mywav));
        myaudio.name = "happy" + Math.random().toString(32).substring(2);

        const storageRef = ref(storage, `audios/${myaudio.name}`);
        console.log(mywav);
        const audio = await new Audio(URL.createObjectURL(mywav));
        await audio.play();

        const metadata = {
            contentType: 'audio/wav',
        };

        await uploadBytes(storageRef, mywav)
            .then((snapshot) => {
                console.log("アップロードに成功しました");
            })
            .catch((error) => {
                console.log("アップロードに失敗しました");
            });

    }

    async function getAllWavPath() {
        const listRef = ref(storage, `audios`);
        const path_list = [];
        await listAll(listRef)
            .then((res) => {
                res.prefixes.forEach((folderRef) => {
                    // All the prefixes under listRef.
                    // You may call listAll() recursively on them.
                });
                res.items.forEach(async (itemRef) => {
                    //console.log(itemRef);
                    await path_list.push(itemRef._location.path_);

                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });
        return path_list;
    }

    async function selectSound() {
        const firestorage = storage;
        const path_list = await getAllWavPath();
        const selected_sound_path = path_list[Math.floor(Math.random() * path_list.length)];
        console.log(selected_sound_path);
        getDownloadURL(ref(storage, selected_sound_path))
            .then((url) => {
                console.log(url);
                const audio = new Audio(url);
                audio.play();

            });

    }

    const handleInputChange = (e) => {
        setFireLevel(e.target.value);
    };

    return (
        <>
            <div id="header" className='h-[10vh] flex justify-center items-center bg-black border-b border-gray-700'>
                <p className="text-center text-white "><span className="kana">かがり</span><span className="kanji">火</span></p>
            </div>
            <div className="h-[75vh] w-screen bg-black relative">
                <div className="h-[22%]"></div>
                <div className="h-[60%] bg-black">
                    <CampFire fireLevel={fireLevel} />
                </div>
                <div className="h-[18%] bg-black">
                    <div className="flex justify-center items-center w-full">
                        <SlArrowUp className="text-7xl text-center text-white" />
                    </div>
                    <button className="text-white" onClick={saveWavFile}><span className="kanji">音</span><span className="kana">をくべる</span></button>
                    <button className="text-white" onClick={selectSound}>再生</button>
                    <input type="number" value={fireLevel} onChange={handleInputChange}/>
                </div>
            </div>
            <div className=" h-[15vh] flex justify-center items-center bg-black text-white border-t border-gray-700">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-3 border-4 border-white rounded-full bg-transparent"></div>
                    <button
                        onClick={onStartOrStop}
                        className={`absolute bg-red-500 focus:outline-none transition-all duration-300 ease-in-out
                    ${isRecording ? "inset-8 rounded-md" : "inset-4 rounded-full"}`}
                    ></button>
                </div>
            </div>
        </>
    );
}

export default Kagaribi;