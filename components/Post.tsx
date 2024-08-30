import React, {useState, useContext, ChangeEvent} from 'react';
// Replace with your actual context import
import {UserContext} from "@/UserContext";
import {router} from "next/client";
import {useRouter} from "next/router";

const PostUploader: React.FC = () => {
    const [contents, setContents] = useState<string>('');
    const [imageId, setImageId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {user} = useContext(UserContext); // Replace with your actual context
    const apiBaseUrl = process.env.NEXT_PUBLIC_FEED_SERVER_API_BASE_URL || 'http://post-service:8080';
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_API_BASE_URL || 'http://image-service:8080';
    const router = useRouter();
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            uploadImage(event.target.files[0]);
        }

    };

    const handleContentsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setContents(event.target.value);
    };

    const uploadImage = (file: File) => {
        if (!file) {
            throw new Error('No file selected');
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = fetch(`${imageBaseUrl}/api/images/upload`, {
                method: 'POST',
                body: formData,
            }).then((response) => {
                if (!response.ok) {
                    throw new Error('Image upload failed');
                }
                return response.text();

            }).then((text) => {
                setImageId(text);
            });

        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createPost = async (): Promise<void> => {
        if (!imageId) {
            throw new Error('Image ID is not available');
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageId,
                    uploaderId: user?.userId,
                    contents,
                }),
            });

            if (!response.ok) {
                throw new Error('Post creation failed');
            }

            router.push(`/timeline/${user?.userId}`);

        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            backgroundColor: '#eee',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            {!imageId && (
                <div style={{
                    'width': '500px',
                    'height': '500px',
                    'border': '2px solid black',
                    'padding': '20px'
                }}>
                    <input className='text-gray-800' type="file" onChange={handleFileChange} disabled={isLoading}/>
                </div>
            )}
            {imageId && (
                <>
                    <img
                        src={`${imageBaseUrl}/api/images/view/${imageId}?thumbnail=true`}
                        alt="Uploaded image"
                        style={{
                            'width': '500px',
                            'height': '500px',
                            'border': '2px solid black'
                        }}
                        draggable="false"
                    ></img>
                </>
            )}
            <div style={{
                'display': 'flex',
                'flexDirection': 'column',
                'justifyContent': 'space-between',
                'height': '500px',
                'marginLeft': '30px',
            }}>
                <form onSubmit={(e) => e.preventDefault()}>

          <textarea
              placeholder={imageId ? "Write your post contents here" : "Upload your image"}
              style={{
                  'width': '300px', 'height': '420px', 'border': '2px solid black',
                  'padding': '20px'
              }}
              className='text-gray-800'
              value={contents}
              onChange={handleContentsChange}
              disabled={!imageId}
          />
                </form>
                <button className={contents.trim() === '' ? "text-orange-300" : "text-orange-500"} style={{
                    borderBottom: '2px solid',
                    marginTop: '10px',
                    fontSize: 50,
                    height: '70px',
                    width: '250px',
                    paddingBottom: '0px'
                }} onClick={createPost} disabled={contents.trim() === ''}>
                    Create Post
                </button>
            </div>

        </div>
    )
        ;
};

export default PostUploader;
