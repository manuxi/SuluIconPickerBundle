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

import IconPicker from '../../../../../src/Resources/js/containers/Form/fields/IconPicker';
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

describe('IconPicker', () => {
    test('renders the selected icon from the sprite', () => {
        const {container} = render(
            <IconPicker {...fieldTypeDefaultProps} value={{pool: 'bootstrap-icons', name: 'calendar-heart'}} />
        );

        expect(container.querySelector('use').getAttribute('href')).toBe(`${SPRITE}#bootstrap-icons-calendar-heart`);
        expect(screen.getByText('calendar-heart')).toBeInTheDocument();
    });

    test('renders a placeholder without value', () => {
        render(<IconPicker {...fieldTypeDefaultProps} />);

        expect(screen.getByText('sulu_icon_picker.select')).toBeInTheDocument();
    });

    test('shows an error for an unknown icon', async() => {
        render(<IconPicker {...fieldTypeDefaultProps} value={{pool: 'bootstrap-icons', name: 'gone'}} />);

        expect(await screen.findByText('sulu_icon_picker.unknown_icon')).toBeInTheDocument();
    });

    test('shows an error for an unknown pool', () => {
        render(<IconPicker {...fieldTypeDefaultProps} value={{pool: 'tabler', name: 'house'}} />);

        expect(screen.getByText('sulu_icon_picker.unknown_pool')).toBeInTheDocument();
    });

    test('removes the icon', () => {
        const onChange = jest.fn();
        const onFinish = jest.fn();

        render(
            <IconPicker
                {...fieldTypeDefaultProps}
                onChange={onChange}
                onFinish={onFinish}
                value={{pool: 'bootstrap-icons', name: 'house'}}
            />
        );

        fireEvent.click(screen.getByLabelText('sulu_icon_picker.remove'));

        expect(onChange).toHaveBeenCalledWith(undefined);
        expect(onFinish).toHaveBeenCalled();
    });

    test('selects an icon in the overlay', async() => {
        const onChange = jest.fn();

        render(<IconPicker {...fieldTypeDefaultProps} onChange={onChange} />);

        fireEvent.click(screen.getByRole('button', {name: /sulu_icon_picker.select/}));
        fireEvent.change(screen.getByPlaceholderText('sulu_icon_picker.search'), {target: {value: 'door'}});

        const tile = await screen.findByTitle('house-door');
        expect(screen.queryByTitle('calendar-heart')).not.toBeInTheDocument();

        fireEvent.click(tile);
        fireEvent.click(screen.getByText('confirm'));

        expect(onChange).toHaveBeenCalledWith({pool: 'bootstrap-icons', name: 'house-door'});
        expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });
});
