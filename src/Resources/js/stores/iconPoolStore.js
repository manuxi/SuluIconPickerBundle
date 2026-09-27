// @flow
import {action, observable} from 'mobx';

export type IconPool = {
    key: string,
    names: string,
    sprite: string,
};

export type IconPickerConfig = {
    defaultPool: ?string,
    pools: {[key: string]: IconPool},
};

class IconPoolStore {
    pools: {[key: string]: IconPool} = {};
    defaultPool: ?string = undefined;
    names = observable.map();
    errors = observable.map();
    requests: {[key: string]: Promise<Array<string>>} = {};

    setConfig(config: ?IconPickerConfig) {
        this.pools = config && config.pools && !Array.isArray(config.pools) ? config.pools : {};
        this.defaultPool = config && config.defaultPool ? config.defaultPool : Object.keys(this.pools)[0];
    }

    getPool(key: ?string): ?IconPool {
        return this.pools[key || this.defaultPool || ''];
    }

    getNames(key: string): ?Array<string> {
        return this.names.get(key);
    }

    hasError(key: string): boolean {
        return this.errors.has(key);
    }

    loadNames(key: string): Promise<Array<string>> {
        if (this.requests[key]) {
            return this.requests[key];
        }

        const pool = this.pools[key];
        if (!pool) {
            return Promise.reject(new Error(`Icon pool "${key}" is not registered.`));
        }

        this.requests[key] = fetch(pool.names, {credentials: 'same-origin'})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Icon names of pool "${key}" could not be loaded (HTTP ${response.status}).`);
                }

                return response.json();
            })
            .then(action((names) => {
                const list = Array.isArray(names) ? names : [];
                this.errors.delete(key);
                this.names.set(key, list);

                return list;
            }))
            .catch(action((error) => {
                delete this.requests[key];
                this.errors.set(key, true);

                throw error;
            }));

        return this.requests[key];
    }

    symbolHref(pool: IconPool, name: string): string {
        return `${pool.sprite}#${pool.key}-${name}`;
    }
}

export default new IconPoolStore();
