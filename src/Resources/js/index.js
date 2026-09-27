// @flow
import {initializer} from 'sulu-admin-bundle/services';
import fieldRegistry from 'sulu-admin-bundle/containers/Form/registries/fieldRegistry';
import SingleIconSelection from './containers/Form/fields/SingleIconSelection';
import IconSelectionOverlay from './containers/IconSelectionOverlay';
import IconSvg from './components/IconSvg';
import iconPoolStore from './stores/iconPoolStore';

initializer.addUpdateConfigHook('sulu_icon_picker', (config, initialized) => {
    iconPoolStore.setConfig(config);

    if (initialized) {
        return;
    }

    fieldRegistry.add('single_icon_selection', SingleIconSelection);
});

export {
    SingleIconSelection,
    IconSelectionOverlay,
    IconSvg,
    iconPoolStore,
};
