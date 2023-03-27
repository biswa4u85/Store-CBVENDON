import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
export const FileUpload = ({ onError, onSuccess, file }: any) => {
    const storage = getStorage();
    const storageRef = ref(storage, `products/${file.name}`);
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
            onError(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                onSuccess(downloadURL);
            });
        }
    );
}