// @flow
import {initializer} from 'sulu-admin-bundle/services';
import fieldRegistry from 'sulu-admin-bundle/containers/Form/registries/fieldRegistry';
import listAdapterRegistry from 'sulu-admin-bundle/containers/List/registries/listAdapterRegistry';
import IconSelection from './containers/Form/fields/IconSelection';
import IconAdapter from './containers/IconAdapter/IconAdapter';

const FIELD_TYPE = 'single_icon_selection';
const LIST_ADAPTER = 'icon';

// Sulu core registers both of these itself (in its own "sulu_admin" update-config-hook, which fires before
// ours - see docs/icon_selection.{en,de}.md). fieldRegistry.add()/listAdapterRegistry.add() throw on an
// already-used key, so the singletons' internal maps are mutated directly to override core's components with
// ours while keeping core's REST loading, search and pagination untouched.
initializer.addUpdateConfigHook('sulu_icon_picker', (config, initialized) => {
    if (initialized) {
        return;
    }

    fieldRegistry.fields[FIELD_TYPE] = IconSelection;
    listAdapterRegistry.adapters[LIST_ADAPTER] = IconAdapter;
});

export {
    IconSelection,
    IconAdapter,
};
