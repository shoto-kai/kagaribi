import React, { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { storage, db } from "../firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { collection, setDoc, getDoc, doc } from "firebase/firestore";
import axios from "axios";

import CampFire from '../components/CampFire'
import { SlArrowUp } from "react-icons/sl"

function Kagaribi() {
    const [visible, setVisible] = useState(false);

    const [fireLevel, setFireLevel] = useState(null); // 0~9が入る

    const patipati = () => {
        getDownloadURL(ref(storage, 'fire/takibi_new.wav'))
            .then((url) => {
                const takibi_wav = new Audio(url);
                if (fireLevel > 0){

                takibi_wav.play();
                };
        });


    };
    const [isAllowaudio, setIsAllowaudio] = useState(false)

    //録音機能
    const renderFlagRef = useRef(false);
    const [isRecording, setIsRecording] = useState(false);
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

    //たきび
    useEffect(() => {
        // この関数が10秒ごとに呼び出される
        function callEverySixMinutes() {
            console.log(isAllowaudio);
            
          //console.log(fireLevel);
          checkFire();
          //selectSound();
            if (isAllowaudio) {
                if (!isRecording){
                    selectSound();
                    patipati();
                }
            }

        }

        const intervalId = setInterval(callEverySixMinutes, 10000);

        // コンポーネントがアンマウントされたときに、タイマーをクリアする
        return () => {
            clearInterval(intervalId);
        };
    }, [fireLevel]);

    //録音中は音を停止
    useEffect(() => {
        // この関数が1秒ごとに呼び出される
        function callEveryOneSecond() {
            
          //console.log(fireLevel);
            checkFire();
            if(isRecording){
            stopAllSound();
            }

        }

        const new_intervalId = setInterval(callEveryOneSecond, 1000);

        // コンポーネントがアンマウントされたときに、タイマーをクリアする
        return () => {
            clearInterval( new_intervalId);
        };
    }, [isRecording]);


    useEffect(() => {
          checkFire();
          if (isAllowaudio) {
            patipati();
          };

         
    })    
        

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
            setVisible(true);
        }
    };

    //以下は保存処理
    const saveWavFile = async () => {
        const now = new Date();
        const nowdate = Date.parse(now);
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
                console.log("音声アップロードに成功しました");
            })
            .catch((error) => {
                console.log("音声アップロードに失敗しました");
            });

        try {
            const docRef = await setDoc(doc(collection(db, "days"), "today"), {
                created_date: nowdate
            });
            console.log("hi");
        } catch (e) {
            console.error("oh");
        }
        setFireLevel(9);
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
                    await path_list.push(itemRef._location.path_);
                });
            }).catch((error) => {
                console.log("Uh-oh, an error occurred!");
            });
        return path_list;
    }

    async function selectSound() {
        checkFire();
        const path_list = await getAllWavPath();
        const selected_sound_path = path_list[Math.floor(Math.random() * path_list.length)];
        //console.log(selected_sound_path);
        getDownloadURL(ref(storage, selected_sound_path))
            .then((url) => {
                //console.log(url);
                const audio = new Audio(url);
                audio.play();
            });
    }

    //火力の調整
    async function checkFire() {
        const docRef = doc(db, "days", "today");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const past_ms_date = docSnap.data().created_date;
            const new_now = new Date();
            const now_ms_date = Date.parse(new_now);
            const diff = Math.floor(Math.abs(now_ms_date - past_ms_date) / 10000);
            if (diff > 9) {
                setFireLevel(0);
            }
            else {
                setFireLevel(9 - diff);
            }
            console.log(fireLevel);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    function stopAllSound() {
        const audios = document.querySelectorAll( "audio" );
        for(var i=0;i<audios.length;i++){
            audios[ i ].addEventListener( "play", function(){
            for(var j=0;j<audios.length;j++){
            if( audios[ j ]!==this ){ audios[ j ].pause() }
            }
            }, false );
        }
    }

    return (
        <>
            <div className="relative">
                <div className={`absolute h-screen w-screen z-20 ${isAllowaudio&&"pointer-events-none"}`}>
                    <div className="relative h-full w-full" onClick={() => setIsAllowaudio(true)}>
                        <div>
                            <img src="./images/welcome.jpg" alt="森"  
                            className={`absolute inset-0 h-full w-full object-cover ${isAllowaudio&&"welcome-image"}`} 
                            />
                        </div>
                        <div className={`absolute h-full w-full flex items-center justify-center text-center pt-[75%] ${isAllowaudio&&"hidden"}`}>
                            <p className="z-30 text-white"><span className="kana">tap to start(かっこいい感じのやつ考えて)</span></p>Ï
                        </div>
                    </div>
                </div>

                <div className={isAllowaudio?"absolute w-screen h-screen z-10":"hidden"}>
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
                            {visible && <button className="text-white" onClick={saveWavFile}><span className="kanji">音</span><span className="kana">をくべる</span></button>}
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
                </div>
            </div>
        </>
    );
}

export default Kagaribi;