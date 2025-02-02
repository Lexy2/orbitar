import React, {useEffect, useState} from 'react';
import {useAPI} from '../AppState/AppState';
import styles from '../Pages/FeedPage.module.scss';
import Paginator from '../Components/Paginator';
import {useSearchParams} from 'react-router-dom';
import {useCache} from '../API/use/useCache';
import {CommentInfo} from '../Types/PostInfo';
import CommentComponent from './CommentComponent';

type UserProfileCommentsProps = {
  username: string;
};

export default function UserProfileComments(props: UserProfileCommentsProps) {
    const [search] = useSearchParams();
    const perpage = 20;
    const page = parseInt(search.get('page') || '1');

    const api = useAPI();
    const [cachedComments, setCachedComments] = useCache<CommentInfo[]>('user-profile-comments', [props.username, page, perpage]);
    const [cachedParentComments, setCachedParentComments] = useCache<Record<number, CommentInfo> | undefined>('user-profile-parent-comments', [props.username, page, perpage]);
    const [comments, setComments] = useState<CommentInfo[] | undefined>(cachedComments);
    const [parentComments, setParentComments] = useState<Record<number, CommentInfo> | undefined>(cachedParentComments);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState(0);
    const [error, setError] = useState<string>();
    const [reloadIdx, setReloadIdx] = useState(0);

    const reload = () => {
        setReloadIdx(reloadIdx + 1);
    };

    const getParentComment = (commentId: number): CommentInfo | undefined => {
        if (parentComments && parentComments[commentId]) {
            return parentComments[commentId];
        }
        return undefined;
    };

    useEffect(() => {
        api.userAPI.userComments(props.username, page, perpage).then(result => {
            setCachedComments(result.comments);
            setCachedParentComments(result.parentComments);
            setError(undefined);
            setLoading(false);
            setComments(result.comments);
            setParentComments(result.parentComments);
            const pages = Math.floor((result.total - 1) / perpage) + 1;
            setPages(pages);
        }).catch(error => {
            console.log('USER PROFILE COMMENTS ERROR', error);
            setError('Не удалось загрузить ленту комментариев пользователя');
        });
    }, [page, reloadIdx]);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [page]);

    return (
        <div className={styles.container}>
            <div className={styles.feed}>
                {loading ? <div className={styles.loading}></div> :
                 <>
                    {error && <div className={styles.error}>{styles.error}</div> }
                     {comments ?
                         comments.map(comment => <CommentComponent idx={getParentComment(comment.parentComment) ? 1 : 0} parent={getParentComment(comment.parentComment)} key={comment.id} comment={comment} showSite={comment.site !== 'main'} />)
                         :
                         (
                             error ? <div className={styles.error}>{error}<div><button onClick={reload}>Повторить</button></div></div>
                                 : <div className={styles.loading}>Загрузка...</div>
                         )
                     }
                    <Paginator page={page} pages={pages} base={`/u/${props.username}/comments`} />
                </>}
            </div>
        </div>
    );
}
