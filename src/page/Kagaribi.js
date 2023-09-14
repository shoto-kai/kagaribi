import React, { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import firebase from "firebase/app";
import { storage } from "../firebase";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL} from "firebase/storage";

import axios from "axios";

import CampFire from '../components/CampFire'
import {SlArrowUp} from "react-icons/sl"

function Kagaribi() {
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
<<<<<<< HEAD
            var response = await axios.get(mediaBlobUrl, {
                responseType: 'blob' // レスポンスのデータ型をblobに指定
=======
            const response = await axios.get(mediaBlobUrl, {
            responseType: 'blob' // レスポンスのデータ型をblobに指定
>>>>>>> 54491600407ce5ed66b64a589cb53c74505a46b6
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
<<<<<<< HEAD
    const saveWavFile = async () => {
        var myblob = await getBlobFromBlobURL();
        var mywav = await getWavfromBlob(myblob);
=======
    const saveWavFile = async() => {
        const myblob =  await getBlobFromBlobURL();
        const mywav = await getWavfromBlob(myblob);
>>>>>>> 54491600407ce5ed66b64a589cb53c74505a46b6
        const myaudio = await new Audio(URL.createObjectURL(mywav));
        myaudio.name = "happy" + Math.random().toString(32).substring(2);

        const storageRef = ref(storage, `audios/${myaudio.name}`);
<<<<<<< HEAD
        var myblob = await getBlobFromBlobURL();
        var mywav = await getWavfromBlob(myblob);
=======
>>>>>>> 54491600407ce5ed66b64a589cb53c74505a46b6
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

<<<<<<< HEAD

    // 再描画の影響を受けない不変なオブジェクト
    const audioContext = useRef(null);
    // 内部状態
    const [audioBuffer, setAudioBuffer] = useState(null); // 追加

    // 初期化
    useEffect(() => {
        audioContext.current = new AudioContext();
    }, [])
    // イベントコールバック
    const handleChangeFile = async (event) => {
        const _file = event.target.files[0];
        const _audioBuffer = await audioContext.current.decodeAudioData( // 追加
            await _file.arrayBuffer()
        );
        setAudioBuffer(_audioBuffer); // 追加
    };

    const handleClickPlay = () => {
        // 自動再生ブロックにより停止されたオーディオを再開させる
        if (audioContext.current.state === "suspended") {
            audioContext.current.resume();
        }
        // ソースノード生成 ＋ 音声を設定
        const sourceNode = audioContext.current.createBufferSource();
        //sourceNode.buffer = audioBuffer;
        // 出力先に接続
        sourceNode.connect(audioContext.current.destination);
        // 再生発火
        sourceNode.start();
    };
=======
    async function getAllWavPath(){
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

    async function selectSound(){
        const firestorage = storage;
        const path_list = await getAllWavPath();
        const selected_sound_path = path_list[Math.floor( Math.random() * path_list.length)];
        console.log(selected_sound_path);
        getDownloadURL(ref(storage, selected_sound_path))
        .then((url) => {
            console.log(url);
            const audio = new Audio(url);
            audio.play();

        });
        
    }
>>>>>>> 54491600407ce5ed66b64a589cb53c74505a46b6

    return (
        <>
            <div id="header" className='h-[10vh] flex justify-center items-center bg-black border-b border-gray-700'>
                <p className="text-center text-white">かがり火</p>
            </div>
            <div className="h-[75vh] w-screen bg-black relative">
                <div className="h-[22%]"></div>
                <div className="h-[60%] bg-black">
                    <CampFire />
                </div>
                <div className="h-[18%] bg-black">
                    <div className="flex justify-center items-center w-full">
                        <SlArrowUp className="text-7xl text-center text-white"/>
                    </div>
                    <button className="text-white" onClick={saveWavFile}>音をくべる</button>
                </div>
            </div>
<<<<<<< HEAD
            <div className=" h-[15vh] flex justify-center items-center bg-black text-white border-t border-gray-700">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-3 border-4 border-white rounded-full bg-transparent"></div>
                    <button 
                        onClick={onStartOrStop} 
                        className={`absolute bg-red-500 focus:outline-none transition-all duration-300 ease-in-out ${isRecording ? "inset-8 rounded-md":"inset-4 rounded-full"}`}
                    ></button>
                </div>
=======

            <div>
                <button onClick={selectSound}>再生</button>
            </div>

            <div className="bg-red-400">
                <p className="text-blue-400">test</p>
                <p>test</p>
                <Test />
>>>>>>> 54491600407ce5ed66b64a589cb53c74505a46b6
            </div>
        </>
    );
}

export default Kagaribi;

