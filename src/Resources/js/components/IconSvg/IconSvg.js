// @flow
import React from 'react';
import iconPoolStore from '../../stores/iconPoolStore';
import type {IconPool} from '../../stores/iconPoolStore';

type Props = {
    className?: string,
    name: string,
    pool: IconPool,
};

export default function IconSvg({className, name, pool}: Props) {
    return (
        <svg aria-hidden="true" className={className} fill="currentColor" focusable="false">
            <use href={iconPoolStore.symbolHref(pool, name)} />
        </svg>
    );
}
