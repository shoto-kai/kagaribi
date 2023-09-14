import React, { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import firebase from "firebase/app";
import { storage } from "../firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import axios from "axios";

import CampFire from '../components/CampFire'

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
            var response = await axios.get(mediaBlobUrl, {
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
        var myblob = await getBlobFromBlobURL();
        var mywav = await getWavfromBlob(myblob);
        const myaudio = await new Audio(URL.createObjectURL(mywav));
        const storageRef = ref(storage, `audios/${myaudio.name}`);
        var myblob = await getBlobFromBlobURL();
        var mywav = await getWavfromBlob(myblob);
        console.log(mywav);
        const audio = await new Audio(URL.createObjectURL(mywav));
        await audio.play();
        await uploadBytes(storageRef, myaudio)
            .then((snapshot) => {
                console.log("アップロードに成功しました");
            })
            .catch((error) => {
                console.log("アップロードに失敗しました");
            });

    }


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

    return (
        <>
            <div id="header" className='h-[10vh] flex justify-center items-center bg-blue-300'>
                <p className="text-center">かがり火</p>
            </div>
            <div className="h-[75vh] w-screen bg-black">
                <CampFire />
                <div>
                    <button className="text-white" onClick={saveWavFile}>送信</button>
                </div>
            </div>
            <div className=" h-[15vh] flex justify-center items-center bg-red-400 text-white ">
                <div>
                    <button onClick={onStartOrStop}>
                        {isRecording ? "録音中" : "録音する"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Kagaribi;

