import React, {useState} from 'react';
import styles from './CreatePostPage.module.css';
import {useAPI, useSiteName} from '../AppState/AppState';
import {useNavigate} from 'react-router-dom';
import CreateCommentComponent from '../Components/CreateCommentComponent';
import {CommentInfo} from '../Types/PostInfo';
import {toast} from 'react-toastify';

export function CreatePostPage() {
    const api = useAPI();
    const {siteName} = useSiteName();
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const handleAnswer = async (text: string): Promise<CommentInfo | undefined> => {
        console.log('post', title, text);

        try {
            const result = await api.postAPI.create(siteName, title, text);
            console.log('CREATE', result);
            navigate('/post/' + result.post.id);
        }
        catch (error) {
            console.log('CREATE ERR', error);
            toast.error('Пост хороший, но создать его не удалось 🤐');
        }

        return;
    };

    const handlePreview = async (text: string): Promise<string> => {
        return (await api.postAPI.preview(text)).content;
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.createpost}>
                <div className={styles.form}>
                    <input className={styles.title} type="text" placeholder="Без названия" value={title} onChange={handleTitleChange} />
                    <CreateCommentComponent open={true} onAnswer={handleAnswer} onPreview={handlePreview} />
                </div>
            </div>
        </div>
    )
}
