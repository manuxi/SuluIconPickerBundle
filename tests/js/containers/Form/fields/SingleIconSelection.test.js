// @flow
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import fieldTypeDefaultProps from '../../../fieldTypeDefaultProps';

jest.mock('sulu-admin-bundle/utils/Translator', () => ({
    translate: (key) => key,
}));

jest.mock('sulu-admin-bundle/components', () => ({
    Icon: function Icon({name}) {
        return <i data-icon={name} />;
    },
    Input: function Input({onChange, placeholder, value}) {
        return <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value || ''} />;
    },
    Loader: function Loader() {
        return <div>loading</div>;
    },
    Overlay: function Overlay({children, confirmDisabled, onConfirm, open}) {
        return open
            ? <div data-testid="overlay">{children}<button disabled={confirmDisabled} onClick={onConfirm}>confirm</button></div>
            : null;
    },
}));

import SingleIconSelection from '../../../../../src/Resources/js/containers/Form/fields/SingleIconSelection';
import iconPoolStore from '../../../../../src/Resources/js/stores/iconPoolStore';

const SPRITE = '/bundles/suluiconpicker/icon-picker/bootstrap-icons/sprite.svg';

beforeEach(() => {
    iconPoolStore.requests = {};
    iconPoolStore.names.clear();
    iconPoolStore.errors.clear();
    iconPoolStore.setConfig({
        defaultPool: 'bootstrap-icons',
        pools: {
            'bootstrap-icons': {
                key: 'bootstrap-icons',
                names: '/bundles/suluiconpicker/icon-picker/bootstrap-icons/names.json',
                sprite: SPRITE,
            },
        },
    });
    global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['calendar-heart', 'house', 'house-door']),
    }));
});

describe('SingleIconSelection', () => {
    test('renders the selected icon from the sprite, like single_media_selection', () => {
        const {container} = render(
            <SingleIconSelection {...fieldTypeDefaultProps} value={{pool: 'bootstrap-icons', name: 'calendar-heart'}} />
        );

        expect(container.querySelector('use').getAttribute('href')).toBe(`${SPRITE}#bootstrap-icons-calendar-heart`);
        expect(screen.getByText('calendar-heart')).toBeInTheDocument();
        // exactly two buttons: the left "open picker" button and the remove button, as in single_media_selection
        expect(container.querySelectorAll('button')).toHaveLength(2);
    });

    test('renders the empty text without value', () => {
        render(<SingleIconSelection {...fieldTypeDefaultProps} />);

        expect(screen.getByText('sulu_icon_picker.select')).toBeInTheDocument();
    });

    test('shows an error for an unknown icon', async() => {
        render(<SingleIconSelection {...fieldTypeDefaultProps} value={{pool: 'bootstrap-icons', name: 'gone'}} />);

        expect(await screen.findByText('sulu_icon_picker.unknown_icon')).toBeInTheDocument();
    });

    test('shows an error for an unknown pool', () => {
        render(<SingleIconSelection {...fieldTypeDefaultProps} value={{pool: 'tabler', name: 'house'}} />);

        expect(screen.getByText('sulu_icon_picker.unknown_pool')).toBeInTheDocument();
    });

    test('removes the icon', () => {
        const onChange = jest.fn();
        const onFinish = jest.fn();

        const {container} = render(
            <SingleIconSelection
                {...fieldTypeDefaultProps}
                onChange={onChange}
                onFinish={onFinish}
                value={{pool: 'bootstrap-icons', name: 'house'}}
            />
        );

        fireEvent.click(container.querySelectorAll('button')[1]);

        expect(onChange).toHaveBeenCalledWith(undefined);
        expect(onFinish).toHaveBeenCalled();
    });

    test('selects an icon in the overlay', async() => {
        const onChange = jest.fn();

        const {container} = render(<SingleIconSelection {...fieldTypeDefaultProps} onChange={onChange} />);

        // the real button, not the item container's role="button" div (Sulu's own SingleItemSelection markup)
        fireEvent.click(container.querySelector('button'));
        fireEvent.change(screen.getByPlaceholderText('sulu_icon_picker.search'), {target: {value: 'door'}});

        const tile = await screen.findByTitle('house-door');
        expect(screen.queryByTitle('calendar-heart')).not.toBeInTheDocument();

        fireEvent.click(tile);
        fireEvent.click(screen.getByText('confirm'));

        expect(onChange).toHaveBeenCalledWith({pool: 'bootstrap-icons', name: 'house-door'});
        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });
});
