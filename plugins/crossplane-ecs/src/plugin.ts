import {createPlugin, createRoutableExtension} from '@backstage/core-plugin-api';

import {rootRouteRef} from './routes';

export const crossplaneAwsPlugin = createPlugin({
    id: 'crossplane-ecs',
    routes: {
        root: rootRouteRef,
    },
});

export type EntityCrossplaneAwsContentProps = {
    /**
     * Sets the refresh interval in milliseconds. The default value is 10000 (10 seconds)
     */
    refreshIntervalMs?: number;
};

export const EntityCrossplaneAwsContent: (
    props: EntityCrossplaneAwsContentProps,
) => JSX.Element = crossplaneAwsPlugin.provide(
    createRoutableExtension({
        name: 'EntityCrossplaneAwsContent',
        component: () => import('./Router').then(m => m.Router),
        mountPoint: rootRouteRef,
    }),
);
