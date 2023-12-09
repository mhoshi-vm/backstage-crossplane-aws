import {Entity} from '@backstage/catalog-model';
import React, {useEffect, useState} from "react";
import {useKubernetesObjects} from "@backstage/plugin-kubernetes";
import {Ecs, Resource, ResourceStatus, UpboundAwsCrd} from "../../type";
import {FetchResponse} from "@backstage/plugin-kubernetes-common";
import {Content, Page, Progress, ResponseErrorPanel} from "@backstage/core-components";
import {Grid} from "@material-ui/core";
import {ResourceTable} from "../ResourceTable";

type KubernetesContentProps = {
    entity: Entity;
    refreshIntervalMs?: number;
    children?: React.ReactNode;
}

export const CrossplaneAwsComponent = ({entity, refreshIntervalMs}: KubernetesContentProps) => {
    const {kubernetesObjects, error} = useKubernetesObjects(
        entity,
        refreshIntervalMs,
    );

    const [loading, setLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        // This useEffect will run whenever kubernetesObjects changes
        // If kubernetesObjects is not undefined or null, setLoading to false
        if (kubernetesObjects !== undefined && kubernetesObjects !== null) {
            setLoading(false);
        }
    }, [kubernetesObjects]);

    const ecss = [] as Ecs[];

    if (kubernetesObjects !== undefined) {
        for (let clusterCnt = 0; clusterCnt < kubernetesObjects.items.length; clusterCnt++) {
            const customResources = kubernetesObjects?.items[clusterCnt].resources.filter(isCustomResource);

            // get ecsCrs
            const upboundEcsCRs = customResources?.map((r) => {
                return {...r, resources: r.resources.filter(isUpboundEcs)}
            });

            // flatMap
            const flattenUpboundEcsAny = upboundEcsCRs?.flatMap(({resources}) =>
                [...resources]
            ) ?? [];

            const ecsCrds = flattenUpboundEcsAny as UpboundAwsCrd[];

            for (let crdCnt = 0; crdCnt < ecsCrds.length; crdCnt++) {

                const appName = ecsCrds[crdCnt].metadata.labels["app.kubernetes.io/part-of"]

                const kind = ecsCrds[crdCnt].kind

                const resource = {
                    name: ecsCrds[crdCnt].metadata.name,
                    externalName: ecsCrds[crdCnt].metadata.annotations["crossplane.io/external-name"],
                } as ResourceStatus;

                for (let condCnt = 0; condCnt < ecsCrds[crdCnt].status.conditions.length; condCnt++) {
                    const condition = ecsCrds[crdCnt].status.conditions[condCnt];
                    const type = condition.type;
                    switch (type) {
                        case ("Ready"):
                            resource.ready = condition.status;
                            break;
                        case("Synced"):
                            resource.synced = condition.status;
                            break;
                        default:
                            break;
                    }
                }

                let ecs = {} as Ecs;
                const appIndex = ecss.findIndex(
                    (item) => item.name === appName
                )
                if (appIndex !== -1) {
                    ecs = ecss[appIndex];
                } else {
                    ecs.name = appName;
                    ecs.resources = [];
                }

                const kindIndex = ecs.resources.findIndex(
                    (item) => item.kind === kind
                )

                if (kindIndex !== -1) {
                    ecs.resources[kindIndex].resources.push(resource);
                } else {
                    ecs.resources.push({
                        kind: kind,
                        resources: [resource]
                    })
                }

                if (appIndex === -1) {
                    ecss.push(ecs);
                }
            }

        }
    }

    return (
        <Page themeId="tool">
            <Content>
                {loading ? ( // Display progress bar while loading
                    <div className="progress-bar-container">
                        <Progress/>
                    </div>
                ) : (kubernetesObjects?.items !== undefined && ecss?.length > 0 &&
                    (ecss.map((ecs) =>
                        (<Grid container spacing={3} direction="column">
                            <Grid item>
                                <ResourceTable app={ecs.name} resources={ecs.resources}/>
                            </Grid>
                        </Grid>)
                    )))
                }
                {error !== undefined &&
                    <Grid container spacing={3} direction="column">
                        <Grid item>
                            <ResponseErrorPanel error={(new Error(error))}/>;
                        </Grid>
                    </Grid>
                }
            </Content>
        </Page>
    );
}

function isCustomResource(n: FetchResponse) {
    return n.type === 'customresources';
}

function isUpboundEcs(n: any): n is Resource {
    return n.apiVersion.endsWith('aws.upbound.io/v1beta1');
}