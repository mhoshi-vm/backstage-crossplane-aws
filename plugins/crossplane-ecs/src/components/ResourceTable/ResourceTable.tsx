import React from "react";
import {Resource} from "../../type";
import {Table, TableColumn} from "@backstage/core-components";

export const ResourceTable = (props: { app: string, resources: Resource[] }) => {
    const {app, resources} = props;


    const columns: TableColumn[] = [
        {title: 'Kind', field: 'kind'},
        {title: 'Name', field: 'name'},
        {title: 'Ready', field: 'ready'},
        {title: 'Synced', field: 'synced'},
        {title: 'External Name', field: 'externalName'},
    ];

    const data = [] as {
        kind: string,
        name: string,
        ready: string,
        synced: string,
        externalName: string
    }[];

    resources.map(resource => {
        resource.resources.map(resourceStatus => {
            data.push({
                kind: resource.kind,
                name: resourceStatus.name,
                ready: resourceStatus.ready,
                synced: resourceStatus.synced,
                externalName: resourceStatus.externalName,
            })
        })
    });

    return (
        <Table
            title={app}
            columns={columns}
            data={data}

        />
    );
};