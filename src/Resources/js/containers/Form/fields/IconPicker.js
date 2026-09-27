// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {Icon} from 'sulu-admin-bundle/components';
import {translate} from 'sulu-admin-bundle/utils/Translator';
import type {FieldTypeProps} from 'sulu-admin-bundle/types';
import IconSvg from '../../../components/IconSvg';
import IconSelectionOverlay from '../../IconSelectionOverlay';
import iconPoolStore from '../../../stores/iconPoolStore';
import type {IconPool} from '../../../stores/iconPoolStore';
import styles from './iconPicker.scss';

type Value = {
    name: string,
    pool: string,
};

type State = {
    overlayOpen: boolean,
};

@observer
class IconPicker extends React.Component<FieldTypeProps<?Value>, State> {
    state = {
        overlayOpen: false,
    };

    componentDidMount() {
        this.loadPreviewNames();
    }

    componentDidUpdate(prevProps: FieldTypeProps<?Value>) {
        if (prevProps.value?.pool !== this.props.value?.pool) {
            this.loadPreviewNames();
        }
    }

    get fieldPoolKey(): ?string {
        const {value: pool} = this.props.schemaOptions?.pool || {};

        return typeof pool === 'string' && pool ? pool : iconPoolStore.defaultPool;
    }

    get previewPoolKey(): ?string {
        const {value} = this.props;

        return value && value.pool ? value.pool : this.fieldPoolKey;
    }

    loadPreviewNames() {
        const pool = iconPoolStore.getPool(this.previewPoolKey);

        if (pool) {
            iconPoolStore.loadNames(pool.key).catch(() => {});
        }
    }

    openOverlay = () => {
        if (this.props.disabled || !iconPoolStore.getPool(this.fieldPoolKey)) {
            return;
        }

        this.setState({overlayOpen: true});
    };

    closeOverlay = () => {
        this.setState({overlayOpen: false});
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.openOverlay();
        }
    };

    handleConfirm = (name: string) => {
        const {onChange, onFinish} = this.props;
        const pool = iconPoolStore.getPool(this.fieldPoolKey);

        if (pool) {
            onChange({pool: pool.key, name});
            onFinish();
        }

        this.closeOverlay();
    };

    handleRemove = (event: SyntheticEvent<HTMLButtonElement>) => {
        const {onChange, onFinish} = this.props;

        event.stopPropagation();
        onChange(undefined);
        onFinish();
    };

    getProblem(previewPool: ?IconPool, name: ?string): ?string {
        const fieldPoolKey = this.fieldPoolKey;

        if (!iconPoolStore.getPool(fieldPoolKey)) {
            return translate('sulu_icon_picker.unknown_pool', {pool: fieldPoolKey || ''});
        }

        if (!name) {
            return undefined;
        }

        if (!previewPool) {
            return translate('sulu_icon_picker.unknown_pool', {pool: this.previewPoolKey || ''});
        }

        const names = iconPoolStore.getNames(previewPool.key);
        if (names && !names.includes(name)) {
            return translate('sulu_icon_picker.unknown_icon', {name});
        }

        return undefined;
    }

    render() {
        const {disabled, error, value} = this.props;
        const {overlayOpen} = this.state;
        const name = value && value.name ? value.name : undefined;
        const previewPool = iconPoolStore.getPool(this.previewPoolKey);
        const fieldPool = iconPoolStore.getPool(this.fieldPoolKey);
        const problem = this.getProblem(previewPool, name);

        const previewClass = [
            styles.preview,
            name ? styles.filled : styles.empty,
            error || problem ? styles.error : '',
            disabled ? styles.disabled : '',
        ].join(' ').trim();

        return (
            <div className={styles.container}>
                <div
                    className={previewClass}
                    onClick={this.openOverlay}
                    onKeyDown={this.handleKeyDown}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    title={name || translate('sulu_icon_picker.select')}
                >
                    {name && previewPool &&
                        <IconSvg className={styles.icon} name={name} pool={previewPool} />
                    }
                    {!name &&
                        <div className={styles.placeholder}>
                            <Icon name="su-plus" />
                            <span>{translate('sulu_icon_picker.select')}</span>
                        </div>
                    }
                    {name && !disabled &&
                        <button
                            aria-label={translate('sulu_icon_picker.remove')}
                            className={styles.remove}
                            onClick={this.handleRemove}
                            type="button"
                        >
                            <Icon name="su-trash-alt" />
                        </button>
                    }
                </div>
                {name && !problem &&
                    <div className={styles.caption}>{name}</div>
                }
                {problem &&
                    <div className={styles.problem}>{problem}</div>
                }
                {fieldPool &&
                    <IconSelectionOverlay
                        onClose={this.closeOverlay}
                        onConfirm={this.handleConfirm}
                        open={overlayOpen}
                        pool={fieldPool}
                        value={value && value.pool === fieldPool.key ? name : undefined}
                    />
                }
            </div>
        );
    }
}

export default IconPicker;
