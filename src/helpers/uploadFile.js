const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`

const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append("upload_preset", "chat-app-file")

    try {
        const response = await fetch(url, {
            method: 'post',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

export default uploadFile