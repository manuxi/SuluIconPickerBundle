// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {Input, Loader, Overlay} from 'sulu-admin-bundle/components';
import {translate} from 'sulu-admin-bundle/utils/Translator';
import IconSvg from '../../components/IconSvg';
import iconPoolStore from '../../stores/iconPoolStore';
import type {IconPool} from '../../stores/iconPoolStore';
import styles from './iconSelectionOverlay.scss';

type Props = {
    onClose: () => void,
    onConfirm: (name: string) => void,
    open: boolean,
    pool: IconPool,
    value: ?string,
};

type State = {
    search: ?string,
    selected: ?string,
};

export function filterIconNames(names: Array<string>, search: ?string): Array<string> {
    const terms = (search || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
        return names;
    }

    return names.filter((name) => terms.every((term) => name.includes(term)));
}

@observer
class IconSelectionOverlay extends React.Component<Props, State> {
    state = {
        search: undefined,
        selected: this.props.value,
    };

    componentDidMount() {
        if (this.props.open) {
            this.loadNames();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const {open, value} = this.props;

        if (open && !prevProps.open) {
            this.setState({search: undefined, selected: value});
            this.loadNames();
        }
    }

    loadNames() {
        iconPoolStore.loadNames(this.props.pool.key).catch(() => {});
    }

    handleSearchChange = (search: ?string) => {
        this.setState({search});
    };

    handleSearchClear = () => {
        this.setState({search: undefined});
    };

    handleTileClick = (event: SyntheticEvent<HTMLButtonElement>) => {
        this.setState({selected: event.currentTarget.dataset.name});
    };

    handleTileDoubleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
        this.props.onConfirm(event.currentTarget.dataset.name);
    };

    handleConfirm = () => {
        const {selected} = this.state;

        if (selected) {
            this.props.onConfirm(selected);
        }
    };

    renderGrid(names: ?Array<string>) {
        const {pool} = this.props;
        const {search, selected} = this.state;

        if (!names) {
            return iconPoolStore.hasError(pool.key)
                ? <div className={styles.message}>{translate('sulu_icon_picker.load_error')}</div>
                : <div className={styles.message}><Loader /></div>;
        }

        const filtered = filterIconNames(names, search);
        if (filtered.length === 0) {
            return <div className={styles.message}>{translate('sulu_icon_picker.no_results')}</div>;
        }

        return (
            <ul className={styles.grid}>
                {filtered.map((name) => (
                    <li key={name}>
                        <button
                            aria-pressed={name === selected}
                            className={name === selected ? `${styles.tile} ${styles.selected}` : styles.tile}
                            data-name={name}
                            onClick={this.handleTileClick}
                            onDoubleClick={this.handleTileDoubleClick}
                            title={name}
                            type="button"
                        >
                            <IconSvg className={styles.tileIcon} name={name} pool={pool} />
                            <span className={styles.tileName}>{name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        const {onClose, open, pool} = this.props;
        const {search, selected} = this.state;
        const names = iconPoolStore.getNames(pool.key);
        const count = names ? filterIconNames(names, search).length : 0;

        return (
            <Overlay
                confirmDisabled={!selected}
                confirmText={translate('sulu_admin.confirm')}
                onClose={onClose}
                onConfirm={this.handleConfirm}
                open={open}
                size="large"
                title={translate('sulu_icon_picker.overlay_title')}
            >
                <div className={styles.container}>
                    <div className={styles.toolbar}>
                        <div className={styles.search}>
                            <Input
                                autoFocus={true}
                                icon="su-search"
                                onChange={this.handleSearchChange}
                                onClearClick={search ? this.handleSearchClear : undefined}
                                placeholder={translate('sulu_icon_picker.search')}
                                value={search}
                            />
                        </div>
                        {names &&
                            <span className={styles.count}>{translate('sulu_icon_picker.count', {count})}</span>
                        }
                    </div>
                    {this.renderGrid(names)}
                </div>
            </Overlay>
        );
    }
}

export default IconSelectionOverlay;
