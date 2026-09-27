// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {Icon} from 'sulu-admin-bundle/components';
import SingleItemSelection from 'sulu-admin-bundle/components/SingleItemSelection';
import {translate} from 'sulu-admin-bundle/utils/Translator';
import type {FieldTypeProps} from 'sulu-admin-bundle/types';
import IconSvg from '../../../components/IconSvg';
import IconSelectionOverlay from '../../IconSelectionOverlay';
import iconPoolStore from '../../../stores/iconPoolStore';
import type {IconPool} from '../../../stores/iconPoolStore';
import styles from './singleIconSelection.scss';

type Value = {
    name: string,
    pool: string,
};

type State = {
    overlayOpen: boolean,
};

@observer
class SingleIconSelection extends React.Component<FieldTypeProps<?Value>, State> {
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

    handleConfirm = (name: string) => {
        const {onChange, onFinish} = this.props;
        const pool = iconPoolStore.getPool(this.fieldPoolKey);

        if (pool) {
            onChange({pool: pool.key, name});
            onFinish();
        }

        this.closeOverlay();
    };

    handleRemove = () => {
        const {onChange, onFinish} = this.props;

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
        const name = value && value.name ? value.name : undefined;
        const previewPool = iconPoolStore.getPool(this.previewPoolKey);
        const fieldPool = iconPoolStore.getPool(this.fieldPoolKey);
        const problem = this.getProblem(previewPool, name);

        return (
            <React.Fragment>
                <SingleItemSelection
                    disabled={!!disabled}
                    emptyText={translate('sulu_icon_picker.select')}
                    leftButton={{
                        icon: 'su-th-large',
                        onClick: this.openOverlay,
                    }}
                    onRemove={name ? this.handleRemove : undefined}
                    valid={!error && !problem}
                >
                    {name &&
                        <div className={styles.iconItem}>
                            {previewPool
                                ? <IconSvg className={styles.icon} name={name} pool={previewPool} />
                                : <Icon className={styles.icon} name="su-exclamation-triangle" />
                            }
                            <div className={problem ? styles.problem : styles.name}>{problem || name}</div>
                        </div>
                    }
                </SingleItemSelection>
                {fieldPool &&
                    <IconSelectionOverlay
                        onClose={this.closeOverlay}
                        onConfirm={this.handleConfirm}
                        open={this.state.overlayOpen}
                        pool={fieldPool}
                        value={value && value.pool === fieldPool.key ? name : undefined}
                    />
                }
            </React.Fragment>
        );
    }
}

export default SingleIconSelection;
