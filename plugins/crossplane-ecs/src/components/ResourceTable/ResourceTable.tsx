import React from "react";
import {Resource} from "../../type";
import {StatusAborted, StatusOK, StatusPending, Table, TableColumn} from "@backstage/core-components";

export const ResourceTable = (props: { app: string, resources: Resource[] }) => {
    const {app, resources} = props;


    const columns: TableColumn[] = [
        {title: 'Kind', field: 'kind'},
        {title: 'Name', field: 'name'},
        {title: 'Ready', field: 'ready'},
        {title: 'Synced', field: 'synced'},
        {title: 'ARN', field: 'externalName'},
    ];

    const data = [] as {
        kind: string,
        name: string,
        ready: string,
        synced: string,
        externalName: string
    }[];

    const statusLogo = [
        {status: 'True', field: <StatusOK />},
        {status: 'False', field: <StatusPending />},
        {status: undefined, field: <StatusAborted />},
    ];

    resources.map(resource => {
        resource.resources.map(resourceStatus => {


            const readyIndex = statusLogo.findIndex(
                (item) => item.status === resourceStatus.ready
            )

            const syncedIndex = statusLogo.findIndex(
                (item) => item.status === resourceStatus.synced
            )
            data.push({
                kind: resource.kind,
                name: resourceStatus.name,
                ready: statusLogo[readyIndex].field as unknown as string,
                synced: statusLogo[syncedIndex].field as unknown as string,
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