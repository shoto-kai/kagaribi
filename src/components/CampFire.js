import { useEffect, useRef, Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'

const CampModelPath = '/models/camp.glb'
const FireModelPath = '/models/fire1.glb'

const Camp = (props) => {
    const group = useRef()

    const gltf = useGLTF(CampModelPath)

    return (
        <>
            <group ref={group} dispose={null}>
                <group scale={props.scale}>
                    <primitive object={gltf.scene} position={props.position} rotation={props.rotation} scale={props.scale} />
                </group>
            </group>
        </>
    )
}

const Fire = (props) => {
    const group = useRef()

    const gltf = useGLTF(FireModelPath)

    const { actions, mixer } = useAnimations(gltf.animations, group)

    useEffect(() => {
        // アニメーションの速度を0.5倍（半分）に設定
        mixer.timeScale = 0.5;
    }, [mixer])  // mixer が変更されたときに useEffect を再実行する

    useEffect(() => {
        console.log("animated")
        // アニメーション名の配列を作成してループで処理
        const animations = [
            'fire_part_00|Take 001|BaseLayer',
            'fire_part_01|Take 001|BaseLayer',
            'fire_part_02|Take 001|BaseLayer',
            'fire_part_03|Take 001|BaseLayer',
            'fire_part_04|Take 001|BaseLayer',
            'fire_part_05|Take 001|BaseLayer',
            'fire_part_06|Take 001|BaseLayer',
            'fire_part_07|Take 001|BaseLayer',
            'fire_part_08|Take 001|BaseLayer',
            'fire_part_09|Take 001|BaseLayer',
            'fire_part_010|Take 001|BaseLayer',
            'fire_part_011|Take 001|BaseLayer',
            'fire_part_012|Take 001|BaseLayer',
            'fire_part_013|Take 001|BaseLayer',
            'fire_part_014|Take 001|BaseLayer',
            'fire_part_015|Take 001|BaseLayer',
            'fire_part_016|Take 001|BaseLayer',
            'fire_part_017|Take 001|BaseLayer',
            'fire_part_018|Take 001|BaseLayer',
            'fire_part_019|Take 001|BaseLayer',
            'fire_part_020|Take 001|BaseLayer',
            'fire_part_021|Take 001|BaseLayer',
            'fire_part_022|Take 001|BaseLayer',
            'fire_part_023|Take 001|BaseLayer',
            'fire_part_024|Take 001|BaseLayer',
            'fire_part_025|Take 001|BaseLayer',
            'fire_part_026|Take 001|BaseLayer',
            'fire_part_027|Take 001|BaseLayer',
            'fire_part_028|Take 001|BaseLayer',
            'fire_part_029|Take 001|BaseLayer'
        ];

        animations.forEach((animationName, index) => {
            setTimeout(() => {
                if (actions[animationName]) {
                    actions[animationName].play();
                }
            }, props.interval * index); // indexを使用して500msずつアニメーションの開始をずらす
        });

        // useEffect内で使用したタイムアウトをクリアするためのクリーンアップ関数を返します
        return () => {
            animations.forEach((_, index) => {
                clearTimeout(index);
            });
        }
    }, [])

    return (
        <>
            <group ref={group} dispose={null}>
                <group scale={props.scale}>
                    <primitive object={gltf.scene} position={props.position} rotation={props.rotation} scale={props.scale} />
                </group>
            </group>
        </>
    )
}

const FlickeringLight = ({position}) => {
    const lightRef = useRef();

    useFrame(() => {
        // ライトの強度をランダムに変動させる
        const intensityVariation = 0.1 * (Math.random() - 0.5);  // -0.05 から 0.05 の範囲で変動
        lightRef.current.intensity = Math.max(0.5, lightRef.current.intensity + intensityVariation);  // 最小値を 0.5 に設定

        // ライトの位置をランダムに変動させる
        const positionVariation = 0.05;
        lightRef.current.position.x += positionVariation * (Math.random() - 0.5);
        lightRef.current.position.y += positionVariation * (Math.random() - 0.5);
        lightRef.current.position.z += positionVariation * (Math.random() - 0.5);
    });

    return (
        <pointLight 
            ref={lightRef}
            position={position} 
            color={0xffaa00}  // 炎のような色
            intensity={1}
            distance={5}  // 照らす距離
            decay={2}  // 光の減衰
        />
    );
};

useGLTF.preload(CampModelPath)
useGLTF.preload(FireModelPath)

export default function CampFire() {

    return (
        <>
            <Canvas className="w-full h-full fixed flex">
                {/* <OrbitControls /> */}
                <directionalLight
                    position={[0, 10, 0]}
                    target-position={[0, 0, 0]}
                />

                <FlickeringLight position={[0,0,0]}/>
                <FlickeringLight position={[0,1,0]}/>
                <FlickeringLight position={[0,1,0]}/>
                <FlickeringLight position={[0,3,0]}/>
                <Suspense >
                    <Camp position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />
                    <Fire position={[0, 0.2, 0]} rotation={[0, 0, 0]} scale={1} interval={100}/>
                    <Fire position={[0, 0.3, 0]} rotation={[0, 0, 0]} scale={1} interval={200}/>
                    <Fire position={[0, 0.2, 0]} rotation={[0, 0, 0]} scale={1} interval={300}/>
                    <Fire position={[0, 0.3, 0]} rotation={[0, 0, 0]} scale={1} interval={400}/>
                    <Fire position={[0, 0.2, 0]} rotation={[0, 0, 0]} scale={1} interval={500}/>
                </Suspense>
            </Canvas>
        </>
    )
}
