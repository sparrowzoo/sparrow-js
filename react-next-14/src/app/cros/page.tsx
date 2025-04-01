"use client";
import {useEffect} from "react";
import CrosStorage from "@/common/lib/CrosStorage";
import ChatApi from "@/lib/ChatApi";
import {StorageType} from "@/common/lib/protocol/CrosProtocol";

export default function Page() {
    let crosStorage: CrosStorage | null = null;
    useEffect(() => {
        crosStorage = CrosStorage.getCrosStorage();
        return () => {
            crosStorage?.destroy();
        };
    }, []);

    function setStorageValue() {
        crosStorage
            ?.set(StorageType.SESSION, "test", "Hello, world!" + new Date().toLocaleString())
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getStorageValue() {
        crosStorage
            ?.get(StorageType.SESSION, "test")
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getToken() {
        crosStorage
            ?.getToken(StorageType.AUTOMATIC,()=>ChatApi.getVisitorToken())
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function setToken() {
        crosStorage
            ?.setToken( "tokenlkjlkj" + new Date().toLocaleString())
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div>
            <h1>Cros Storage Demo</h1>
            <p>This is a demo page for Cros Storage integration with Next.js</p>
            <button onClick={setStorageValue}>Set storage value</button>
            <button onClick={getStorageValue}>Get storage value</button>

            <button onClick={setToken}>Set Token value</button>
            <button onClick={getToken}>Get Token value</button>
        </div>
    );
}
