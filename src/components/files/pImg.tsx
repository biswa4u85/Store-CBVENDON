import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader } from "../loader";
import {
    Upload,
    Typography,
    Space,
    Avatar,
} from "@pankod/refine-antd";

const { Text } = Typography;

type FilesProps = {
    lable?: any
    count?: any
    name: any
    formProps: any
    folder: string;
};

export const PImg: React.FC<FilesProps> = ({ formProps, name, folder, count = 1, lable }) => {

    const [fileList, setFileList] = useState<any>([])
    const [loaders, setLoaders] = useState<any>(false)

    useEffect(() => {
        if (formProps.form.getFieldValue('products') && formProps.form.getFieldValue('products')[name] && formProps.form.getFieldValue('products')[name].image) {
            setFileList(formProps.form.getFieldValue('products')[name].image)
        }
    }, [formProps.initialValues])

    const FileUpload = ({ onError, onSuccess, file }: any) => {
        setLoaders(true)
        const storage = getStorage();
        const storageRef = ref(storage, `${folder}/${file.name}`);
        const metadata = {
            contentType: file.type,
        };
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                setLoaders(false)
                onError(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setLoaders(false)
                    onSuccess(downloadURL);
                });
            }
        );
    }

    const onFileChange = (file: any) => {
        let tempFiles = count == 1 ? [] : fileList
        if (file.file.response) {
            tempFiles.push({
                name: file.file.name,
                percent: file.file.percent,
                size: file.file.size,
                status: file.file.status,
                type: file.file.type,
                uid: file.file.uid,
                url: file.file.response
            })
        }
        let products = formProps.form.getFieldValue('products')
        products[name].image = tempFiles
        if (file.file.response) {
            (formProps as any).form.setFieldsValue({
                ['products']: products
            })
            setFileList(tempFiles)
        }
    }

    return (
        <div style={{ width: 180 }}>
            <Upload.Dragger
                name="file"
                onChange={onFileChange}
                customRequest={FileUpload}
                listType="picture"
                showUploadList={false}
                maxCount={count}
            >
                <Space direction="vertical">
                    {loaders ? <Loader /> : <> {
                        (count == 1) ? <Avatar
                            shape="square"
                            style={{
                                width: 100,
                                height: 100,
                            }}
                            src={(fileList && fileList[0]) ? fileList[0]['url'] : "/images/user-default-img.png"} alt=""
                        /> :
                            <Avatar
                                shape="square"
                                style={{
                                    width: 100,
                                    height: 100,
                                }}
                                src={"/images/user-default-img.png"} alt=""
                            />
                    }</>
                    }
                    {!(fileList && fileList[0]) && (<Text style={{ fontSize: "12px" }}>
                        Upload Image
                    </Text>)}
                </Space>

            </Upload.Dragger>
        </div>
    );
};
