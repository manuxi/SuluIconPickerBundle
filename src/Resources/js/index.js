// @flow
import {initializer} from 'sulu-admin-bundle/services';
import fieldRegistry from 'sulu-admin-bundle/containers/Form/registries/fieldRegistry';
import IconPicker from './containers/Form/fields/IconPicker';
import IconSelectionOverlay from './containers/IconSelectionOverlay';
import IconSvg from './components/IconSvg';
import iconPoolStore from './stores/iconPoolStore';

initializer.addUpdateConfigHook('sulu_icon_picker', (config, initialized) => {
    iconPoolStore.setConfig(config);

    if (initialized) {
        return;
    }

    fieldRegistry.add('icon_picker', IconPicker);
});

export {
    IconPicker,
    IconSelectionOverlay,
    IconSvg,
    iconPoolStore,
};
