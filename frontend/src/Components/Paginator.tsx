import {Link} from 'react-location';
import React from 'react';
import styles from './Paginator.module.css';

interface PaginatorProps {
    page: number;
    pages: number;
    base: string;
}

export default function Paginator(props: PaginatorProps) {
    let pages = [];
    for (let i = 1; i <= props.pages; i++) {
        let classes = [styles.page];
        if (i === props.page) {
            classes.push(styles.current);
        }
        let search = {};
        if (i > 1) {
            search = { page: i };
        }

        pages.push(<Link key={i} className={classes.join(' ')} to={props.base} search={search}>{i}</Link>)
    }

    return (
        <div className={styles.paginator}>
            {pages}
        </div>
    );
}