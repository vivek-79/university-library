
'use client'
import { toast } from "@/hooks/use-toast";
import config from "@/lib/config";

import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";

const {env:{imagekit:{publicKey,urlEndpoint}}} = config;


const authenticator = async()=>{
  try {
    const respponse = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if(!respponse.ok){
      const errrText = await respponse.text();
      throw new Error(`Request failed with status: ${respponse.status} : ${errrText}`)
    }

    const data = await respponse.json();

    const {signature,expire,token} = data;

    return { token, expire, signature };

  } catch (error:any) {
    throw new Error(`Authentication request failed: ${error.message}`)
  }
}
const ImageUpload = ({onFileChange}:{onFileChange:(filePath:string)=>void}) => {

  const ikUoloadRef = useRef(null);
  const [file,setFile] = useState<{filePath:string} | null>(null)

  const onError = (error:any)=>{
    console.log(error)
    toast({
      title: "Image upload failed",
      description: `Your image could not be uploaded try again`,
    })
  }

  const onSuccess = (res:any)=>{
    console.log(res)
    setFile(res);
    onFileChange(res.filePath);
    toast({
      title: "Image upload successfully",
      description: `${res.filePath} uploaded successfully`,
    })
  }
  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <IKUpload className="hidden" 
      ref={ikUoloadRef} 
      onError={onError} 
      onSuccess={onSuccess}
      fileName="test-upload.png"
      />

      <button onClick={(e)=>{e.preventDefault();
        if(ikUoloadRef.current){
          //@ts-ignore
          ikUoloadRef.current?.click();
        }
      }} className="upload-btn">
        <Image src="/icons/upload.svg" alt='upload-icon' width={20} height={20} className="object-contain"/>
        <p className="text-base text-lime-100">Upload a File</p>
        {file && <p className="upload-filename">{file.filePath}</p> }
      </button>

      {file && (
        <IKImage 
        alt={file.filePath}
        path={file.filePath}
        width={500}
        height={300}
        />
      ) }
    </ImageKitProvider>
  )
}

export default ImageUpload