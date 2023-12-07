import React from 'react';
import {AppPluginInterface, AppRouteSurface, EntityPageSurface} from "@vmware-tanzu/core-frontend";
import {EntityCrossplaneAwsContent} from './plugin';
import {EntityLayout} from "@backstage/plugin-catalog";

export const TanzuAWSPlugin: AppPluginInterface = () => context => {
    context.applyWithDependency(
        AppRouteSurface,
        EntityPageSurface,
        (_appRouteSurface, entityPageSurface) => {
            entityPageSurface.servicePage.addTab(
                // eslint-disable-next-line react/react-in-jsx-scope
                <EntityLayout.Route path="/aws" title="AWS Resources">
                    <EntityCrossplaneAwsContent refreshIntervalMs={5000}/>
                </EntityLayout.Route>,
            );
        },
    );
}